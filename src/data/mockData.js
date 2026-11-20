// QuickBite Mock Data: Restaurants, Dishes, Categories, and Offers

export const CATEGORIES = [
  {
    id: 'pizza',
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80',
    description: 'Cheesy, hot & oven-baked'
  },
  {
    id: 'burger',
    name: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80',
    description: 'Juicy patties & crunchy fries'
  },
  {
    id: 'biryani',
    name: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
    description: 'Rich, fragrant & spiced rice'
  },
  {
    id: 'chinese',
    name: 'Chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=80',
    description: 'Wok-tossed noodles & manchurian'
  },
  {
    id: 'south-indian',
    name: 'South Indian',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=80',
    description: 'Crispy dosas & fluffy idlis'
  },
  {
    id: 'snacks',
    name: 'Snacks & Momos',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&auto=format&fit=crop&q=80',
    description: 'Hot momos, rolls & quick bites'
  },
  {
    id: 'beverages',
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80',
    description: 'Refreshing shakes & coolers'
  },
  {
    id: 'desserts',
    name: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    description: 'Sweet indulgences & ice creams'
  }
];

export const CITIES = [
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' }
];

export const COUPONS = [
  {
    code: 'QUICK50',
    discountPercent: 50,
    maxDiscount: 150,
    minOrder: 199,
    description: '50% OFF up to ₹150 on orders above ₹199',
    badge: 'Popular'
  },
  {
    code: 'QUICK40',
    discountPercent: 40,
    maxDiscount: 120,
    minOrder: 149,
    description: 'Get 40% OFF up to ₹120 on orders above ₹149',
    badge: 'Deal of the day'
  },
  {
    code: 'QUICK20',
    flatDiscount: 20,
    minOrder: 99,
    description: 'Flat ₹20 OFF on orders above ₹99',
    badge: 'Instant'
  },
  {
    code: 'TASTY100',
    flatDiscount: 100,
    minOrder: 399,
    description: 'Flat ₹100 OFF on party orders above ₹399',
    badge: 'Best Value'
  },
  {
    code: 'FREEDEL',
    isFreeDelivery: true,
    minOrder: 100,
    description: '100% Free Delivery on your order',
    badge: 'Free Shipping'
  }
];

