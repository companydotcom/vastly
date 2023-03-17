import ora from "ora"
import chalk from "chalk"
import { runCommand } from "./runCommand.js"

export const runGenerator = async (repoName: string): Promise<void> => {
  try {
    const generateSpinner = ora({
      text: "Generating files with dxp-app generator...",
      color: "yellow",
    }).start()
    await runCommand("yo", ["@companydotcom/dxp-app"], repoName)
    generateSpinner.succeed(chalk.green("dxp-app generator completed successfully"))
  } catch (error) {
    console.error(error)
  }
}
