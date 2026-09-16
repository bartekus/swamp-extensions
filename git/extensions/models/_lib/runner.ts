import type { ExecResult } from "./types.ts";

/**
 * Options accepted by every git invocation.
 *
 * `env` entries are overlaid on the parent environment — `clearEnv` is
 * deliberately not set, so PATH, HOME, SSH_AUTH_SOCK, and any GIT_* variables
 * the operator already exported stay visible to the subprocess. Clearing it
 * would break authenticated clone and push.
 */
export interface ExecOptions {
  cwd?: string;
  signal?: AbortSignal;
  env?: Record<string, string>;
}

export type CommandExecutor = (
  argv: string[],
  opts?: ExecOptions,
) => ExecResult | Promise<ExecResult>;

async function denoExecutor(
  argv: string[],
  opts?: ExecOptions,
): Promise<ExecResult> {
  const cmd = new Deno.Command(argv[0], {
    args: argv.slice(1),
    cwd: opts?.cwd,
    signal: opts?.signal,
    // Omitted entirely when no overrides are supplied, so commands without
    // date inputs are constructed exactly as they were before env support.
    ...(opts?.env ? { env: opts.env } : {}),
    stdout: "piped",
    stderr: "piped",
  });
  const output = await cmd.output();
  const decoder = new TextDecoder();
  return {
    stdout: decoder.decode(output.stdout),
    stderr: decoder.decode(output.stderr),
    exitCode: output.code,
  };
}

let executor: CommandExecutor = denoExecutor;

export function setCommandExecutor(exec: CommandExecutor): void {
  executor = exec;
}

export function resetCommandExecutor(): void {
  executor = denoExecutor;
}

export async function execGit(
  args: string[],
  opts?: ExecOptions,
): Promise<ExecResult> {
  return await executor(["git", ...args], opts);
}
