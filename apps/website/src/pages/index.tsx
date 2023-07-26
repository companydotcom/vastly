import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Container, Heading, Slider, Text, VStack } from "@vastly/ui";
import { LogoGrid } from "@/components/logo-grid";
import NextImage from "next/image";
import { Footer } from "@/components/footer";
import { CTA } from "@/components/cta";
import HeroSlider from "@/components/hero-slider";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Vastly Wave</title>
        <meta name="description" content="Vastly Wave" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className={`${inter.className}`}>
        <Box className="intro-header" position="relative" zIndex="base" px={[5]} mb="6.2rem">
          <Container centerContent maxW="65rem" textAlign="left">
            <VStack align="start">
              <Heading fontSize={["6rem", null, null, "20rem"]} color="brand.orange">
                Vastly
              </Heading>
              <Heading maxW="60rem" fontSize={["1.5rem", null, null, "4.5rem"]} color="brand.teal">
                Create custom digital experiences at scale.
              </Heading>
              <Text maxW="800px" fontSize={["1rem", null, null, "2xl"]}>
                Unlock seamless Digital Transformation with Vastly, the all-in-one platform that
                empowers organizations with the tools, people, process & technology they need to
                create enterprise-level digital experiences
              </Text>
            </VStack>
          </Container>
          <Container centerContent maxW="1200px" mt="5rem">
            <LogoGrid />
          </Container>
          <NextImage
            src="/waveinverse1.png"
            fill
            alt="wavy background image"
            style={{ pointerEvents: "none", opacity: 0.15, zIndex: -1, objectFit: "contain" }}
          />
        </Box>
        <HeroSlider />
        <CTA />
        <Footer />
      </Box>
    </>
  );
}
