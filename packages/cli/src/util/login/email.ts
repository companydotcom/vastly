import { errorToString } from "@companydotcom/utils";
import chalk from "chalk";
import { Client } from "../client.js";
import eraseLines from "../output/erase-lines.js";
import executeLogin from "./execute-login.js";
import { getTokens } from "./get-tokens.js";

export interface LoginResult {
  token?: string;
  success: boolean;
}

export default async function doEmailLogin(client: Client, email: string) {
  const { output } = client;
  try {
    output.spinner.color = "yellow";
    output.spinner.start("Sending you an email...\n");

    try {
      await executeLogin(client, email);
    } catch (err) {
      output.spinner.fail("Trouble sending email");
      output.error(errorToString(err));
      return { success: false };
    }

    output.print(eraseLines(1));
    output.print(
      `\nSent an email to ${chalk.cyan(email)}!  Please follow the directions inside.\n`,
    );

    try {
      const tokens = await getTokens(client);
      return { token: tokens?.token, success: true };
    } catch (err) {
      output.spinner.fail("Trouble listening to verification");
      output.error(errorToString(err));
    }
  } catch (err: unknown) {
    console.log("Err:", err);
    output.error(err as string);
  }
}
