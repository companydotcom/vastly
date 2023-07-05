import { errorToString } from "@vastly/utils";
import chalk from "chalk";
import { createServer } from "http";
import { AddressInfo } from "net";
import { Client } from "../client.js";
import executeLogin from "./execute-login.js";
import { getTokens } from "./get-tokens.js";

export interface LoginResultSuccess {
  token?: string;
  success: boolean;
}

export type LoginResult = number | LoginResultSuccess;

export default async function doEmailLogin(client: Client, email: string): Promise<LoginResult> {
  const { output } = client;

  output.spinner.color = "yellow";
  output.spinner.start("Sending you an email...");

  const server = createServer();

  server.listen();

  const { port } = server.address() as AddressInfo;

  try {
    await executeLogin(client, email, port);
  } catch (err: unknown) {
    output.error(errorToString(err));
    return 0;
  }

  output.log(
    `Sent an email to ${chalk.cyan(email)}!  Please follow the directions inside.\n`,
    chalk.white,
  );

  try {
    const tokens = await getTokens(client, server);
    output.spinner.stop();
    return { token: tokens?.token, success: true };
  } catch (err) {
    output.spinner.fail("Trouble listening to verification");
    output.error(errorToString(err));
    return 1;
  }
}
