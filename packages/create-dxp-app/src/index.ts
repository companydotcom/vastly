import { Command } from "commander"
import inquirer from "inquirer"
import { Octokit } from "@octokit/rest"
import { spawnSync } from "child_process"
import ora from "ora"
import chalk from "chalk"
import { generateQuestions } from "./questions/index.js"
import { runGenerator } from "./utils/runGenerator.js"

const program = new Command()

program
  .description("Custom Offering Core CLI")
  .option("-g, --generate", "Generate new custom offering")
  .parse(process.argv)

const options = program.opts()

if (options.generate) {
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

            await runGenerator(repoName)

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

interface generateAnswers {
  repoName: string
  repoDescription: string
  email: string
  username: string
  token: string
  generate: boolean
}
