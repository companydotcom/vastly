import { Command } from "commander"
import inquirer from "inquirer"
import { Octokit } from "@octokit/rest"
import { spawn, spawnSync, ChildProcess } from "child_process"
import ora from "ora"
import chalk from "chalk"
import { loginQuestions, generateQuestions } from "./questions/index.js"

const program = new Command()

program
  .description("Custom Offering Core CLI")
  .option("-l, --login", "Login to Company.com CLI")
  .option("-g, --generate", "Generate new custom offering")
  .parse(process.argv)

const options = program.opts()

if (options.login) {
  inquirer.prompt(loginQuestions).then((answers: loginAnswers) => {
    console.log(answers)
  })
} else if (options.generate) {
  inquirer.prompt(generateQuestions).then((answers: generateAnswers) => {
    if (answers.generate) {
      const octokit = new Octokit({
        auth: answers.token,
      })

      const generateRepo = async () => {
        try {
          const spinner = ora({
            text: "Creating repository...",
            color: "yellow",
          }).start()
          if (answers.generate) {
            const repoName = answers.repoName
            const repoDescription = answers.repoDescription
            const userEmail = answers.email
            const userName = answers.username
            const userAccessToken = answers.token

            const { data: repoData } = await octokit.repos.createForAuthenticatedUser({
              name: repoName,
              description: repoDescription,
            })
            spinner.succeed(
              chalk.green(`Repository ${chalk.bold(repoData.name)} created successfully`),
            )

            const cloneSpinner = ora({
              text: "Cloning repository...",
              color: "yellow",
            }).start()
            spawnSync("git", ["clone", repoData.clone_url])
            cloneSpinner.succeed(
              chalk.green(`Repository ${chalk.bold(repoData.name)} cloned successfully`),
            )

            const directorySpinner = ora({
              text: "Changing directory...",
              color: "yellow",
            }).start()
            process.chdir(repoData.name)
            directorySpinner.succeed(
              chalk.green(`Changed directory to ${chalk.bold(repoData.name)}`),
            )

            const runCommand = (
              command: string,
              args: string[],
              answer: string | null = null,
            ): Promise<void> => {
              const child: ChildProcess = spawn(command, args, { stdio: "pipe" })
              return new Promise<void>((resolve, reject) => {
                child.stdout!.on("data", (data) => {
                  // Output the child process's stdout to the parent process
                  // process.stdout.write(chalk.green(data.toString()))

                  // Automatically answer the child process's question
                  if (answer !== null) {
                    child.stdin!.write(answer + "\n")
                  }
                })
                child.stderr!.on("data", (data) => {
                  // Output the child process's stderr to the parent process
                  // process.stderr.write(chalk.red(data.toString()))
                })
                child.on("exit", (code: number) => {
                  if (code !== 0) {
                    reject(new Error(`Command failed with exit code ${code}`))
                  } else {
                    resolve()
                  }
                })
              })
            }

            const runGenerator = async (): Promise<void> => {
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

            await runGenerator()

            const gitSpinner = ora({
              text: "Pushing changes to GitHub...",
              color: "yellow",
            }).start()
            spawnSync("git", ["branch", "--unset-upstream"])
            spawnSync("git", ["add", "."])
            spawnSync("git", ["commit", ".", "-m", "Initial commit"])
            spawnSync("git", ["push", "--set-upstream", "origin", "master"], {
              env: {
                GIT_COMMITTER_EMAIL: userEmail,
                GIT_COMMITTER_NAME: userName,
                GIT_AUTHOR_EMAIL: userEmail,
                GIT_AUTHOR_NAME: userName,
                GITHUB_TOKEN: userAccessToken,
              },
              stdio: "inherit",
            })
            gitSpinner.succeed(
              chalk.green(
                `Repo created successfully at ${chalk.bold(
                  `https://github.com/${userName}/${repoName}`,
                )}`,
              ),
            )
          }
        } catch (error) {
          console.error(error)
        }
      }
      generateRepo()
    }
  })
}

interface loginAnswers {
  username: string
  password: string
}

interface generateAnswers {
  repoName: string
  repoDescription: string
  email: string
  username: string
  token: string
  generate: boolean
}
