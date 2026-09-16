import { execGit } from "./runner.ts";
import { Attr, getTracer } from "./tracing.ts";
import { SpanStatusCode } from "npm:@opentelemetry/api@1.9.0";
import { GlobalArgsSchema } from "./schemas.ts";
import type {
  AmendArgs,
  BranchArgs,
  CherryPickArgs,
  CloneArgs,
  CommitArgs,
  ConfigArgs,
  DiffArgs,
  FetchArgs,
  GlobalArgs,
  IsAncestorArgs,
  LogArgs,
  PullArgs,
  PushArgs,
  RemoteRefArgs,
  RemoveWorktreeArgs,
  StatusArgs,
  UpstreamStateArgs,
  WorktreeDiffArgs,
} from "./schemas.ts";
import type { DataHandle, GitContext } from "./types.ts";

function resolveGlobalArgs(raw: Record<string, unknown>): GlobalArgs {
  return GlobalArgsSchema.parse(raw);
}

function scrubCredentials(text: string): string {
  return text.replace(/https:\/\/[^@]*@/g, "https://***@");
}

// ---------------------------------------------------------------------------
// clone
// ---------------------------------------------------------------------------

export async function runClone(
  args: CloneArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.clone", async (span) => {
    try {
      const argv = ["clone"];

      if (args.depth !== undefined && args.depth > 0) {
        argv.push("--depth", String(args.depth));
      }
      if (args.branch) {
        argv.push("--branch", args.branch);
      }

      let url = args.url;
      if (args.token) {
        if (!url.startsWith("https://")) {
          throw new Error(
            "token authentication requires an https:// URL",
          );
        }
        const parsed = new URL(url);
        parsed.username = "x-access-token";
        parsed.password = args.token;
        url = parsed.toString();
      }
      argv.push("--", url);

      if (args.path) {
        argv.push(args.path);
      }

      const result = await execGit(argv, { signal: ctx.signal });
      if (result.exitCode !== 0) {
        throw new Error(
          `git clone failed (exit ${result.exitCode}): ${
            scrubCredentials(result.stderr)
          }`,
        );
      }

      const clonedPath = args.path ||
        args.url.split("/").pop()?.replace(/\.git$/, "") || "repo";

      span.setAttribute(Attr.METHOD, "clone");
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      ctx.logger.info(`cloned ${scrubCredentials(args.url)} to ${clonedPath}`);

      const safeUrl = scrubCredentials(args.url);
      const handle = await ctx.writeResource("cloneResult", "clone", {
        path: clonedPath,
        url: safeUrl,
        ...(args.depth !== undefined ? { depth: args.depth } : {}),
        ...(args.branch ? { branch: args.branch } : {}),
      }, {
        tags: { method: "clone", url: safeUrl },
      });

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: scrubCredentials(
          error instanceof Error ? error.message : String(error),
        ),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// diff
// ---------------------------------------------------------------------------

export async function runDiff(
  args: DiffArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.diff", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const argv = ["diff"];

      if (args.nameOnly) {
        argv.push("--name-only");
      }
      if (args.diffFilter) {
        argv.push(`--diff-filter=${args.diffFilter}`);
      }
      if (args.stat) {
        argv.push("--stat");
      }

      if (args.threeWay) {
        argv.push(`${args.base}...${args.head}`);
      } else {
        argv.push(args.base, args.head);
      }

      if (args.paths && args.paths.length > 0) {
        argv.push("--");
        argv.push(...args.paths);
      }

      const result = await execGit(argv, {
        cwd: globals.repoPath,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git diff failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      const raw = result.stdout;
      const files = args.nameOnly
        ? raw.split("\n").filter((l) => l.trim().length > 0)
        : [];

      span.setAttribute(Attr.METHOD, "diff");
      span.setAttribute(Attr.BASE_REF, args.base);
      span.setAttribute(Attr.HEAD_REF, args.head);
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      const handle = await ctx.writeResource("diffResult", "diff", {
        files,
        raw,
        count: files.length,
        base: args.base,
        head: args.head,
      }, {
        tags: { method: "diff", base: args.base, head: args.head },
      });

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

export async function runStatus(
  args: StatusArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.status", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const argv = ["status", "--porcelain"];

      if (args.paths && args.paths.length > 0) {
        argv.push("--");
        argv.push(...args.paths);
      }

      const result = await execGit(argv, {
        cwd: globals.repoPath,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git status failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      const raw = result.stdout;
      const lines = raw.split("\n").filter((l) => l.trim().length > 0);

      const entries = lines.map((line) => ({
        status: line.substring(0, 2),
        path: line.substring(3),
      }));

      span.setAttribute(Attr.METHOD, "status");
      span.setAttribute(Attr.REPO_PATH, globals.repoPath);
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      const handle = await ctx.writeResource("statusResult", "status", {
        entries,
        clean: lines.length === 0,
        count: lines.length,
        raw,
      }, {
        tags: { method: "status", clean: String(lines.length === 0) },
      });

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// log
// ---------------------------------------------------------------------------

const NUL = "\x00";
const GIT_NUL_FORMAT = "%H%x00%an%x00%aI%x00%s%x00";

export async function runLog(
  args: LogArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.log", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const argv = ["log"];

      if (args.format) {
        argv.push(`--format=${args.format}`);
      } else {
        argv.push(`--format=${GIT_NUL_FORMAT}`);
      }

      if (args.maxCount !== undefined) {
        argv.push("-n", String(args.maxCount));
      }

      if (args.paths && args.paths.length > 0) {
        argv.push("--");
        argv.push(...args.paths);
      }

      const result = await execGit(argv, {
        cwd: globals.repoPath,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git log failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      const raw = result.stdout;
      let commits: {
        sha: string;
        author: string;
        date: string;
        message: string;
      }[] = [];

      if (!args.format) {
        commits = raw
          .split(NUL)
          .reduce((records, _field, idx, fields) => {
            if (idx % 4 === 0 && idx + 3 < fields.length) {
              const sha = fields[idx].trim();
              if (sha.length > 0) {
                records.push({
                  sha,
                  author: fields[idx + 1],
                  date: fields[idx + 2],
                  message: fields[idx + 3],
                });
              }
            }
            return records;
          }, [] as typeof commits);
      }

      span.setAttribute(Attr.METHOD, "log");
      span.setAttribute(Attr.REPO_PATH, globals.repoPath);
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      const handle = await ctx.writeResource("logResult", "log", {
        commits,
        count: commits.length,
        ...(args.format ? { raw } : {}),
      }, {
        tags: { method: "log" },
      });

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// commit / amend shared helpers
// ---------------------------------------------------------------------------

/**
 * Resolve the author/committer date pair for a commit-creating method.
 *
 * Setting only the author date — what `git commit --date` does — leaves a real
 * wall-clock committer timestamp on the object. Default `git log` hides it, so
 * the discrepancy surfaces much later and is surprising when it does. Supplying
 * `authorDate` alone therefore sets both. A caller who genuinely wants the two
 * to differ sets `committerDate` explicitly.
 */
function resolveCommitDates(
  args: { authorDate?: string; committerDate?: string },
): { authorDate?: string; committerDate?: string } {
  return {
    authorDate: args.authorDate,
    committerDate: args.committerDate ?? args.authorDate,
  };
}

/** Format for {@link readCommitMetadata} — `%s` last, as a subject has no newline. */
const COMMIT_META_FORMAT = "%H%n%aI%n%cI%n%s";

/**
 * Read back the SHA, dates, and subject of HEAD in a single git invocation.
 *
 * The SHA and dates are the result's identity, so a failure to read them throws.
 * The subject is tolerated when absent — callers fall back to the message they
 * asked for, preserving the behavior the separate `log -1 --format=%s` call had.
 */
async function readCommitMetadata(
  opts: { cwd?: string; signal?: AbortSignal },
): Promise<
  { sha: string; authorDate: string; committerDate: string; subject?: string }
> {
  const result = await execGit(
    ["log", "-1", `--format=${COMMIT_META_FORMAT}`],
    opts,
  );
  if (result.exitCode !== 0) {
    throw new Error(
      `git log -1 failed (exit ${result.exitCode}): ${result.stderr}`,
    );
  }

  const lines = result.stdout.split("\n");
  const [sha, authorDate, committerDate] = lines;
  if (!sha || !authorDate || !committerDate) {
    throw new Error(
      `git log -1 returned unexpected output: ${JSON.stringify(result.stdout)}`,
    );
  }

  return {
    sha: sha.trim(),
    authorDate: authorDate.trim(),
    committerDate: committerDate.trim(),
    subject: lines.length > 3 && lines[3].length > 0 ? lines[3] : undefined,
  };
}

// ---------------------------------------------------------------------------
// commit
// ---------------------------------------------------------------------------

export async function runCommit(
  args: CommitArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.commit", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const cwd = globals.repoPath;

      if (args.addAll) {
        const addResult = await execGit(["add", "-A"], {
          cwd,
          signal: ctx.signal,
        });
        if (addResult.exitCode !== 0) {
          throw new Error(
            `git add failed (exit ${addResult.exitCode}): ${addResult.stderr}`,
          );
        }
      } else if (args.paths && args.paths.length > 0) {
        const addResult = await execGit(["add", "--", ...args.paths], {
          cwd,
          signal: ctx.signal,
        });
        if (addResult.exitCode !== 0) {
          throw new Error(
            `git add failed (exit ${addResult.exitCode}): ${addResult.stderr}`,
          );
        }
      }

      const commitArgv = [];
      if (globals.authorName) {
        commitArgv.push("-c", `user.name=${globals.authorName}`);
      }
      if (globals.authorEmail) {
        commitArgv.push("-c", `user.email=${globals.authorEmail}`);
      }
      commitArgv.push("commit", "-m", args.message);

      // A fresh commit takes both dates through the environment. `--date` is
      // deliberately not used here: it sets only the author date.
      const dates = resolveCommitDates(args);
      const commitEnv: Record<string, string> = {};
      if (dates.authorDate) commitEnv.GIT_AUTHOR_DATE = dates.authorDate;
      if (dates.committerDate) {
        commitEnv.GIT_COMMITTER_DATE = dates.committerDate;
      }

      const commitResult = await execGit(commitArgv, {
        cwd,
        signal: ctx.signal,
        // Only the commit itself carries dates — staging has no timestamp.
        env: Object.keys(commitEnv).length > 0 ? commitEnv : undefined,
      });
      if (commitResult.exitCode !== 0) {
        throw new Error(
          `git commit failed (exit ${commitResult.exitCode}): ${commitResult.stderr}`,
        );
      }

      const meta = await readCommitMetadata({ cwd, signal: ctx.signal });
      const sha = meta.sha;

      span.setAttribute(Attr.METHOD, "commit");
      span.setAttribute(Attr.COMMIT_SHA, sha);
      span.setAttribute(Attr.EXIT_CODE, commitResult.exitCode);

      ctx.logger.info(`committed ${sha.substring(0, 8)}: ${args.message}`);

      const handle = await ctx.writeResource(
        "commitResult",
        `commit-${sha.substring(0, 8)}`,
        {
          sha,
          message: args.message,
          authorDate: meta.authorDate,
          committerDate: meta.committerDate,
        },
        {
          tags: { method: "commit", sha },
        },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// amend
// ---------------------------------------------------------------------------

export async function runAmend(
  args: AmendArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.amend", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const cwd = globals.repoPath;

      const oldShaResult = await execGit(["rev-parse", "HEAD"], {
        cwd,
        signal: ctx.signal,
      });
      if (oldShaResult.exitCode !== 0) {
        throw new Error(
          "cannot amend: no HEAD commit exists (empty repository)",
        );
      }
      const oldSha = oldShaResult.stdout.trim();

      if (args.addAll) {
        const addResult = await execGit(["add", "-A"], {
          cwd,
          signal: ctx.signal,
        });
        if (addResult.exitCode !== 0) {
          throw new Error(
            `git add failed (exit ${addResult.exitCode}): ${addResult.stderr}`,
          );
        }
      } else if (args.paths && args.paths.length > 0) {
        const addResult = await execGit(["add", "--", ...args.paths], {
          cwd,
          signal: ctx.signal,
        });
        if (addResult.exitCode !== 0) {
          throw new Error(
            `git add failed (exit ${addResult.exitCode}): ${addResult.stderr}`,
          );
        }
      }

      const commitArgv = [];
      if (globals.authorName) {
        commitArgv.push("-c", `user.name=${globals.authorName}`);
      }
      if (globals.authorEmail) {
        commitArgv.push("-c", `user.email=${globals.authorEmail}`);
      }
      commitArgv.push("commit", "--amend");

      if (args.keepMessage) {
        commitArgv.push("--no-edit");
      } else {
        commitArgv.push("-m", args.message!);
      }

      // Amend needs a different mechanism from commit, and the difference is
      // not cosmetic: `git commit --amend` reuses the original commit's author
      // info and IGNORES GIT_AUTHOR_DATE — silently, with exit 0. The author
      // date must go through `--date`, which also preserves the original author
      // name and email (unlike `--reset-author`, which overwrites them with the
      // committer identity). Do not "simplify" this to match runCommit's
      // env-only path; doing so drops the author date without any error.
      const dates = resolveCommitDates(args);
      if (dates.authorDate) {
        commitArgv.push(`--date=${dates.authorDate}`);
      }

      const commitResult = await execGit(commitArgv, {
        cwd,
        signal: ctx.signal,
        env: dates.committerDate
          ? { GIT_COMMITTER_DATE: dates.committerDate }
          : undefined,
      });
      if (commitResult.exitCode !== 0) {
        throw new Error(
          `git commit --amend failed (exit ${commitResult.exitCode}): ${commitResult.stderr}`,
        );
      }

      const meta = await readCommitMetadata({ cwd, signal: ctx.signal });
      const newSha = meta.sha;
      const message = meta.subject ?? args.message ?? "";

      span.setAttribute(Attr.METHOD, "amend");
      span.setAttribute(Attr.COMMIT_SHA, newSha);
      span.setAttribute(Attr.EXIT_CODE, commitResult.exitCode);

      ctx.logger.info(
        `amended ${oldSha.substring(0, 8)} → ${newSha.substring(0, 8)}`,
      );

      const handle = await ctx.writeResource(
        "amendResult",
        `amend-${newSha.substring(0, 8)}`,
        {
          oldSha,
          newSha,
          message,
          authorDate: meta.authorDate,
          committerDate: meta.committerDate,
        },
        {
          tags: { method: "amend", oldSha, newSha },
        },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// push
// ---------------------------------------------------------------------------

export async function runPush(
  args: PushArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.push", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const remote = args.remote || globals.remote;
      const argv = ["push"];

      if (args.forceWithLease) {
        argv.push("--force-with-lease");
      } else if (args.force) {
        argv.push("--force");
      }
      if (args.setUpstream) {
        argv.push("-u");
      }

      argv.push(remote, args.branch);

      const result = await execGit(argv, {
        cwd: globals.repoPath,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git push failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      span.setAttribute(Attr.METHOD, "push");
      span.setAttribute(Attr.REMOTE, remote);
      span.setAttribute(Attr.BRANCH, args.branch);
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      const forceLabel = args.forceWithLease
        ? " (force-with-lease)"
        : args.force
        ? " (force)"
        : "";
      ctx.logger.info(
        `pushed ${args.branch} to ${remote}${forceLabel}`,
      );

      const safeBranch = args.branch.replace(/\//g, "-");
      const handle = await ctx.writeResource(
        "pushResult",
        `push-${safeBranch}`,
        {
          remote,
          branch: args.branch,
          forced: args.force || args.forceWithLease,
          forceWithLease: args.forceWithLease,
        },
        {
          tags: { method: "push", remote, branch: args.branch },
        },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// branch
// ---------------------------------------------------------------------------

export async function runBranch(
  args: BranchArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.branch", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const cwd = globals.repoPath;

      if (args.list) {
        const result = await execGit(["branch", "--list"], {
          cwd,
          signal: ctx.signal,
        });
        if (result.exitCode !== 0) {
          throw new Error(
            `git branch --list failed (exit ${result.exitCode}): ${result.stderr}`,
          );
        }

        let current: string | undefined;
        const branches = result.stdout
          .split("\n")
          .filter((l) => l.trim().length > 0)
          .map((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("* ")) {
              current = trimmed.substring(2);
              return current;
            }
            return trimmed;
          });

        span.setAttribute(Attr.METHOD, "branch");
        span.setAttribute(Attr.EXIT_CODE, result.exitCode);

        const handle = await ctx.writeResource(
          "branchResult",
          "branch-list",
          { current, branches },
          { tags: { method: "branch", action: "list" } },
        );

        return { dataHandles: [handle] };
      }

      if (!args.name) {
        throw new Error("branch name is required when not listing");
      }

      if (args.create) {
        const argv = args.orphan
          ? ["checkout", "--orphan", args.name]
          : ["checkout", "-b", args.name];
        if (!args.orphan && args.startPoint) {
          argv.push(args.startPoint);
        }

        const result = await execGit(argv, { cwd, signal: ctx.signal });
        if (result.exitCode !== 0) {
          const flag = args.orphan ? "--orphan" : "-b";
          throw new Error(
            `git checkout ${flag} failed (exit ${result.exitCode}): ${result.stderr}`,
          );
        }

        span.setAttribute(Attr.METHOD, "branch");
        span.setAttribute(Attr.BRANCH, args.name);
        span.setAttribute(Attr.EXIT_CODE, result.exitCode);

        const label = args.orphan ? "orphan branch" : "branch";
        ctx.logger.info(`created and switched to ${label} ${args.name}`);

        const safeName = args.name.replace(/\//g, "-");
        const handle = await ctx.writeResource(
          "branchResult",
          `branch-${safeName}`,
          { current: args.name, created: true, orphan: args.orphan },
          { tags: { method: "branch", action: "create", branch: args.name } },
        );

        return { dataHandles: [handle] };
      }

      const result = await execGit(["checkout", args.name], {
        cwd,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git checkout failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      span.setAttribute(Attr.METHOD, "branch");
      span.setAttribute(Attr.BRANCH, args.name);
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      ctx.logger.info(`switched to branch ${args.name}`);

      const safeName = args.name.replace(/\//g, "-");
      const handle = await ctx.writeResource(
        "branchResult",
        `branch-${safeName}`,
        { current: args.name, created: false },
        { tags: { method: "branch", action: "switch", branch: args.name } },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// config
// ---------------------------------------------------------------------------

export async function runConfig(
  args: ConfigArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.config", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const cwd = globals.repoPath;
      const resourceName = `config-${args.key.replace(/\./g, "-")}`;

      if (args.value !== undefined) {
        const scopeFlag = args.scope === "global" ? "--global" : "--local";
        const result = await execGit(
          ["config", scopeFlag, args.key, args.value],
          { cwd, signal: ctx.signal },
        );
        if (result.exitCode !== 0) {
          throw new Error(
            `git config set failed (exit ${result.exitCode}): ${result.stderr}`,
          );
        }

        span.setAttribute(Attr.METHOD, "config");
        span.setAttribute(Attr.EXIT_CODE, result.exitCode);

        ctx.logger.info(`set ${args.key}`);

        const handle = await ctx.writeResource(
          "configResult",
          resourceName,
          { key: args.key, value: args.value },
          { tags: { method: "config", key: args.key } },
        );

        return { dataHandles: [handle] };
      }

      const result = await execGit(["config", args.key], {
        cwd,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git config get failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      const value = result.stdout.trim();

      span.setAttribute(Attr.METHOD, "config");
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      const handle = await ctx.writeResource(
        "configResult",
        resourceName,
        { key: args.key, value },
        { tags: { method: "config", key: args.key } },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// pull
// ---------------------------------------------------------------------------

export async function runPull(
  args: PullArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.pull", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const remote = args.remote || globals.remote;
      const argv = ["pull"];

      if (args.rebase) {
        argv.push("--rebase");
      }
      if (args.ffOnly) {
        argv.push("--ff-only");
      }

      argv.push(remote);
      if (args.branch) {
        argv.push(args.branch);
      }

      const result = await execGit(argv, {
        cwd: globals.repoPath,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git pull failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      const raw = result.stdout + result.stderr;
      const alreadyUpToDate = raw.includes("Already up to date");

      span.setAttribute(Attr.METHOD, "pull");
      span.setAttribute(Attr.REMOTE, remote);
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      ctx.logger.info(
        `pulled from ${remote}${
          alreadyUpToDate ? " (already up to date)" : ""
        }`,
      );

      const handle = await ctx.writeResource(
        "pullResult",
        "pull",
        {
          remote,
          ...(args.branch ? { branch: args.branch } : {}),
          alreadyUpToDate,
          raw: raw.trim(),
        },
        {
          tags: { method: "pull", remote },
        },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// fetch
// ---------------------------------------------------------------------------

export async function runFetch(
  args: FetchArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.fetch", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const remote = args.remote || globals.remote;
      const argv = ["fetch"];

      if (args.tags) {
        argv.push("--tags");
      }
      if (args.prune) {
        argv.push("--prune");
      }
      if (args.depth !== undefined && args.depth > 0) {
        argv.push("--depth", String(args.depth));
      }

      argv.push(remote);

      const result = await execGit(argv, {
        cwd: globals.repoPath,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git fetch failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      span.setAttribute(Attr.METHOD, "fetch");
      span.setAttribute(Attr.REMOTE, remote);
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      ctx.logger.info(
        `fetched from ${remote}${args.tags ? " (with tags)" : ""}${
          args.prune ? " (pruned)" : ""
        }`,
      );

      const handle = await ctx.writeResource(
        "fetchResult",
        "fetch",
        {
          remote,
          tags: args.tags,
          pruned: args.prune,
          raw: (result.stdout + result.stderr).trim(),
        },
        {
          tags: { method: "fetch", remote },
        },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// cherry-pick
// ---------------------------------------------------------------------------

export async function runCherryPick(
  args: CherryPickArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.cherry-pick", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const cwd = globals.repoPath;

      if (args.abort) {
        const result = await execGit(["cherry-pick", "--abort"], {
          cwd,
          signal: ctx.signal,
        });
        if (result.exitCode !== 0) {
          throw new Error(
            `git cherry-pick --abort failed (exit ${result.exitCode}): ${result.stderr}`,
          );
        }

        span.setAttribute(Attr.METHOD, "cherry-pick");
        span.setAttribute(Attr.EXIT_CODE, result.exitCode);

        ctx.logger.info("aborted cherry-pick");

        const handle = await ctx.writeResource(
          "cherryPickResult",
          "cherry-pick-abort",
          {
            commits: [],
            conflict: false,
            aborted: true,
            raw: (result.stdout + result.stderr).trim(),
          },
          {
            tags: { method: "cherry-pick", action: "abort" },
          },
        );

        return { dataHandles: [handle] };
      }

      if (!args.commits || args.commits.length === 0) {
        throw new Error(
          "commits are required when not aborting a cherry-pick",
        );
      }

      const argv = ["cherry-pick"];
      if (args.noCommit) {
        argv.push("--no-commit");
      }
      argv.push("--", ...args.commits);

      const result = await execGit(argv, { cwd, signal: ctx.signal });
      const raw = (result.stdout + result.stderr).trim();

      if (result.exitCode !== 0) {
        const isConflict = raw.includes("CONFLICT") ||
          raw.includes("could not apply");

        if (!isConflict) {
          throw new Error(
            `git cherry-pick failed (exit ${result.exitCode}): ${result.stderr}`,
          );
        }

        const statusResult = await execGit(
          ["diff", "--name-only", "--diff-filter=U"],
          { cwd, signal: ctx.signal },
        );
        const conflictFiles = statusResult.stdout
          .split("\n")
          .filter((l) => l.trim().length > 0);

        span.setAttribute(Attr.METHOD, "cherry-pick");
        span.setAttribute(Attr.EXIT_CODE, result.exitCode);

        ctx.logger.warn(
          `cherry-pick conflict: ${conflictFiles.length} file(s)`,
        );

        const handle = await ctx.writeResource(
          "cherryPickResult",
          "cherry-pick",
          {
            commits: args.commits,
            conflict: true,
            conflictFiles,
            raw,
          },
          {
            tags: { method: "cherry-pick", conflict: "true" },
          },
        );

        return { dataHandles: [handle] };
      }

      span.setAttribute(Attr.METHOD, "cherry-pick");
      span.setAttribute(
        Attr.CHERRY_PICK_SHA,
        args.commits.join(","),
      );
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      ctx.logger.info(
        `cherry-picked ${args.commits.length} commit(s)`,
      );

      const handle = await ctx.writeResource(
        "cherryPickResult",
        "cherry-pick",
        {
          commits: args.commits,
          conflict: false,
          raw,
        },
        {
          tags: { method: "cherry-pick" },
        },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// upstream-state
// ---------------------------------------------------------------------------

export async function runUpstreamState(
  args: UpstreamStateArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan(
    "git.upstream-state",
    async (span) => {
      try {
        const globals = resolveGlobalArgs(ctx.globalArgs);
        const cwd = globals.repoPath;

        let branch: string;
        if (args.branch) {
          branch = args.branch;
        } else {
          const headResult = await execGit(
            ["rev-parse", "--abbrev-ref", "HEAD"],
            { cwd, signal: ctx.signal },
          );
          if (headResult.exitCode !== 0) {
            throw new Error(
              `git rev-parse --abbrev-ref HEAD failed (exit ${headResult.exitCode}): ${headResult.stderr}`,
            );
          }
          branch = headResult.stdout.trim();
        }

        const upstreamRef = args.branch ? `${args.branch}@{u}` : "@{u}";
        const upstreamResult = await execGit(
          ["rev-parse", "--abbrev-ref", "--symbolic-full-name", upstreamRef],
          { cwd, signal: ctx.signal },
        );

        const trackingRefAvailable = upstreamResult.exitCode === 0;
        let upstream = "";
        let configuredUpstream = "";
        let ahead = 0;
        let behind = 0;

        if (trackingRefAvailable) {
          upstream = upstreamResult.stdout.trim();

          const countResult = await execGit(
            ["rev-list", "--left-right", "--count", `${upstream}...${branch}`],
            { cwd, signal: ctx.signal },
          );
          if (countResult.exitCode !== 0) {
            throw new Error(
              `git rev-list --left-right --count failed (exit ${countResult.exitCode}): ${countResult.stderr}`,
            );
          }

          const parts = countResult.stdout.trim().split(/\s+/);
          if (
            parts.length !== 2 ||
            !Number.isFinite(Number(parts[0])) ||
            !Number.isFinite(Number(parts[1]))
          ) {
            throw new Error(
              `unexpected rev-list output (expected "behind\\tahead"): ${countResult.stdout.trim()}`,
            );
          }
          behind = parseInt(parts[0], 10);
          ahead = parseInt(parts[1], 10);
          configuredUpstream = upstream;
        } else {
          const remoteResult = await execGit(
            ["config", "--get", `branch.${branch}.remote`],
            { cwd, signal: ctx.signal },
          );
          const mergeResult = await execGit(
            ["config", "--get", `branch.${branch}.merge`],
            { cwd, signal: ctx.signal },
          );
          const remote = remoteResult.exitCode === 0
            ? remoteResult.stdout.trim()
            : "";
          const merge = mergeResult.exitCode === 0
            ? mergeResult.stdout.trim()
            : "";
          if (remote !== "" && merge !== "") {
            const shortMerge = merge.replace(/^refs\/heads\//, "");
            configuredUpstream = `${remote}/${shortMerge}`;
          }
        }

        const hasUpstream = trackingRefAvailable ||
          configuredUpstream !== "";
        const pushed = trackingRefAvailable && ahead === 0;
        const synced = trackingRefAvailable && ahead === 0 && behind === 0;

        span.setAttribute(Attr.METHOD, "upstream-state");
        span.setAttribute(Attr.BRANCH, branch);
        span.setAttribute(Attr.EXIT_CODE, 0);
        if (trackingRefAvailable) {
          span.setAttribute(Attr.UPSTREAM_REF, upstream);
        }

        ctx.logger.info(
          trackingRefAvailable
            ? `${branch} tracking ${upstream}: ahead=${ahead} behind=${behind}`
            : hasUpstream
            ? `${branch} has configured upstream ${configuredUpstream} but no local tracking ref`
            : `${branch} has no upstream`,
        );

        const safeBranch = branch.replace(/\//g, "-");
        const handle = await ctx.writeResource(
          "upstreamStateResult",
          `upstream-state-${safeBranch}`,
          {
            branch,
            hasUpstream,
            upstream,
            configuredUpstream,
            trackingRefAvailable,
            ahead,
            behind,
            pushed,
            synced,
          },
          {
            tags: {
              method: "upstream-state",
              branch,
              pushed: String(pushed),
              synced: String(synced),
            },
          },
        );

        return { dataHandles: [handle] };
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        throw error;
      } finally {
        span.end();
      }
    },
  );
}

// ---------------------------------------------------------------------------
// remote-ref
// ---------------------------------------------------------------------------

export async function runRemoteRef(
  args: RemoteRefArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan("git.remote-ref", async (span) => {
    try {
      const globals = resolveGlobalArgs(ctx.globalArgs);
      const remote = args.remote || globals.remote;

      const argv = ["ls-remote", "--", remote, args.ref];

      const result = await execGit(argv, {
        cwd: globals.repoPath,
        signal: ctx.signal,
      });
      if (result.exitCode !== 0) {
        throw new Error(
          `git ls-remote failed (exit ${result.exitCode}): ${result.stderr}`,
        );
      }

      const lines = result.stdout
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .filter((l) => !l.endsWith("^{}"));

      if (lines.length === 0) {
        throw new Error(
          `ref not found: '${args.ref}' does not exist on remote '${remote}'`,
        );
      }

      if (lines.length > 1) {
        const refs = lines.map((l) => l.split("\t")[1] || l).join(", ");
        throw new Error(
          `ambiguous ref: '${args.ref}' matches multiple refs on remote '${remote}': ${refs}`,
        );
      }

      const parts = lines[0].split("\t");
      if (parts.length < 2) {
        throw new Error(
          `unexpected ls-remote output: ${lines[0]}`,
        );
      }

      const sha = parts[0].trim();
      const resolvedRef = parts[1].trim();

      span.setAttribute(Attr.METHOD, "remote-ref");
      span.setAttribute(Attr.REMOTE, remote);
      span.setAttribute(Attr.REF, resolvedRef);
      span.setAttribute(Attr.EXIT_CODE, result.exitCode);

      ctx.logger.info(
        `${resolvedRef} on ${remote}: ${sha.substring(0, 8)}`,
      );

      const safeRef = resolvedRef.replace(/\//g, "-");
      const handle = await ctx.writeResource(
        "remoteRefResult",
        `remote-ref-${safeRef}`,
        {
          remote,
          ref: resolvedRef,
          sha,
        },
        {
          tags: { method: "remote-ref", remote, ref: resolvedRef },
        },
      );

      return { dataHandles: [handle] };
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

// ---------------------------------------------------------------------------
// is-ancestor
// ---------------------------------------------------------------------------

export async function runIsAncestor(
  args: IsAncestorArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan(
    "git.is-ancestor",
    async (span) => {
      try {
        const globals = resolveGlobalArgs(ctx.globalArgs);
        const cwd = globals.repoPath;

        const result = await execGit(
          ["merge-base", "--is-ancestor", args.ancestor, args.descendant],
          { cwd, signal: ctx.signal },
        );

        if (result.exitCode !== 0 && result.exitCode !== 1) {
          throw new Error(
            `git merge-base --is-ancestor failed (exit ${result.exitCode}): ${result.stderr}`,
          );
        }

        const isAncestor = result.exitCode === 0;

        span.setAttribute(Attr.METHOD, "is-ancestor");
        span.setAttribute(Attr.EXIT_CODE, result.exitCode);

        ctx.logger.info(
          `${args.ancestor} ${
            isAncestor ? "is" : "is not"
          } an ancestor of ${args.descendant}`,
        );

        const handle = await ctx.writeResource(
          "isAncestorResult",
          "is-ancestor",
          {
            ancestor: args.ancestor,
            descendant: args.descendant,
            isAncestor,
          },
          {
            tags: {
              method: "is-ancestor",
              ancestor: args.ancestor,
              descendant: args.descendant,
              isAncestor: String(isAncestor),
            },
          },
        );

        return { dataHandles: [handle] };
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        throw error;
      } finally {
        span.end();
      }
    },
  );
}

// ---------------------------------------------------------------------------
// remove-worktree
// ---------------------------------------------------------------------------

interface WorktreeEntry {
  worktree: string;
  bare: boolean;
}

function parseWorktreeList(raw: string): WorktreeEntry[] {
  const entries: WorktreeEntry[] = [];
  let current: Partial<WorktreeEntry> = {};

  for (const line of raw.split("\n")) {
    if (line === "") {
      if (current.worktree !== undefined) {
        entries.push({
          worktree: current.worktree,
          bare: current.bare ?? false,
        });
      }
      current = {};
      continue;
    }
    if (line.startsWith("worktree ")) {
      current.worktree = line.substring("worktree ".length);
    }
    if (line === "bare") {
      current.bare = true;
    }
  }
  if (current.worktree !== undefined) {
    entries.push({
      worktree: current.worktree,
      bare: current.bare ?? false,
    });
  }
  return entries;
}

export async function runRemoveWorktree(
  args: RemoveWorktreeArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan(
    "git.remove-worktree",
    async (span) => {
      try {
        const globals = resolveGlobalArgs(ctx.globalArgs);
        const cwd = globals.repoPath;

        const listResult = await execGit(
          ["worktree", "list", "--porcelain"],
          { cwd, signal: ctx.signal },
        );
        if (listResult.exitCode !== 0) {
          throw new Error(
            `git worktree list failed (exit ${listResult.exitCode}): ${listResult.stderr}`,
          );
        }

        const worktrees = parseWorktreeList(listResult.stdout);

        const resolvedPath = args.path.replace(/\/+$/, "");

        const primaryPath = worktrees.length > 0
          ? worktrees[0].worktree
          : undefined;
        if (
          primaryPath !== undefined &&
          resolvedPath === primaryPath.replace(/\/+$/, "")
        ) {
          throw new Error(
            "cannot remove the primary checkout",
          );
        }

        const registered = worktrees.some(
          (w) => w.worktree.replace(/\/+$/, "") === resolvedPath,
        );

        if (!registered) {
          span.setAttribute(Attr.METHOD, "remove-worktree");
          span.setAttribute(Attr.EXIT_CODE, 0);

          ctx.logger.info(
            `worktree ${resolvedPath} already absent`,
          );

          const handle = await ctx.writeResource(
            "removeWorktreeResult",
            "remove-worktree",
            {
              path: resolvedPath,
              removed: false,
              alreadyAbsent: true,
              reason: "worktree not registered",
            },
            {
              tags: { method: "remove-worktree", removed: "false" },
            },
          );

          return { dataHandles: [handle] };
        }

        const statusResult = await execGit(
          ["status", "--porcelain"],
          { cwd: resolvedPath, signal: ctx.signal },
        );
        if (statusResult.exitCode !== 0) {
          throw new Error(
            `git status failed for worktree (exit ${statusResult.exitCode}): ${statusResult.stderr}`,
          );
        }
        if (statusResult.stdout.trim().length > 0) {
          throw new Error(
            "worktree has uncommitted changes — commit or discard before removing",
          );
        }

        const removeResult = await execGit(
          ["worktree", "remove", resolvedPath],
          { cwd, signal: ctx.signal },
        );
        if (removeResult.exitCode !== 0) {
          throw new Error(
            `git worktree remove failed (exit ${removeResult.exitCode}): ${removeResult.stderr}`,
          );
        }

        span.setAttribute(Attr.METHOD, "remove-worktree");
        span.setAttribute(Attr.EXIT_CODE, removeResult.exitCode);

        ctx.logger.info(`removed worktree ${resolvedPath}`);

        const handle = await ctx.writeResource(
          "removeWorktreeResult",
          "remove-worktree",
          {
            path: resolvedPath,
            removed: true,
            alreadyAbsent: false,
            reason: "worktree removed",
          },
          {
            tags: { method: "remove-worktree", removed: "true" },
          },
        );

        return { dataHandles: [handle] };
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        throw error;
      } finally {
        span.end();
      }
    },
  );
}

// ---------------------------------------------------------------------------
// worktree-diff
// ---------------------------------------------------------------------------

export async function runWorktreeDiff(
  args: WorktreeDiffArgs,
  ctx: GitContext,
): Promise<{ dataHandles: DataHandle[] }> {
  return await getTracer().startActiveSpan(
    "git.worktree-diff",
    async (span) => {
      try {
        const globals = resolveGlobalArgs(ctx.globalArgs);
        const cwd = globals.repoPath;

        const pathArgs: string[] = [];
        if (args.paths && args.paths.length > 0) {
          pathArgs.push("--");
          pathArgs.push(...args.paths);
        }

        // Always enumerate tracked changed files for accurate files/count.
        const nameOnlyArgv = ["diff", "--name-only", args.base, ...pathArgs];
        const nameOnlyResult = await execGit(nameOnlyArgv, {
          cwd,
          signal: ctx.signal,
        });
        if (nameOnlyResult.exitCode !== 0) {
          throw new Error(
            `git diff failed (exit ${nameOnlyResult.exitCode}): ${nameOnlyResult.stderr}`,
          );
        }

        const trackedFiles = nameOnlyResult.stdout
          .split("\n")
          .filter((l) => l.trim().length > 0);

        // Get the primary diff output (patch, stat, or name-only).
        let raw: string;
        if (args.nameOnly) {
          raw = nameOnlyResult.stdout;
        } else {
          const diffArgv = ["diff", args.base];
          if (args.stat) {
            diffArgv.push("--stat");
          }
          diffArgv.push(...pathArgs);

          const diffResult = await execGit(diffArgv, {
            cwd,
            signal: ctx.signal,
          });
          if (diffResult.exitCode !== 0) {
            throw new Error(
              `git diff failed (exit ${diffResult.exitCode}): ${diffResult.stderr}`,
            );
          }
          raw = diffResult.stdout;
        }

        // Enumerate untracked non-ignored files.
        const lsArgv = [
          "ls-files",
          "--others",
          "--exclude-standard",
          ...pathArgs,
        ];

        const lsResult = await execGit(lsArgv, {
          cwd,
          signal: ctx.signal,
        });
        if (lsResult.exitCode !== 0) {
          throw new Error(
            `git ls-files failed (exit ${lsResult.exitCode}): ${lsResult.stderr}`,
          );
        }

        const untrackedFiles = lsResult.stdout
          .split("\n")
          .filter((l) => l.trim().length > 0);

        // Collect patches for untracked files in full-diff mode.
        if (!args.nameOnly && !args.stat && untrackedFiles.length > 0) {
          for (const file of untrackedFiles) {
            const noIndexResult = await execGit(
              ["diff", "--no-index", "--", "/dev/null", file],
              { cwd, signal: ctx.signal },
            );
            // git diff --no-index exits 1 when files differ (expected)
            if (noIndexResult.exitCode !== 0 && noIndexResult.exitCode !== 1) {
              throw new Error(
                `git diff --no-index failed for ${file} (exit ${noIndexResult.exitCode}): ${noIndexResult.stderr}`,
              );
            }
            raw += noIndexResult.stdout;
          }
        }

        const allFiles = [...trackedFiles, ...untrackedFiles];

        span.setAttribute(Attr.METHOD, "worktree-diff");
        span.setAttribute(Attr.BASE_REF, args.base);
        span.setAttribute(Attr.REPO_PATH, cwd);
        span.setAttribute(Attr.EXIT_CODE, 0);

        const handle = await ctx.writeResource(
          "worktreeDiffResult",
          "worktree-diff",
          {
            files: allFiles,
            untrackedFiles,
            raw,
            count: allFiles.length,
            base: args.base,
          },
          {
            tags: { method: "worktree-diff", base: args.base },
          },
        );

        return { dataHandles: [handle] };
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        throw error;
      } finally {
        span.end();
      }
    },
  );
}
