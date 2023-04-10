import { builder } from "../builder"

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
  }),
})
