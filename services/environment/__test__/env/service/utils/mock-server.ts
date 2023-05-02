// src/mocks/handlers.js
import { rest } from "msw";
import { setupServer } from "msw/node";

export const handlers = [
  rest.post("/env/{env}", (req, res, ctx) => {
    console.log("🚀 ~ file: mock-server.ts:6 ~ rest.post ~ req:", req);

    return res(
      // Respond with a 200 status code
      ctx.status(200),
    );
  }),

  rest.get("/user", (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem("is-authenticated");

    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: "Not authorized",
        }),
      );
    }

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: "admin",
      }),
    );
  }),
];

export const server = setupServer(...handlers);
