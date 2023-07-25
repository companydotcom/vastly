import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions = {
  providers: [
    CognitoProvider({
      clientId: "",
      clientSecret: "",
      issuer: "",
    }),
  ],
  secret: "",
};

export default NextAuth(authOptions);
