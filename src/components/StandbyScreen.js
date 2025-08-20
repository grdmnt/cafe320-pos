import React from 'react';
import { Box, Button, Text, Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Create motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionText = motion(Text);

const StandbyScreen = ({ onStartOrdering }) => {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleStartOrdering = () => {
    setIsExiting(true);
    // Delay the actual navigation to allow animation to play
    setTimeout(() => {
      onStartOrdering();
    }, 600);
  };

  return (
    <>
      <MotionBox
        minH="100vh"
        bg="#ffb3d9"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        position="relative"
        initial={{ opacity: 0, scale: 1 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? 1.5 : 1
        }}
        transition={{ duration: isExiting ? 0.6 : 0.8 }}
      >
        {/* Static frame */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          border="60px solid"
          borderColor="#2d5016"
          borderRadius="0"
          zIndex={1}
          boxShadow="inset 0 0 30px rgba(0,0,0,0.2), 0 0 20px rgba(45, 80, 22, 0.3)"
        />


        {/* Main content - all fade in together */}
        <MotionBox
          textAlign="center"
          position="relative"
          maxW="600px"
          px={8}
          zIndex={3}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Heading
            fontSize="8xl"
            color="#2d5016"
            fontWeight="bold"
            mb={8}
            fontFamily="'Caveat', cursive"
            textShadow="0 2px 4px rgba(255,255,255,0.5)"
            transform="rotate(-2deg)"
          >
            Cafe 320
          </Heading>

          <MotionText
            fontSize="xl"
            color="#4a7c59"
            mb={8}
            fontWeight="medium"
            fontFamily="'Kalam', cursive"
            textShadow="0 1px 2px rgba(255,255,255,0.3)"
          >
            Your cozy neighborhood cafe
          </MotionText>

          <MotionBox
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(10px)"
            borderRadius="25px"
            p={6}
            mb={8}
            border="2px solid #4a7c59"
            boxShadow="0 4px 15px rgba(45, 80, 22, 0.2)"
          >
            <MotionText
              color="#2d5016"
              fontSize="lg"
              fontFamily="'Kalam', cursive"
              mb={3}
            >
              Welcome, lovely customer! 💕
            </MotionText>
            <MotionText
              color="#4a7c59"
              fontSize="md"
              fontFamily="'Kalam', cursive"
            >
              Ready to treat yourself to something delicious?
            </MotionText>
          </MotionBox>

          <MotionButton
            onClick={handleStartOrdering}
            size="lg"
            h="60px"
            px={8}
            fontSize="xl"
            fontWeight="bold"
            bg="#ff69b4"
            color="white"
            borderRadius="full"
            boxShadow="0 4px 20px rgba(0,0,0,0.2)"
            _hover={{}}
            _active={{}}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 6px 25px rgba(0,0,0,0.3)"
            }}
            whileTap={{
              scale: 0.95
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            Start My Order!
          </MotionButton>

          <MotionText
            color="#4a7c59"
            fontSize="sm"
            fontFamily="'Kalam', cursive"
            mt={4}
          >
            Tap above to see our yummy treats!
          </MotionText>
        </MotionBox>
      </MotionBox>
    </>
  );
};

export default StandbyScreen;
