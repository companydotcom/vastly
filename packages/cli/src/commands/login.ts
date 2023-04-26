import inquirer from "inquirer";
import { Client } from "../util/client.js";
import doEmailLogin from "../util/login/email.js";

export default async function login(client: Client) {
  const { output } = client;

  try {
    const email: string = await inquirer
      .prompt([
        {
          type: "text",
          name: "email",
          message: "What is your email address?",
        },
      ])
      .then((a) => a.email)
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
          throw new Error("Interactive mode not supported");
        } else {
          // Something else went wrong
          output.error("something wrong");
        }
      });

    await doEmailLogin(client, email);
  } catch (err: unknown) {
    output.error(err as string);
  }
}
