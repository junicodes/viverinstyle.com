# Living in Style - Demo Data

This folder contains demo data and assets for the Living in Style e-commerce platform.

## Demo Products

The application is pre-seeded with 8 premium furniture products across 5 categories:

### Sofas
- **Cloud Sofa** - $2,499
  - Premium comfort sofa with plush cushions
  - Available in 4 colors: Pearl White, Cloud Grey, Charcoal, Navy Blue
  - Materials: Premium Fabric, Velvet, Linen
  - 10-year warranty, Free delivery, Machine washable covers

### Chairs
- **Oslo Dining Chair** - $399
  - Minimalist Scandinavian design
  - Available in Natural Oak, Walnut, White, Black
  - Materials: Solid Oak, Ash Wood, Beech
  - Ergonomic design, Sustainable timber

- **Luxe Armchair** - $1,299
  - Luxury reading chair with 360° swivel
  - Available in Cloud Grey, Mustard, Navy, Blush Pink
  - Materials: Velvet, Linen, Leather
  - Plush cushioning, Removable covers

### Tables
- **Harmony Dining Table** - $1,899
  - Solid timber dining table (seats 6-8)
  - Available in Natural, Walnut, White Oak
  - Materials: Solid Oak, Walnut, Recycled Timber
  - Expandable, Handcrafted

- **Minimal Work Desk** - $799
  - Clean aesthetic workspace desk
  - Available in White, Natural Oak, Black
  - Materials: Oak Veneer, Solid Oak, Laminate
  - Cable management, Height adjustable

- **Zen Coffee Table** - $649
  - Minimalist living room table
  - Available in Natural, White Marble, Black Oak
  - Materials: Marble, Oak, Glass
  - Storage shelf, Easy clean surface

### Beds
- **Haven Bed Frame** - $1,699
  - Modern sleep sanctuary bed frame
  - Available in Pearl White, Stone Grey, Natural Oak
  - Materials: Upholstered Fabric, Solid Wood, Leather
  - Queen & King sizes, Storage options

### Storage
- **Essence Storage Cabinet** - $899
  - Clean lines storage solution
  - Available in Pure White, Oak, Charcoal
  - Materials: MDF, Solid Wood, Bamboo
  - Adjustable shelves, Soft-close doors

## Features

All products include:
- Free delivery Australia-wide
- 10-year warranty (5-year for some items)
- 120-day trial period
- Australian made (where applicable)
- Sustainable materials
- Customer reviews and ratings

## Customization Options

Each product supports:
- Color selection
- Material selection
- Custom dimensions (width, depth, height)
  - Adjustable ±20% from base dimensions
  - Real-time 3D preview

## Database Structure

Products are stored in Supabase KV store with the following structure:

```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  colors: string[];
  materials: string[];
  dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}
```

## Usage

The demo data is automatically seeded when the application first loads. The `/make-server-35e920f3/init-demo` endpoint checks if products already exist before seeding to avoid duplicates.

## Australian Market Focus

- Prices in AUD
- Melbourne-based company address
- Australian phone number format
- AEST business hours
- Australia-wide delivery
- Sustainable Australian timber
- Supporting local artisans
