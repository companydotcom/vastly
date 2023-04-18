import { spawn, ChildProcess } from "child_process";

export const runCommand = (
  command: string,
  args: string[],
  answer: string | null = null,
): Promise<void> => {
  const child: ChildProcess = spawn(command, args, { stdio: "pipe" });
  return new Promise<void>((resolve, reject) => {
    child.stdout!.on("data", (data: Buffer | string) => {
      // Output the child process's stdout to the parent process
      // process.stdout.write(chalk.green(data.toString()))

      // Automatically answer the child process's question
      if (answer !== null) {
        child.stdin!.write(answer + "\n");
      }
    });
    child.stderr!.on("data", (data: Buffer | string) => {
      // Output the child process's stderr to the parent process
      // process.stderr.write(chalk.red(data.toString()))
    });
    child.on("exit", (code: number) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
};
