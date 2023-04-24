import { Box, Button, Container, Heading } from "@companydotcom/ui";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Amplify, Auth } from "aws-amplify";
import { useRouter } from "next/router";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_FBBnPmKc7",
    userPoolWebClientId: "4vr9r59ednfan4cj167sf8mrqf",
    mandatorySignIn: true,
  },
});

async function sendRequest(url: string, { arg }: { arg: { test: string } }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function MagicLink() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email, token } = router.query;

  const { trigger, isMutating } = useSWRMutation(
    "https://gxmblcgqcb.execute-api.us-east-1.amazonaws.com/dev/onboarding/verify",
    sendRequest,
  );

  const verifyChallenge = async () => {
    if (token && typeof token === "string" && typeof email === "string") {
      try {
        setIsLoading(true);
        const cognitoUser = await Auth.signIn(email);
        console.log("cognitoUser:", cognitoUser);
        const challengeResult = await Auth.sendCustomChallengeAnswer(cognitoUser, token);
        console.log(" challengeResult:", challengeResult);

        const test = await trigger({ test: cognitoUser?.signInUserSession?.accessToken?.jwtToken });
        console.log("👾 ~ verifyChallenge ~ test:", test);

        // await fetch("http://localhost:5001", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     message: challengeResult?.signInUserSession?.accessToken?.jwtToken,
        //   }),
        // })
        //   .then((response) => response.text())
        //   .then((data) => console.log(data))
        //   .catch((error) => console.error(error));

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        alert("The token is invalid.");
      }
    }
  };

  return (
    <Box mt="120">
      <Container centerContent>
        <Heading>Click to verify</Heading>
        <Button isLoading={isLoading} mt="12" onClick={() => verifyChallenge()}>
          Verify
        </Button>
      </Container>
    </Box>
  );
}
