# @swamp/git

Git repository operations with structured output for swamp workflows. Wraps the
git CLI and returns typed data (file lists, commit objects, status entries)
instead of raw text, making git operations composable in workflows and
queryable through `swamp data`.

Designed for CI automation: change detection via diff, dirty-tree checks via
status, bot commits and branch management for automated PRs. Every operation
that currently lives as inline bash in CI workflow YAML can become a typed,
testable model method call.

## Installation

```bash
swamp extension pull @swamp/git
```

## Usage

### Create a Model Instance

Point the model at the repo you want to operate on:

```bash
swamp model create @swamp/git repo \
  --global-arg repoPath=/path/to/repo
```

For automation that commits and pushes, set the author identity:

```bash
swamp model create @swamp/git repo \
  --global-arg repoPath=/path/to/repo \
  --global-arg authorName="forgejo-actions[bot]" \
  --global-arg authorEmail="forgejo-actions[bot]@git.swamp-club.com"
```

### Detect Changed Files (CI Change Detection)

The most common CI pattern — find which files changed in a PR:

```bash
# Three-way diff between PR base and head (same as actions/checkout + git diff)
swamp model method run repo diff \
  --input base=$BASE_SHA \
  --input head=$HEAD_SHA \
  --input nameOnly=true \
  --input threeWay=true \
  --json
```

Filter to specific paths (replaces `git diff | grep`):

```bash
# Only manifest files (replaces: git diff --name-only HEAD~1 HEAD -- '*/manifest.yaml')
swamp model method run repo diff \
  --input base=HEAD~1 \
  --input nameOnly=true \
  --input 'paths:json=["*/manifest.yaml"]' \
  --input diffFilter=d \
  --json
```

### Review Working-Tree Changes (Pre-commit Review)

Diff the working tree against a base ref, including staged, unstaged, and
untracked non-ignored files. Read-only — makes no index, worktree, or network
mutations.

```bash
# Full working-tree diff against HEAD (tracked + untracked)
swamp model method run repo worktree_diff --json

# Name-only file list for change detection
swamp model method run repo worktree_diff \
  --input nameOnly=true \
  --json

# Diff against a specific base ref
swamp model method run repo worktree_diff \
  --input base=HEAD~3 \
  --json

# Filter to specific paths
swamp model method run repo worktree_diff \
  --input nameOnly=true \
  --input 'paths:json=["src/", "lib/"]' \
  --json
```

### Check Working Tree Status

```bash
# Working tree status (replaces: git status --porcelain)
swamp model method run repo status --json

# Filter to specific paths (replaces: git status --porcelain -- '*/deno.json')
swamp model method run repo status \
  --input 'paths:json=["*/deno.json"]' \
  --json
```

### Look Up a Remote Ref (Pre-commit Base Check)

```bash
# Get the current SHA of refs/heads/main on origin
swamp model method run repo remote_ref \
  --input ref=refs/heads/main \
  --json

# Shorthand ref (git ls-remote resolves it)
swamp model method run repo remote_ref \
  --input ref=main \
  --json

# Check a different remote
swamp model method run repo remote_ref \
  --input remote=upstream \
  --input ref=refs/heads/main \
  --json
```

### Check Upstream / Push State

```bash
# Is the current branch pushed and synced with its upstream?
swamp model method run repo upstream_state --json

# Check a specific branch
swamp model method run repo upstream_state \
  --input branch=main \
  --json

# Query for unpushed branches across models
swamp data query repo 'tags.pushed == "false"'
```

### Query Commit History

```bash
# Last 5 commits
swamp model method run repo log --input maxCount=5 --json

# History scoped to a directory (for regression detection)
swamp model method run repo log \
  --input 'paths:json=["codegen/aws/"]' \
  --input maxCount=10 \
  --json
```

### Commit and Push (Bot Automation)

The complete bot-commit cycle — replaces the 10-line bash block in CI:

```bash
# Create a branch
swamp model method run repo branch \
  --input name=automated/regenerate-models \
  --input create=true \
  --json

# Stage all changes and commit
swamp model method run repo commit \
  --input "message=chore: regenerate models (2026-08-05)" \
  --input addAll=true \
  --json

# Force-push to the automation branch
swamp model method run repo push \
  --input branch=automated/regenerate-models \
  --input force=true \
  --json
```

