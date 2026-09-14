@AGENTS.md

## Workflows (Claude Code)

Do NOT interpret workflow requests as a request to build a Claude Code agent
task list, spin up worktrees, or schedule a cron/remote agent. Only reach for
the harness orchestration tools (TaskCreate/TaskList, EnterWorktree, CronCreate,
RemoteTrigger) when the user explicitly names that mechanism (e.g. "task list",
"subagent", "worktree", "cron", "remote agent") or explicitly asks you to do the
work yourself step by step rather than author a swamp workflow.
