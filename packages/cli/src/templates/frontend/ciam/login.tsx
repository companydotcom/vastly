import React from "react";
import { Button, Container } from "@vastly/ui";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
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
}
