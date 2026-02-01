# Project Rules

## Git Policy
- **NEVER push to remote** - always let the user push manually
- Do not run `git push`, `git push --force`, or any push variants

---

# VAPA Project Guidelines

This document outlines the design system, patterns, and conventions established for the VAPA (Venezuelan-American Petroleum Association) landing page project.

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion (`motion` package)
- **Carousel**: Swiper.js
- **Icons**: Lucide React
- **Architecture**: Atomic Design (atoms, molecules, organisms)

## Tailwind CSS v4 Configuration (REQUIRED)

**This project uses Tailwind CSS v4 with `@theme inline` for Safari compatibility.** Design tokens are exposed as native Tailwind utilities to ensure cross-browser support.

### Why Native Utilities Instead of Arbitrary Values

Safari has issues resolving CSS variables within Tailwind's arbitrary value syntax. For example:

```tsx
// ❌ DON'T - Fails in Safari
className="bg-[var(--color-primary)] text-[var(--color-bg-dark)]"

// ✅ DO - Works in all browsers
className="bg-gold text-dark"
```

### Available Design Token Utilities

All tokens are defined in `globals.css` under `@theme inline`:

#### Colors
| Token | Utility | Value |
|-------|---------|-------|
| Gold (primary) | `bg-gold`, `text-gold`, `border-gold` | `#D4A853` |
| Gold Dark | `bg-gold-dark`, `text-gold-dark` | `#B8923D` |
| Dark (bg) | `bg-dark`, `text-dark` | `#0A1628` |
| Darker | `bg-darker` | `#06101C` |
| Section | `bg-section` | `#0D1E33` |
| Content | `bg-content` | `#1A3352` |
| Card Dark | `bg-card-dark` | `#152D45` |

#### Text Colors
| Token | Utility | Value |
|-------|---------|-------|
| White | `text-white` | `#FFFFFF` |
| Muted | `text-muted` | `#B8C5D3` |
| Secondary | `text-secondary` | `#8899AA` |
| Tertiary | `text-tertiary` | `#6B7A8A` |

#### Border Colors
| Token | Utility | Value |
|-------|---------|-------|
| Border Gold | `border-border-gold` | `#D4A85340` |
| Border Gold Light | `border-border-gold-light` | `#D4A85320` |
| Border Gold Strong | `border-border-gold-strong` | `#D4A85380` |

#### Gold Tints (for hover states)
| Token | Utility | Value |
|-------|---------|-------|
| Tint 10% | `bg-gold-tint-10` | `#D4A85310` |
| Tint 15% | `bg-gold-tint-15` | `#D4A85315` |
| Tint 20% | `bg-gold-tint-20` | `#D4A85320` |
| Tint 30% | `bg-gold-tint-30` | `#D4A85330` |

### Gradient Classes (CSS Classes, not Tailwind)

Gradients cannot be defined in `@theme inline`, so they are CSS classes in `globals.css`:

```tsx
// ✅ Use CSS classes for gradients
className="bg-gradient-gold"       // Gold accent gradient
className="bg-gradient-header"     // Header fade to transparent
className="bg-gradient-hero-overlay"  // Hero section overlay
className="bg-gradient-page-hero"  // Page hero overlay
```

### Safari-Specific Hover Workaround

For hover states that need to change colors in Safari, use React state instead of CSS `:hover`:

```tsx
// ✅ Safari-compatible hover
const [isHovered, setIsHovered] = useState(false);

<Link
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  <span style={{ color: isHovered ? "#D4A853" : undefined }}>
    Link Text
  </span>
</Link>
```

### Adding New Design Tokens

To add new tokens, update `globals.css`:

```css
@theme inline {
  /* Add new color tokens here */
  --color-new-token: #hexvalue;
}
```

Then use as: `bg-new-token`, `text-new-token`, `border-new-token`

## Atomic Design Principles (REQUIRED)

**This project strictly follows Atomic Design methodology.** All components must be organized into atoms, molecules, and organisms.

