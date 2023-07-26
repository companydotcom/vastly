import { Flex, useMediaQuery, Box, Text, HStack } from "@vastly/ui";
import NextImage from "next/image";

const items = [
  {
    image: "/ACG.png",
    alt: "ACG",
    width: 94,
    height: 42,
  },
  {
    image: "/GSA.png",
    alt: "GSA",
    width: 62,
    height: 70,
  },
  {
    image: "/THM.png",
    alt: "HomeMag",
    width: 128,
    height: 35,
  },
  {
    image: "/Grandio.png",
    alt: "Grandio",
    width: 123,
    height: 35,
  },
  {
    image: "/Paysafe.png",
    alt: "Paysafe",
    width: 133,
    height: 32,
  },
  {
    image: "/Sphere.png",
    alt: "Sphere",
    width: 107,
    height: 42,
  },
  {
    image: "/OfficeDepot.png",
    alt: "OfficeDepot",
    width: 87,
    height: 42,
  },
  {
    image: "/CardConnect.png",
    alt: "CardConnect",
    width: 217,
    height: 28,
  },
];

export const LogoGrid = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <Box>
      <Text fontSize={["1rem", null, null, "2xl"]} opacity=".3">
        Trusted by these category leading brands and organizations
      </Text>
      <HStack wrap="wrap" gap="34px" mt={["1.7rem", null, null, "2.8rem"]}>
        {items.slice(0, isLargerThan768 ? items.length : 4).map((item) => (
          <NextImage
            key={item.alt}
            src={item.image}
            alt={item.alt}
            width={item.width}
            height={item.height}
          />
        ))}
      </HStack>
    </Box>
  );
};
