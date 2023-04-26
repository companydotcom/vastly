import { errorToString } from "@companydotcom/utils";
import http from "http";
import querystring from "querystring";
import crypto from "crypto";
import { Client } from "../client.js";
import executeLogin from "./execute-login.js";
// const opn = require('opn');

const customDomain = "vastly.auth.us-east-1.amazoncognito.com";
const clientId = "3h1cjrefbprnkslt466thr1lfd";
const tokenEndpoint = `https://${customDomain}/oauth2/token`;
const authEndpoint = `https://${customDomain}/login`;

// https://company.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=3h1cjrefbprnkslt466thr1lfd&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=email%20openid%20phone&state=your_state

export default async function doEmailLogin(client: Client, email: string) {
  const { output } = client;
  try {
    // output.spinner.color = "yellow";
    // output.spinner.start("Sending you an email...\n");

    try {
      await executeLogin(client, email);
      // output.spinner.text = JSON.stringify(data);
      // output.spinner.succeed("Sent you an email!");
    } catch (err) {
      output.error(errorToString(err));
    }

    // "listenind mode" is actually just polling a /verify endpoint

    // function generatePkcePair() {
    //   const codeVerifier = crypto
    //     .randomBytes(32)
    //     .toString("base64")
    //     .replace(/\+/g, "-")
    //     .replace(/\//g, "_")
    //     .replace(/=+$/, "");

    //   const codeChallenge = crypto
    //     .createHash("sha256")
    //     .update(codeVerifier)
    //     .digest("base64")
    //     .replace(/\+/g, "-")
    //     .replace(/\//g, "_")
    //     .replace(/=+$/, "");

    //   return { codeVerifier, codeChallenge };
    // }

    // const { codeVerifier, codeChallenge } = generatePkcePair();

    // const server = http.createServer(async (req, res) => {
    //   res.setHeader("Access-Control-Allow-Headers", req.headers.origin ?? "");
    //   res.setHeader("Access-Control-Allow-Origin", "*");
    //   res.setHeader("Access-Control-Allow-Methods", "POST");

    //   try {
    //     const url = new URL(req.url || "", `http://${req.headers.host}`);
    //     const code = url.searchParams.get("token");
    //     console.log("👾 ~ server ~ url:", url);

    //     if (!code) {
    //       res.writeHead(400, { "Content-Type": "text/html" });
    //       res.end("Error: Authorization code not found in the callback URL");
    //       return;
    //     }

    //     const tokenRequestData = querystring.stringify({
    //       grant_type: "authorization_code",
    //       client_id: clientId,
    //       code: code,
    //       redirect_uri: "http://localhost:3000",
    //       code_verifier: codeVerifier,
    //     });

    //     const tokenRequestOptions = {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //         "Content-Length": Buffer.byteLength(tokenRequestData),
    //       },
    //     };

    //     const tokenRequest = http.request(tokenEndpoint, tokenRequestOptions, (tokenResponse) => {
    //       console.log("does this even trun");
    //       tokenResponse.setEncoding("utf8");

    //       let tokenData = "";
    //       tokenResponse.on("data", (chunk) => {
    //         tokenData += chunk;
    //       });

    //       tokenResponse.on("end", () => {
    //         const tokens = JSON.parse(tokenData);

    //         // Store the tokens in your CLI application
    //         console.log("TOKENS", tokens);

    //         // Close the server and browser window
    //         res.writeHead(200, { "Content-Type": "text/html" });
    //         res.end("<script>window.close();</script>");
    //         server.close(() => {
    //           console.log("server closing");
    //         });
    //       });

    //       tokenResponse.on("error", (e) => {
    //         console.log("ERROR", e);
    //       });
    //     });

    //     const test = await tokenRequest.write(tokenRequestData);
    //     console.log("👾 ~ server ~ test:", test);

    //     tokenRequest.end();
    //   } catch (e) {
    //     console.error("Error in token exchange", e);
    //     res.writeHead(500, { "Content-Type": "text/html" });
    //     res.end("Server error!");
    //   }
    // });

    // server.listen(5001, () => {
    //   console.log("Server is listening on http://localhost:5001");

    //   // const authUrl = `${authEndpoint}?response_type=code&client_id=${clientId}&redirect_uri=http://localhost:3000&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=email+openid+phone`;

    //   // Open the OAuth URL in the user's default browser
    //   // opn(authUrl);
    // });

    // spinner.succeed(chalk.green("waiting for verification"));
  } catch (err: unknown) {
    console.log("👾 ~ doEmailLogin ~ err:", err);
    output.error(err as string);
  }
}
