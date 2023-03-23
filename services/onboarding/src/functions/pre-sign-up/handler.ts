import type { PreSignUpTriggerHandler } from "aws-lambda"
import { middyfy } from "@companydotcom/server-utils"

const preSignUp: PreSignUpTriggerHandler = async (event) => {
  event.response.autoConfirmUser = true
  return event
}

export const main = middyfy(preSignUp)
