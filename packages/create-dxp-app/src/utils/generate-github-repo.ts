import { spawnSync } from "child_process";
import ora, { Ora } from "ora";
import chalk from "chalk";
import { Octokit } from "@octokit/rest";
import { copyTemplate } from "./copy-template.js";
import { GenerateAnswers, GeneratorResponse } from "../types";

export const generateGithubRepo = async ({
  repoName,
  repoDescription,
  userEmail,
  userName,
  userAccessToken,
  packageManager,
  generate,
}: GenerateAnswers): Promise<GeneratorResponse> => {
  const octokit = new Octokit({
    auth: userAccessToken,
  });

  let spinner: Ora;
  spinner = ora({
    text: "Creating repository...",
    color: "yellow",
  }).start();

  try {
    if (!generate) {
      spinner.fail(chalk.red("Did not generate repository"));
      return { success: false };
    }

    // create github repository
    const { data: repoData } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: repoDescription,
    });

    spinner.succeed(chalk.green(`Repository ${chalk.bold(repoData.name)} created successfully`));

    // clone github repository
    spinner = ora({
      text: "Cloning repository...",
      color: "yellow",
    }).start();
    spawnSync("git", ["clone", repoData.clone_url]);
    spinner.succeed(chalk.green(`Repository ${chalk.bold(repoData.name)} cloned successfully`));

    // change directory into cloned github repository
    spinner = ora({
      text: "Changing directory...",
      color: "yellow",
    }).start();
    process.chdir(repoData.name);
    spinner.succeed(chalk.green(`Changed directory to ${chalk.bold(repoData.name)}`));

    // generate repo from template
    await copyTemplate(packageManager, { repoName, repoDescription });

    // git add, commit and push to github
    spinner = ora({
      text: "Pushing changes to GitHub...",
      color: "yellow",
    }).start();
    spawnSync("git", ["branch", "--unset-upstream"]);
    spawnSync("git", ["add", "."]);
    spawnSync("git", ["commit", "-m", "Initial commit"]);
    spawnSync("git", ["push", "--set-upstream", "origin", "main"], {
      env: {
        GIT_COMMITTER_EMAIL: userEmail,
        GIT_COMMITTER_NAME: userName,
        GIT_AUTHOR_EMAIL: userEmail,
        GIT_AUTHOR_NAME: userName,
        GITHUB_TOKEN: userAccessToken,
      },
      stdio: "ignore",
    });
    spinner.succeed(
      chalk.green(
        `Repo created successfully at ${chalk.bold(`https://github.com/${userName}/${repoName}`)}`,
      ),
    );

    return { success: true };
  } catch (error) {
    spinner.fail(
      chalk.red("An error occurred while generating the repository! Check your GitHub Credentials"),
    );
    return {
      success: false,
      message: "An error occurred while generating the repository! Check your GitHub Credentials",
    };
  }
};
