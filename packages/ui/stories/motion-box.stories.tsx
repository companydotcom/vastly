import type { Meta, StoryObj } from "@storybook/react";
import { Box, Container, keyframes } from '@chakra-ui/react';
import { MotionBox } from '../src';

const meta: Meta<typeof MotionBox> = {
  title: "Components/Motion/MotionBox",
  component: MotionBox
};

export default meta;
type Story = StoryObj<typeof MotionBox>;



/** `MotionBox` is a custom `<motion />` component created from the Framer Motion library. Seamlessly add animation to any `Box` component you would normally use by wrapping `MotionBox` around it and adding any animation you'd like to it. For more information, visit https://www.framer.com/motion/introduction/ */
export const Example: Story = {
  render: () => {
  const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 20%; }
  25% { transform: scale(2) rotate(0); border-radius: 20%; }
  50% { transform: scale(2) rotate(270deg); border-radius: 50%; }
  75% { transform: scale(1) rotate(270deg); border-radius: 50%; }
  100% { transform: scale(1) rotate(0); border-radius: 20%; }
`;
const animation = `${animationKeyframes} 2s ease-in-out infinite`;

   return (
    <Container h="25vh" display="flex" alignItems="center" justifyContent="center">
      <MotionBox
        animation={animation}
        padding="2"
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        width="12"
        height="12"
        display="flex"
      >
        Hello World
      </MotionBox>
    </Container>
  )
}
};