import inquirer from "inquirer";
import { Client } from "../util/client.js";
import doEmailLogin from "../util/login/email.js";
import { writeToConfigFile } from "../util/config/files.js";

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

    const result = await doEmailLogin(client, email);
    console.log("👾 ~ login ~ result:", result);

    if (result) {
      // write result (tokens) to config file here
      writeToConfigFile({ token: result.token });
    }
  } catch (err: unknown) {
    output.error(err as string);
  }
}
