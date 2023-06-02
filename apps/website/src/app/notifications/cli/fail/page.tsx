"use client";
import { Container, Heading } from "@vastly/ui";

export default function CLIFail() {
  console.log("test");
  return (
    <Container centerContent mt="44" maxW="container.md">
      <Heading size="md" mb="6">
        Uh-oh, we weren’t able to authenticate you. Please try again.{" "}
      </Heading>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 32C0 14.375 14.25 0 32 0C49.625 0 64 14.375 64 32C64 49.75 49.625 64 32 64C14.25 64 0 49.75 0 32ZM22 30C24.25 30 26 28.25 26 26C26 23.875 24.25 22 22 22C19.75 22 18 23.875 18 26C18 28.25 19.75 30 22 30ZM42 22C39.75 22 38 23.875 38 26C38 28.25 39.75 30 42 30C44.25 30 46 28.25 46 26C46 23.875 44.25 22 42 22ZM20 42C18.875 42 18 43 18 44C18 45.125 18.875 46 20 46H44C45 46 46 45.125 46 44C46 43 45 42 44 42H20Z"
          fill="#171923"
        />
      </svg>
    </Container>
  );
}
