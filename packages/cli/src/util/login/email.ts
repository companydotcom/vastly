import { errorToString } from "@companydotcom/utils";
import http from "http";
import { Client } from "../client.js";
import executeLogin from "./execute-login.js";

export default async function doEmailLogin(client: Client, email: string) {
  const { output } = client;
  try {
    output.spinner.color = "yellow";
    output.spinner.start("Sending you an email...\n");

    try {
      const data = await executeLogin(client, email);
      output.spinner.text = JSON.stringify(data);
      output.spinner.succeed("Sent you an email!");
    } catch (err) {
      output.error(errorToString(err));
    }

    // replace with express or webhook library
    // const server = http.createServer((req, res) => {
    //   // handle incoming requests
    //   output.log(`We sent an email to ${email}. Please follow the steps in that email.\n`);

    //   // Parse the request body
    //   let body = "";
    //   req.on("data", (chunk) => {
    //     body += chunk.toString();
    //   });

    //   // Handle the end of the request
    //   req.on("end", () => {
    //     console.log(`Request body: ${body}`);
    //     output.spinner.succeed("You are now logged in");
    //     res.end("OK");
    //   });
    // });

    // server.listen("/verify", () => {
    //   output.spinner.start("Waiting for your email confirmation\n");
    // });
    // spinner.succeed(chalk.green("waiting for verification"));
  } catch (err: unknown) {
    output.error(err as string);
  }
}