### Component Hierarchy

```
src/components/
├── atoms/           # Basic building blocks (cannot be broken down further)
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── IconWrapper.tsx
│   └── index.ts
├── molecules/       # Combinations of atoms (reusable patterns)
│   ├── SectionHeader.tsx
│   ├── IconCard.tsx
│   ├── PricingCard.tsx
│   ├── EventCard.tsx
│   ├── PersonCard.tsx
│   ├── AccordionSection.tsx
│   ├── ContactForm.tsx
│   └── index.ts
├── organisms/       # Complex UI sections (page-level components)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── PageHero.tsx
│   ├── AboutSection.tsx
│   ├── EventsSection.tsx
│   ├── CTASection.tsx
│   ├── ParallaxImage.tsx
│   └── index.ts
├── utils/
│   └── animations.ts    # Shared animation variants
└── index.ts             # Barrel exports from all folders
```

### Rules for Creating Components

#### Atoms
- **Definition**: Smallest possible UI elements that cannot be broken down further
- **Examples**: Buttons, badges, icons, form inputs, labels
- **Location**: `src/components/atoms/`
- **Naming**: Descriptive noun (e.g., `Button`, `Badge`, `IconWrapper`)

```tsx
// Example atom: Badge.tsx
export function Badge({ children, animate = true, className = "" }: BadgeProps) {
  // Simple, single-purpose component
}
```

#### Molecules
- **Definition**: Combinations of 2+ atoms that work together as a unit
- **Examples**: Cards, form groups, navigation items, section headers
- **Location**: `src/components/molecules/`
- **Pattern**: Should be reusable across multiple organisms

```tsx
// Example molecule: SectionHeader.tsx
// Combines Badge atom + heading + optional subtitle
export function SectionHeader({ label, title, subtitle, align = "center" }: Props) {
  return (
    <div>
      <Badge>{label}</Badge>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
```

#### Organisms
- **Definition**: Complex, distinct sections of a page composed of molecules and/or atoms
- **Examples**: Headers, footers, hero sections, feature sections, pricing tables
- **Location**: `src/components/organisms/` for shared organisms
- **Page-specific organisms**: `src/app/[page]/organisms/` for page-specific sections

```tsx
// Example organism: HeroSection.tsx
export function HeroSection() {
  return (
    <section>
      <ParallaxImage />
      <Badge>LABEL</Badge>
      <h1>Title</h1>
      <Button>CTA</Button>
    </section>
  );
}
```

### Page Content Organization

For pages with multiple sections, break down the content into organisms:

```
src/app/donations/
├── organisms/
│   ├── TaxBadge.tsx
│   ├── DonationTiersSection.tsx
│   ├── ImpactSection.tsx
│   ├── PaymentMethodsSection.tsx
│   └── index.ts
├── DonationsContent.tsx    # Composes organisms
└── page.tsx                # Main page file
```

### Import Patterns

```tsx
// Import from barrel exports
import { Header, Footer } from "@/components";
import { Button, Badge } from "@/components/atoms";
import { SectionHeader, IconCard } from "@/components/molecules";
import { HeroSection } from "@/components/organisms";

// Page-specific organisms
import { DonationTiersSection, ImpactSection } from "./organisms";
```

### Shared Utilities

Animation variants are centralized in `src/components/utils/animations.ts`:

```tsx
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  fadeIn,
  defaultViewport,
  defaultTransition,
  slowTransition,
  staggerDelay,
} from "@/components/utils/animations";
```

### When to Create New Components

| Scenario | Action |
|----------|--------|
| Repeating UI pattern (3+ times) | Extract to molecule |
| Single-purpose element | Create atom |
| Full page section | Create organism |
| Page-specific section | Create in `app/[page]/organisms/` |
| Shared across pages | Create in `components/organisms/` |

### Refactoring Guidelines

