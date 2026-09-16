import { z } from "npm:zod@4.3.6";

// ---------------------------------------------------------------------------
// Global arguments
// ---------------------------------------------------------------------------

export const GlobalArgsSchema = z.object({
  repoPath: z.string().default(".")
    .describe("Path to the git repository"),
  remote: z.string().default("origin").refine(
    (v) => !v.startsWith("-"),
    { message: "must not start with a dash (interpreted as a git flag)" },
  )
    .describe("Default remote name"),
  authorName: z.string().optional()
    .describe("Commit author name (applied via git -c flags)"),
  authorEmail: z.string().optional()
    .describe("Commit author email (applied via git -c flags)"),
});

export type GlobalArgs = z.infer<typeof GlobalArgsSchema>;

// ---------------------------------------------------------------------------
// Shared refinements
// ---------------------------------------------------------------------------

const safeRef = z.string().refine(
  (v) => !v.startsWith("-"),
  { message: "must not start with a dash (interpreted as a git flag)" },
);

const safeRefOptional = z.string().optional().refine(
  (v) => v === undefined || !v.startsWith("-"),
  { message: "must not start with a dash (interpreted as a git flag)" },
);

/**
 * A git-parseable date string.
 *
 * Deliberately thin: git is the authoritative validator and rejects anything it
 * cannot parse with `fatal: invalid date format: <value>` and a non-zero exit.
 * Re-implementing its parser here would only narrow what callers can express —
 * git accepts ISO 8601, RFC 2822, `@<epoch> <tz>`, and relative forms like
 * "2 hours ago". What we do reject is input that would corrupt the environment
 * block a date is passed through: empty values and embedded control characters,
 * where a newline could smuggle a second assignment.
 */
const gitDate = z.string().optional().refine(
  (v) => v === undefined || v.trim().length > 0,
  { message: "must not be empty" },
).refine(
  (v) => v === undefined || !/[\n\r\0]/.test(v),
  {
    message:
      "must not contain control characters (newline, carriage return, or null)",
  },
);

// ---------------------------------------------------------------------------
// Method argument schemas
// ---------------------------------------------------------------------------

export const CloneArgsSchema = z.object({
  url: z.string().min(1)
    .describe("Repository URL to clone"),
  path: z.string().optional()
    .describe("Destination path (defaults to repo name)"),
  depth: z.number().int().min(0).optional()
    .describe("Clone depth (0 = full history, omit for default)"),
  branch: safeRefOptional
    .describe("Branch to checkout after clone"),
  token: z.string().optional().meta({ sensitive: true })
    .describe("Auth token for authenticated HTTPS clone"),
});

export type CloneArgs = z.infer<typeof CloneArgsSchema>;

export const DiffArgsSchema = z.object({
  base: safeRef
    .describe("Base ref (SHA, branch, tag, HEAD~1, etc.)"),
  head: safeRef.default("HEAD")
    .describe("Head ref"),
  nameOnly: z.boolean().default(false)
    .describe("Only return changed file paths"),
  diffFilter: z.string().optional()
    .describe("Diff filter flags (e.g. 'd' to exclude deleted files)"),
  paths: z.array(z.string()).optional()
    .describe("Path filters (git pathspecs after --)"),
  stat: z.boolean().default(false)
    .describe("Show diffstat summary instead of patch"),
  threeWay: z.boolean().default(false)
    .describe("Use three-dot (merge-base) diff syntax"),
});

export type DiffArgs = z.infer<typeof DiffArgsSchema>;

export const StatusArgsSchema = z.object({
  paths: z.array(z.string()).optional()
    .describe("Filter status to specific paths"),
});

export type StatusArgs = z.infer<typeof StatusArgsSchema>;

export const LogArgsSchema = z.object({
  paths: z.array(z.string()).optional()
    .describe("Scope log to specific directories or files"),
  maxCount: z.number().int().positive().optional()
    .describe("Maximum number of commits to return"),
  format: z.string().optional()
    .describe("Custom --format string (disables structured parsing)"),
});

