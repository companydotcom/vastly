import { builder } from "./builder"
import { writeFileSync } from "fs"
import { printSchema, lexicographicSortSchema } from "graphql"
import "./schema/User"
import "./schema/Post"

export const schema = builder.toSchema()

const schemaAsString = printSchema(lexicographicSortSchema(schema))

writeFileSync("schema.graphql", schemaAsString)
