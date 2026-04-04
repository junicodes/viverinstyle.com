export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
}

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'default-1',
    slug: 'how-to-choose-the-perfect-sofa',
    title: 'How to Choose the Perfect Sofa for Your Living Room',
    excerpt: 'Finding the right sofa is about more than just style. Learn how to balance comfort, durability, and design to find a sofa that truly fits your lifestyle and space.',
    content: `Choosing a sofa is one of the most important furniture decisions you'll make. It's the centrepiece of your living room—where you relax after work, host guests, and spend quality time with family.\n\nHere are the key factors to consider:\n\n**1. Measure Your Space**\nBefore falling in love with a sofa, measure your room. Allow at least 45cm between the sofa and coffee table, and ensure there's enough walkway space around it.\n\n**2. Choose the Right Size**\nA 3-seater sofa (around 200-220cm) suits most living rooms. If you have a larger space, consider an L-shaped or modular configuration.\n\n**3. Consider the Frame**\nHardwood frames (kiln-dried oak, beech, or ash) are the most durable. Avoid softwood or particle board frames—they won't hold up over time.\n\n**4. Test the Cushions**\nHigh-density foam cushions maintain their shape longer. For ultimate luxury, look for a combination of foam and feather filling.\n\n**5. Pick the Right Fabric**\nFor families with kids or pets, performance fabrics like microfibre or crypton are stain-resistant and easy to clean. Velvet and linen are beautiful but require more care.\n\n**6. Think About Your Style**\nMid-century modern, Scandinavian minimal, or classic elegance—your sofa should complement your existing decor, not fight against it.`,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    category: 'Buying Guides',
    readTime: '5 min read',
    date: '2026-03-15',
    author: 'Vivere In Style',
  },
  {
    id: 'default-2',
    slug: 'interior-design-trends-2026',
    title: 'Top Interior Design Trends for Australian Homes in 2026',
    excerpt: 'From warm earth tones to curved furniture and sustainable materials, discover the design trends shaping Australian homes this year.',
    content: `Australian interior design in 2026 is all about warmth, sustainability, and comfort. Here are the trends to watch:\n\n**1. Warm Earth Tones**\nCool greys are giving way to warm terracotta, sand, olive, and burnt sienna. These colours create inviting, grounded spaces.\n\n**2. Curved & Organic Shapes**\nSharp edges are out. Rounded sofas, oval dining tables, and arched mirrors bring softness and flow to interiors.\n\n**3. Sustainable Materials**\nReclaimed wood, recycled metals, and responsibly sourced fabrics are now expected, not just appreciated.\n\n**4. Indoor-Outdoor Living**\nAustralians are blurring the line between inside and out with bi-fold doors, outdoor-grade furniture indoors, and lots of natural light.\n\n**5. Statement Lighting**\nA single sculptural pendant or floor lamp can transform a room. Think oversized, textured, or handcrafted pieces.\n\n**6. Quiet Luxury**\nSubtle quality over loud branding—premium materials, expert craftsmanship, and timeless design speak louder than logos.`,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    category: 'Design Inspiration',
    readTime: '4 min read',
    date: '2026-03-10',
    author: 'Vivere In Style',
  },
  {
    id: 'default-3',
    slug: 'dining-table-guide-shape-size-material',
    title: 'The Ultimate Dining Table Guide: Shape, Size & Material',
    excerpt: 'Round or rectangular? Marble or timber? Our comprehensive guide helps you choose the perfect dining table for your home and lifestyle.',
    content: `Your dining table is where meals become memories. Here's how to choose the right one.\n\n**Shape Matters**\n- **Rectangular** tables are the most versatile, seating 6-10 comfortably. They work well in longer rooms.\n- **Round** tables encourage conversation and suit smaller or square rooms. They have no sharp corners, making them great for families.\n- **Oval** tables offer the best of both—seating capacity of a rectangle with the flow of a circle.\n\n**Size Guide**\nAllow 60cm width per person for comfortable dining. A 6-seater should be at least 180cm long.\n\n**Materials**\n- **Solid timber** is warm and ages beautifully. Oak and walnut are top choices.\n- **Marble** is luxurious and unique—no two pieces are alike. It does require sealing and care.\n- **Glass** visually opens up smaller spaces but shows fingerprints.\n- **Engineered stone** gives you the marble look with better durability.\n\n**Consider Your Lifestyle**\nIf you entertain often, prioritise an extendable table. With young kids, avoid glass tops and sharp corners.`,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    category: 'Buying Guides',
    readTime: '6 min read',
    date: '2026-03-05',
    author: 'Vivere In Style',
  },
  {
    id: 'default-4',
    slug: 'small-space-furniture-ideas',
    title: '10 Clever Furniture Ideas for Small Apartments',
    excerpt: 'Living in a compact space doesn\'t mean sacrificing style. These smart furniture picks maximise every square metre.',
    content: `Small doesn't mean cramped. With the right furniture, a compact apartment can feel spacious and stylish.\n\n**1. Multifunctional Sofa Beds** — Perfect for studio apartments where the living room doubles as a bedroom.\n\n**2. Nesting Tables** — Stack them when not in use, spread them out when guests arrive.\n\n**3. Wall-Mounted Desks** — Fold-down desks free up floor space when you're not working.\n\n**4. Storage Ottomans** — Seating that doubles as hidden storage is a small-space essential.\n\n**5. Slim Console Tables** — Use them behind sofas or in entryways for surface area without bulk.\n\n**6. Round Dining Tables** — They fit more people in less space and improve traffic flow.\n\n**7. Floating Shelves** — Keep floors clear and use vertical space for storage and display.\n\n**8. Transparent Furniture** — Acrylic or glass pieces create visual openness.\n\n**9. Mirrors** — Not furniture, but a large mirror makes any room feel twice the size.\n\n**10. Modular Sofas** — Rearrange sections to fit your space as needed.`,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    category: 'Design Inspiration',
    readTime: '4 min read',
    date: '2026-02-28',
    author: 'Vivere In Style',
  },
  {
    id: 'default-5',
    slug: 'how-to-care-for-leather-furniture',
    title: 'How to Care for Your Leather Furniture: A Complete Guide',
    excerpt: 'Leather furniture is an investment. Keep it looking pristine for decades with these professional care tips.',
    content: `Quality leather furniture can last a lifetime with the right care. Here's how to keep yours looking beautiful.\n\n**Regular Maintenance**\n- Dust weekly with a soft, dry cloth.\n- Vacuum crevices gently with a soft brush attachment.\n- Keep leather away from direct sunlight and heat sources.\n\n**Cleaning**\n- Use a damp (not wet) cloth with mild soap for light cleaning.\n- Always test cleaning products on a hidden area first.\n- Never use harsh chemicals, bleach, or abrasive cleaners.\n\n**Conditioning**\n- Apply a quality leather conditioner every 6-12 months.\n- This prevents drying, cracking, and keeps the leather supple.\n\n**Spill Response**\n- Blot spills immediately—never rub.\n- For ink or stubborn stains, consult a professional leather cleaner.\n\n**Scratches**\n- Light scratches often buff out with your fingers using the natural oils in the leather.\n- Deeper scratches may need professional repair.\n\n**Long-Term Care**\n- Rotate cushions regularly to ensure even wear.\n- Avoid sitting on armrests or the back of the sofa.`,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    category: 'Care & Maintenance',
    readTime: '5 min read',
    date: '2026-02-20',
    author: 'Vivere In Style',
  },
  {
    id: 'default-6',
    slug: 'bedroom-styling-tips',
    title: 'Transform Your Bedroom Into a Luxury Retreat',
    excerpt: 'Simple styling changes that turn an ordinary bedroom into a hotel-worthy sanctuary. No renovation required.',
    content: `You don't need a renovation to create a bedroom that feels like a five-star retreat. These styling tips make a big impact.\n\n**1. Invest in Quality Bedding**\nStart with a great mattress, then layer with high thread-count sheets, a plush duvet, and European pillows.\n\n**2. Create a Headboard Moment**\nAn upholstered headboard instantly elevates the room. Choose velvet or linen in a rich, deep tone.\n\n**3. Layer Your Lighting**\nCombine ambient (overhead), task (bedside lamps), and accent (a candle or LED strip) lighting.\n\n**4. Add Texture**\nMix materials—a chunky knit throw, linen curtains, a wool rug, and smooth ceramic accessories.\n\n**5. Declutter the Nightstand**\nKeep it minimal: a lamp, a book, a small plant. Use drawers for everything else.\n\n**6. Choose a Muted Palette**\nSoft neutrals, muted greens, or dusty blues create a calming atmosphere.\n\n**7. Don't Forget Scent**\nA diffuser or quality candle with lavender, eucalyptus, or sandalwood sets the mood.`,
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
    category: 'Design Inspiration',
    readTime: '4 min read',
    date: '2026-02-15',
    author: 'Vivere In Style',
  },
];
