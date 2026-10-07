import api from "./api";

// EXPANDED CULINARY MENU CATALOGUE
// Covering authentic Starters, Main Courses, Desserts, and Beverages.
const INITIAL_FOODS = [
  // ==================== STARTERS ====================
  {
    id: 1,
    name: "Crispy Paneer Tikka",
    category: "Starters",
    price: 249,
    description: "Cottage cheese cubes marinated in spiced yogurt and grilled to golden perfection with onions and bell peppers.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: true,
    available: true
  },
  {
    id: 2,
    name: "Chicken Reshmi Kebab",
    category: "Starters",
    price: 299,
    description: "Tender chicken pieces blended with cream, cheese, and aromatic royal spices, chargrilled on skewers.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: false,
    available: true
  },
  {
    id: 11,
    name: "Dahi Ke Kebab",
    category: "Starters",
    price: 269,
    description: "Velvety spiced hung curd patties coated with fine breadcrumbs and shallow fried to a crisp golden crust.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: true,
    available: true
  },
  {
    id: 12,
    name: "Amritsari Fish Fry",
    category: "Starters",
    price: 349,
    description: "Crispy carom-scented batter-fried fish fillets served with spicy mint coriander dip and pickled onions.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: false,
    available: true
  },
  {
    id: 13,
    name: "Hara Bhara Kebab",
    category: "Starters",
    price: 229,
    description: "Wholesome spinach, green peas, and potato cutlets spiced with ginger, green chilies, and tangy chaat masala.",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    isVeg: true,
    available: true
  },
  {
    id: 14,
    name: "Tandoori Malai Chaap",
    category: "Starters",
    price: 279,
    description: "Soya chaap skewers steeped in thick cashew cream, cheese, and cardamom before roasting over charcoal.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: true,
    available: true
  },
  {
    id: 15,
    name: "Smoky Peri-Peri Chicken Wings",
    category: "Starters",
    price: 319,
    description: "Crispy fried chicken wings tossed in our signature smoky peri-peri glaze, toasted sesame, and scallions.",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: false,
    available: true
  },

  // ==================== MAIN COURSE ====================
  {
    id: 3,
    name: "Royal Butter Chicken",
    category: "Main Course",
    price: 389,
    description: "Succulent tandoori chicken cooked in rich, creamy tomato gravy with a generous touch of butter and kasuri methi.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    isVeg: false,
    available: true
  },
  {
    id: 4,
    name: "Dal Makhani Grandeur",
    category: "Main Course",
    price: 279,
    description: "Black lentils slow-cooked overnight with creamy butter, garlic, and freshly grounded fragrant whole spices.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    isVeg: true,
    available: true
  },
  {
    id: 5,
    name: "Hyderabadi Dum Biryani",
    category: "Main Course",
    price: 349,
    description: "Fragrant basmati rice layered with spiced marinated chicken, pure saffron, caramelized onions, and fresh mint.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: false,
    available: true
  },
  {
    id: 16,
    name: "Paneer Lababdar",
    category: "Main Course",
    price: 329,
    description: "Soft cottage cheese chunks simmered in an exotic onion-tomato gravy with grated paneer and cashew paste.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: true,
    available: true
  },
  {
    id: 17,
    name: "Kashmiri Mutton Rogan Josh",
    category: "Main Course",
    price: 459,
    description: "Traditional slow-cooked tender goat meat in rich aromatic gravy flavored with Kashmiri chilies, mace, and fennel.",
    image: "https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    isVeg: false,
    available: true
  },
  {
    id: 18,
    name: "Kadhai Chicken Wok Special",
    category: "Main Course",
    price: 369,
    description: "Chicken braised in a cast-iron wok with crushed coriander seeds, bell peppers, crunchy onions, and spicy tomato reduction.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: false,
    available: true
  },
  {
    id: 19,
    name: "Kolhapuri Vegetable Medley",
    category: "Main Course",
    price: 269,
    description: "Fiery mixed seasonal vegetables cooked in roasted coconut and sesame paste with regional red chili tadka.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    isVeg: true,
    available: true
  },
  {
    id: 20,
    name: "Lucknowi Royal Veg Dum Biryani",
    category: "Main Course",
    price: 299,
    description: "Awadhi style dum biryani infused with kewra, saffron, fresh garden vegetables, mint, and toasted golden cashews.",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: true,
    available: true
  },
  {
    id: 6,
    name: "Garlic Butter Naan Basket",
    category: "Main Course",
    price: 129,
    description: "Tandoor baked fluffy flatbread brushed generously with roasted garlic butter and fresh coriander leaves.",
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: true,
    available: true
  },
  {
    id: 21,
    name: "Artisan Bread Platter (4 Pcs)",
    category: "Main Course",
    price: 169,
    description: "Assortment of fresh tandoori butter roti, stuffed paneer kulcha, lachha paratha, and missi roti.",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    isVeg: true,
    available: true
  },

  // ==================== DESSERTS ====================
  {
    id: 7,
    name: "Hot Sizzling Brownie",
    category: "Desserts",
    price: 199,
    description: "Warm fudgy chocolate walnut brownie served on a sizzling hot plate with vanilla bean ice cream and chocolate drizzle.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: true,
    available: true
  },
  {
    id: 8,
    name: "Gulab Jamun with Rabri",
    category: "Desserts",
    price: 169,
    description: "Traditional melt-in-the-mouth soft milk dumplings soaked in cardamom rose syrup, garnished with pistachios and rabri.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: true,
    available: true
  },
  {
    id: 22,
    name: "Royal Kesar Pista Kulfi",
    category: "Desserts",
    price: 139,
    description: "Dense and creamy traditional malai kulfi richly loaded with saffron strands, crushed pistachios, and slivered almonds.",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: true,
    available: true
  },
  {
    id: 23,
    name: "Rasmalai Supreme (2 Pcs)",
    category: "Desserts",
    price: 179,
    description: "Delicate cottage cheese patties soaked in chilled saffron-infused creamy condensed milk with slivered nuts.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    isVeg: true,
    available: true
  },
  {
    id: 24,
    name: "Desi Ghee Gajar Ka Halwa",
    category: "Desserts",
    price: 189,
    description: "Slow-simmered winter red carrots with pure desi ghee, khoya, roasted cashews, and golden raisins.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: true,
    available: true
  },

  // ==================== BEVERAGES ====================
  {
    id: 9,
    name: "Mango Mint Mojito",
    category: "Beverages",
    price: 149,
    description: "Refreshing fusion of Alphonso mango pulp, fresh crushed mint leaves, lime juice, and chilled sparkling soda.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    isVeg: true,
    available: true
  },
  {
    id: 10,
    name: "Royal Cold Coffee with Ice Cream",
    category: "Beverages",
    price: 159,
    description: "Creamy iced brewed coffee blended with chocolate sauce and crowned with a scoop of vanilla bean ice cream.",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: true,
    available: true
  },
  {
    id: 25,
    name: "Punjabi Masala Chaas",
    category: "Beverages",
    price: 89,
    description: "Refreshing spiced churned buttermilk tempered with roasted cumin, black salt, fresh ginger, and mint.",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    isVeg: true,
    available: true
  },
  {
    id: 26,
    name: "Rose Falooda Royale",
    category: "Beverages",
    price: 189,
    description: "Classic royal dessert beverage layered with fragrant rose syrup, vermicelli, sweet basil seeds, chilled milk, and ice cream.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: true,
    available: true
  },
  {
    id: 27,
    name: "Fresh Watermelon Basil Cooler",
    category: "Beverages",
    price: 139,
    description: "Hydrating cold-pressed fresh watermelon juice muddled with sweet holy basil, black salt, and a splash of lime.",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    isVeg: true,
    available: true
  },
  {
    id: 28,
    name: "Royal Masala Chai Pot",
    category: "Beverages",
    price: 99,
    description: "Freshly brewed aromatic Indian milk tea simmered with fresh ginger, green cardamom, cloves, and cinnamon.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    isVeg: true,
    available: true
  }
];