### Commit at a Specific Date (History Reconstruction)

When commit time is data — importing from another VCS, replaying an event log,
reconstructing history — set the dates explicitly instead of taking wall clock:

```bash
swamp model method run repo commit \
  --input "message=import: 2001 changeset" \
  --input addAll=true \
  --input authorDate="2001-02-03T04:05:06+00:00" \
  --json
```

Any format git accepts works: ISO 8601, RFC 2822, `@<epoch> <tz>`, or relative
forms like `"2 hours ago"`. Git validates the value and fails the method with
`invalid date format` if it cannot parse it.

**`authorDate` sets both dates by default.** This is deliberate.
`git commit --date` sets only the author date, leaving a real wall-clock
committer timestamp on every object — invisible in default `git log` output and
surprising whenever something finally surfaces it. To make the two differ, set
`committerDate` explicitly:

```bash
swamp model method run repo commit \
  --input "message=applied later than authored" \
  --input authorDate="2001-02-03T04:05:06+00:00" \
  --input committerDate="2011-12-13T14:15:16+00:00" \
  --json
```

`amend` takes the same two inputs and preserves the original commit's author
name and email while rewriting its dates:

```bash
swamp model method run repo amend \
  --input keepMessage=true \
  --input authorDate="2001-02-03T04:05:06+00:00" \
  --json
```

Both methods report the resulting `authorDate` and `committerDate` in their
result data, which is the only place the committer date is visible — the `log`
method reports author dates only.

### Get and Set Config

```bash
# Read a config value
swamp model method run repo config --input key=user.name --json

# Set a config value (local scope by default)
swamp model method run repo config \
  --input key=user.name \
  --input value="Bot" \
  --json
```

### Clone a Repository

```bash
# Shallow clone (like actions/checkout with fetch-depth: 2)
swamp model method run repo clone \
  --input url=https://github.com/org/repo.git \
  --input depth=2 \
  --json

# Full clone with auth token
swamp model method run repo clone \
  --input url=https://git.example.com/org/repo \
  --input depth=0 \
  --input token=$BOT_TOKEN \
  --json
```

## CI Replacement Examples

### Before: Inline Bash Change Detection

```yaml
# 15 lines of bash in ci-extensions.yml
- run: |
    CHANGED=$(git diff --name-only "${BASE_SHA}...${HEAD_SHA}")
    check_path() {
      local name=$1; shift; local found=false
      for pattern in "$@"; do
        if echo "$CHANGED" | grep -q "^${pattern}"; then found=true; break; fi
      done
      echo "${name}=${found}" >> $GITHUB_OUTPUT
    }
    check_path agent-runner "agent-runner/"
    check_path ssh "ssh/"
```

### After: Structured Diff

```yaml
- run: |
    RESULT=$(swamp model method run repo diff \
      --input base=$BASE_SHA \
      --input head=$HEAD_SHA \
      --input nameOnly=true \
      --input threeWay=true \
      --json)

    # Files are a JSON array — no grep/sed needed
    FILES=$(echo "$RESULT" | jq -r '.dataArtifacts[0].attributes.files[]')
    echo "agent-runner=$(echo "$FILES" | grep -q '^agent-runner/' && echo true || echo false)" >> $GITHUB_OUTPUT
```

### Before: Bot Commit-and-Push (regenerate-models.yml)

```yaml
# 10 lines of bash
- run: |
    git config user.name "forgejo-actions[bot]"
    git config user.email "forgejo-actions[bot]@git.swamp-club.com"
    git checkout -b "$BRANCH"
    git add -A
    git commit -m "${TITLE} ($DATE)"
    git push --force origin "$BRANCH"
```

### After: Three Method Calls

```yaml
- run: |
    swamp model method run repo branch --input name=$BRANCH --input create=true --json
    swamp model method run repo commit --input "message=${TITLE} ($DATE)" --input addAll=true --json
    swamp model method run repo push --input branch=$BRANCH --input force=true --json
```

## Structured Output

Every method writes a typed resource. The data is queryable via `swamp data`:

```bash
# Get the latest diff result
swamp data get repo diff --json

# Query status history for dirty states
swamp data query repo 'tags.clean == "false"'
```

