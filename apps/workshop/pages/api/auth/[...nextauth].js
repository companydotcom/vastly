import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: "p4Ws30dJq5V8s4Ruu4bDQ1jh6xGEhwTy",
      clientSecret: "OE2zb46IITsm4rmtWFNBY9Ao50Oa8eJIDB6v8k7owqY07QvOk_dqv97AVWEPeDTt",
      issuer: "https://company-corp-devx.auth0.com",
      callbackUrl: "http://localhost:3000/api/auth/callback/auth0",
    }),
    GithubProvider({
      clientId: "c79b2d4c77ae22c228b4",
      clientSecret: "8b93443b9ccc3337ccbff865e09d96342245d159",
    }),
    GoogleProvider({
      clientId: "881048175178-27k5hcpn59b4ib9366ckiqh493feb59g.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  jwt: {
    secret: "supersecretauthsecret",
  },
}

export default NextAuth(authOptions)

// export const authOptions = {
//   providers: [
//     Auth0Provider({
//       clientId: process.env.AUTH0_CLIENT_ID,
//       clientSecret: process.env.AUTH0_CLIENT_SECRET,
//       issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//     }),
//   ],
//   jwt: {
//     secret: process.env.NEXTAUTH_SECRET,
//   },
// }