1. **Identify repetition**: If the same pattern appears 3+ times, extract it
2. **Start from atoms**: Build up from the smallest pieces
3. **Use molecules for composition**: Combine atoms into reusable units
4. **Keep organisms focused**: Each organism = one distinct page section
5. **Use shared animations**: Import from `utils/animations.ts`

## Color Palette

All colors are defined as CSS custom properties in `src/app/globals.css`:

### Primary Colors (Gold Accent)
```css
--color-primary: #D4A853        /* Main gold accent */
--color-primary-dark: #B8923D   /* Darker gold variant */
```

### Background Colors (Blue Primary)
```css
--color-bg-dark: #0A1628        /* Main dark blue background */
--color-bg-darker: #06101C      /* Footer/darker sections */
--color-bg-section: #0D1E33     /* Section backgrounds */
```

Additional section background: `#1A3352` for content sections on interior pages.

### Text Colors
```css
--color-text-white: #FFFFFF
--color-text-muted: #B8C5D3     /* Primary body text */
--color-text-secondary: #8899AA /* Secondary text */
--color-text-tertiary: #6B7A8A  /* Subtle text */
```

### Border Colors
```css
--color-border-gold: #D4A85340        /* 25% opacity gold */
--color-border-gold-light: #D4A85320  /* 12% opacity gold */
--color-border-gold-strong: #D4A85380 /* 50% opacity gold */
--color-border-white: #FFFFFF40       /* 25% opacity white */
```

## Mobile-First Approach

**This project follows a mobile-first design philosophy.** Always write styles for mobile first, then add responsive breakpoints for larger screens.

### Breakpoints
- Base (mobile): `< 640px`
- `sm`: `640px+`
- `md`: `768px+`
- `lg`: `1024px+`
- `xl`: `1280px+`
- `2xl`: `1536px+`

### Example Pattern
```tsx
// Mobile-first: base styles for mobile, then scale up
className="text-sm sm:text-base md:text-lg lg:text-xl"
className="px-5 md:px-10 lg:px-20"
className="gap-4 md:gap-6 lg:gap-8"
```

## Animations with Framer Motion

All scroll-triggered animations use Framer Motion's `whileInView` with `viewport={{ once: true }}`.

### Animation Variants

#### Fade In Left (for text entering from left)
```tsx
const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};
```

#### Fade In Right (for text entering from right)
```tsx
const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};
```

#### Fade In Up (for cards, CTAs, bottom sections)
```tsx
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};
```

### Usage Pattern
```tsx
import { motion } from "motion/react";

<motion.div
  variants={fadeInLeft}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6, delay: 0.1 }}
>
  Content here
</motion.div>
```

### Staggered Animations
For lists/grids, use index-based delays:
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    {item.content}
  </motion.div>
))}
```

## Parallax Background Images

**All hero sections with large background images should use the `ParallaxImage` component.**

### ParallaxImage Component
Located at `src/components/ParallaxImage.tsx`

```tsx
import { ParallaxImage } from "@/components";

<section className="relative h-[700px] overflow-hidden">
  <ParallaxImage
    src="/image.jpg"
    alt="Description"
    priority      // For above-the-fold images
    speed={0.2}   // Parallax intensity (0.2-0.4 recommended)
  />

  {/* Gradient overlay - use CSS class for Safari compatibility */}
  <div className="absolute inset-0 bg-gradient-hero-overlay" />

  {/* Content */}
  <div className="absolute ...">
    ...
  </div>
</section>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | Image source URL |
| `alt` | string | required | Alt text for accessibility |
| `priority` | boolean | false | Load image with priority (LCP) |
| `speed` | number | 0.3 | Parallax intensity (0-1) |

## Common Components

Every page should include these layout components:

### Header (`src/components/Header.tsx`)
- Fixed navigation with logo
- Desktop: horizontal nav links + CTA button
- Mobile: hamburger menu with slide-out panel from left
- Uses `AnimatePresence` for mobile menu animations

