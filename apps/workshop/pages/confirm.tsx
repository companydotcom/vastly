import { Box, Button, Container, Heading } from "@companydotcom/ui";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { Amplify, Auth } from "aws-amplify";
import { useRouter } from "next/router";

// @ts-ignore
// const fetcher = (...args) => fetch(...args).then((res) => res.json());

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_FBBnPmKc7",
    userPoolWebClientId: "4vr9r59ednfan4cj167sf8mrqf",
    mandatorySignIn: true,
  },
});

// async function sendRequest(url: string, { arg }: { arg: { test: string } }) {
//   return fetch(url, {
//     method: "POST",
//     body: JSON.stringify(arg),
//   }).then((res) => res.json());
// }

export default function MagicLink() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;

  // const { trigger, isMutating } = useSWRMutation(
  //   `http://localhost:5001?token=${token}`,
  //   sendRequest,
  // );

  const verifyChallenge = async () => {
    if (token && typeof token === "string" && typeof email === "string") {
      try {
        setIsLoading(true);
        const cognitoUser = await Auth.signIn(email);
        const challengeResult = await Auth.sendCustomChallengeAnswer(cognitoUser, token);

        // const t = await trigger({ test: "THIS IS TOKEN" });
        setIsLoading(false);
      } catch (err) {
        console.log(JSON.stringify(err));
        setIsLoading(false);
        console.log("The token is invalid.");
      }
    }
  };

  return (
    <Box mt="120">
      <Container centerContent>
        <Heading>Click to verify</Heading>
        {/* @ts-ignore */}
        <Button isLoading={isLoading} mt="12" onClick={() => verifyChallenge(email, token)}>
          Verify
        </Button>
      </Container>
    </Box>
  );
}
