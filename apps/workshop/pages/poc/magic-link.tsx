import { Box, Button, Container, Heading } from "@companydotcom/ui";
import { Amplify, Auth } from "aws-amplify";
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
  const { email, token } = router.query;

  const verifyChallenge = async () => {
    if (token && typeof token === "string" && typeof email === "string") {
      try {
        const cognitoUser = await Auth.signIn(email);
        console.log("cognitoUser:", cognitoUser);

        const challengeResult = await Auth.sendCustomChallengeAnswer(cognitoUser, token);
        console.log(" challengeResult:", challengeResult);
      } catch (err) {
        console.log(err);
        alert("The token is invalid.");
      }
    }
  };

  return (
    <Box mt="120">
      <Container centerContent>
        <Heading>Click to verify</Heading>
        <Button mt="12" onClick={() => verifyChallenge()}>
          Verify
        </Button>
      </Container>
    </Box>
  );
}