// Helper to initialize and synchronize local food storage
const getStoredFoods = () => {
  const stored = localStorage.getItem("quickdine_foods");
  if (!stored) {
    localStorage.setItem("quickdine_foods", JSON.stringify(INITIAL_FOODS));
    return INITIAL_FOODS;
  }
  try {
    const parsed = JSON.parse(stored);
    const existingIds = new Set(parsed.map((item) => item.id));
    const newDefaults = INITIAL_FOODS.filter((item) => !existingIds.has(item.id));
    if (newDefaults.length > 0) {
      const merged = [...parsed, ...newDefaults];
      localStorage.setItem("quickdine_foods", JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem("quickdine_foods", JSON.stringify(INITIAL_FOODS));
    return INITIAL_FOODS;
  }
};

const saveStoredFoods = (foods) => {
  localStorage.setItem("quickdine_foods", JSON.stringify(foods));
};

// -------------------------------------------------------------
// API SERVICE FUNCTIONS (Ready for Spring Boot /api/foods)
// -------------------------------------------------------------

export const getFoods = async () => {
  try {
    // Attempt backend API call first
    const res = await api.get("/api/foods");
    return res.data;
  } catch (error) {
    // Graceful fallback to rich local food catalogue
    return getStoredFoods();
  }
};

export const getFoodById = async (id) => {
  try {
    const res = await api.get(`/api/foods/${id}`);
    return res.data;
  } catch (error) {
    const foods = getStoredFoods();
    const item = foods.find((f) => f.id === Number(id));
    if (!item) throw new Error("Food item not found");
    return item;
  }
};

export const createFood = async (foodData) => {
  try {
    const res = await api.post("/api/foods", foodData);
    return res.data;
  } catch (error) {
    const foods = getStoredFoods();
    const newFood = {
      ...foodData,
      id: Date.now(),
      rating: 4.5,
      price: Number(foodData.price)
    };
    foods.unshift(newFood);
    saveStoredFoods(foods);
    return newFood;
  }
};

export const updateFood = async (id, foodData) => {
  try {
    const res = await api.put(`/api/foods/${id}`, foodData);
    return res.data;
  } catch (error) {
    const foods = getStoredFoods();
    const index = foods.findIndex((f) => f.id === Number(id));
    if (index !== -1) {
      foods[index] = { ...foods[index], ...foodData, price: Number(foodData.price) };
      saveStoredFoods(foods);
      return foods[index];
    }
    throw new Error("Food item not found to update");
  }
};

export const deleteFood = async (id) => {
  try {
    await api.delete(`/api/foods/${id}`);
    return true;
  } catch (error) {
    const foods = getStoredFoods();
    const filtered = foods.filter((f) => f.id !== Number(id));
    saveStoredFoods(filtered);
    return true;
  }
};
