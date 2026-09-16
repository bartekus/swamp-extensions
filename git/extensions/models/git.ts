import { z } from "npm:zod@4.3.6";
import {
  AmendArgsSchema,
  AmendResultSchema,
  BranchArgsSchema,
  BranchResultSchema,
  CherryPickArgsSchema,
  CherryPickResultSchema,
  CloneArgsSchema,
  CloneResultSchema,
  CommitArgsSchema,
  CommitResultSchema,
  ConfigArgsSchema,
  ConfigResultSchema,
  DiffArgsSchema,
  DiffResultSchema,
  FetchArgsSchema,
  FetchResultSchema,
  GlobalArgsSchema,
  IsAncestorArgsSchema,
  IsAncestorResultSchema,
  LogArgsSchema,
  LogResultSchema,
  PullArgsSchema,
  PullResultSchema,
  PushArgsSchema,
  PushResultSchema,
  RemoteRefArgsSchema,
  RemoteRefResultSchema,
  RemoveWorktreeArgsSchema,
  RemoveWorktreeResultSchema,
  StatusArgsSchema,
  StatusResultSchema,
  UpstreamStateArgsSchema,
  UpstreamStateResultSchema,
  WorktreeDiffArgsSchema,
  WorktreeDiffResultSchema,
} from "./_lib/schemas.ts";
import {
  runAmend,
  runBranch,
  runCherryPick,
  runClone,
  runCommit,
  runConfig,
  runDiff,
  runFetch,
  runIsAncestor,
  runLog,
  runPull,
  runPush,
  runRemoteRef,
  runRemoveWorktree,
  runStatus,
  runUpstreamState,
  runWorktreeDiff,
} from "./_lib/operations.ts";
import { checkGitAvailable, checkRepoInitialized } from "./_lib/checks.ts";
import type { GitContext } from "./_lib/types.ts";

/**
 * Git repository operations — structured CLI wrapper for CI automation.
 *
 * @module
 */

