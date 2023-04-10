import { builder } from "../builder"
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    posts: t.relation("posts"),
  }),
})

builder.queryField("users", (t) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.user.findMany({ ...query })
    },
  }),
)
