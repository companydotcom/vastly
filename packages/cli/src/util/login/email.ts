import { errorToString } from "@companydotcom/utils";
import chalk from "chalk";
import { Client } from "../client.js";
import eraseLines from "../output/erase-lines.js";
import executeLogin from "./execute-login.js";
import { startHttpListener } from "./http-listener.js";

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
    }

    output.print(eraseLines(1));
    output.print(
      `\nSent an email to ${chalk.cyan(email)}!  Please follow the directions inside.\n`,
    );

    try {
      const tokens = await startHttpListener(client);
      return tokens;
    } catch (err) {
      output.spinner.fail("Trouble listening to verification");
      output.error(errorToString(err));
    }
  } catch (err: unknown) {
    console.log("👾 ~ doEmailLogin ~ err:", err);
    output.error(err as string);
  }
}
