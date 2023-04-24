import { builder } from "../builder"

builder.objectType("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    createdAt: t.expose("createdAt", {
      type: "Date",
    }),
  }),
})
