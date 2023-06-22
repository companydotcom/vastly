import { errorToString } from "@vastly/utils";
import chalk from "chalk";
import { Client } from "../client.js";
import eraseLines from "../output/erase-lines.js";
import executeLogin from "./execute-login.js";
import { getTokens } from "./get-tokens.js";

export interface LoginResultSuccess {
  token?: string;
  success: boolean;
}

export type LoginResult = number | LoginResultSuccess;

export default async function doEmailLogin(client: Client, email: string): Promise<LoginResult> {
  const { output } = client;

  output.print("\n");
  output.spinner.color = "yellow";
  output.spinner.start("Sending you an email...\n");

  try {
    await executeLogin(client, email);
  } catch (err: unknown) {
    output.error(errorToString(err));
    return 1;
  }

  output.print(eraseLines(2));
  output.print(`\nSent an email to ${chalk.cyan(email)}!  Please follow the directions inside.\n`);

  try {
    const tokens = await getTokens(client);
    return { token: tokens?.token, success: true };
  } catch (err) {
    output.spinner.fail("Trouble listening to verification");
    output.error(errorToString(err));
    return 1;
  }
}
