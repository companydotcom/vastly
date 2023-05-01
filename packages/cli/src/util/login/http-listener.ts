import * as http from "http";
import * as url from "url";
import { IncomingMessage, ServerResponse } from "http";
import { Client } from "../client.js";
import executeVerify from "./execute-verify.js";

function handleRequest(
  resolve: (value: { token: string }) => void,
  server: http.Server,
  client: Client,
) {
  const { output } = client;

  return async (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = url.parse(req.url || "", true);
    const { email, token } = parsedUrl.query;

    if (!email || !token) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Email and token are required in the query string." }));
      return;
    }

    try {
      const authResponse = await executeVerify(client, email, token.toString());

      if (authResponse) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("You're logged in.  You can close the browser now.");

        resolve({
          token: authResponse?.token,
        });
      }

      server.close(() => {
        output.spinner.succeed("Verification success");
      });
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "An error occurred while processing the request." }));
      server.close(() => {
        console.log("HTTP listener stopped");
      });
    }
  };
}

export function startHttpListener(client: Client): Promise<{ token: string }> {
  const { output } = client;

  return new Promise((resolve) => {
    const server = http.createServer();
    const requestHandler = handleRequest(resolve, server, client);
    server.on("request", requestHandler);

    server.listen(5001, () => {
      output.spinner.start("Waiting for verification\n");
    });

    process.on("SIGINT", () => {
      server.close(() => {
        process.exit(0);
      });
    });
  });
}
