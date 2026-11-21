import React, { createContext, useContext, useState, useEffect } from 'react';
import { COUPONS, INITIAL_ADDRESSES } from '../data/mockData';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Persistent cart items
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_cart');
      return saved ? JSON.parse(saved) : [
        // Preload 2 demo items to match reference screenshot Screen 4 initially, or empty if user cleared
        {
          id: 'mcd-1',
          name: 'McAloo Tikki Burger',
          price: 49,
          veg: true,
          quantity: 1,
          restaurantId: 'mcdonalds',
          restaurantName: "McDonald's",
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
        },
        {
          id: 'dom-1',
          name: 'Margherita Pizza',
          price: 199,
          veg: true,
          quantity: 1,
          restaurantId: 'dominos-pizza',
          restaurantName: "Domino's Pizza",
          image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80'
        }
      ];
    } catch {
      return [];
    }
  });

  // Persistent coupon
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_coupon');
      return saved ? JSON.parse(saved) : {
        code: 'QUICK20',
        flatDiscount: 20,
        minOrder: 99,
        description: 'Flat ₹20 OFF on orders above ₹99'
      };
    } catch {
      return null;
    }
  });

  // Location
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('quickbite_city') || 'Vadodara';
  });

  // Addresses
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_addresses');
      return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
    } catch {
      return INITIAL_ADDRESSES;
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    return localStorage.getItem('quickbite_active_addr') || 'addr-1';
  });

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_favorites');
      return saved ? JSON.parse(saved) : ['dominos-pizza', 'biryani-blues'];
    } catch {
      return ['dominos-pizza', 'biryani-blues'];
    }
  });

  // Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('quickbite_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('quickbite_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('quickbite_coupon');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('quickbite_city', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem('quickbite_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('quickbite_active_addr', selectedAddressId);
  }, [selectedAddressId]);

  useEffect(() => {
    localStorage.setItem('quickbite_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('quickbite_orders', JSON.stringify(orders));
  }, [orders]);

  // Calculations
  const itemTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && itemTotal >= (appliedCoupon.minOrder || 0)) {
    if (appliedCoupon.flatDiscount) {
      discount = appliedCoupon.flatDiscount;
    } else if (appliedCoupon.discountPercent) {
      const calculated = (itemTotal * appliedCoupon.discountPercent) / 100;
      discount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    }
  }

  // Auto remove coupon if order amount falls below minOrder
  useEffect(() => {
    if (appliedCoupon && itemTotal > 0 && itemTotal < (appliedCoupon.minOrder || 0)) {
      setAppliedCoupon(null);
      showToast(`Coupon ${appliedCoupon.code} removed (Min order ₹${appliedCoupon.minOrder})`, 'info');
    }
  }, [itemTotal, appliedCoupon]);

  // Delivery Charges: ₹30 standard, FREE if itemTotal >= 300 or coupon is FREEDEL
  const isFreeDeliveryQualified = itemTotal >= 300 || appliedCoupon?.isFreeDelivery;
  const deliveryFee = itemTotal === 0 ? 0 : (isFreeDeliveryQualified ? 0 : 30);
  const platformFee = itemTotal === 0 ? 0 : 5;
  const finalAmount = Math.max(0, itemTotal - discount + deliveryFee + platformFee);

  // Cart operations
  const addToCart = (dish, restaurant) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          veg: dish.veg,
          image: dish.image,
          category: dish.category,
          restaurantId: restaurant?.id || 'dominos-pizza',
          restaurantName: restaurant?.name || "QuickBite Partner",
          quantity: 1
        }
      ];
    });
    showToast(`Added ${dish.name} to cart!`);
  };

  const removeFromCart = (dishId) => {
    setCartItems(prev => prev.filter(item => item.id !== dishId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (dishId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    showToast('Cart cleared', 'info');
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS.find(c => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try QUICK50, QUICK40, or QUICK20.' };
    }

    if (itemTotal < found.minOrder) {
      return { success: false, message: `Minimum order amount of ₹${found.minOrder} required for ${found.code}.` };
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`);
    return { success: true, message: `Coupon ${found.code} applied! Saved discount on order.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const toggleFavorite = (restaurantId) => {
    setFavorites(prev => {
      const exists = prev.includes(restaurantId);
      const updated = exists ? prev.filter(id => id !== restaurantId) : [...prev, restaurantId];
      showToast(exists ? 'Removed from favorites' : 'Added to favorites!');
      return updated;
    });
  };

  const addAddress = (newAddr) => {
    const addrWithId = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setSavedAddresses(prev => [addrWithId, ...prev]);
    setSelectedAddressId(addrWithId.id);
    showToast('New address saved!');
    return addrWithId;
  };

  const placeOrder = ({ paymentMethod, deliveryInstructions = '' }) => {
    const activeAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];
    const orderId = `QB${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...cartItems],
      address: activeAddress,
      paymentMethod,
      deliveryInstructions,
      itemTotal,
      discount,
      deliveryFee,
      platformFee,
      totalAmount: finalAmount,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
      status: 'Order Placed', // 'Order Placed' -> 'Restaurant Preparing' -> 'Out for Delivery' -> 'Delivered'
      rider: {
        name: 'Arjun Singh',
        phone: '+91 90000 11111',
        rating: 4.9,
        bikeNumber: 'GJ-06-BQ-4912'
      },
      estimatedDeliveryMins: 28
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => {
      const exists = prev.some(order => order.id === orderId);
      if (exists) {
        return prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
      }
      // If order not yet in state (e.g. demo order ID), add it with full fields
      const demoOrder = {
        id: orderId || 'QB84920193',
        createdAt: new Date().toISOString(),
        items: [
          { name: 'McAloo Tikki Burger', quantity: 1, price: 49 },
          { name: 'Margherita Pizza', quantity: 1, price: 199 }
        ],
        address: savedAddresses[0] || INITIAL_ADDRESSES[0],
        paymentMethod: 'Cash on Delivery',
        totalAmount: 263,
        status: newStatus,
        restaurantName: "Domino's Pizza",
        restaurant_lat: 22.3175,
        restaurant_lng: 73.1680,
        delivery_lat: 22.3072,
        delivery_lng: 73.1812,
        rider: {
          name: 'Arjun Singh',
          phone: '+91 90000 11111',
          rating: 4.9,
          bikeNumber: 'GJ-06-BQ-4912'
        },
        estimatedDeliveryMins: 24
      };
      return [demoOrder, ...prev];
    });
  };

  const reorder = (orderId) => {
    const pastOrder = orders.find(o => o.id === orderId);
    if (pastOrder && pastOrder.items) {
      setCartItems(pastOrder.items);
      showToast('Items added to cart from past order!');
      return true;
    }
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        itemTotal,
        discount,
        deliveryFee,
        platformFee,
        finalAmount,
        isFreeDeliveryQualified,
        appliedCoupon,
        selectedCity,
        setSelectedCity,
        savedAddresses,
        selectedAddressId,
        setSelectedAddressId,
        activeAddress: savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0],
        favorites,
        orders,
        toast,
        showToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleFavorite,
        addAddress,
        placeOrder,
        updateOrderStatus,
        reorder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
