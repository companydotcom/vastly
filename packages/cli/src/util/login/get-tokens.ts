import { Server, IncomingMessage, ServerResponse } from "http";
import executeVerify from "./execute-verify.js";
import { Client } from "../client.js";
import { errorToString } from "@vastly/utils";

export async function getTokens(
  client: Client,
  server: Server<typeof IncomingMessage, typeof ServerResponse>,
) {
  const { output } = client;

  const location = new URL("https://wave.vastly.is/notifications/cli-");

  output.spinner.start("Waiting for verification\n");

  try {
    const token: Promise<{ token: string }> = new Promise(async (resolve, reject) => {
      server.once("request", async (req, res) => {
        try {
          // Close the HTTP connection to prevent
          // `server.close()` from hanging
          res.setHeader("connection", "close");

          const params = new URL(req.url || "", `http://${req.headers.host}`).searchParams;

          const email = params.get("email");
          const token = params.get("token");

          if (!email || !token) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Email and token are required in the query string." }));
          }

          if (email && token) {
            const authResponse = await executeVerify(
              client,
              decodeURIComponent(email),
              token?.toString(),
            );

            if (authResponse) {
              location.pathname += "success";
              resolve({
                token: authResponse?.token,
              });
            }
          }

          output.spinner.succeed("Verification success");

          res.statusCode = 302;
          res.setHeader("location", location.href);
          res.end();
        } catch (error) {
          reject(error);
        }
      });

      server.once("error", reject);
    });

    return await token;
  } catch (err) {
    location.pathname += "fail";
    output.spinner.fail("Verification failed");
    output.debug(errorToString(err));
    process.exit();
  } finally {
    server.close();
  }
}
