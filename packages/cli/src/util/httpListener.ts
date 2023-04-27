import * as http from "http";
import * as url from "url";
import { IncomingMessage, ServerResponse } from "http";
import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_FBBnPmKc7",
    userPoolWebClientId: "4vr9r59ednfan4cj167sf8mrqf",
    mandatorySignIn: true,
  },
});

function handleRequest(
  resolve: (value: { access_token: string; id_token: string; refresh_token: string }) => void,
  server: http.Server,
) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = url.parse(req.url || "", true);
    const { email, token } = parsedUrl.query;

    if (!email || !token) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Email and token are required in the query string." }));
      return;
    }

    try {
      const cognitoUser = await Auth.signIn(email.toString());
      const authResponse = await Auth.sendCustomChallengeAnswer(cognitoUser, token.toString());

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("You're logged in.  You can close the browser now.");

      resolve({
        access_token: authResponse.signInUserSession?.accessToken || "",
        id_token: authResponse.signInUserSession?.idToken || "",
        refresh_token: authResponse.signInUserSession?.refreshToken || "",
      });

      server.close(() => {
        console.log("HTTP listener stopped");
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

export function startHttpListener(): Promise<{ access_token: string; id_token: string }> {
  return new Promise((resolve) => {
    const server = http.createServer();
    const requestHandler = handleRequest(resolve, server);
    server.on("request", requestHandler);

    server.listen(5001, () => {
      console.log("HTTP listener started on port 5001");
    });

    process.on("SIGINT", () => {
      server.close(() => {
        console.log("HTTP listener stopped");
        process.exit(0);
      });
    });
  });
}
