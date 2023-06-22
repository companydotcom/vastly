import url from "url";
import { createServer } from "http";
import executeVerify from "./execute-verify.js";
import { Client } from "../client.js";

export async function getTokens(client: Client) {
  const { output } = client;
  const server = createServer();
  server.listen(5001);

  const location = new URL("https://wave.vastly.is/notifications/cli-");

  output.log("\n");
  output.spinner.start("Waiting for verification\n");

  try {
    const token: Promise<{ token: string }> = new Promise(async (resolve, reject) => {
      server.once("request", async (req, res) => {
        // Close the HTTP connection to prevent
        // `server.close()` from hanging
        res.setHeader("connection", "close");

        const parsedUrl = url.parse(req.url || "", true);
        const { email, token } = parsedUrl.query;

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
    location.pathname += "fail";
    output.spinner.fail("Verification failed");
    console.log("err:", err);
  } finally {
    server.close();
  }
}
