import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const categoriesData = [
  {
    name: 'Dresses',
    description: 'Breathtaking evening gowns, silk cocktail dresses, and couture silhouettes.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Abayas',
    description: 'Exquisite modern and traditional luxury abayas with intricate gold threadwork.',
    image: 'https://images.unsplash.com/photo-1585885747683-16a3f912c9c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hijabs',
    description: 'Premium mulberry silk, lightweight modal, and pleated chiffon modest headpieces.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Handbags',
    description: 'Handcrafted Italian full-grain leather bags, clutches, and gold-chain crossbody totes.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Shoes',
    description: 'Stiletto pumps, jewel-encrusted evening sandals, and velvet mules.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jewelry',
    description: '18k gold vermeil, natural pearls, diamond pavé accents, and heirloom cuffs.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Accessories',
    description: 'Fine silk scarves, gold-buckle waist belts, sunglasses, and fragrance misters.',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'New Arrivals',
    description: 'Our most recent runway releases, freshly styled for the contemporary muse.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
];

const importData = async () => {
  try {
    console.log('Clearing existing database collections...');
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'Lady Victoria',
      email: 'admin@luxeladies.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+1 (555) 890-4321',
      address: {
        street: '740 Park Avenue, Penthouse 12',
        city: 'New York',
        state: 'NY',
        postalCode: '10021',
        country: 'United States',
      },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });

    const customerUser = await User.create({
      name: 'Sophia Laurent',
      email: 'customer@luxeladies.com',
      password: 'customerpassword123',
      role: 'customer',
      phone: '+1 (555) 234-5678',
      address: {
        street: '128 Beverly Hills Boulevard',
        city: 'Beverly Hills',
        state: 'CA',
        postalCode: '90210',
        country: 'United States',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    console.log('Seeding Categories...');
    const createdCategories = await Category.insertMany(categoriesData);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('Seeding Products...');
    const rawProducts = [
      // 1. Dresses
      {
        name: 'Midnight Navy Silk Evening Gown',
        description: 'Draped in pure liquid mulberry silk, this floor-length navy evening gown features subtle gold bullion shoulder embellishments and a structured cowl neckline.',
        category: categoryMap['Dresses'],
        categoryName: 'Dresses',
        price: 495.0,
        discountPrice: 420.0,
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Midnight Navy', 'Emerald Green'],
        material: '100% Heavy Silk Charmeuse',
        countInStock: 12,
        rating: 4.9,
        numReviews: 8,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        careInstructions: 'Specialist dry clean only. Preserve on padded hanger.',
      },
      {
        name: 'Aurelia Gold Brocade Cocktail Dress',
        description: 'Woven with metallic champagne threads in an intricate floral damask pattern. Cut with an architectural A-line silhouette that radiates regal poise.',
        category: categoryMap['Dresses'],
        categoryName: 'Dresses',
        price: 380.0,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['S', 'M', 'L'],
        colors: ['Champagne Gold', 'Royal Blue'],
        material: 'French Brocade & Organza Lining',
        countInStock: 8,
        rating: 4.8,
        numReviews: 5,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        careInstructions: 'Dry clean only. Cool iron on reverse.',
      },
      {
        name: 'Celeste Pleated Chiffon Maxi Dress',
        description: 'Airy midnight navy pleated chiffon cascades effortlessly from a delicate halter neckline adorned with polished gold hardware.',
        category: categoryMap['Dresses'],
        categoryName: 'Dresses',
        price: 320.0,
        discountPrice: 285.0,
        images: [
          'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Midnight Navy', 'Dusty Rose'],
        material: 'Fine Italian Chiffon',
        countInStock: 14,
        rating: 4.7,
        numReviews: 6,
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: true,
        careInstructions: 'Hand wash cold or dry clean.',
      },

      // 2. Abayas
      {
        name: 'Royal Noor Hand-Embroidered Abaya',
        description: 'Crafted from premium Japanese Crepe, adorned with handmade bullion gold thread embroidery along the cuffs and sweeping lapels.',
        category: categoryMap['Abayas'],
        categoryName: 'Abayas',
        price: 450.0,
        discountPrice: 395.0,
        images: [
          'https://images.unsplash.com/photo-1585885747683-16a3f912c9c5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['52', '54', '56', '58', '60'],
        colors: ['Deep Navy', 'Jet Black', 'Rich Onyx'],
        material: 'Premium Japanese Crepe & 24k Gold Threading',
        countInStock: 15,
        rating: 5.0,
        numReviews: 12,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        careInstructions: 'Professional dry clean only. Steam gently.',
      },
      {
        name: 'Zahra Velvet Kimono Abaya',
        description: 'A lavish velvet open-front abaya in rich deep midnight blue, accented with hammered antique gold toggles and silk tassel trims.',
        category: categoryMap['Abayas'],
        categoryName: 'Abayas',
        price: 360.0,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['54', '56', '58'],
        colors: ['Midnight Velvet Navy', 'Golden Camel'],
        material: 'Plush Micro-Velvet & Satin Lining',
        countInStock: 7,
        rating: 4.9,
        numReviews: 7,
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        careInstructions: 'Dry clean only. Do not iron directly on velvet pile.',
      },

      // 3. Hijabs
      {
        name: 'Luxe Mulberry Silk Shawl Hijab',
        description: 'Feather-light 100% pure Mulberry silk with a luminous subtle sheen and hand-rolled gold edges. Non-slip weave for all-day comfort.',
        category: categoryMap['Hijabs'],
        categoryName: 'Hijabs',
        price: 75.0,
        discountPrice: 65.0,
        images: [
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['One Size (75 x 190 cm)'],
        colors: ['Navy Sheen', 'Champagne Lustre', 'Golden Sand', 'Pearl White'],
        material: 'Grade 6A Mulberry Silk (16 Momme)',
        countInStock: 30,
        rating: 5.0,
        numReviews: 14,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        careInstructions: 'Hand wash gently with silk detergent, line dry in shade.',
      },
      {
        name: 'Gilded Pleated Modal Hijab',
        description: 'Ultra-soft micro modal featuring subtle micro-pleats tipped with metallic gold pigment. Breathable, elegant, and effortless to style.',
        category: categoryMap['Hijabs'],
        categoryName: 'Hijabs',
        price: 45.0,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['One Size (80 x 200 cm)'],
        colors: ['Royal Navy', 'Honey Gold', 'Caramel'],
        material: '100% Organic Austrian Modal',
        countInStock: 25,
        rating: 4.8,
        numReviews: 9,
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        careInstructions: 'Machine wash delicate cycle in laundry bag.',
      },

      // 4. Handbags
      {
        name: 'The Sovereign Quilted Leather Flap Bag',
        description: 'Supple Italian calfskin in deep midnight navy with diamond matelassé quilting, complemented by a substantial polished 18k gold lock and sliding chain strap.',
        category: categoryMap['Handbags'],
        categoryName: 'Handbags',
        price: 620.0,
        discountPrice: 550.0,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['Medium', 'Large'],
        colors: ['Navy Blue / Gold Hardware', 'Black / Gold Hardware'],
        material: 'Full-Grain Italian Calfskin Leather',
        countInStock: 6,
        rating: 5.0,
        numReviews: 11,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        careInstructions: 'Store in protective dust bag. Condition with neutral leather balm.',
      },
      {
        name: 'Palais Minaudière Gold Evening Clutch',
        description: 'A sculptural brass hardcase clutch dipped in high-shine 24k gold, lined in midnight blue velvet. Accommodates standard smartphones and evening essentials.',
        category: categoryMap['Handbags'],
        categoryName: 'Handbags',
        price: 420.0,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['One Size (20 x 12 x 5 cm)'],
        colors: ['Mirror Gold', 'Brushed Champagne'],
        material: 'Handcrafted Polished Brass & Velvet Lining',
        countInStock: 8,
        rating: 4.9,
        numReviews: 8,
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        careInstructions: 'Buff with microfibre jewelry cloth to remove fingerprints.',
      },

      // 5. Shoes
      {
        name: 'Dynasty 105 Satin & Crystal Pumps',
        description: 'Exquisite pointed-toe stiletto pumps in navy blue Italian duchesse satin, adorned with a signature crystal brooch reminiscent of royal tiaras.',
        category: categoryMap['Shoes'],
        categoryName: 'Shoes',
        price: 490.0,
        discountPrice: 440.0,
        images: [
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['36 EU', '37 EU', '38 EU', '39 EU', '40 EU', '41 EU'],
        colors: ['Navy Satin', 'Champagne Gold Satin'],
        material: 'Italian Silk Satin, Swarovski Crystal Buckle, Leather Sole',
        countInStock: 10,
        rating: 4.9,
        numReviews: 7,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        careInstructions: 'Protect with rain/stain repellent spray designed for silk.',
      },
      {
        name: 'Seraphina Sculpted Gold Heel Mules',
        description: 'Striking open-back mules featuring a hand-carved baroque gold pillar heel and supple midnight leather strap across the arch.',
        category: categoryMap['Shoes'],
        categoryName: 'Shoes',
        price: 375.0,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['37 EU', '38 EU', '39 EU', '40 EU'],
        colors: ['Deep Navy', 'Metallic Gold'],
        material: 'Soft Nappa Leather & Metal Heel',
        countInStock: 9,
        rating: 4.8,
        numReviews: 5,
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        careInstructions: 'Clean leather with damp soft cloth.',
      },

      // 6. Jewelry
      {
        name: 'The Empress 18k Gold & Sapphire Necklace',
        description: 'A bespoke statement collar cast in 18-karat gold vermeil, cradling a certified laboratory-grown deep royal blue sapphire surrounded by sparkling pavé zirconia.',
        category: categoryMap['Jewelry'],
        categoryName: 'Jewelry',
        price: 580.0,
        discountPrice: 510.0,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['16 inch + 2 inch extender'],
        colors: ['Yellow Gold / Royal Sapphire'],
        material: '18K Heavy Gold Vermeil over 925 Sterling Silver',
        countInStock: 10,
        rating: 5.0,
        numReviews: 16,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        careInstructions: 'Keep dry and avoid perfume contact. Store in velvet pouch.',
      },
      {
        name: 'Baroque Pearl Drop Chandelier Earrings',
        description: 'Lustrous natural South Sea baroque freshwater pearls suspended from geometric 18k gold vermeil arches. Each pearl is uniquely formed by nature.',
        category: categoryMap['Jewelry'],
        categoryName: 'Jewelry',
        price: 240.0,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['One Size (5 cm drop)'],
        colors: ['Gold / Pearl Cream'],
        material: 'Natural Baroque Pearls & 18K Gold Vermeil',
        countInStock: 18,
        rating: 4.9,
        numReviews: 10,
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        careInstructions: 'Wipe with soft damp cloth after wearing.',
      },

      // 7. Accessories
      {
        name: 'Atelier Silk Twill Monogram Scarf',
        description: 'A 90x90cm Italian silk twill square featuring an elaborate navy, cream, and gold cartouche border. Timeless styling around the neck, hair, or handbag handle.',
        category: categoryMap['Accessories'],
        categoryName: 'Accessories',
        price: 195.0,
        discountPrice: 165.0,
        images: [
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['90 x 90 cm'],
        colors: ['Navy & Gilded Gold', 'Pearl & Champagne'],
        material: '100% Silk Twill with Hand-Rolled Edges',
        countInStock: 22,
        rating: 4.8,
        numReviews: 9,
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        careInstructions: 'Dry clean only.',
      },
      {
        name: 'Iconic Gold-Link Waist Belt',
        description: 'Heavy polished gold chain links connected to a navy leather accent tab. Designed to cinch fluid abayas, dresses, and tailored trench coats.',
        category: categoryMap['Accessories'],
        categoryName: 'Accessories',
        price: 185.0,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['S (65-75cm)', 'M (75-85cm)', 'L (85-95cm)'],
        colors: ['Gold / Navy Tab'],
        material: 'Electroplated Solid Brass & Box Calf Leather',
        countInStock: 14,
        rating: 4.9,
        numReviews: 6,
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: false,
        careInstructions: 'Store flat in storage box.',
      },

      // 8. New Arrivals
      {
        name: 'L’Étoile Organza Cape Gown',
        description: 'Dramatic flowing capelet in sheer gold-dusted navy organza over a tailored sweetheart column dress. The pinnacle of high-society gala fashion.',
        category: categoryMap['New Arrivals'],
        categoryName: 'New Arrivals',
        price: 680.0,
        discountPrice: 590.0,
        images: [
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Starlight Navy & Gold'],
        material: 'Silk Organza & Stretch Crepe Underlay',
        countInStock: 5,
        rating: 5.0,
        numReviews: 4,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        careInstructions: 'Couture dry clean only.',
      },
      {
        name: 'Gilded Twilight Structured Blazer Dress',
        description: 'Sharply tailored double-breasted tuxedo dress crafted from navy wool-silk with peak lapels tipped in pure gold lamé, fastened with crested buttons.',
        category: categoryMap['New Arrivals'],
        categoryName: 'New Arrivals',
        price: 520.0,
        discountPrice: null,
        images: [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
        ],
        sizes: ['S', 'M', 'L'],
        colors: ['Navy / Gold Trim'],
        material: 'Super 120s Wool & Silk Lamé',
        countInStock: 8,
        rating: 4.9,
        numReviews: 3,
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        careInstructions: 'Dry clean only.',
      },
    ];

    const createdProducts = await Product.insertMany(rawProducts);

    console.log('Seeding Sample Reviews...');
    const sampleReviews = [
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        product: createdProducts[0]._id, // Midnight Navy Silk Evening Gown
        rating: 5,
        title: 'Beyond breathtaking in person',
        comment: 'The drape of the silk is out of this world! I wore this to the opera gala in Paris and received countless compliments all night. The gold embroidery on the shoulders is subtle yet unmistakably luxurious.',
        isVerifiedPurchase: true,
      },
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        product: createdProducts[3]._id, // Royal Noor Abaya
        rating: 5,
        title: 'Heirloom craftsmanship',
        comment: 'The weight of the Japanese crepe is perfection. It hangs with such majesty and the gold threadwork glimmers beautifully in low evening lighting.',
        isVerifiedPurchase: true,
      },
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        product: createdProducts[7]._id, // Quilted Leather Flap Bag
        rating: 5,
        title: 'Comparable to the highest Parisian fashion houses',
        comment: 'Leather smells incredible and the gold chain has proper substantial weight. Luxe Ladies has become my favorite luxury destination.',
        isVerifiedPurchase: true,
      },
    ];

    await Review.insertMany(sampleReviews);

    console.log('Seeding Initial Orders for Admin metrics...');
    await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          name: createdProducts[0].name,
          quantity: 1,
          image: createdProducts[0].coverImage,
          price: createdProducts[0].discountPrice || createdProducts[0].price,
          size: 'M',
          color: 'Midnight Navy',
          product: createdProducts[0]._id,
        },
        {
          name: createdProducts[7].name,
          quantity: 1,
          image: createdProducts[7].coverImage,
          price: createdProducts[7].discountPrice || createdProducts[7].price,
          size: 'Medium',
          color: 'Navy Blue / Gold Hardware',
          product: createdProducts[7]._id,
        },
      ],
      shippingAddress: {
        fullName: 'Sophia Laurent',
        street: '128 Beverly Hills Boulevard',
        city: 'Beverly Hills',
        state: 'CA',
        postalCode: '90210',
        country: 'United States',
        phone: '+1 (555) 234-5678',
      },
      paymentMethod: 'Credit Card',
      itemsPrice: 970.0,
      taxPrice: 77.6,
      shippingPrice: 0.0,
      totalPrice: 1047.6,
      isPaid: true,
      paidAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      orderStatus: 'Delivered',
      trackingNumber: 'LUXE-78291044',
      deliveredAt: new Date(Date.now() - 86400000 * 1),
    });

    await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          name: createdProducts[3].name,
          quantity: 1,
          image: createdProducts[3].coverImage,
          price: createdProducts[3].discountPrice || createdProducts[3].price,
          size: '56',
          color: 'Deep Navy',
          product: createdProducts[3]._id,
        },
      ],
      shippingAddress: {
        fullName: 'Sophia Laurent',
        street: '128 Beverly Hills Boulevard',
        city: 'Beverly Hills',
        state: 'CA',
        postalCode: '90210',
        country: 'United States',
        phone: '+1 (555) 234-5678',
      },
      paymentMethod: 'Credit Card',
      itemsPrice: 395.0,
      taxPrice: 31.6,
      shippingPrice: 0.0,
      totalPrice: 426.6,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'Processing',
      trackingNumber: 'LUXE-99182301',
    });

    console.log('✅ Luxe Ladies Database seeded successfully!');
    console.log('Admin login: admin@luxeladies.com / adminpassword123');
    console.log('Customer login: customer@luxeladies.com / customerpassword123');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

importData();
