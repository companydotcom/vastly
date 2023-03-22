/* eslint-disable @typescript-eslint/no-unused-vars */
import type { APIGatewayProxyResult } from "aws-lambda"
import type { ValidatedAPIGatewayProxyEvent } from "@companydotcom/utils"
import { middyfy, formatJSONResponse } from "@companydotcom/utils"
// TODO: Remove the workaround whenever MS fixes the issue
// https://github.com/microsoft/TypeScript/issues/48212
import type { MiddyfiedHandler } from "@companydotcom/utils/node_modules/@middy/core"

import schema from "./schema"

const hello = async (
  event: ValidatedAPIGatewayProxyEvent<typeof schema>,
): Promise<APIGatewayProxyResult> => {
  await new Promise((res) => setTimeout(res, 500))

  return formatJSONResponse({
    message: `Hello ${event.body.name} !`,
  })
}

export const main = middyfy(hello)
