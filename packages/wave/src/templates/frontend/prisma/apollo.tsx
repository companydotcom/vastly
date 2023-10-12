import React from "react";
import { createAuthLink, AUTH_TYPE } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

const url = ""; // Appsync API Endpoint URL or localhost

const region = "";

const auth = {
  type: "API_KEY" as AUTH_TYPE.API_KEY,
  apiKey: "",
};

const httpLink = new HttpLink({ uri: url });

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export const ApolloWrapper = ({ children }: any) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