### Diff Result

```json
{
  "files": ["src/main.ts", "src/lib.ts"],
  "raw": "src/main.ts\nsrc/lib.ts\n",
  "count": 2,
  "base": "HEAD~1",
  "head": "HEAD"
}
```

### Status Result

```json
{
  "entries": [
    { "status": "M", "path": "src/main.ts" },
    { "status": "??", "path": "new-file.ts" }
  ],
  "clean": false,
  "count": 2,
  "raw": " M src/main.ts\n?? new-file.ts\n"
}
```

### Log Result

```json
{
  "commits": [
    {
      "sha": "abc1234def5678...",
      "author": "Alice",
      "date": "2026-08-05T10:00:00+00:00",
      "message": "fix: resolve auth race condition"
    }
  ],
  "count": 1
}
```

### Commit Result

```json
{
  "sha": "abc1234def5678...",
  "message": "chore: regenerate models"
}
```

## Global Arguments

| Argument      | Default  | Description |
| ------------- | -------- | ----------- |
| `repoPath`    | `.`      | Path to the git repository to operate on |
| `remote`      | `origin` | Default remote name for push operations |
| `authorName`  | —        | Commit author name (applied via `git -c user.name=` flags) |
| `authorEmail` | —        | Commit author email (applied via `git -c user.email=` flags) |

## Methods

| Method   | Description |
| -------- | ----------- |
| `clone`  | Clone a repository with configurable depth, branch, and auth token |
| `diff`   | Show changes between refs — name-only file lists, stat summaries, or full diffs |
| `worktree_diff` | Read-only working-tree diff — staged, unstaged, and untracked changes vs a base ref |
| `status` | Working tree status with structured entries and clean/dirty flag |
| `remote_ref` | Look up the SHA of a named ref on a remote via git ls-remote (read-only) |
| `upstream_state` | Tracking-branch state: configured upstream, tracking-ref availability, ahead/behind counts, pushed/synced flags |
| `log`    | Commit history with structured entries (SHA, author, date, message) |
| `commit` | Stage files and create a commit, optionally at a chosen author/committer date |
| `amend`  | Amend the most recent commit — rewrite message, staged content, and/or dates, recording old and new SHA |
| `push`   | Push commits to a remote (with optional force or force-with-lease) |
| `pull`   | Pull changes from a remote |
| `fetch`  | Fetch refs from a remote with optional tag and prune support |
| `cherry_pick` | Cherry-pick commits or abort an in-progress cherry-pick |
| `branch` | Create, switch, or list branches |
| `config` | Get or set git configuration values |

## Resources

| Resource       | Description |
| -------------- | ----------- |
| `cloneResult`  | Clone path, URL, depth, branch |
| `diffResult`   | Changed files array, raw diff, count, base/head refs |
| `worktreeDiffResult` | Changed tracked files, untracked files, combined raw diff, count, base ref |
| `statusResult` | Status entries with path and status code, clean flag, count |
| `remoteRefResult` | Remote name, resolved ref, and SHA from git ls-remote |
| `upstreamStateResult` | Branch, upstream, configuredUpstream, trackingRefAvailable, ahead/behind counts (nullable), pushed/synced flags (nullable) |
| `logResult`    | Structured commit entries (SHA, author, date, message) |
| `commitResult` | Commit SHA, message, author date, committer date |
| `amendResult`  | Old SHA, new SHA, message, author date, committer date of the amended commit |
| `pushResult`   | Remote, branch, forced flag, forceWithLease flag |
| `pullResult`   | Remote, branch, already-up-to-date flag |
| `fetchResult`  | Remote, tags, pruned flag |
| `cherryPickResult` | Applied commits, conflict status, conflicting files |
| `branchResult` | Current branch, branch list, creation status |
| `configResult` | Config key and value |

## Pre-flight Checks

| Check              | Applies To | Description |
| ------------------ | ---------- | ----------- |
| `git-available`    | all 17 methods | Verifies `git` binary is on PATH |
| `repo-initialized` | all except `clone` and `remote_ref` | Verifies `repoPath` is inside a git work tree |

## License

AGPL-3.0 with Swamp Exception — see LICENSE.txt for details.
