import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Badge,
  Spinner,
  useDisclosure
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

// Create motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error loading orders. Please check your connection and try again.');
    } finally {
      setLoading(false);
      if (isRefresh) {
        setTimeout(() => {
          setRefreshing(false);
        }, 500);
      }
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      // Delete order items first (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Update local state
      setOrders(orders.filter(order => order.id !== orderId));
      alert('Order deleted successfully.');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const clearAllOrders = async () => {
    try {
      // Delete order items first (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .neq('id', 0); // Delete all items

      if (itemsError) throw itemsError;

      // Then delete orders
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .neq('id', 0); // Delete all orders

      if (ordersError) throw ordersError;

      setOrders([]);
      onClose();
      alert('All orders have been cleared successfully.');
    } catch (error) {
      console.error('Error clearing orders:', error);
      alert('Error clearing orders. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Spinner size="xl" color="#4a7c59" />
        </motion.div>
        <MotionText 
          mt={4}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading orders...
        </MotionText>
      </MotionBox>
    );
  }

  // Animation variants
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
      x: -50, 
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      x: 100,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <MotionBox 
      maxW="1200px" 
      mx="auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <MotionBox 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={8}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <MotionHeading 
          size="4xl" 
          color="#2d5016"
          fontWeight="bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Order History
        </MotionHeading>
        <MotionBox display="flex" gap={3}>
          <MotionButton
            onClick={handleRefresh}
            colorScheme="green"
            size="lg"
            isLoading={refreshing}
            loadingText="Refreshing"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 8px 20px rgba(72, 187, 120, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          >
            🔄 Refresh
          </MotionButton>
          {orders.length > 0 && (
            <MotionButton
              onClick={onOpen}
              colorScheme="red"
              size="lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 8px 20px rgba(245, 101, 101, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              Clear All
            </MotionButton>
          )}
        </MotionBox>
      </MotionBox>

      {orders.length === 0 ? (
        <MotionBox 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          h="40vh"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Text fontSize="4xl" mb={4} opacity={0.6}>
            ☕
          </Text>
          <MotionText 
            fontSize="xl" 
            color="#ff69b4" 
            mb={2}
            fontWeight="semibold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            No orders yet!
          </MotionText>
          <MotionText 
            color="#4a7c59"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Your orders will appear here once placed.
          </MotionText>
        </MotionBox>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                layout
                exit="exit"
              >
                <MotionBox 
                  w="full" 
                  bg="white"
                  p={6} 
                  borderRadius="15px" 
                  boxShadow="md" 
                  border="1px solid" 
                  borderColor="#e2e8f0" 
                  mb={4}
                  whileHover={{
                    boxShadow: "lg"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  

                  <MotionBox 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mb={4}
                  >
                    <MotionHeading 
                      size="md" 
                      color="#2d5016"
                      fontWeight="600"
                    >
                      Order #{order.id}
                    </MotionHeading>
                    <MotionBox 
                      display="flex" 
                      alignItems="center" 
                      gap={4}
                    >
                      <Badge bg="#f7fafc" color="#4a5568" fontSize="sm" p={2} borderRadius="md">
                        {formatDate(order.created_at)}
                      </Badge>
                      <Button
                        onClick={() => deleteOrder(order.id)}
                        colorScheme="red"
                        size="sm"
                        variant="outline"
                      >
                        Delete
                      </Button>
                    </MotionBox>
                  </MotionBox>

                  <MotionBox>
                    <Text 
                      fontSize="lg" 
                      mb={3}
                      color="#2d5016"
                      fontWeight="medium"
                    >
                      <strong>Customer:</strong> {order.customer_name}
                    </Text>

                    <Box>
                      <Text fontWeight="semibold" mb={2} color="#4a7c59">Items:</Text>
                      {order.order_items.map((item, itemIndex) => (
                        <Box key={item.id}>
                          <Box 
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center" 
                            p={3} 
                            bg="#f8f9fa" 
                            borderRadius="md" 
                            mb={2}
                            border="1px solid"
                            borderColor="#e9ecef"
                          >
                            <Text fontWeight="medium" color="#2d5016">{item.products.name}</Text>
                            <Badge bg="#e2e8f0" color="#4a5568" borderRadius="md" px={3} py={1}>
                              Qty: {item.quantity}
                            </Badge>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </MotionBox>
                </MotionBox>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <MotionBox 
              bg="white" 
              p={8} 
              borderRadius="25px" 
              boxShadow="2xl" 
              maxW="md" 
              w="full" 
              mx={4}
              border="3px solid"
              borderColor="#ff69b4"
              position="relative"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              
              <MotionHeading 
                size="lg" 
                mb={4} 
                color="red.600"
                fontWeight="600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                Clear All Orders?
              </MotionHeading>
              
              <MotionText 
                mb={6} 
                color="#4a7c59"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                This will permanently delete all order history. Are you sure?
              </MotionText>
              
              <MotionBox 
                display="flex" 
                gap={3} 
                justifyContent="flex-end"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <MotionButton 
                  ref={cancelRef} 
                  onClick={onClose}
                  colorScheme="gray"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Cancel
                </MotionButton>
                <MotionButton 
                  colorScheme="red" 
                  onClick={clearAllOrders}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 8px 20px rgba(245, 101, 101, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Clear All
                </MotionButton>
              </MotionBox>
            </MotionBox>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default OrderList;
