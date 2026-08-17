import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// Example fruit-tray photos (AI-generated, provided by the client as visual
// placeholders) - not real photos of Rfruits' actual product. Swap for real
// photography before launch; this is purely to make the preview feel real.
const IMG_CLASSIC = "/images/tray-classic.png";
const IMG_TABLE = "/images/tray-table.png";
const IMG_VEGGIE = "/images/tray-veggie.png";

// Serving counts, dimensions, and included-items copy below are illustrative
// placeholders (clearly example data) until the client supplies real product
// specs. allergensInfo/kosherInfo use an honest "to be updated" placeholder
// rather than any implied certification, since that's a factual claim we
// can't make up.
const products = [
  {
    slug: "magash-klasi",
    name: "מגש פירות קלאסי",
    description: "מבחר פירות טריים ועונתיים, סידור קלאסי ואלגנטי המתאים לכל אירוע.",
    images: [IMG_CLASSIC, IMG_TABLE, IMG_VEGGIE],
    category: "מגשי פירות",
    occasionTags: ["יום הולדת", "אירוח ומשפחה", "מתנה מרגשת"],
    whatsIncluded: ["מבחר פירות טריים בעונה", "סידור וחיתוך ידני", "עטיפה מוקפדת"],
    dimensions: "כ-30 ס״מ קוטר (לדוגמה, משתנה לפי גודל)",
    storageInstructions: "מומלץ לשמור בקירור ולהגיש בסמוך למועד ההגשה.",
    prepTimeHours: 24,
    badges: ["הנמכר ביותר"],
    isBestSeller: true,
    basePrice: 149,
    variants: [
      { label: "קטן", price: 149, servesLabel: "8-10 סועדים" },
      { label: "בינוני", price: 219, servesLabel: "12-15 סועדים" },
      { label: "גדול", price: 289, servesLabel: "18-22 סועדים" },
    ],
  },
  {
    slug: "maarz-ishi",
    name: "מארז פירות אישי",
    description: "מארז קומפקטי לאדם אחד, אידיאלי למשרד או ארוחת ביניים בריאה.",
    images: [IMG_CLASSIC, IMG_VEGGIE, IMG_TABLE],
    category: "מארזי פירות",
    occasionTags: ["בריאות ופינוק"],
    whatsIncluded: ["מבחר פירות חתוכים טריים", "אריזה אישית נוחה לנשיאה"],
    dimensions: "כ-15x15 ס״מ",
    storageInstructions: "מומלץ לשמור בקירור עד ההגשה.",
    prepTimeHours: 12,
    badges: [],
    isBestSeller: true,
    basePrice: 99,
    variants: [{ label: "רגיל", price: 99, servesLabel: "סועד 1" }],
  },
  {
    slug: "magash-gadol",
    name: "מגש פירות גדול",
    description: "מגש עשיר ומרשים לאירועים גדולים ומפגשים משפחתיים.",
    images: [IMG_TABLE, IMG_CLASSIC, IMG_VEGGIE],
    category: "מגשי פירות",
    occasionTags: ["אירוח ומשפחה", "אירועים ועסקים"],
    whatsIncluded: ["מבחר פירות טריים מורחב", "סידור וחיתוך ידני", "עטיפה מוקפדת"],
    dimensions: "כ-40 ס״מ קוטר (לדוגמה, משתנה לפי גודל)",
    storageInstructions: "מומלץ לשמור בקירור ולהגיש בסמוך למועד ההגשה.",
    prepTimeHours: 24,
    badges: ["מתאים לאירוח"],
    isBestSeller: true,
    basePrice: 249,
    variants: [
      { label: "גדול", price: 249, servesLabel: "20-25 סועדים" },
      { label: "ענק", price: 349, servesLabel: "30-35 סועדים" },
    ],
  },
  {
    slug: "magash-eruah-yokrati",
    name: "מגש אירוח יוקרתי",
    description: "מגש פרימיום עם מבחר פירות אקזוטיים לאירוח ברמה גבוהה.",
    images: [IMG_TABLE, IMG_VEGGIE, IMG_CLASSIC],
    category: "אירועים ועסקים",
    occasionTags: ["אירועים ועסקים", "מתנה מרגשת"],
    whatsIncluded: ["מבחר פירות אקזוטיים", "סידור פרימיום ידני", "עטיפה מפוארת"],
    dimensions: "כ-45 ס״מ קוטר (לדוגמה)",
    storageInstructions: "מומלץ לשמור בקירור ולהגיש בסמוך למועד ההגשה.",
    prepTimeHours: 24,
    badges: ["מתאים לאירוח"],
    isBestSeller: true,
    basePrice: 399,
    variants: [{ label: "רגיל", price: 399, servesLabel: "25-30 סועדים" }],
  },
  {
    slug: "magash-briut-tivoni",
    name: "מגש בריאות / טבעוני",
    description: "מגש פירות וירקות טבעוני, מתאים לתפריטים בריאים ולדרישות תזונתיות מיוחדות.",
    images: [IMG_VEGGIE, IMG_CLASSIC, IMG_TABLE],
    category: "מגשי פירות",
    occasionTags: ["בריאות ופינוק"],
    whatsIncluded: ["מבחר פירות וירקות טריים", "ללא תוספת סוכר"],
    dimensions: "כ-30 ס״מ קוטר (לדוגמה, משתנה לפי גודל)",
    storageInstructions: "מומלץ לשמור בקירור ולהגיש בסמוך למועד ההגשה.",
    prepTimeHours: 24,
    badges: [],
    isBestSeller: true,
    basePrice: 159,
    variants: [
      { label: "קטן", price: 159, servesLabel: "8-10 סועדים" },
      { label: "גדול", price: 229, servesLabel: "15-18 סועדים" },
    ],
  },
];

const ALLERGENS_TBD = "פרטי אלרגנים יעודכנו בקרוב - צרו קשר לבירור מול העסק.";
const KOSHER_TBD = "פרטי כשרות יעודכנו בקרוב - צרו קשר לבירור מול העסק.";

async function main() {
  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {
        images: p.images,
        occasionTags: p.occasionTags,
        whatsIncluded: p.whatsIncluded,
        dimensions: p.dimensions,
        allergensInfo: ALLERGENS_TBD,
        kosherInfo: KOSHER_TBD,
        storageInstructions: p.storageInstructions,
        prepTimeHours: p.prepTimeHours,
        badges: p.badges,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        images: p.images,
        category: p.category,
        isBestSeller: p.isBestSeller,
        basePrice: p.basePrice,
        occasionTags: p.occasionTags,
        whatsIncluded: p.whatsIncluded,
        dimensions: p.dimensions,
        allergensInfo: ALLERGENS_TBD,
        kosherInfo: KOSHER_TBD,
        storageInstructions: p.storageInstructions,
        prepTimeHours: p.prepTimeHours,
        badges: p.badges,
        variants: {
          create: p.variants,
        },
      },
    });

    const existingVariants = await db.productVariant.findMany({
      where: { product: { slug: p.slug } },
    });
    for (const v of p.variants) {
      const match = existingVariants.find((ev) => ev.label === v.label);
      if (match) {
        await db.productVariant.update({
          where: { id: match.id },
          data: { servesLabel: v.servesLabel, price: v.price },
        });
      }
    }
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
