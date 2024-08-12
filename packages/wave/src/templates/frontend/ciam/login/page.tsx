import React from "react";
import { Button, Container } from "@vastly/ui";
import { auth, signIn, signOut } from "../api/auth/authConfig";

export const Home = async () => {
  const session = await auth();
  if (session && session.user) {
    return (
      <Container maxW="container.md" centerContent mt="44" textAlign="center">
        Signed in as {session.user.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </Container>
    );
  }
  return (
    <Container maxW="container.md" centerContent mt="44" textAlign="center">
      Not signed in <br />
      <Button onClick={() => signIn("cognito")}>Sign in</Button>
    </Container>
  );
};
