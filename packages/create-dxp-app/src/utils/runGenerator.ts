import * as path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"
import ora from "ora"
import chalk from "chalk"
import fse from "fs-extra"

// import fse from "fs-extra"
// import { runCommand } from "./runCommand.js"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const runGenerator = async (packageManager: string): Promise<void> => {
  try {
    const generateSpinner = ora({
      text: "Generating files with dxp-app generator...",
      color: "yellow",
    }).start()

    //copy template
    let sharedTemplate = path.resolve(__dirname, "../templates", `_shared_ts`)
    fse.copySync(sharedTemplate, "./")

    generateSpinner.succeed(chalk.green("dxp-app generator completed successfully"))
  } catch (error) {
    console.error(error)
  }
}
