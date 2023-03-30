import executeLogin from "./execute-login"

export default async function doEmailLogin() {
  // let result = 1
  // return result
  let email = "jacob.granberry@company-corp.com"
  try {
    const data = await executeLogin(email)
    console.log("👾DATA:", data)
    // verificationToken = data.token
    // securityCode = data.securityCode
  } catch (err: unknown) {
    console.log("👾ERR:", err)
    // output.error(errorToString(err))
    return 1
  }
}

doEmailLogin()
