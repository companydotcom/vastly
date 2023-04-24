import SchemaBuilder from "@pothos/core"
import { DateResolver } from "graphql-scalars"
import { User, Post } from "../src/schema/types"

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date }
  }
  Objects: {
    User: User
    Post: Post
  }
}>({})

builder.addScalarType("Date", DateResolver, {})

builder.queryType({})
