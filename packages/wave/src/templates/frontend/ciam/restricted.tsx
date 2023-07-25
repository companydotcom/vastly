import React from "react";
import { Container } from "@vastly/ui";
import { useSession } from "next-auth/react";

export default function Page() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Container maxW="container.md" centerContent mt="44" textAlign="center">
        Loading...
      </Container>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Container maxW="container.md" centerContent mt="44" textAlign="center">
        Access Denied
      </Container>
    );
  }

  return (
    <Container maxW="container.md" centerContent mt="44" textAlign="center">
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
    </Container>
  );
}
