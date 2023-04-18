import { Box, Button, Container, Heading } from "@companydotcom/ui";
import { Amplify, Auth } from "aws-amplify";
import { useEffect } from "react";
import { useRouter } from "next/router";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_FBBnPmKc7",
    userPoolWebClientId: "4vr9r59ednfan4cj167sf8mrqf",
    mandatorySignIn: true,
  },
});

export default function MagicLink() {
  const router = useRouter();
  const { qsEmail, qsToken } = router.query;

  useEffect(() => {
    const verifyChallenge = async () => {
      if (qsToken && typeof qsToken === "string" && typeof qsEmail === "string") {
        const email = decodeURIComponent(qsEmail?.substring(6));
        const cognitoUser = await Auth.signIn(email);

        const token = decodeURIComponent(qsToken?.substring(6));
        try {
          const challengeResult = await Auth.sendCustomChallengeAnswer(cognitoUser, token);
          console.log("👾 ~ verifyChallenge ~ challengeResult:", challengeResult);
        } catch (err) {
          console.log(err);
          alert("The token is invalid.");
        }
      }
    };

    if (qsEmail && qsToken) {
      verifyChallenge();
    }
  }, []);

  return (
    <Box mt="120">
      <Container centerContent>
        <Heading>Click to verify</Heading>
        <Button mt="12">Verify</Button>
      </Container>
    </Box>
  );
}
