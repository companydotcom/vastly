import type { APIGatewayProxyResult } from "aws-lambda"
import { middyfy } from './../../helpers/middify';
import { formatJSONResponse, ValidatedAPIGatewayProxyEvent } from "../../helpers/response"

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
