import { Box, Button, Container, Heading } from "@vastly/ui";

export const CTA = () => {
  return (
    <Box bg="brand.orange" color="white" py="3.75rem" px="5">
      <Container centerContent>
        <Heading>Get early access to Wave.</Heading>
        <Button size="lg" color="brand.orange" mt="2rem">
          APPLY NOW
        </Button>
      </Container>
    </Box>
  );
};
