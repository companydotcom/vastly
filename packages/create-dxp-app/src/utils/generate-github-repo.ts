import { spawnSync } from "child_process";
import ora from "ora";
import chalk from "chalk";
import { Octokit } from "@octokit/rest";
import { copyTemplate } from "./copy-template.js";
import { GenerateAnswers } from "../types";

export const generateGithubRepo = async (answers: GenerateAnswers) => {
  const octokit = new Octokit({
    auth: answers.token,
  });
  try {
    const spinner = ora({
      text: "Creating repository...",
      color: "yellow",
    }).start();
    if (answers.generate) {
      const repoName = answers.repoName;
      const repoDescription = answers.repoDescription;
      const userEmail = answers.email;
      const userName = answers.username;
      const userAccessToken = answers.token;
      const packageManager = answers.packageManager;

      // create github repository
      const { data: repoData } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: repoDescription,
      });
      spinner.succeed(chalk.green(`Repository ${chalk.bold(repoData.name)} created successfully`));

      // clone github repository
      const cloneSpinner = ora({
        text: "Cloning repository...",
        color: "yellow",
      }).start();
      spawnSync("git", ["clone", repoData.clone_url]);
      cloneSpinner.succeed(
        chalk.green(`Repository ${chalk.bold(repoData.name)} cloned successfully`),
      );

      // change directory into cloned github repository
      const directorySpinner = ora({
        text: "Changing directory...",
        color: "yellow",
      }).start();
      process.chdir(repoData.name);
      directorySpinner.succeed(chalk.green(`Changed directory to ${chalk.bold(repoData.name)}`));

      // generate repo from template
      await copyTemplate(packageManager);

      // git add, commit and push to github
      const gitSpinner = ora({
        text: "Pushing changes to GitHub...",
        color: "yellow",
      }).start();
      spawnSync("git", ["branch", "--unset-upstream"]);
      spawnSync("git", ["add", "."]);
      spawnSync("git", ["commit", ".", "-m", "Initial commit"]);
      spawnSync("git", ["push", "--set-upstream", "origin", "master"], {
        env: {
          GIT_COMMITTER_EMAIL: userEmail,
          GIT_COMMITTER_NAME: userName,
          GIT_AUTHOR_EMAIL: userEmail,
          GIT_AUTHOR_NAME: userName,
          GITHUB_TOKEN: userAccessToken,
        },
        stdio: "ignore",
      });
      gitSpinner.succeed(
        chalk.green(
          `Repo created successfully at ${chalk.bold(
            `https://github.com/${userName}/${repoName}`,
          )}`,
        ),
      );
    }
  } catch (error) {
    console.error(error);
  }
};
