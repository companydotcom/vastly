import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    CognitoProvider({
      clientId: "",
      clientSecret: "",
      issuer: "",
    }),
  ],
  secret: "",
});
