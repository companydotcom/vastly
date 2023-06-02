"use client";
import { Container, Heading } from "@vastly/ui";

export default function CLISuccess() {
  return (
    <Container centerContent mt="44" maxW="container.md">
      <Heading size="md" mb="6">
        You’ve successfully been authenticated!
      </Heading>
      <svg
        width="86"
        height="96"
        viewBox="0 0 86 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M83.125 19.875C85.5625 22.125 85.5625 26.0625 83.125 28.3125L35.125 76.3125C32.875 78.75 28.9375 78.75 26.6875 76.3125L2.6875 52.3125C0.25 50.0625 0.25 46.125 2.6875 43.875C4.9375 41.4375 8.875 41.4375 11.125 43.875L30.8125 63.5625L74.6875 19.875C76.9375 17.4375 80.875 17.4375 83.125 19.875Z"
          fill="#29A32D"
        />
      </svg>
    </Container>
  );
}
