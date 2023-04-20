import { builder } from "./builder"
import "./schema/User"
import "./schema/Post"

export const schema = builder.toSchema()