**Header Variants:**
```tsx
// Solid background (default) - for pages without hero image behind header
<Header variant="solid" activeNav="Home" />

// Gradient fade - for pages where header sits over hero image
// Creates a gradient that fades from solid to transparent at bottom
<Header variant="gradient" activeNav="About" />
```

### Footer (`src/components/Footer.tsx`)
- Logo and tagline
- Navigation columns (Organization, Events, Get Involved)
- Social media links
- Contact information (address, email)
- Copyright notice

### PageHero (`src/components/PageHero.tsx`)
For interior pages with centered hero content:
```tsx
<PageHero
  image="https://example.com/image.jpg"
  imageAlt="Description"
  label="SECTION LABEL"
  title="Page Title"
  subtitle="Page subtitle text"
  height={350}  // Optional, default 350
/>
```

### PersonCard (`src/components/PersonCard.tsx`)
For displaying team members, directors, advisors:
```tsx
<PersonCard
  image="/person.jpg"
  name="John Doe"
  title="President"
  size="medium"  // "small" | "medium" | "large"
  index={0}      // For staggered animations
/>
```

## Page Structure

### Home Page Template
```tsx
import { Header, HeroSection, Footer } from "@/components";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen bg-dark">
      <Header />
      <HeroSection />
      {/* Page-specific sections */}
      <Footer />
    </main>
  );
}
```

### Interior Page Template (with gradient header)
```tsx
import { Header, PageHero, Footer } from "@/components";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen bg-dark">
      <Header variant="gradient" activeNav="About" />
      <PageHero
        image="/hero.jpg"
        imageAlt="Description"
        label="SECTION"
        title="Page Title"
        subtitle="Subtitle"
        height={350}
      />
      {/* Content sections */}
      <Footer />
    </main>
  );
}
```

## Component Patterns

### Section Container
```tsx
<section className="flex flex-col gap-8 md:gap-12 lg:gap-16 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[100px] bg-dark">
```

### Content Section (Interior Pages)
```tsx
<section className="flex flex-col gap-12 md:gap-14 lg:gap-16 px-5 md:px-10 lg:px-20 py-16 md:py-20 lg:py-[80px] bg-content">
```

### Section Headers
```tsx
<div className="flex flex-col gap-2 md:gap-4">
  <span className="text-[10px] md:text-xs font-semibold text-gold tracking-[2px]">
    SECTION LABEL
  </span>
  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white">
    Section Title
  </h2>
</div>
```

### Primary Button
```tsx
<button className="px-6 md:px-9 py-4 md:py-[18px] bg-gold text-dark text-sm md:text-base font-semibold rounded hover:opacity-90 transition-opacity">
  Button Text
</button>
```

### Secondary/Outline Button
```tsx
<button className="px-6 md:px-9 py-4 md:py-[18px] text-white text-sm md:text-base font-medium rounded border border-border-gold-strong hover:bg-white/5 transition-colors">
  Button Text
</button>
```

### Secondary/Outline Button Over Images
When outline buttons appear over background images (hero sections, CTA sections), add backdrop blur for readability:
```tsx
<button className="px-6 md:px-9 py-4 md:py-[18px] text-white text-sm md:text-base font-medium rounded border border-border-gold-strong bg-black/20 backdrop-blur-sm hover:bg-white/10 transition-colors">
  Button Text
</button>
```
Key additions: `bg-black/20 backdrop-blur-sm` creates a subtle frosted glass effect.

### Text Over Images
When muted/secondary text appears over background images, add a drop shadow for readability:
```tsx
<p className="text-muted drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
  Subtitle text here
</p>
```
This creates subtle text separation without changing the color.

### Cards
```tsx
<div className="flex flex-col gap-4 md:gap-5 p-6 md:p-8 lg:p-10 rounded-lg bg-dark">
  {/* Card content */}
</div>
```

## Mobile Carousels

For content that displays as a grid on desktop but needs horizontal scrolling on mobile, use Swiper:

```tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

{/* Mobile Carousel */}
<div className="block md:hidden">
  <Swiper
    modules={[Pagination, Autoplay]}
    spaceBetween={16}
    slidesPerView={1.15}
    pagination={{
      clickable: true,
      bulletClass: "swiper-pagination-bullet !bg-gold !opacity-30",
      bulletActiveClass: "!opacity-100",
    }}
    autoplay={{ delay: 4000, disableOnInteraction: false }}
    className="!pb-10"
  >
    {items.map((item) => (
      <SwiperSlide key={item.id}>
        <Card item={item} />
      </SwiperSlide>
    ))}
  </Swiper>
</div>

{/* Desktop Grid */}
<div className="hidden md:flex gap-4 lg:gap-6">
  {items.map((item) => (
    <Card key={item.id} item={item} />
  ))}
</div>
```

## File Structure

```
src/
├── app/
│   ├── globals.css              # CSS variables, base styles
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Home page
│   ├── donations/
│   │   ├── organisms/           # Page-specific organisms
│   │   │   ├── TaxBadge.tsx
│   │   │   ├── DonationTiersSection.tsx
│   │   │   ├── ImpactSection.tsx
│   │   │   ├── PaymentMethodsSection.tsx
│   │   │   └── index.ts
│   │   ├── DonationsContent.tsx
│   │   └── page.tsx
│   ├── membership/
│   │   ├── organisms/
│   │   │   ├── MembershipPlansSection.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── SponsorsSection.tsx
│   │   │   └── index.ts
│   │   ├── MembershipContent.tsx
│   │   └── page.tsx
│   └── about/
│       ├── history/
│       │   ├── organisms/
│       │   │   ├── MissionSection.tsx
│       │   │   ├── TimelineSection.tsx
│       │   │   ├── VisionSection.tsx
│       │   │   └── index.ts
│       │   ├── HistoryContent.tsx
│       │   └── page.tsx
│       ├── directors/
│       ├── advisory/
│       └── formers/
├── components/
│   ├── atoms/                   # Basic building blocks
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── IconWrapper.tsx
│   │   └── index.ts
│   ├── molecules/               # Reusable component patterns
│   │   ├── SectionHeader.tsx
│   │   ├── IconCard.tsx
│   │   ├── PricingCard.tsx
│   │   ├── EventCard.tsx
│   │   ├── PersonCard.tsx
│   │   ├── AccordionSection.tsx
│   │   ├── ContactForm.tsx
│   │   └── index.ts
│   ├── organisms/               # Complex page sections
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PageHero.tsx
│   │   ├── AboutSection.tsx
│   │   ├── EventsSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── ParallaxImage.tsx
│   │   └── index.ts
│   ├── utils/
│   │   └── animations.ts        # Shared animation variants
│   ├── ui/                      # shadcn/ui components
│   │   └── select.tsx
│   └── index.ts                 # Barrel exports from all folders
```

## Accessibility

- All images must have descriptive `alt` text
- Interactive elements must have proper `aria-labels`
- Maintain color contrast ratios (gold on dark blue passes WCAG AA)
- Mobile menu toggle includes `aria-label="Toggle menu"`

## Performance

- Use `priority` prop on above-the-fold images
- Lazy load below-fold images (default Next.js behavior)
- Use `viewport={{ once: true }}` for scroll animations (animate only once)
- Parallax images are sized at 120% height to prevent gaps during scroll

## Key Design Rules

1. **Gold accent (#D4A853)** is used for:
   - Primary buttons
   - Section labels
   - Active navigation items
   - Decorative borders

2. **Blue backgrounds** create visual hierarchy:
   - `#0A1628` - Main/darkest (header, cards)
   - `#1A3352` - Content sections
   - `#06101C` - Footer

3. **Header gradient variant** should be used when:
   - The page has a hero image immediately below the header
   - Creates seamless blending between header and hero

4. **All hero images must have parallax effect** using the `ParallaxImage` or `PageHero` components
