# ProximosDestinos Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/ProximosDestinos.tsx`
- **Screenshot:** `docs/design-references/guianatours-com-co-e923d4eb/root-8a5edab2/section-destinos.png`
- **Interaction model:** static (the cards themselves are hover-driven — see `ProductCard.spec.md`)
- **Depends on:** `ProductCard.tsx`

## DOM Structure
`<section>` (`data-id="a3125aa"`) → boxed container → heading `<h2>` → `<ul class="products">` grid with six `<li class="product">`.

## Computed Styles (exact values from getComputedStyle)

### Section
- background-color: **#fbfaec**
- padding: **10px 20px 40px**
- height 831.72px at 1440
- position: relative

### Container
- max-width: **1140px**; margin-inline: auto
- display: flex; flex-direction: column

### Heading (`h2.elementor-heading-title`)
- text: `Nuestros próximos destinos`
- font-size: **24px**; line-height: **24px**; font-weight: **700**
- color: **#373435**
- text-align: **center**
- margin: 0 0 12px
- width 1120px (container minus the column's own 10px insets)

### Grid (`ul.products`)
- display: **grid**
- grid-template-columns: `346.656px 346.672px 346.656px` → `repeat(3, minmax(0, 1fr))`
- gap: **40px**
- margin: 0 0 17px
- width 1120px; height 688.72px
- list-style: none; padding: 0

## States & Behaviors
- **Section itself:** N/A — no scroll, click or time behaviour. No entrance animation (verified: no `elementor-invisible`, no IntersectionObserver).
- **Cards:** hover behaviour is fully specified in `ProductCard.spec.md`.

## Assets
- Six product image pairs under `${ASSETS}/products/` (see `content.ts` → `PRODUCTS`).

## Text Content (verbatim)
Heading: `Nuestros próximos destinos`
Card content: see `ProductCard.spec.md`.

## Responsive Behavior
- **Desktop (≥1024px):** 3 columns, tracks 346.66px, gap 40px. Section height 832px.
- **Tablet (768px):** **2 columns**, tracks 334px, gap 40px. Section height 1173px.
- **Mobile (390px):** **1 column**, track 330px, gap 40px. Section height 2253px.
- **Breakpoints:** 3 → 2 columns at **1024px** (Kadence `grid-lg-col-3`); 2 → 1 column at **576px** (Kadence `grid-sm-col-2`).
- Section padding (`10px 20px 40px`) and background (#fbfaec) are unchanged at every width.
