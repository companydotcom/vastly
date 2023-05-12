import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";
import inquirer from "inquirer";
import login from "../src/commands/login";
import { mockClient } from "./mocks/client";

describe("login", () => {
  it("should be called", async () => {
    const t = mockClient.setArgv("login");
    console.log("👾 ~ it ~ t:", t);
  });
});

// const fetchMocker = createFetchMock(vi);
// fetchMocker.enableMocks();

// vi.mock("inquirer");

// describe("login", () => {
//   const mockOutput = {
//     error: vi.fn(),
//     log: vi.fn(),
//   };
//   const mockClient = {
//     output: mockOutput,
//   };

//   beforeEach(() => {
//     vi.resetAllMocks();
//   });

//   it("should call `inquirer.prompt()` with correct question", async () => {
//     const mockEmail = "test@test.com";
//     inquirer.prompt.mockResolvedValueOnce({ email: mockEmail });

//     await login(mockClient);

//     expect(inquirer.prompt).toHaveBeenCalledWith([
//       {
//         type: "text",
//         name: "email",
//         message: "What is your email address?",
//       },
//     ]);
//   });

//   it("should call `doEmailLogin()` and `writeToConfigFile()` when email is valid", async () => {
//     const mockEmail = "test@test.com";
//     const mockResult: LoginResult = {
//       success: true,
//       token: "1234abcd",
//     };
//     const mockDoEmailLogin = vi.fn().mockResolvedValueOnce(mockResult);
//     const mockWriteToConfigFile = vi.fn();

//     vi.mock("./login", () => ({
//       __esModule: true,
//       default: async function login(client: any) {
//         const { output } = client;
//         const promptResult = await inquirer.prompt([
//           {
//             type: "text",
//             name: "email",
//             message: "What is your email address?",
//           },
//         ]);
//         const email = promptResult.email;

//         let result: LoginResult | undefined;
//         if (validate(email)) {
//           result = await mockDoEmailLogin(client, email);
//         } else {
//           throw new Error("Email invalid!");
//         }

//         if (result && result.success) {
//           mockWriteToConfigFile({ token: result.token });
//         }
//       },
//       doEmailLogin: mockDoEmailLogin,
//       writeToConfigFile: mockWriteToConfigFile,
//       validate: vi.requireActual("./login").validate,
//     }));

//     await login(mockClient);

//     expect(mockDoEmailLogin).toHaveBeenCalledWith(mockClient, mockEmail);
//     expect(mockWriteToConfigFile).toHaveBeenCalledWith({ token: mockResult.token });
//     expect(mockOutput.log).toHaveBeenCalledWith("User logged in successfully");
//   });

//   it("should throw an error when email is invalid", async () => {
//     const mockEmail = "invalid-email";
//     inquirer.prompt.mockResolvedValueOnce({ email: mockEmail });

//     try {
//       await login(mockClient);
//     } catch (err) {
//       expect(err).toEqual(new Error("Email invalid!"));
//     }
//   });

//   it("should throw an error when `inquirer.prompt()` throws an error", async () => {
//     const mockError = new Error("Interactive mode not supported");
//     inquirer.prompt.mockRejectedValueOnce(mockError);

//     try {
//       await login(mockClient);
//     } catch (err) {
//       expect(err).toEqual(mockError);
//       expect(mockOutput.error).toHaveBeenCalledWith("Interactive mode not supported");
//     }
//   });

//   it("should log error when `doEmailLogin()` fails", async () => {
//     const mockEmail = "test@test.com";
//     const mockError = new Error("Login failed");
//     const mockDoEmailLogin = vi.fn().mockRejectedValueOnce(mockError);

//     vi.mock("./login", () => ({
//       __esModule: true,
//       default: async function login(client: any) {
//         const { output } = client;
//         const promptResult = await inquirer.prompt([
//           {
//             type: "text",
//             name: "email",
//             message: "What is your email address?",
//           },
//         ]);
//         const email = promptResult.email;
//       },
//     }));
//   });
// });