export type LogArgs = z.infer<typeof LogArgsSchema>;

export const CommitArgsSchema = z.object({
  message: z.string().min(1)
    .describe("Commit message"),
  paths: z.array(z.string()).optional()
    .describe("Specific paths to stage before committing"),
  addAll: z.boolean().default(false)
    .describe("Run git add -A before committing"),
  authorDate: gitDate
    .describe(
      "Author date (any git-parseable format). Also sets the committer date unless committerDate is given explicitly",
    ),
  committerDate: gitDate
    .describe(
      "Committer date (any git-parseable format). Defaults to authorDate when that is set",
    ),
});

export type CommitArgs = z.infer<typeof CommitArgsSchema>;

export const AmendArgsSchema = z.object({
  message: z.string().min(1).optional()
    .describe("New commit message (omit to keep existing message)"),
  paths: z.array(z.string()).optional()
    .describe("Additional paths to stage before amending"),
  addAll: z.boolean().default(false)
    .describe("Run git add -A before amending"),
  keepMessage: z.boolean().default(false)
    .describe("Keep the existing commit message (--no-edit)"),
  authorDate: gitDate
    .describe(
      "Author date (any git-parseable format). Also sets the committer date unless committerDate is given explicitly. The original author name and email are preserved",
    ),
  committerDate: gitDate
    .describe(
      "Committer date (any git-parseable format). Defaults to authorDate when that is set",
    ),
}).refine(
  (v) => v.message !== undefined || v.keepMessage,
  {
    message:
      "either message or keepMessage must be provided — amend needs a message source",
  },
).refine(
  (v) => !(v.message !== undefined && v.keepMessage),
  {
    message:
      "message and keepMessage are mutually exclusive — provide one or the other",
  },
);

export type AmendArgs = z.infer<typeof AmendArgsSchema>;

export const PushArgsSchema = z.object({
  remote: safeRefOptional
    .describe("Remote name (defaults to global remote)"),
  branch: safeRef
    .describe("Branch to push"),
  force: z.boolean().default(false)
    .describe("Force push (--force)"),
  forceWithLease: z.boolean().default(false)
    .describe(
      "Force push with lease check (--force-with-lease) — refuses when the remote moved since the last fetch",
    ),
  setUpstream: z.boolean().default(false)
    .describe("Set upstream tracking (-u)"),
}).refine(
  (v) => !(v.force && v.forceWithLease),
  {
    message:
      "force and forceWithLease are mutually exclusive — use one or the other",
  },
);

export type PushArgs = z.infer<typeof PushArgsSchema>;

export const BranchArgsSchema = z.object({
  name: safeRefOptional
    .describe("Branch name to create or switch to"),
  create: z.boolean().default(false)
    .describe("Create a new branch"),
  orphan: z.boolean().default(false)
    .describe(
      "Create an orphan branch with no parent history (requires create: true)",
    ),
  startPoint: safeRefOptional
    .describe("Base ref for new branch creation"),
  list: z.boolean().default(false)
    .describe("List all local branches"),
}).refine(
  (v) => !v.orphan || v.create,
  {
    message: "orphan requires create to be true",
  },
).refine(
  (v) => !(v.orphan && v.startPoint),
  {
    message:
      "orphan and startPoint are mutually exclusive — orphan branches have no parent",
  },
);

export type BranchArgs = z.infer<typeof BranchArgsSchema>;

export const PullArgsSchema = z.object({
  remote: safeRefOptional
    .describe("Remote name (defaults to global remote)"),
  branch: safeRefOptional
    .describe("Branch to pull"),
  rebase: z.boolean().default(false)
    .describe("Rebase local commits on top of upstream (--rebase)"),
  ffOnly: z.boolean().default(false)
    .describe("Only fast-forward, fail if not possible (--ff-only)"),
});

export type PullArgs = z.infer<typeof PullArgsSchema>;

