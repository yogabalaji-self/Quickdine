USE quickdine;

CREATE TABLE IF NOT EXISTS foods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DOUBLE NOT NULL,
    description TEXT,
    image VARCHAR(500) NOT NULL,
    rating DOUBLE DEFAULT 4.5,
    is_veg BOOLEAN DEFAULT TRUE,
    available BOOLEAN DEFAULT TRUE
);

DELETE FROM foods;

INSERT INTO foods (name, category, price, description, image, rating, is_veg, available) VALUES
('Crispy Paneer Tikka', 'Starters', 249, 'Cottage cheese cubes marinated in spiced yogurt and grilled to golden perfection with onions and bell peppers.', '/images/foods/paneer-tikka.jpg', 4.8, 1, 1),
('Chicken Reshmi Kebab', 'Starters', 299, 'Tender chicken pieces blended with cream, cheese, and aromatic royal spices, chargrilled on skewers.', '/images/foods/chicken-reshmi-kebab.jpg', 4.9, 0, 1),
('Dahi Ke Kebab', 'Starters', 269, 'Velvety spiced hung curd patties coated with fine breadcrumbs and shallow fried to a crisp golden crust.', '/images/foods/dahi-ke-kebab.jpg', 4.8, 1, 1),
('Amritsari Fish Fry', 'Starters', 349, 'Crispy carom-scented batter-fried fish fillets served with spicy mint coriander dip and pickled onions.', '/images/foods/amritsari-fish-fry.jpg', 4.9, 0, 1),
('Hara Bhara Kebab', 'Starters', 229, 'Wholesome spinach, green peas, and potato cutlets spiced with ginger, green chilies, and tangy chaat masala.', '/images/foods/hara-bhara-kebab.jpg', 4.7, 1, 1),
('Tandoori Malai Chaap', 'Starters', 279, 'Soya chaap skewers steeped in thick cashew cream, cheese, and cardamom before roasting over charcoal.', '/images/foods/tandoori-malai-chaap.jpg', 4.8, 1, 1),
('Smoky Peri-Peri Chicken Wings', 'Starters', 319, 'Crispy fried chicken wings tossed in our signature smoky peri-peri glaze, toasted sesame, and scallions.', '/images/foods/peri-peri-chicken-wings.jpg', 4.9, 0, 1),
('Royal Butter Chicken', 'Main Course', 389, 'Succulent tandoori chicken cooked in rich, creamy tomato gravy with a generous touch of butter and kasuri methi.', '/images/foods/butter-chicken.jpg', 5.0, 0, 1),
('Dal Makhani Grandeur', 'Main Course', 279, 'Black lentils slow-cooked overnight with creamy butter, garlic, and freshly grounded fragrant whole spices.', '/images/foods/dal-makhani.jpg', 4.7, 1, 1),
('Hyderabadi Dum Biryani', 'Main Course', 349, 'Fragrant basmati rice layered with spiced marinated chicken, pure saffron, caramelized onions, and fresh mint.', '/images/foods/hyderabadi-biryani.jpg', 4.9, 0, 1),
('Paneer Lababdar', 'Main Course', 329, 'Soft cottage cheese chunks simmered in an exotic onion-tomato gravy with grated paneer and cashew paste.', '/images/foods/paneer-lababdar.jpg', 4.9, 1, 1),
('Kashmiri Mutton Rogan Josh', 'Main Course', 459, 'Traditional slow-cooked tender goat meat in rich aromatic gravy flavored with Kashmiri chilies, mace, and fennel.', '/images/foods/mutton-rogan-josh.jpg', 5.0, 0, 1),
('Kadhai Chicken Wok Special', 'Main Course', 369, 'Chicken braised in a cast-iron wok with crushed coriander seeds, bell peppers, crunchy onions, and spicy tomato reduction.', '/images/foods/kadhai-chicken.jpg', 4.8, 0, 1),
('Kolhapuri Vegetable Medley', 'Main Course', 269, 'Fiery mixed seasonal vegetables cooked in roasted coconut and sesame paste with regional red chili tadka.', '/images/foods/kolhapuri-veg.jpg', 4.6, 1, 1),
('Lucknowi Royal Veg Dum Biryani', 'Main Course', 299, 'Awadhi style dum biryani infused with kewra, saffron, fresh garden vegetables, mint, and toasted golden cashews.', '/images/foods/veg-dum-biryani.jpg', 4.8, 1, 1),
('Garlic Butter Naan Basket', 'Main Course', 129, 'Tandoor baked fluffy flatbread brushed generously with roasted garlic butter and fresh coriander leaves.', '/images/foods/garlic-naan.jpg', 4.8, 1, 1),
('Artisan Bread Platter (4 Pcs)', 'Main Course', 169, 'Assortment of fresh tandoori butter roti, stuffed paneer kulcha, lachha paratha, and missi roti.', '/images/foods/bread-platter.jpg', 4.7, 1, 1),
('Hot Sizzling Brownie', 'Desserts', 199, 'Warm fudgy chocolate walnut brownie served on a sizzling hot plate with vanilla bean ice cream and chocolate drizzle.', '/images/foods/sizzling-brownie.jpg', 4.9, 1, 1),
('Gulab Jamun with Rabri', 'Desserts', 169, 'Traditional melt-in-the-mouth soft milk dumplings soaked in cardamom rose syrup, garnished with pistachios and rabri.', '/images/foods/gulab-jamun.jpg', 4.8, 1, 1),
('Royal Kesar Pista Kulfi', 'Desserts', 139, 'Dense and creamy traditional malai kulfi richly loaded with saffron strands, crushed pistachios, and slivered almonds.', '/images/foods/kesar-pista-kulfi.jpg', 4.9, 1, 1),
('Rasmalai Supreme (2 Pcs)', 'Desserts', 179, 'Delicate cottage cheese patties soaked in chilled saffron-infused creamy condensed milk with slivered nuts.', '/images/foods/rasmalai.jpg', 5.0, 1, 1),
('Desi Ghee Gajar Ka Halwa', 'Desserts', 189, 'Slow-simmered winter red carrots with pure desi ghee, khoya, roasted cashews, and golden raisins.', '/images/foods/gajar-halwa.jpg', 4.9, 1, 1),
('Mango Mint Mojito', 'Beverages', 149, 'Refreshing fusion of Alphonso mango pulp, fresh crushed mint leaves, lime juice, and chilled sparkling soda.', '/images/foods/mango-mojito.jpg', 4.7, 1, 1),
('Royal Cold Coffee with Ice Cream', 'Beverages', 159, 'Creamy iced brewed coffee blended with chocolate sauce and crowned with a scoop of vanilla bean ice cream.', '/images/foods/cold-coffee.jpg', 4.8, 1, 1),
('Punjabi Masala Chaas', 'Beverages', 89, 'Refreshing spiced churned buttermilk tempered with roasted cumin, black salt, fresh ginger, and mint.', '/images/foods/masala-chaas.jpg', 4.8, 1, 1),
('Rose Falooda Royale', 'Beverages', 189, 'Classic royal dessert beverage layered with fragrant rose syrup, vermicelli, sweet basil seeds, chilled milk, and ice cream.', '/images/foods/rose-falooda.jpg', 4.9, 1, 1),
('Fresh Watermelon Basil Cooler', 'Beverages', 139, 'Hydrating cold-pressed fresh watermelon juice muddled with sweet holy basil, black salt, and a splash of lime.', '/images/foods/watermelon-cooler.jpg', 4.7, 1, 1),
('Royal Masala Chai Pot', 'Beverages', 99, 'Freshly brewed aromatic Indian milk tea simmered with fresh ginger, green cardamom, cloves, and cinnamon.', '/images/foods/masala-chai.jpg', 4.9, 1, 1);
