import { validate } from "email-validator";
import { Client } from "../util/client.js";
import doEmailLogin, { LoginResult } from "../util/login/email.js";
import { writeToConfigFile } from "../util/config/files.js";

export default async function login(client: Client) {
  const { output } = client;

  try {
    const email: string = await client
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

    let result: LoginResult = 1;

    if (validate(email)) {
      result = await doEmailLogin(client, email);
    } else {
      result = 1;
      throw new Error("Email invalid!");
    }

    if (typeof result !== "number" && "success" in result) {
      // write result (tokens) to config file here
      writeToConfigFile({ token: result.token });
    }

    return 0;
  } catch (err: unknown) {
    output.error(err as string);
  }
}
