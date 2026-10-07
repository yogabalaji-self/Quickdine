package com.quickdine.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.quickdine.entity.Food;
import com.quickdine.entity.Order;
import com.quickdine.entity.OrderItem;
import com.quickdine.entity.RestaurantTable;
import com.quickdine.entity.User;
import com.quickdine.repository.FoodRepository;
import com.quickdine.repository.OrderRepository;
import com.quickdine.repository.RestaurantTableRepository;
import com.quickdine.repository.UserRepository;
import com.quickdine.service.UserService;

@Component
public class DataInitializer implements CommandLineRunner {

    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;
    private final RestaurantTableRepository tableRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public DataInitializer(FoodRepository foodRepository, OrderRepository orderRepository, RestaurantTableRepository tableRepository, UserRepository userRepository,
                           PasswordEncoder passwordEncoder, UserService userService) {
        this.foodRepository = foodRepository;
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Make sure an admin account exists (login with it opens the admin page)
        if (userRepository.findByEmailIgnoreCase("admin@quickdine.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@quickdine.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // stored as BCrypt hash
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("QuickDine DataInitializer: default admin user created (admin@quickdine.com).");
        }

        // Upgrade any users that still have a plain-text password to a BCrypt hash
        int migrated = userService.migratePlainPasswords();
        if (migrated > 0) {
            System.out.println("QuickDine DataInitializer: " + migrated + " plain-text password(s) converted to BCrypt hashes.");
        }

        // Proof in the console: how many stored passwords are BCrypt hashes
        List<User> allUsers = userRepository.findAll();
        long hashed = allUsers.stream().filter(u -> UserService.isBcryptHash(u.getPassword())).count();
        System.out.println("QuickDine password check: " + hashed + " of " + allUsers.size()
                + " user passwords are stored as BCrypt hashes.");
        if (hashed < allUsers.size()) {
            System.out.println("WARNING: some users still have a non-hashed password!");
        }

        if (foodRepository.count() == 0) {
            List<Food> defaultFoods = List.of(
                new Food("Crispy Paneer Tikka", "Starters", 249.0, "Cottage cheese cubes marinated in spiced yogurt and grilled to golden perfection with onions and bell peppers.", "/images/foods/paneer-tikka.jpg", 4.8, true, true),
                new Food("Chicken Reshmi Kebab", "Starters", 299.0, "Tender chicken pieces blended with cream, cheese, and aromatic royal spices, chargrilled on skewers.", "/images/foods/chicken-reshmi-kebab.jpg", 4.9, false, true),
                new Food("Dahi Ke Kebab", "Starters", 269.0, "Velvety spiced hung curd patties coated with fine breadcrumbs and shallow fried to a crisp golden crust.", "/images/foods/dahi-ke-kebab.jpg", 4.8, true, true),
                new Food("Amritsari Fish Fry", "Starters", 349.0, "Crispy carom-scented batter-fried fish fillets served with spicy mint coriander dip and pickled onions.", "/images/foods/amritsari-fish-fry.jpg", 4.9, false, true),
                new Food("Hara Bhara Kebab", "Starters", 229.0, "Wholesome spinach, green peas, and potato cutlets spiced with ginger, green chilies, and tangy chaat masala.", "/images/foods/hara-bhara-kebab.jpg", 4.7, true, true),
                new Food("Tandoori Malai Chaap", "Starters", 279.0, "Soya chaap skewers steeped in thick cashew cream, cheese, and cardamom before roasting over charcoal.", "/images/foods/tandoori-malai-chaap.jpg", 4.8, true, true),
                new Food("Smoky Peri-Peri Chicken Wings", "Starters", 319.0, "Crispy fried chicken wings tossed in our signature smoky peri-peri glaze, toasted sesame, and scallions.", "/images/foods/peri-peri-chicken-wings.jpg", 4.9, false, true),
                new Food("Royal Butter Chicken", "Main Course", 389.0, "Succulent tandoori chicken cooked in rich, creamy tomato gravy with a generous touch of butter and kasuri methi.", "/images/foods/butter-chicken.jpg", 5.0, false, true),
                new Food("Dal Makhani Grandeur", "Main Course", 279.0, "Black lentils slow-cooked overnight with creamy butter, garlic, and freshly grounded fragrant whole spices.", "/images/foods/dal-makhani.jpg", 4.7, true, true),
                new Food("Hyderabadi Dum Biryani", "Main Course", 349.0, "Fragrant basmati rice layered with spiced marinated chicken, pure saffron, caramelized onions, and fresh mint.", "/images/foods/hyderabadi-biryani.jpg", 4.9, false, true),
                new Food("Paneer Lababdar", "Main Course", 329.0, "Soft cottage cheese chunks simmered in an exotic onion-tomato gravy with grated paneer and cashew paste.", "/images/foods/paneer-lababdar.jpg", 4.9, true, true),
                new Food("Kashmiri Mutton Rogan Josh", "Main Course", 459.0, "Traditional slow-cooked tender goat meat in rich aromatic gravy flavored with Kashmiri chilies, mace, and fennel.", "/images/foods/mutton-rogan-josh.jpg", 5.0, false, true),
                new Food("Kadhai Chicken Wok Special", "Main Course", 369.0, "Chicken braised in a cast-iron wok with crushed coriander seeds, bell peppers, crunchy onions, and spicy tomato reduction.", "/images/foods/kadhai-chicken.jpg", 4.8, false, true),
                new Food("Kolhapuri Vegetable Medley", "Main Course", 269.0, "Fiery mixed seasonal vegetables cooked in roasted coconut and sesame paste with regional red chili tadka.", "/images/foods/kolhapuri-veg.jpg", 4.6, true, true),
                new Food("Lucknowi Royal Veg Dum Biryani", "Main Course", 299.0, "Awadhi style dum biryani infused with kewra, saffron, fresh garden vegetables, mint, and toasted golden cashews.", "/images/foods/veg-dum-biryani.jpg", 4.8, true, true),
                new Food("Garlic Butter Naan Basket", "Main Course", 129.0, "Tandoor baked fluffy flatbread brushed generously with roasted garlic butter and fresh coriander leaves.", "/images/foods/garlic-naan.jpg", 4.8, true, true),
                new Food("Artisan Bread Platter (4 Pcs)", "Main Course", 169.0, "Assortment of fresh tandoori butter roti, stuffed paneer kulcha, lachha paratha, and missi roti.", "/images/foods/bread-platter.jpg", 4.7, true, true),
                new Food("Hot Sizzling Brownie", "Desserts", 199.0, "Warm fudgy chocolate walnut brownie served on a sizzling hot plate with vanilla bean ice cream and chocolate drizzle.", "/images/foods/sizzling-brownie.jpg", 4.9, true, true),
                new Food("Gulab Jamun with Rabri", "Desserts", 169.0, "Traditional melt-in-the-mouth soft milk dumplings soaked in cardamom rose syrup, garnished with pistachios and rabri.", "/images/foods/gulab-jamun.jpg", 4.8, true, true),
                new Food("Royal Kesar Pista Kulfi", "Desserts", 139.0, "Dense and creamy traditional malai kulfi richly loaded with saffron strands, crushed pistachios, and slivered almonds.", "/images/foods/kesar-pista-kulfi.jpg", 4.9, true, true),
                new Food("Rasmalai Supreme (2 Pcs)", "Desserts", 179.0, "Delicate cottage cheese patties soaked in chilled saffron-infused creamy condensed milk with slivered nuts.", "/images/foods/rasmalai.jpg", 5.0, true, true),
                new Food("Desi Ghee Gajar Ka Halwa", "Desserts", 189.0, "Slow-simmered winter red carrots with pure desi ghee, khoya, roasted cashews, and golden raisins.", "/images/foods/gajar-halwa.jpg", 4.9, true, true),
                new Food("Mango Mint Mojito", "Beverages", 149.0, "Refreshing fusion of Alphonso mango pulp, fresh crushed mint leaves, lime juice, and chilled sparkling soda.", "/images/foods/mango-mojito.jpg", 4.7, true, true),
                new Food("Royal Cold Coffee with Ice Cream", "Beverages", 159.0, "Creamy iced brewed coffee blended with chocolate sauce and crowned with a scoop of vanilla bean ice cream.", "/images/foods/cold-coffee.jpg", 4.8, true, true),
                new Food("Punjabi Masala Chaas", "Beverages", 89.0, "Refreshing spiced churned buttermilk tempered with roasted cumin, black salt, fresh ginger, and mint.", "/images/foods/masala-chaas.jpg", 4.8, true, true),
                new Food("Rose Falooda Royale", "Beverages", 189.0, "Classic royal dessert beverage layered with fragrant rose syrup, vermicelli, sweet basil seeds, chilled milk, and ice cream.", "/images/foods/rose-falooda.jpg", 4.9, true, true),
                new Food("Fresh Watermelon Basil Cooler", "Beverages", 139.0, "Hydrating cold-pressed fresh watermelon juice muddled with sweet holy basil, black salt, and a splash of lime.", "/images/foods/watermelon-cooler.jpg", 4.7, true, true),
                new Food("Royal Masala Chai Pot", "Beverages", 99.0, "Freshly brewed aromatic Indian milk tea simmered with fresh ginger, green cardamom, cloves, and cinnamon.", "/images/foods/masala-chai.jpg", 4.9, true, true)
            );
            foodRepository.saveAll(defaultFoods);
            System.out.println("QuickDine DataInitializer: 28 food items seeded successfully into database.");
        }

        if (tableRepository.count() == 0) {
            List<RestaurantTable> defaultTables = List.of(
                new RestaurantTable("T-01", 2, "AVAILABLE"),
                new RestaurantTable("T-02", 4, "OCCUPIED"),
                new RestaurantTable("T-03", 4, "AVAILABLE"),
                new RestaurantTable("T-04", 6, "RESERVED"),
                new RestaurantTable("T-05", 8, "AVAILABLE"),
                new RestaurantTable("T-06", 2, "AVAILABLE")
            );
            tableRepository.saveAll(defaultTables);
            System.out.println("QuickDine DataInitializer: 6 restaurant tables seeded successfully into database.");
        }

        if (orderRepository.count() == 0) {
            Order o1 = new Order("QD-1001", "Yoga", "yoga@gmail.com", "+91 9876543210",
                "Flat 402, Royal Palms, MG Road, Bangalore", "T-04", "DINE_IN", "CARD",
                1165.0, 58.25, 40.0, 1263.25, "PREPARING", "2026-10-04 19:30");
            o1.addItem(new OrderItem(8L, "Royal Butter Chicken", 389.0, 2));
            o1.addItem(new OrderItem(16L, "Garlic Butter Naan Basket", 129.0, 3));
            orderRepository.save(o1);

            Order o2 = new Order("QD-1002", "Balaji", "balaji@example.com", "+91 9123456780",
                "Takeaway - Pick up at restaurant counter", "Takeaway", "TAKEAWAY", "UPI",
                547.0, 27.35, 40.0, 614.35, "READY", "2026-10-05 09:15");
            o2.addItem(new OrderItem(1L, "Crispy Paneer Tikka", 249.0, 1));
            o2.addItem(new OrderItem(23L, "Mango Mint Mojito", 149.0, 2));
            orderRepository.save(o2);

            System.out.println("QuickDine DataInitializer: Sample orders seeded successfully into database.");
        }
    }
}
