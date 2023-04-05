export default async function login(client: any) {
  client
    .command("login")
    .description("Log into company.com")
    .action(async () => {
      console.log("Logging in!")
    })

  //
  // result = await doEmailLogin()
  //
  // check if email login failed, return result
  //
  // Save the user's authentication token to the configuration file.
  // https://vercel.com/docs/concepts/projects/project-configuration/global-configuration
}
