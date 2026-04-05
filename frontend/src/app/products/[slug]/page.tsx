import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductDetailView } from "@/components/product/ProductDetailView";
import type { StaticProduct } from "@/components/product/ProductDetailView";

/* ================================================================
   STATIC PRODUCT DATA
   ================================================================ */
const products: StaticProduct[] = [
  {
    slug: "noir-velvet",
    name: "Noir Velvet",
    category: "Woody &middot; Oud",
    shortDescription: "A dark, magnetic fragrance for those who command attention without saying a word.",
    description:
      "Noir Velvet opens with a burst of black orchid and spiced saffron, settling into a deep heart of oud wood and suede. The dry-down reveals smoky vanilla, dark amber, and a whisper of incense that lingers for hours. Best worn on cool evenings, date nights, and moments that matter.",
    price: "₹3,749",
    oldPrice: "₹4,999",
    savePercent: "25%",
    badge: "SALE",
    badgeType: "sale",
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
    thumbs: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=200&auto=format&fit=crop",
    ],
    notes: ["Black Orchid", "Oud Wood", "Dark Vanilla", "Saffron", "Incense"],
    details: [
      {
        title: "Description",
        body: "Noir Velvet is RYVEN's signature dark fragrance. Designed for the confident and the bold, it layers rare oud wood with smoky vanilla and amber to create a scent that's impossible to ignore. EDP concentration ensures 8-12 hours of projection.",
      },
      {
        title: "How to Use",
        body: "Apply to pulse points — wrists, neck, behind ears. For maximum longevity, spray on moisturized skin. Do not rub wrists together; let the fragrance develop naturally.",
      },
      {
        title: "Ingredients & Size",
        body: "50ml Eau de Parfum &bull; Alcohol Denat., Fragrance (Parfum), Aqua, Benzyl Benzoate, Coumarin, Limonene, Linalool &bull; Cruelty-free &bull; Made in India",
      },
    ],
    reviews: {
      avg: 4.8,
      total: 124,
      bars: [78, 15, 5, 1, 1],
      list: [
        { name: "Arjun M.", initials: "AM", stars: 5, date: "2 weeks ago", text: "This is the most complimented fragrance I own. My wife noticed it immediately and asked what I was wearing. The oud is smooth, not harsh at all. Lasts a solid 10+ hours on me.", verified: true },
        { name: "Priya S.", initials: "PS", stars: 5, date: "1 month ago", text: "Bought this for my husband's birthday and he absolutely loves it. The projection is incredible — you can smell it from across the room. Very premium feel for the price.", verified: true },
        { name: "Rahul K.", initials: "RK", stars: 4, date: "1 month ago", text: "Great scent, very unique. The dry-down is where it really shines. Took off one star because the opening is a bit strong, but it settles beautifully after 15 minutes.", verified: true },
        { name: "Sneha D.", initials: "SD", stars: 5, date: "2 months ago", text: "I'm a perfume collector and this rivals fragrances 3x the price. The oud-vanilla combo is perfectly balanced. Already ordered a backup bottle.", verified: true },
      ],
    },
  },
  {
    slug: "rose-absolue",
    name: "Rose Absolue",
    category: "Fresh &middot; Floral",
    shortDescription: "An elegant rose-forward scent with dewy petals and a graceful musk finish.",
    description:
      "Rose Absolue captures the first light of a garden at dawn. Opening with Bulgarian rose and dewy petals, the heart reveals white peony and pink pepper. A velvety base of white musk and sheer sandalwood gives it lasting sophistication. Perfect for day events, brunches, and spring wardrobes.",
    price: "₹2,999",
    badge: "NEW",
    badgeType: "new",
    img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
    thumbs: [
      "https://images.unsplash.com/photo-1595425964272-fc617fa71096?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=200&auto=format&fit=crop",
    ],
    notes: ["Damask Rose", "White Peony", "Pink Pepper", "White Musk", "Sandalwood"],
    details: [
      {
        title: "Description",
        body: "Rose Absolue is crafted for those who appreciate timeless floral elegance. Using real Damask rose extract, this scent feels luxurious yet light — never overpowering. A true all-day companion with 6-8 hours of wear.",
      },
      {
        title: "How to Use",
        body: "Spritz on pulse points and let it bloom naturally. Layer with an unscented body lotion for extended wear. Ideal for day wear and warmer months.",
      },
      {
        title: "Ingredients & Size",
        body: "50ml Eau de Parfum &bull; Alcohol Denat., Fragrance (Parfum), Aqua, Citronellol, Geraniol, Hydroxycitronellal, Linalool &bull; Cruelty-free &bull; Made in India",
      },
    ],
    reviews: {
      avg: 4.9,
      total: 89,
      bars: [85, 10, 3, 1, 1],
      list: [
        { name: "Meera R.", initials: "MR", stars: 5, date: "1 week ago", text: "The most beautiful rose fragrance I've ever tried. It's fresh and dewy, not your grandmother's rose perfume. I get compliments every single time I wear it.", verified: true },
        { name: "Ananya T.", initials: "AT", stars: 5, date: "3 weeks ago", text: "Blind bought this based on the notes and I'm so glad I did. The peony and musk base makes it so wearable. My new daily signature scent.", verified: true },
        { name: "Kiran P.", initials: "KP", stars: 5, date: "1 month ago", text: "Gifted this to my mom and she's obsessed. She said it smells like a ₹10,000 perfume. The quality of the rose is outstanding for this price range.", verified: true },
        { name: "Divya N.", initials: "DN", stars: 4, date: "2 months ago", text: "Lovely scent — very elegant and feminine. Only wish it lasted a bit longer on my skin (about 5-6 hours). But the sillage while it lasts is gorgeous.", verified: true },
      ],
    },
  },
  {
    slug: "cedar-smoke",
    name: "Cedar Smoke",
    category: "Woody &middot; Aromatic",
    shortDescription: "A campfire evening captured in a bottle — rugged, warm, and unforgettable.",
    description:
      "Cedar Smoke is built for the adventurer. It opens with crisp bergamot and juniper berries, then deepens into a heart of Atlas cedarwood and birch tar. The base is pure warmth: amber, vetiver, and a hint of leather. This is the scent of mountain lodges and starlit bonfires.",
    price: "₹2,499",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
    thumbs: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200&auto=format&fit=crop",
    ],
    notes: ["Cedarwood", "Birch Tar", "Amber", "Bergamot", "Vetiver"],
    details: [
      {
        title: "Description",
        body: "Cedar Smoke channels raw, rugged masculinity. The birch tar and cedarwood combination creates an authentic smoky-wood character that's both distinctive and deeply wearable. Expect 8-10 hours of strong performance.",
      },
      {
        title: "How to Use",
        body: "Best applied to fabric and pulse points for a smoky trail. Works exceptionally well in cold weather. 2-3 sprays are enough — this one projects.",
      },
      {
        title: "Ingredients & Size",
        body: "50ml Eau de Parfum &bull; Alcohol Denat., Fragrance (Parfum), Aqua, Coumarin, Alpha-Isomethyl Ionone, Limonene &bull; Cruelty-free &bull; Made in India",
      },
    ],
    reviews: {
      avg: 4.7,
      total: 67,
      bars: [72, 18, 7, 2, 1],
      list: [
        { name: "Vikram A.", initials: "VA", stars: 5, date: "5 days ago", text: "This smells EXACTLY like sitting by a campfire in a cedar forest. Never experienced anything like it at this price. The longevity is insane — I could still smell it on my jacket the next day.", verified: true },
        { name: "Amit S.", initials: "AS", stars: 5, date: "2 weeks ago", text: "My go-to winter scent now. The birch tar note is so well blended — smoky without being acrid. Multiple friends have asked me for the name.", verified: true },
        { name: "Rohan G.", initials: "RG", stars: 4, date: "1 month ago", text: "Really unique fragrance. Not for everyone — it's bold and unapologetically woody. I love it but my wife says it's too smoky for her taste.", verified: true },
        { name: "Sanjay M.", initials: "SM", stars: 5, date: "6 weeks ago", text: "Best cedar fragrance in India under ₹5K. Period. The quality of ingredients is evident. The amber dry-down is chef's kiss.", verified: true },
      ],
    },
  },
  {
    slug: "ocean-drift",
    name: "Ocean Drift",
    category: "Fresh &middot; Aquatic",
    shortDescription: "Crisp sea breeze meets bergamot and driftwood — built for hot summer days.",
    description:
      "Ocean Drift is pure coastal energy. A bright opening of sea salt, bergamot, and green apple gives way to a watery heart of lotus and marine accord. The base of driftwood and white amber keeps it grounded and masculine. Your new gym, beach, and everyday summer fragrance.",
    price: "₹1,999",
    badge: "POPULAR",
    badgeType: "new",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
    thumbs: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=200&auto=format&fit=crop",
    ],
    notes: ["Sea Salt", "Bergamot", "Driftwood", "Lotus", "White Amber"],
    details: [
      {
        title: "Description",
        body: "Ocean Drift captures the feeling of a morning walk along the coastline. Fresh, clean, and energizing — it's the kind of scent that makes people lean in closer. Light enough for office wear, vibrant enough for weekends. 5-7 hours of wear.",
      },
      {
        title: "How to Use",
        body: "Spray generously on chest, wrists, and neck. Reapply after 4-5 hours for all-day freshness. Perfect layered with matching body wash or lotion.",
      },
      {
        title: "Ingredients & Size",
        body: "50ml Eau de Parfum &bull; Alcohol Denat., Fragrance (Parfum), Aqua, Limonene, Linalool, Citral &bull; Cruelty-free &bull; Made in India",
      },
    ],
    reviews: {
      avg: 4.6,
      total: 203,
      bars: [65, 22, 8, 3, 2],
      list: [
        { name: "Kunal B.", initials: "KB", stars: 5, date: "3 days ago", text: "Perfect summer fragrance! Fresh, clean, and lasts surprisingly long for an aquatic. I've gone through 2 bottles already this year. RYVEN nailed this one.", verified: true },
        { name: "Riya L.", initials: "RL", stars: 5, date: "1 week ago", text: "Bought this for my boyfriend and now I want a women's version. The sea salt and bergamot combo is addictive. Great office-safe scent too.", verified: true },
        { name: "Deepak V.", initials: "DV", stars: 4, date: "3 weeks ago", text: "Very pleasant fresh scent. Reminds me of expensive aquatic fragrances from Versace. Only downside is it doesn't project as much after 3-4 hours.", verified: true },
        { name: "Pooja K.", initials: "PK", stars: 5, date: "1 month ago", text: "My husband wears this daily and I love it. It's that perfect 'clean guy who smells amazing' scent. Great price for the quality.", verified: true },
      ],
    },
  },
  {
    slug: "amber-nights",
    name: "Amber Nights",
    category: "Oriental &middot; Warm",
    shortDescription: "Rich amber, saffron threads, and tonka bean — a warm evening in a bottle.",
    description:
      "Amber Nights is pure opulence. Opening with Iranian saffron and cardamom, the heart blooms with rich amber resin and dried fruits. The base is a luxurious blend of tonka bean, benzoin, and a touch of oud. This is your celebration scent — weddings, parties, and special occasions.",
    price: "₹3,299",
    oldPrice: "₹4,199",
    savePercent: "21%",
    badge: "SALE",
    badgeType: "sale",
    img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop",
    thumbs: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=200&auto=format&fit=crop",
    ],
    notes: ["Amber", "Saffron", "Tonka Bean", "Cardamom", "Benzoin"],
    details: [
      {
        title: "Description",
        body: "Amber Nights draws from the richness of Middle Eastern perfumery. Warm, sweet, and deeply sensual — it wraps you like a cashmere blanket. The saffron-amber accord is RYVEN's most requested note combination. Expect 10+ hours of beastly performance.",
      },
      {
        title: "How to Use",
        body: "Apply sparingly — 2 sprays to the neck and 1 to the wrist. This is a powerhouse fragrance. Best for evening wear and cooler seasons. Do not over-spray.",
      },
      {
        title: "Ingredients & Size",
        body: "50ml Eau de Parfum &bull; Alcohol Denat., Fragrance (Parfum), Aqua, Coumarin, Benzyl Benzoate, Eugenol, Cinnamal &bull; Cruelty-free &bull; Made in India",
      },
    ],
    reviews: {
      avg: 4.9,
      total: 156,
      bars: [88, 8, 3, 1, 0],
      list: [
        { name: "Nikhil R.", initials: "NR", stars: 5, date: "4 days ago", text: "This is THE Indian luxury fragrance. The saffron note is so authentic — you can tell real saffron was used. I wore this to a wedding and got stopped 6 times asking what I was wearing.", verified: true },
        { name: "Aisha M.", initials: "AM", stars: 5, date: "2 weeks ago", text: "Words cannot describe how good this smells. Sweet, warm, and incredibly long-lasting. I sprayed it at 9am and could still smell it at midnight. Absolutely worth every rupee.", verified: true },
        { name: "Raj P.", initials: "RP", stars: 5, date: "1 month ago", text: "I own 40+ fragrances including Dior, Armani, and Tom Ford. This competes with all of them. The tonka-amber blend is executed flawlessly. RYVEN is seriously underrated.", verified: true },
        { name: "Kavya S.", initials: "KS", stars: 4, date: "6 weeks ago", text: "Beautiful scent but it's very strong — be careful not to overdo it. My only minor issue is the atomizer could be better. The juice itself is pure perfection.", verified: true },
      ],
    },
  },
  {
    slug: "white-tea",
    name: "White Tea",
    category: "Fresh &middot; Clean",
    shortDescription: "Minimalist and calming — white tea leaves, soft linen, and a whisper of jasmine.",
    description:
      "White Tea is RYVEN's cleanest scent. Imagine freshly laundered linen drying in a sunlit garden of jasmine and green tea. The opening is crisp white tea and bergamot, the heart is sheer jasmine and lily of the valley, and the base is soft cedar and clean musk. Universally flattering and endlessly wearable.",
    price: "₹1,499",
    img: "https://images.unsplash.com/photo-1595425964272-fc617fa71096?q=80&w=800&auto=format&fit=crop",
    thumbs: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200&auto=format&fit=crop",
    ],
    notes: ["White Tea", "Jasmine", "Soft Linen", "Bergamot", "Clean Musk"],
    details: [
      {
        title: "Description",
        body: "White Tea is for minimalists who believe less is more. A gentle, comforting scent that never overwhelms — perfect for close encounters and everyday confidence. Unisex appeal with 5-6 hours of soft, skin-close wear.",
      },
      {
        title: "How to Use",
        body: "Spray freely on skin and clothes. This is a close-wear scent — feels intimate and personal. Perfect for office, classroom, or any indoor setting.",
      },
      {
        title: "Ingredients & Size",
        body: "50ml Eau de Parfum &bull; Alcohol Denat., Fragrance (Parfum), Aqua, Linalool, Limonene, Hydroxycitronellal &bull; Cruelty-free &bull; Made in India",
      },
    ],
    reviews: {
      avg: 4.7,
      total: 91,
      bars: [74, 17, 6, 2, 1],
      list: [
        { name: "Tanya G.", initials: "TG", stars: 5, date: "1 week ago", text: "If 'clean' had a smell, this would be it. I wear it every day to work and people always say I smell fresh. It's my comfort scent — calming and beautiful.", verified: true },
        { name: "Varun D.", initials: "VD", stars: 5, date: "3 weeks ago", text: "Amazing unisex fragrance. Both my girlfriend and I share this bottle (she's not happy about it). The jasmine and tea combo is so soothing. Best budget fragrance in India.", verified: true },
        { name: "Ishita C.", initials: "IC", stars: 4, date: "1 month ago", text: "Really lovely and understated. Not a head-turner like Noir Velvet or Amber Nights, but that's the point. It's a 'your skin but better' kind of scent.", verified: true },
        { name: "Manish T.", initials: "MT", stars: 5, date: "2 months ago", text: "I bought the entire RYVEN line and this is the one I reach for most. It's just... pleasant. No fuss, no drama, just a beautifully clean fragrance that makes you feel good.", verified: true },
      ],
    },
  },
];

/* Product lookup map */
const productMap = new Map(products.map((p) => [p.slug, p]));

/* ── Metadata ── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productMap.get(slug);
  if (!product) return { title: "Product Not Found | RYVEN" };
  return {
    title: `${product.name} | RYVEN`,
    description: product.shortDescription,
  };
}

/* Static params for pre-rendering */
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/* ── Page ── */
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productMap.get(slug);

  if (!product) notFound();

  const related = products
    .filter((p) => p.slug !== slug)
    .slice(0, 4)
    .map((p) => ({ slug: p.slug, name: p.name, price: p.price, img: p.img, category: p.category }));

  return <ProductDetailView product={product} related={related} />;
}
