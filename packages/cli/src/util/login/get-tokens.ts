import url from "url";
import { createServer } from "http";
import { Client } from "../client.js";
import executeVerify from "./execute-verify.js";

export async function getTokens(client: Client) {
  const { output } = client;
  const server = createServer();
  server.listen(5001);

  output.spinner.start("Waiting for verification\n");

  try {
    const token: Promise<{ token: string }> = new Promise(async (resolve, reject) => {
      // const requestHandler = handleRequest(client, resolve, server);

      server.once("request", async (req, res) => {
        // Close the HTTP connection to prevent
        // `server.close()` from hanging
        res.setHeader("connection", "close");

        const parsedUrl = url.parse(req.url || "", true);
        const { email, token } = parsedUrl.query;
        const location = new URL("https://workshop-black-ten.vercel.app/notifications/cli-");

        if (!email || !token) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Email and token are required in the query string." }));
        }

        if (email && token) {
          const authResponse = await executeVerify(client, email, token?.toString());

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
      });
      server.once("error", reject);
    });

    return await token;
  } catch (err) {
    output.spinner.fail("Verification failed");
    console.log("err:", err);
  } finally {
    server.close();
  }
}
