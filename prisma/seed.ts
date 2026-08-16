import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const products = [
  {
    slug: "magash-klasi",
    name: "מגש פירות קלאסי",
    description: "מבחר פירות טריים ועונתיים, סידור קלאסי ואלגנטי המתאים לכל אירוע.",
    images: ["/images/placeholder-tray-1.jpg"],
    category: "מגשי פירות",
    isBestSeller: true,
    basePrice: 149,
    variants: [
      { label: "קטן", price: 149 },
      { label: "בינוני", price: 219 },
      { label: "גדול", price: 289 },
    ],
  },
  {
    slug: "maarz-ishi",
    name: "מארז פירות אישי",
    description: "מארז קומפקטי לאדם אחד, אידיאלי למשרד או ארוחת ביניים בריאה.",
    images: ["/images/placeholder-tray-2.jpg"],
    category: "מארזי פירות",
    isBestSeller: true,
    basePrice: 99,
    variants: [{ label: "רגיל", price: 99 }],
  },
  {
    slug: "magash-gadol",
    name: "מגש פירות גדול",
    description: "מגש עשיר ומרשים לאירועים גדולים ומפגשים משפחתיים.",
    images: ["/images/placeholder-tray-3.jpg"],
    category: "מגשי פירות",
    isBestSeller: true,
    basePrice: 249,
    variants: [
      { label: "גדול", price: 249 },
      { label: "ענק", price: 349 },
    ],
  },
  {
    slug: "magash-eruah-yokrati",
    name: "מגש אירוח יוקרתי",
    description: "מגש פרימיום עם מבחר פירות אקזוטיים לאירוח ברמה גבוהה.",
    images: ["/images/placeholder-tray-4.jpg"],
    category: "אירועים ועסקים",
    isBestSeller: true,
    basePrice: 399,
    variants: [{ label: "רגיל", price: 399 }],
  },
  {
    slug: "magash-briut-tivoni",
    name: "מגש בריאות / טבעוני",
    description: "מגש פירות וירקות טבעוני, מתאים לתפריטים בריאים ולדרישות תזונתיות מיוחדות.",
    images: ["/images/placeholder-tray-5.jpg"],
    category: "מגשי פירות",
    isBestSeller: true,
    basePrice: 159,
    variants: [
      { label: "קטן", price: 159 },
      { label: "גדול", price: 229 },
    ],
  },
];

async function main() {
  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        images: p.images,
        category: p.category,
        isBestSeller: p.isBestSeller,
        basePrice: p.basePrice,
        variants: {
          create: p.variants,
        },
      },
    });
  }

  await db.adminUser.upsert({
    where: { email: "admin@rfruits.co.il" },
    update: {},
    create: {
      email: "admin@rfruits.co.il",
      passwordHash: await bcrypt.hash("changeme", 10),
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
