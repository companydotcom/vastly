import { errorToString } from "@companydotcom/utils";
import http from "http";
import querystring from "querystring";
import crypto from "crypto";
import { Client } from "../client.js";
import executeLogin from "./execute-login.js";
import { startHttpListener } from "../httplistener.js";

const customDomain = "vastly.auth.us-east-1.amazoncognito.com";
const clientId = "3h1cjrefbprnkslt466thr1lfd";
const tokenEndpoint = `https://${customDomain}/oauth2/token`;
const authEndpoint = `https://${customDomain}/login`;

export default async function doEmailLogin(client: Client, email: string) {
  const { output } = client;
  try {
    output.spinner.color = "yellow";
    output.spinner.start("Sending you an email...\n");

    try {
      await executeLogin(client, email);
      output.spinner.succeed("Sent you an email!");
      output.spinner.succeed("Waiting for Verification");
      const tokens = await startHttpListener();
      output.spinner.succeed("Verification Success");
      console.log("TOKENS:", tokens);
    } catch (err) {
      output.error(errorToString(err));
    }
  } catch (err: unknown) {
    console.log("👾 ~ doEmailLogin ~ err:", err);
    output.error(err as string);
  }
}