/** Git model — clone, diff, worktree_diff, status, log, commit, amend, push, pull, fetch, cherry_pick, branch, config, remote_ref, upstream_state, is_ancestor, remove_worktree. */
export const model = {
  type: "@swamp/git",
  version: "2026.09.15.1",

  globalArguments: GlobalArgsSchema,

  upgrades: [
    {
      toVersion: "2026.08.07.1",
      description:
        "Add pull, fetch, and cherry_pick methods. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.08.13.1",
      description:
        "Add upstream_state method for tracking-branch state. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.08.17.1",
      description:
        "Fix upstream_state for sparse-fetch repos: add trackingRefAvailable and configuredUpstream fields. hasUpstream now reflects configured upstream, not just local tracking ref availability.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.08.18.1",
      description:
        "Thread AbortSignal from model context to Git subprocesses. Cancelling a Swamp operation now terminates in-flight git commands. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.08.18.2",
      description:
        "Sanitize '/' in branch names used as data names for branch and push methods. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.08.20.1",
      description:
        "Add amend method for rewriting the most recent commit. Add forceWithLease to push for safer force-pushes. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.08.25.1",
      description:
        "Add remote_ref method for read-only remote ref SHA lookup via git ls-remote. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.08.28.1",
      description:
        "Add is_ancestor method for read-only ancestry checks, orphan branch creation via branch method, and remove_worktree method for safe worktree cleanup. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.08.30.1",
      description:
        "Add worktree_diff method for read-only working-tree diff including staged, unstaged, and untracked files. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
    {
      toVersion: "2026.09.15.1",
      description:
        "Add authorDate and committerDate inputs to commit and amend. Setting authorDate alone also sets the committer date, so a reconstructed commit does not keep a wall-clock committer timestamp. commitResult and amendResult now report the resulting authorDate and committerDate. Annotated tags carry a committer timestamp too and will need the same treatment if a tag method is added. No globalArguments changes.",
      upgradeAttributes: (
        old: Record<string, unknown>,
      ): Record<string, unknown> => old,
    },
  ],

  resources: {
    cloneResult: {
      description: "Result of a git clone operation",
      schema: CloneResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    diffResult: {
      description:
        "Changed files and raw diff output from a git diff operation",
      schema: DiffResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 10,
    },
    statusResult: {
      description:
        "Working tree status: structured entries, clean/dirty flag, count",
      schema: StatusResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 10,
    },
    logResult: {
      description: "Commit history with structured entries",
      schema: LogResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 10,
    },
    commitResult: {
      description: "Result of a git commit: SHA and message",
      schema: CommitResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 10,
    },
    amendResult: {
      description:
        "Result of a git commit --amend: old SHA, new SHA, and message",
      schema: AmendResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 10,
    },
    pushResult: {
      description: "Result of a git push operation",
      schema: PushResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    branchResult: {
      description:
        "Branch operation result: current branch, list, or creation status",
      schema: BranchResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    configResult: {
      description: "Git config get/set result",
      schema: ConfigResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    pullResult: {
      description: "Result of a git pull operation",
      schema: PullResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    fetchResult: {
      description: "Result of a git fetch operation",
      schema: FetchResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    cherryPickResult: {
      description:
        "Cherry-pick result: applied commits, conflict status, and conflicting files",
      schema: CherryPickResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    remoteRefResult: {
      description:
        "Remote ref lookup result: remote name, resolved ref, and SHA",
      schema: RemoteRefResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    isAncestorResult: {
      description:
        "Ancestry check result: ancestor, descendant, and boolean isAncestor flag",
      schema: IsAncestorResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    removeWorktreeResult: {
      description:
        "Worktree removal result: path, removed/alreadyAbsent flags, and reason",
      schema: RemoveWorktreeResultSchema,
      lifetime: "ephemeral" as const,
      garbageCollection: 5,
    },
    upstreamStateResult: {
      description:
        "Tracking-branch state: branch, upstream, configuredUpstream, trackingRefAvailable, ahead/behind counts (nullable), pushed/synced flags (nullable)",
      schema: UpstreamStateResultSchema,
      lifetime: "ephemeral" as const,
      // Higher than peers (5–10) per issue #1634: "how long has this been
      // unpushed" needs history that ephemeral/10 destroys.
      garbageCollection: 50,
    },
    worktreeDiffResult: {
      description:
        "Working-tree diff: tracked changes (staged + unstaged) plus untracked non-ignored files, with reviewable patch output",
      schema: WorktreeDiffResultSchema,
      lifetime: "ephemeral" as const,
      // Higher GC to preserve reviewed evidence at manual approval gates.
      garbageCollection: 50,
    },
  },

  checks: {
    "git-available": {
      description: "Verify git binary is available on PATH",
      labels: ["prerequisite"],
      appliesTo: [
        "clone",
        "diff",
        "worktree_diff",
        "status",
        "log",
        "commit",
        "amend",
        "push",
        "pull",
        "fetch",
        "cherry_pick",
        "branch",
        "config",
        "remote_ref",
        "upstream_state",
        "is_ancestor",
        "remove_worktree",
      ],
      execute: checkGitAvailable,
    },
    "repo-initialized": {
      description: "Verify the working directory is a git repository",
      labels: ["prerequisite"],
      appliesTo: [
        "diff",
        "worktree_diff",
        "status",
        "log",
        "commit",
        "amend",
        "push",
        "pull",
        "fetch",
        "cherry_pick",
        "branch",
        "config",
        "upstream_state",
        "is_ancestor",
        "remove_worktree",
      ],
      execute: checkRepoInitialized,
    },
  },

  methods: {
    clone: {
      description: "Clone a git repository",
      arguments: CloneArgsSchema,
      execute: (args: z.input<typeof CloneArgsSchema>, ctx: GitContext) =>
        runClone(CloneArgsSchema.parse(args), ctx),
    },
    diff: {
      description:
        "Show changes between refs with optional name-only and path filtering",
      arguments: DiffArgsSchema,
      execute: (args: z.input<typeof DiffArgsSchema>, ctx: GitContext) =>
        runDiff(DiffArgsSchema.parse(args), ctx),
    },
    worktree_diff: {
      description:
        "Read-only working-tree diff: compare a base ref against the working tree including staged, unstaged, and untracked non-ignored files",
      arguments: WorktreeDiffArgsSchema,
      execute: (
        args: z.input<typeof WorktreeDiffArgsSchema>,
        ctx: GitContext,
      ) => runWorktreeDiff(WorktreeDiffArgsSchema.parse(args), ctx),
    },
    status: {
      description: "Show working tree status with structured output",
      arguments: StatusArgsSchema,
      execute: (args: z.input<typeof StatusArgsSchema>, ctx: GitContext) =>
        runStatus(StatusArgsSchema.parse(args), ctx),
    },
    log: {
      description: "Show commit history with structured entries",
      arguments: LogArgsSchema,
      execute: (args: z.input<typeof LogArgsSchema>, ctx: GitContext) =>
        runLog(LogArgsSchema.parse(args), ctx),
    },
    commit: {
      description: "Stage files and create a commit",
      arguments: CommitArgsSchema,
      execute: (args: z.input<typeof CommitArgsSchema>, ctx: GitContext) =>
        runCommit(CommitArgsSchema.parse(args), ctx),
    },
    amend: {
      description:
        "Amend the most recent commit — rewrite message and/or staged content",
      arguments: AmendArgsSchema,
      execute: (args: z.input<typeof AmendArgsSchema>, ctx: GitContext) =>
        runAmend(AmendArgsSchema.parse(args), ctx),
    },
    push: {
      description:
        "Push commits to a remote with optional force or force-with-lease",
      arguments: PushArgsSchema,
      execute: (args: z.input<typeof PushArgsSchema>, ctx: GitContext) =>
        runPush(PushArgsSchema.parse(args), ctx),
    },
    branch: {
      description: "Create, switch, or list branches",
      arguments: BranchArgsSchema,
      execute: (args: z.input<typeof BranchArgsSchema>, ctx: GitContext) =>
        runBranch(BranchArgsSchema.parse(args), ctx),
    },
    pull: {
      description: "Pull changes from a remote into the current branch",
      arguments: PullArgsSchema,
      execute: (args: z.input<typeof PullArgsSchema>, ctx: GitContext) =>
        runPull(PullArgsSchema.parse(args), ctx),
    },
    fetch: {
      description:
        "Fetch refs from a remote with optional tag and prune support",
      arguments: FetchArgsSchema,
      execute: (args: z.input<typeof FetchArgsSchema>, ctx: GitContext) =>
        runFetch(FetchArgsSchema.parse(args), ctx),
    },
    cherry_pick: {
      description:
        "Cherry-pick commits onto the current branch, or abort an in-progress cherry-pick",
      arguments: CherryPickArgsSchema,
      execute: (
        args: z.input<typeof CherryPickArgsSchema>,
        ctx: GitContext,
      ) => runCherryPick(CherryPickArgsSchema.parse(args), ctx),
    },
    config: {
      description: "Get or set git configuration values",
      arguments: ConfigArgsSchema,
      execute: (args: z.input<typeof ConfigArgsSchema>, ctx: GitContext) =>
        runConfig(ConfigArgsSchema.parse(args), ctx),
    },
    remote_ref: {
      description:
        "Look up the SHA of a named ref on a remote via git ls-remote (read-only, no worktree mutation)",
      arguments: RemoteRefArgsSchema,
      execute: (
        args: z.input<typeof RemoteRefArgsSchema>,
        ctx: GitContext,
      ) => runRemoteRef(RemoteRefArgsSchema.parse(args), ctx),
    },
    upstream_state: {
      description:
        "Report tracking-branch state: ahead/behind counts, pushed/synced flags",
      arguments: UpstreamStateArgsSchema,
      execute: (
        args: z.input<typeof UpstreamStateArgsSchema>,
        ctx: GitContext,
      ) => runUpstreamState(UpstreamStateArgsSchema.parse(args), ctx),
    },
    is_ancestor: {
      description:
        "Check if one commit is an ancestor of another via git merge-base --is-ancestor (read-only)",
      arguments: IsAncestorArgsSchema,
      execute: (
        args: z.input<typeof IsAncestorArgsSchema>,
        ctx: GitContext,
      ) => runIsAncestor(IsAncestorArgsSchema.parse(args), ctx),
    },
    remove_worktree: {
      description:
        "Safely remove a registered clean secondary worktree — refuses the primary checkout and dirty worktrees, idempotent when already absent",
      arguments: RemoveWorktreeArgsSchema,
      execute: (
        args: z.input<typeof RemoveWorktreeArgsSchema>,
        ctx: GitContext,
      ) => runRemoveWorktree(RemoveWorktreeArgsSchema.parse(args), ctx),
    },
  },
};