export const FetchArgsSchema = z.object({
  remote: safeRefOptional
    .describe("Remote name (defaults to global remote)"),
  tags: z.boolean().default(false)
    .describe("Fetch all tags from the remote (--tags)"),
  prune: z.boolean().default(false)
    .describe("Remove remote-tracking refs that no longer exist (--prune)"),
  depth: z.number().int().min(0).optional()
    .describe("Limit fetch to specified depth"),
});

export type FetchArgs = z.infer<typeof FetchArgsSchema>;

export const CherryPickArgsSchema = z.object({
  commits: z.array(safeRef).optional()
    .describe("Commit SHAs to cherry-pick (in order)"),
  noCommit: z.boolean().default(false)
    .describe("Apply changes without committing (--no-commit)"),
  abort: z.boolean().default(false)
    .describe("Abort an in-progress cherry-pick (--abort)"),
});

export type CherryPickArgs = z.infer<typeof CherryPickArgsSchema>;

export const ConfigArgsSchema = z.object({
  key: z.string().min(1).refine(
    (v) => !v.startsWith("-"),
    { message: "must not start with a dash (interpreted as a git flag)" },
  )
    .describe("Config key (e.g. user.name, user.email)"),
  value: z.string().optional().refine(
    (v) => v === undefined || !v.startsWith("-"),
    { message: "must not start with a dash (interpreted as a git flag)" },
  )
    .describe("Value to set (omit to read current value)"),
  scope: z.enum(["local", "global"]).default("local")
    .describe("Config scope for set operations"),
});

export type ConfigArgs = z.infer<typeof ConfigArgsSchema>;

// ---------------------------------------------------------------------------
// Resource schemas
// ---------------------------------------------------------------------------

export const CloneResultSchema = z.object({
  path: z.string(),
  url: z.string(),
  depth: z.number().int().optional(),
  branch: z.string().optional(),
});

export const DiffResultSchema = z.object({
  files: z.array(z.string()),
  raw: z.string(),
  count: z.number().int(),
  base: z.string(),
  head: z.string(),
});

export const StatusEntrySchema = z.object({
  path: z.string(),
  status: z.string(),
});

export const StatusResultSchema = z.object({
  entries: z.array(StatusEntrySchema),
  clean: z.boolean(),
  count: z.number().int(),
  raw: z.string(),
});

export const CommitEntrySchema = z.object({
  sha: z.string(),
  author: z.string(),
  date: z.string(),
  message: z.string(),
});

export const LogResultSchema = z.object({
  commits: z.array(CommitEntrySchema),
  count: z.number().int(),
  raw: z.string().optional(),
});

export const CommitResultSchema = z.object({
  sha: z.string(),
  message: z.string(),
  authorDate: z.string(),
  committerDate: z.string(),
});

export const AmendResultSchema = z.object({
  oldSha: z.string(),
  newSha: z.string(),
  message: z.string(),
  authorDate: z.string(),
  committerDate: z.string(),
});

export const PushResultSchema = z.object({
  remote: z.string(),
  branch: z.string(),
  forced: z.boolean(),
  forceWithLease: z.boolean(),
});

export const BranchResultSchema = z.object({
  current: z.string().optional(),
  branches: z.array(z.string()).optional(),
  created: z.boolean().optional(),
  orphan: z.boolean().optional(),
});

export const PullResultSchema = z.object({
  remote: z.string(),
  branch: z.string().optional(),
  alreadyUpToDate: z.boolean(),
  raw: z.string(),
});

export const FetchResultSchema = z.object({
  remote: z.string(),
  tags: z.boolean(),
  pruned: z.boolean(),
  raw: z.string(),
});

export const CherryPickResultSchema = z.object({
  commits: z.array(z.string()),
  conflict: z.boolean(),
  conflictFiles: z.array(z.string()).optional(),
  aborted: z.boolean().optional(),
  raw: z.string(),
});

export const ConfigResultSchema = z.object({
  key: z.string(),
  value: z.string(),
});

// ---------------------------------------------------------------------------
// remote_ref
// ---------------------------------------------------------------------------

