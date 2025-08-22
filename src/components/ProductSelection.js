import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Text, Input, Heading, Spinner } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import { supabase } from '../supabaseClient';

// Create motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

const ProductSelection = ({ onOrderComplete }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState(null);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const confettiConfig = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        resize: true,
      },
    },
    particles: {
      color: {
        value: ["#2d5016", "#4a7c59", "#ff69b4", "#f687b3", "#68d391"],
      },
      move: {
        decay: 0.05,
        direction: "top",
        enable: true,
        gravity: {
          acceleration: 9.81,
          enable: true,
          inverse: false,
          maxSpeed: 50,
        },
        path: {
          clamp: true,
          delay: {
            random: {
              enable: true,
              minimumValue: 0,
            },
            value: 0,
          },
          enable: true,
          options: {},
        },
        outModes: {
          top: "none",
          default: "destroy",
        },
        random: false,
        size: true,
        speed: {
          min: 50,
          max: 150,
        },
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 0,
      },
      opacity: {
        random: {
          enable: true,
          minimumValue: 0.1,
        },
        value: {
          min: 0.1,
          max: 1,
        },
        animation: {
          count: 0,
          enable: true,
          speed: 1,
          decay: 0.05,
          sync: false,
          destroy: "none",
          startValue: "max",
          minimumValue: 0.1,
        },
      },
      rotate: {
        random: {
          enable: true,
          minimumValue: 0,
        },
        value: {
          min: 0,
          max: 360,
        },
        animation: {
          enable: true,
          speed: 30,
          decay: 0,
          sync: false,
        },
        direction: "random",
        path: false,
      },
      tilt: {
        direction: "random",
        enable: true,
        value: {
          min: 0,
          max: 360,
        },
        animation: {
          enable: true,
          speed: 30,
          decay: 0,
          sync: false,
        },
      },
      size: {
        random: {
          enable: true,
          minimumValue: 1,
        },
        value: {
          min: 2,
          max: 6,
        },
        animation: {
          count: 0,
          enable: true,
          speed: 40,
          decay: 0.1,
          sync: false,
          destroy: "none",
          startValue: "random",
          minimumValue: 0.1,
        },
      },
      roll: {
        darken: {
          enable: true,
          value: 25,
        },
        enable: true,
        speed: {
          min: 5,
          max: 15,
        },
      },
      wobble: {
        distance: 30,
        enable: true,
        speed: {
          min: -7,
          max: 7,
        },
      },
      shape: {
        type: ["circle", "square"],
        options: {},
      },
    },
    detectRetina: true,
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const playSuccessSound = () => {
    const audio = new Audio('/sounds/success.mp3');
    audio.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
  };

  const showNotification = (type, title, description) => {
    setNotification({ type, title, description });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error loading products. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setShowNameInput(true);
  };

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      showNotification("warning", "Name needed!", "Please tell us your name so we can make your order special!");
      return;
    }

    try {
      // Create order without total_amount since we're not using prices
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          { customer_name: customerName, total_amount: 0 }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order item
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert([{
          order_id: orderData.id,
          product_id: selectedProduct.id,
          quantity: 1,
          price: 0
        }]);

      if (itemsError) throw itemsError;

      // Trigger confetti, sound, and show success notification
      triggerConfetti();
      playSuccessSound();

      showNotification("success", "Order placed! 🎉", `Your delicious ${selectedProduct.name} is coming right up, ${customerName}!`);

      // Reset form
      setSelectedProduct(null);
      setCustomerName('');
      setShowNameInput(false);

      // Delay the callback to let user see the confetti
      setTimeout(() => {
        if (onOrderComplete) onOrderComplete();
      }, 3000);

    } catch (error) {
      console.error('Error submitting order:', error);
      showNotification("error", "Oops!", "Something went wrong! Please try again, we're here to help!");
    }
  };

  const handleCancel = () => {
    setShowNameInput(false);
    setSelectedProduct(null);
    setCustomerName('');
  };

  if (loading) {
    return (
      <MotionBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        h="50vh"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Spinner size="xl" color="purple.500" />
        <MotionText
          mt={4}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading products...
        </MotionText>
      </MotionBox>
    );
  }

  if (showNameInput) {
    return (
      <AnimatePresence>
        <MotionBox
          maxW="md"
          mx="auto"
          mt={8}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <MotionBox
            bg="white"
            p={8}
            borderRadius="30px"
            boxShadow="2xl"
            border="3px solid"
            borderColor="#ff69b4"
            position="relative"
            overflow="hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >

            <MotionHeading
              size="lg"
              textAlign="center"
              mb={6}
              color="#2d5016"
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Almost Ready!
            </MotionHeading>

            <MotionBox
              bg="linear-gradient(135deg, rgba(74, 124, 89, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%)"
              p={4}
              borderRadius="20px"
              border="2px solid"
              borderColor="#ff69b4"
              mb={6}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <MotionText
                color="#2d5016"
                fontWeight="semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                Your Choice: <strong>{selectedProduct?.name}</strong>
              </MotionText>
            </MotionBox>

            <MotionBox
              mb={6}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Text mb={2} fontWeight="medium" color="#4a7c59">Your Name</Text>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="What's your name?"
                  size="lg"
                  autoFocus
                  bg="gray.50"
                  border="2px solid"
                  borderColor="#ff69b4"
                  borderRadius="15px"
                  _focus={{
                    borderColor: "#2d5016",
                    boxShadow: "0 0 0 3px rgba(45, 80, 22, 0.1)"
                  }}
                />
              </motion.div>
            </MotionBox>

            <MotionBox
              display="flex"
              gap={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <MotionButton
                onClick={handleCancel}
                colorScheme="gray"
                size="lg"
                flex={1}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Go Back
              </MotionButton>
              <MotionButton
                onClick={handleSubmitOrder}
                bg="#ff69b4"
                color="white"
                size="lg"
                flex={1}
                borderRadius="20px"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(255, 105, 180, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                _hover={{}}
              >
                Place My Order! 💖
              </MotionButton>
            </MotionBox>
          </MotionBox>
        </MotionBox>
      </AnimatePresence>
    );
  }

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };


  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      position="relative"
    >
      {/* Confetti Particles */}
      {showConfetti && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          zIndex={9999}
          pointerEvents="none"
        >
          <Particles
            id="confetti"
            init={particlesInit}
            options={{
              ...confettiConfig,
              particles: {
                ...confettiConfig.particles,
                number: {
                  ...confettiConfig.particles.number,
                  value: 150,
                },
              },
            }}
          />
        </Box>
      )}

      {/* Custom Notification */}
      <AnimatePresence>
        {notification && (
          <MotionBox
            position="fixed"
            top="20px"
            right="20px"
            zIndex={10000}
            bg={notification.type === 'success' ? '#ff69b4' : notification.type === 'error' ? 'red.500' : '#4a7c59'}
            color="white"
            p={4}
            borderRadius="lg"
            boxShadow="xl"
            maxW="400px"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Text fontWeight="bold" mb={1}>
              {notification.title}
            </Text>
            <Text fontSize="sm">
              {notification.description}
            </Text>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Header */}
      <MotionBox textAlign="center" mb={8}>

        <MotionHeading
          size="4xl"
          color="#2d5016"
          fontWeight="bold"
          mb={2}
          fontFamily="'Caveat', cursive"
          transform="rotate(-1deg)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Cafe 320
        </MotionHeading>

        <MotionText
          fontSize="lg"
          color="#4a7c59"
          fontWeight="medium"
          fontFamily="'Kalam', cursive"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          What would you like today?
        </MotionText>
      </MotionBox>

      {/* Animated Product Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              y: -2
            }}
            whileTap={{
              scale: 0.98
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            <MotionButton
              onClick={() => selectProduct(product)}
              h="120px"
              w="100%"
              bg="white"
              color="#2d5016"
              border="2px solid"
              borderColor="#4a7c59"
              borderRadius="20px"
              boxShadow="md"
              _hover={{ borderColor: "#ff69b4", transform: "translateY(-2px)", bg: "rgba(255, 105, 180, 0.05)" }}
              _active={{}}
              transition="all 0.2s"
            >


              <Text
                fontSize="lg"
                fontWeight="semibold"
                textAlign="center"
              >
                {product.name}
              </Text>
            </MotionButton>
          </motion.div>
        ))}
      </motion.div>
    </MotionBox>
  );
};

export default ProductSelection;