export const RESTAURANTS = [
  {
    id: 'dominos-pizza',
    name: "Domino's Pizza",
    logo: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80',
    rating: 4.4,
    ratingCount: '10k+',
    deliveryTime: '30-40 mins',
    deliveryTimeMin: 30,
    costForTwo: 150,
    priceRange: '100-300',
    cuisines: ['Pizzas', 'Italian', 'Pastas', 'Desserts'],
    categoryIds: ['pizza', 'desserts', 'beverages'],
    isVegOnly: false,
    freeDelivery: true,
    promoted: true,
    discountTag: '50% OFF up to ₹100',
    address: 'GF-12, Alkapuri Arcade, RC Dutt Road, Vadodara',
    menuCategories: ['Pizza', 'Sides', 'Beverages', 'Desserts'],
    menu: [
      {
        id: 'dom-1',
        name: 'Margherita Pizza',
        category: 'Pizza',
        price: 199,
        veg: true,
        rating: 4.6,
        ratingCount: 3240,
        bestseller: true,
        description: 'Classic cheese delight with 100% real mozzarella cheese on fresh hand-stretched crust.',
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'dom-2',
        name: 'Farmhouse Pizza',
        category: 'Pizza',
        price: 299,
        veg: true,
        rating: 4.5,
        ratingCount: 2890,
        bestseller: true,
        description: 'Loaded with crunchy bell peppers, onions, ripe tomatoes and delicious grilled mushrooms.',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'dom-3',
        name: 'Peppy Paneer Pizza',
        category: 'Pizza',
        price: 349,
        veg: true,
        rating: 4.4,
        ratingCount: 1540,
        bestseller: false,
        description: 'Spiced paneer chunks, crisp capsicum and fiery red paprika with melted cheese.',
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'dom-4',
        name: 'Chicken Golden Delight',
        category: 'Pizza',
        price: 399,
        veg: false,
        rating: 4.7,
        ratingCount: 2100,
        bestseller: true,
        description: 'Double barbeque chicken, golden sweet corn, and extra rich mozzarella cheese.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'dom-5',
        name: 'Garlic Breadsticks',
        category: 'Sides',
        price: 129,
        veg: true,
        rating: 4.6,
        ratingCount: 4200,
        bestseller: true,
        description: 'Freshly baked buttery breadsticks seasoned with Italian herbs and melted garlic butter dip.',
        image: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'dom-6',
        name: 'Stuffed Garlic Bread',
        category: 'Sides',
        price: 169,
        veg: true,
        rating: 4.5,
        ratingCount: 1980,
        bestseller: false,
        description: 'Stuffed with melted mozzarella cheese, sweet corn, and fiery jalapenos.',
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'dom-7',
        name: 'Choco Lava Cake',
        category: 'Desserts',
        price: 109,
        veg: true,
        rating: 4.8,
        ratingCount: 5600,
        bestseller: true,
        description: 'Warm chocolate cake with a gooey, molten chocolate fudge center.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'dom-8',
        name: 'Cold Coffee Frappe',
        category: 'Beverages',
        price: 89,
        veg: true,
        rating: 4.3,
        ratingCount: 840,
        bestseller: false,
        description: 'Chilled rich roasted coffee blended with creamy milk and vanilla cream.',
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'biryani-blues',
    name: 'Biryani Blues',
    logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1000&auto=format&fit=crop&q=80',
    rating: 4.5,
    ratingCount: '8k+',
    deliveryTime: '25-35 mins',
    deliveryTimeMin: 25,
    costForTwo: 200,
    priceRange: '100-300',
    cuisines: ['Biryani', 'Hyderabadi', 'Mughlai', 'North Indian'],
    categoryIds: ['biryani', 'desserts'],
    isVegOnly: false,
    freeDelivery: true,
    promoted: false,
    discountTag: '40% OFF up to ₹80',
    address: 'Near Inorbit Mall, Subhanpura, Vadodara',
    menuCategories: ['Biryani', 'Starters', 'Desserts', 'Beverages'],
    menu: [
      {
        id: 'bb-1',
        name: 'Hyderabadi Chicken Dum Biryani',
        category: 'Biryani',
        price: 299,
        veg: false,
        rating: 4.7,
        ratingCount: 3820,
        bestseller: true,
        description: 'Authentic Hyderabadi dum biryani cooked on slow charcoal fire with succulent chicken and aromatic basmati rice.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'bb-2',
        name: 'Paneer Dum Biryani',
        category: 'Biryani',
        price: 249,
        veg: true,
        rating: 4.4,
        ratingCount: 1980,
        bestseller: true,
        description: 'Layered basmati rice infused with saffron, caramelized onions, and tender cottage cheese cubes.',
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'bb-3',
        name: 'Chicken 65',
        category: 'Starters',
        price: 229,
        veg: false,
        rating: 4.6,
        ratingCount: 1420,
        bestseller: true,
        description: 'Crispy fried chicken bites tossed in curry leaves, mustard seeds, and Andhra red chili paste.',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'bb-4',
        name: 'Shahi Gulab Jamun (2 pcs)',
        category: 'Desserts',
        price: 79,
        veg: true,
        rating: 4.8,
        ratingCount: 2200,
        bestseller: false,
        description: 'Soft melt-in-the-mouth khoya dumplings soaked in fragrant cardamom rose syrup.',
        image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'mcdonalds',
    name: "McDonald's",
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1000&auto=format&fit=crop&q=80',
    rating: 4.2,
    ratingCount: '12k+',
    deliveryTime: '25-35 mins',
    deliveryTimeMin: 25,
    costForTwo: 250,
    priceRange: '100-300',
    cuisines: ['Burgers', 'Fast Food', 'Beverages', 'Desserts'],
    categoryIds: ['burger', 'beverages', 'desserts'],
    isVegOnly: false,
    freeDelivery: true,
    promoted: true,
    discountTag: 'Flat 50% OFF',
    address: 'Centre Square Mall, Sarabhai Campus, Vadodara',
    menuCategories: ['Burgers', 'Sides', 'Beverages', 'Desserts'],
    menu: [
      {
        id: 'mcd-1',
        name: 'McAloo Tikki Burger',
        category: 'Burgers',
        price: 49,
        veg: true,
        rating: 4.4,
        ratingCount: 9400,
        bestseller: true,
        description: 'Crispy potato and peas patty topped with special tomato mayonnaise dressing in a toasted bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'mcd-2',
        name: 'McSpicy Chicken Burger',
        category: 'Burgers',
        price: 189,
        veg: false,
        rating: 4.6,
        ratingCount: 6300,
        bestseller: true,
        description: 'Tender juicy chicken patty coated in spicy crispy batter topped with crunchy lettuce and cream mayo.',
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'mcd-3',
        name: 'French Fries (Large)',
        category: 'Sides',
        price: 119,
        veg: true,
        rating: 4.7,
        ratingCount: 8200,
        bestseller: true,
        description: 'Golden crispy salted fries, perfectly fluffy inside and crunchy outside.',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'mcd-4',
        name: 'McFlurry Oreo',
        category: 'Desserts',
        price: 99,
        veg: true,
        rating: 4.5,
        ratingCount: 3100,
        bestseller: false,
        description: 'Creamy soft vanilla soft serve blended with crunchy chocolate Oreo cookie crumbles.',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'kfc',
    name: 'KFC',
    logo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1000&auto=format&fit=crop&q=80',
    rating: 4.3,
    ratingCount: '7k+',
    deliveryTime: '30-40 mins',
    deliveryTimeMin: 30,
    costForTwo: 250,
    priceRange: '100-300',
    cuisines: ['Burgers', 'Fast Food', 'Snacks', 'Rolls'],
    categoryIds: ['burger', 'snacks'],
    isVegOnly: false,
    freeDelivery: true,
    promoted: false,
    discountTag: '20% OFF on Combos',
    address: 'Near Old Padra Road, Malhar Mega Mall, Vadodara',
    menuCategories: ['Chicken Buckets', 'Burgers', 'Snacks'],
    menu: [
      {
        id: 'kfc-1',
        name: 'Hot & Crispy Chicken (4 pcs)',
        category: 'Chicken Buckets',
        price: 399,
        veg: false,
        rating: 4.7,
        ratingCount: 4100,
        bestseller: true,
        description: 'Signature 11 herbs & spices coated bone-in chicken fried to crispy golden crunch.',
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'kfc-2',
        name: 'Zinger Burger',
        category: 'Burgers',
        price: 179,
        veg: false,
        rating: 4.5,
        ratingCount: 3500,
        bestseller: true,
        description: 'Crunchy battered whole chicken breast fillet served in a sesame bun with lettuce and mayo.',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'kfc-3',
        name: 'Peri Peri Chicken Strips (6 pcs)',
        category: 'Snacks',
        price: 249,
        veg: false,
        rating: 4.4,
        ratingCount: 1800,
        bestseller: false,
        description: 'Boneless tender chicken breast strips seasoned with spicy tangy peri peri sprinkle.',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'pizza-hut',
    name: 'Pizza Hut',
    logo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1000&auto=format&fit=crop&q=80',
    rating: 4.1,
    ratingCount: '9k+',
    deliveryTime: '20-40 mins',
    deliveryTimeMin: 20,
    costForTwo: 230,
    priceRange: '100-300',
    cuisines: ['Pizzas', 'Italian', 'Pasta', 'Fast Food'],
    categoryIds: ['pizza', 'beverages'],
    isVegOnly: false,
    freeDelivery: true,
    promoted: false,
    discountTag: 'Buy 1 Get 1 Free',
    address: 'Sayajigunj, Opposite Railway Station, Vadodara',
    menuCategories: ['Pan Pizza', 'Appetizers', 'Beverages'],
    menu: [
      {
        id: 'ph-1',
        name: 'Veggie Supreme Pan Pizza',
        category: 'Pan Pizza',
        price: 319,
        veg: true,
        rating: 4.5,
        ratingCount: 2200,
        bestseller: true,
        description: 'Black olives, green capsicum, mushroom, onion, red paprika and sweet corn on crispy pan crust.',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'ph-2',
        name: 'Cheese Garlic Bread',
        category: 'Appetizers',
        price: 139,
        veg: true,
        rating: 4.3,
        ratingCount: 1700,
        bestseller: false,
        description: 'Toasted baguette flavored with garlic butter and melted mozzarella cheese.',
        image: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'wow-momo',
    name: 'WOW! Momo',
    logo: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1000&auto=format&fit=crop&q=80',
    rating: 4.5,
    ratingCount: '6k+',
    deliveryTime: '20-30 mins',
    deliveryTimeMin: 20,
    costForTwo: 150,
    priceRange: '100-300',
    cuisines: ['Tibetan', 'Chinese', 'Snacks', 'Momos'],
    categoryIds: ['snacks', 'chinese'],
    isVegOnly: false,
    freeDelivery: true,
    promoted: false,
    discountTag: '20% OFF on Platters',
    address: 'Near Eva Mall, Manjalpur, Vadodara',
    menuCategories: ['Steamed Momos', 'Fried Momos', 'Momo Platters'],
    menu: [
      {
        id: 'wm-1',
        name: 'Steamed Veg Darjeeling Momos (6 pcs)',
        category: 'Steamed Momos',
        price: 129,
        veg: true,
        rating: 4.6,
        ratingCount: 2900,
        bestseller: true,
        description: 'Delicate steamed dumplings stuffed with spiced shredded vegetables and served with spicy red chutney.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'wm-2',
        name: 'Kurkure Chicken Momos (6 pcs)',
        category: 'Fried Momos',
        price: 189,
        veg: false,
        rating: 4.8,
        ratingCount: 3400,
        bestseller: true,
        description: 'Crispy cornflake-crusted deep fried momos filled with juicy chicken and seasoned with peri peri.',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'wm-3',
        name: 'Pan Fried Chilli Momo Platter',
        category: 'Momo Platters',
        price: 219,
        veg: true,
        rating: 4.4,
        ratingCount: 1100,
        bestseller: false,
        description: 'Crispy pan-fried momos tossed in sweet and spicy Schezwan sauce with bell peppers.',
        image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'behrouz-biryani',
    name: 'Behrouz Biryani',
    logo: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000&auto=format&fit=crop&q=80',
    rating: 4.6,
    ratingCount: '15k+',
    deliveryTime: '30-40 mins',
    deliveryTimeMin: 30,
    costForTwo: 350,
    priceRange: '300-500',
    cuisines: ['Biryani', 'Mughlai', 'North Indian', 'Royal'],
    categoryIds: ['biryani', 'desserts'],
    isVegOnly: false,
    freeDelivery: true,
    promoted: true,
    discountTag: 'Flat ₹125 OFF',
    address: 'Akota Gardens Road, Akota, Vadodara',
    menuCategories: ['Royal Biryani', 'Kebabs', 'Desserts'],
    menu: [
      {
        id: 'bbz-1',
        name: 'Dum Gosht Mutton Biryani',
        category: 'Royal Biryani',
        price: 449,
        veg: false,
        rating: 4.8,
        ratingCount: 4500,
        bestseller: true,
        description: 'Tender marinated mutton pieces cooked in sealed earthen handi with royal spices and fragrant basmati rice.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'bbz-2',
        name: 'Subz-e-Biryani (Veg)',
        category: 'Royal Biryani',
        price: 289,
        veg: true,
        rating: 4.5,
        ratingCount: 1900,
        bestseller: false,
        description: 'Diced garden vegetables and aromatic spices layered with saffron-tinged rice and roasted cashews.',
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'haldirams',
    name: "Haldiram's Sweets & Thali",
    logo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&auto=format&fit=crop&q=80',
    rating: 4.4,
    ratingCount: '14k+',
    deliveryTime: '20-30 mins',
    deliveryTimeMin: 20,
    costForTwo: 220,
    priceRange: '100-300',
    cuisines: ['North Indian', 'Chaat', 'Sweets', 'South Indian'],
    categoryIds: ['south-indian', 'desserts', 'snacks'],
    isVegOnly: true,
    freeDelivery: true,
    promoted: false,
    discountTag: '15% OFF on Pure Veg Thali',
    address: 'Near Natubhai Circle, Race Course, Vadodara',
    menuCategories: ['Chaat', 'Thali & Meals', 'Sweets'],
    menu: [
      {
        id: 'hld-1',
        name: 'Special Raj Kachori',
        category: 'Chaat',
        price: 139,
        veg: true,
        rating: 4.7,
        ratingCount: 5200,
        bestseller: true,
        description: 'Crispy giant kachori stuffed with sprouts, potatoes, sweet curd, tangy tamarind and mint chutney.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'hld-2',
        name: 'Deluxe Veg Thali',
        category: 'Thali & Meals',
        price: 249,
        veg: true,
        rating: 4.6,
        ratingCount: 3100,
        bestseller: true,
        description: 'Complete wholesome meal with Paneer butter masala, Dal makhani, Jeera rice, 2 Butter rotis, Raita & Gulab jamun.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'hld-3',
        name: 'Kesar Rasmalai (2 pcs)',
        category: 'Sweets',
        price: 119,
        veg: true,
        rating: 4.9,
        ratingCount: 4600,
        bestseller: true,
        description: 'Spongy cottage cheese patties steeped in saffron and pistachio infused thick condensed milk.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'sankalp-south-indian',
    name: 'Sankalp South Indian',
    logo: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=1000&auto=format&fit=crop&q=80',
    rating: 4.5,
    ratingCount: '9k+',
    deliveryTime: '20-35 mins',
    deliveryTimeMin: 20,
    costForTwo: 180,
    priceRange: '100-300',
    cuisines: ['South Indian', 'Dosas', 'Healthy', 'Beverages'],
    categoryIds: ['south-indian', 'beverages'],
    isVegOnly: true,
    freeDelivery: true,
    promoted: false,
    discountTag: 'Free Filter Coffee on ₹250',
    address: 'Jetalpur Road, Alkapuri, Vadodara',
    menuCategories: ['Dosas', 'Idli & Vada', 'Beverages'],
    menu: [
      {
        id: 'skp-1',
        name: 'Mysore Masala Dosa',
        category: 'Dosas',
        price: 179,
        veg: true,
        rating: 4.8,
        ratingCount: 3900,
        bestseller: true,
        description: 'Crispy golden crepe smeared with spicy garlic red chutney and stuffed with seasoned potato mash.',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'skp-2',
        name: 'Steamed Ghee Idli (3 pcs)',
        category: 'Idli & Vada',
        price: 99,
        veg: true,
        rating: 4.6,
        ratingCount: 2200,
        bestseller: false,
        description: 'Piping hot fluffy rice cakes topped with aromatic pure desi ghee, piping hot sambhar & coconut chutney.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'skp-3',
        name: 'Traditional South Indian Filter Coffee',
        category: 'Beverages',
        price: 59,
        veg: true,
        rating: 4.9,
        ratingCount: 4100,
        bestseller: true,
        description: 'Brewed chicory blend served frothed in authentic steel tumbler and davarah.',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'mainland-china',
    name: 'Mainland China Express',
    logo: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=1000&auto=format&fit=crop&q=80',
    rating: 4.6,
    ratingCount: '5k+',
    deliveryTime: '30-45 mins',
    deliveryTimeMin: 30,
    costForTwo: 450,
    priceRange: '300-500',
    cuisines: ['Chinese', 'Asian', 'Noodles', 'Seafood'],
    categoryIds: ['chinese'],
    isVegOnly: false,
    freeDelivery: false,
    promoted: false,
    discountTag: 'Flat 20% OFF',
    address: 'Near Bird Circle, Old Padra Road, Vadodara',
    menuCategories: ['Noodles & Rice', 'Appetizers', 'Gravies'],
    menu: [
      {
        id: 'mc-1',
        name: 'Wok tossed Veg Hakka Noodles',
        category: 'Noodles & Rice',
        price: 219,
        veg: true,
        rating: 4.6,
        ratingCount: 1800,
        bestseller: true,
        description: 'Stir fried noodles with crunchy cabbage, bell peppers, carrots, spring onions and light soy.',
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'mc-2',
        name: 'Chilli Paneer Dry',
        category: 'Appetizers',
        price: 269,
        veg: true,
        rating: 4.7,
        ratingCount: 2400,
        bestseller: true,
        description: 'Crispy batter-coated cottage cheese cubes tossed in spicy garlic soy sauce with green chilies.',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'mc-3',
        name: 'Schezwan Chicken Fried Rice',
        category: 'Noodles & Rice',
        price: 279,
        veg: false,
        rating: 4.5,
        ratingCount: 1600,
        bestseller: false,
        description: 'Fragrant jasmine rice wok-tossed with shredded chicken, egg, and fiery homemade Schezwan sauce.',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'barbeque-nation',
    name: 'Barbeque Nation Grill Box',
    logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
    rating: 4.5,
    ratingCount: '11k+',
    deliveryTime: '35-50 mins',
    deliveryTimeMin: 35,
    costForTwo: 650,
    priceRange: '500+',
    cuisines: ['Barbecue', 'North Indian', 'Kebabs', 'Biryani'],
    categoryIds: ['biryani', 'desserts'],
    isVegOnly: false,
    freeDelivery: true,
    promoted: true,
    discountTag: 'Flat ₹150 OFF on Grill Boxes',
    address: 'Seven Seas Mall, Fatehgunj, Vadodara',
    menuCategories: ['Grill Boxes', 'Main Course', 'Desserts'],
    menu: [
      {
        id: 'bbq-1',
        name: 'BBQ Non-Veg Feast Box',
        category: 'Grill Boxes',
        price: 599,
        veg: false,
        rating: 4.8,
        ratingCount: 3200,
        bestseller: true,
        description: 'Loaded box with Tandoori Chicken, Mutton Seekh Kebab, Fish Tikka, Butter Chicken, Naan & Brownie.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'bbq-2',
        name: 'BBQ Veg Celebration Box',
        category: 'Grill Boxes',
        price: 499,
        veg: true,
        rating: 4.6,
        ratingCount: 2100,
        bestseller: true,
        description: 'Paneer Tikka, Crispy Corn, Veg Kebab, Dal Makhani, Paneer Butter Masala, Rice & Gulab Jamun.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'baskin-robbins',
    name: 'Baskin Robbins Ice Cream',
    logo: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=1000&auto=format&fit=crop&q=80',
    rating: 4.6,
    ratingCount: '8k+',
    deliveryTime: '15-25 mins',
    deliveryTimeMin: 15,
    costForTwo: 280,
    priceRange: '100-300',
    cuisines: ['Ice Cream', 'Desserts', 'Cakes', 'Shakes'],
    categoryIds: ['desserts', 'beverages'],
    isVegOnly: true,
    freeDelivery: true,
    promoted: false,
    discountTag: '25% OFF on Tubs',
    address: 'Near Chakli Circle, Race Course Road, Vadodara',
    menuCategories: ['Ice Cream Scoops', 'Sundaes', 'Thick Shakes'],
    menu: [
      {
        id: 'br-1',
        name: 'Belgian Chocolate Tub (450ml)',
        category: 'Ice Cream Scoops',
        price: 320,
        veg: true,
        rating: 4.9,
        ratingCount: 3900,
        bestseller: true,
        description: 'Decadent dark chocolate ice cream made with imported Belgian cocoa and chocolate flakes.',
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'br-2',
        name: 'Mississippi Mud Sundae',
        category: 'Sundaes',
        price: 189,
        veg: true,
        rating: 4.7,
        ratingCount: 1600,
        bestseller: true,
        description: 'Rich chocolate fudge cake topped with chocolate ice cream, warm hot fudge sauce and roasted nuts.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'br-3',
        name: 'Cotton Candy Shake',
        category: 'Thick Shakes',
        price: 199,
        veg: true,
        rating: 4.4,
        ratingCount: 880,
        bestseller: false,
        description: 'Playful pink and purple cotton candy ice cream churned into a rich thick milkshake.',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    name: 'Shalin Rathod',
    type: 'Home',
    phone: '+91 98765 43210',
    flat: 'Flat 123, Block B',
    street: 'Green Park Apartments, Vasna Road',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '390001',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Shalin Rathod',
    type: 'Work',
    phone: '+91 98765 43210',
    flat: '4th Floor, Tech Wing',
    street: 'Synergy IT Hub, Gotri Road',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '390007',
    isDefault: false
  }
];