export const RemoteRefArgsSchema = z.object({
  remote: safeRefOptional
    .describe("Remote name (defaults to global remote)"),
  ref: safeRef
    .describe(
      "Ref to look up (e.g. 'refs/heads/main', 'main', 'v1.0.0'). Fully-qualified refs avoid ambiguity.",
    ),
});

export type RemoteRefArgs = z.infer<typeof RemoteRefArgsSchema>;

export const RemoteRefResultSchema = z.object({
  remote: z.string(),
  ref: z.string(),
  sha: z.string(),
});

// ---------------------------------------------------------------------------
// is_ancestor
// ---------------------------------------------------------------------------

export const IsAncestorArgsSchema = z.object({
  ancestor: safeRef
    .describe("Ref to test as ancestor (SHA, branch, tag)"),
  descendant: safeRef
    .describe("Ref to test as descendant (SHA, branch, tag)"),
});

export type IsAncestorArgs = z.infer<typeof IsAncestorArgsSchema>;

export const IsAncestorResultSchema = z.object({
  ancestor: z.string(),
  descendant: z.string(),
  isAncestor: z.boolean(),
});

// ---------------------------------------------------------------------------
// remove_worktree
// ---------------------------------------------------------------------------

export const RemoveWorktreeArgsSchema = z.object({
  path: z.string().min(1).refine(
    (v) => !v.startsWith("-"),
    { message: "must not start with a dash (interpreted as a git flag)" },
  )
    .describe("Path of the worktree to remove"),
});

export type RemoveWorktreeArgs = z.infer<typeof RemoveWorktreeArgsSchema>;

export const RemoveWorktreeResultSchema = z.object({
  path: z.string(),
  removed: z.boolean(),
  alreadyAbsent: z.boolean(),
  reason: z.string(),
});

// ---------------------------------------------------------------------------
// upstream_state
// ---------------------------------------------------------------------------

export const UpstreamStateArgsSchema = z.object({
  branch: safeRefOptional
    .describe("Branch to check (defaults to current HEAD branch)"),
});

export type UpstreamStateArgs = z.infer<typeof UpstreamStateArgsSchema>;

export const UpstreamStateResultSchema = z.object({
  branch: z.string(),
  hasUpstream: z.boolean()
    .describe(
      "True when the branch has a configured upstream (remote + merge ref), even if the tracking ref is not locally available",
    ),
  upstream: z.string()
    .describe(
      "Upstream tracking ref (e.g. origin/main) when trackingRefAvailable is true, otherwise empty string",
    ),
  configuredUpstream: z.string()
    .describe(
      "Configured upstream from branch.<name>.remote + branch.<name>.merge (e.g. origin/feature), or empty string when no upstream is configured",
    ),
  trackingRefAvailable: z.boolean()
    .describe(
      "Whether the remote-tracking ref exists locally (git rev-parse @{u} resolved). When false, ahead/behind/pushed/synced are defaults (0/false) — check this field first.",
    ),
  ahead: z.number().int(),
  behind: z.number().int(),
  pushed: z.boolean(),
  synced: z.boolean(),
});

// ---------------------------------------------------------------------------
// worktree_diff
// ---------------------------------------------------------------------------

export const WorktreeDiffArgsSchema = z.object({
  base: safeRef.default("HEAD")
    .describe("Base ref to compare against (SHA, branch, tag, HEAD~1, etc.)"),
  nameOnly: z.boolean().default(false)
    .describe("Only return changed file paths"),
  stat: z.boolean().default(false)
    .describe("Show diffstat summary instead of patch"),
  paths: z.array(z.string()).optional()
    .describe("Path filters (git pathspecs after --)"),
});

export type WorktreeDiffArgs = z.infer<typeof WorktreeDiffArgsSchema>;

export const WorktreeDiffResultSchema = z.object({
  files: z.array(z.string()),
  untrackedFiles: z.array(z.string()),
  raw: z.string(),
  count: z.number().int(),
  base: z.string(),
});
