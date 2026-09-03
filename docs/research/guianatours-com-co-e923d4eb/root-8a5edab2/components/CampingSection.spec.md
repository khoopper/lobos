# CampingSection Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/CampingSection.tsx`
- **Screenshot:** `docs/design-references/guianatours-com-co-e923d4eb/root-8a5edab2/section-camping.png`
- **Interaction model:** **static** (button hover only)

## DOM Structure
`<section>` (`data-id="11044c1"`) → boxed container → two columns:

1. Column `59fafb1` (66%) — a single large square photograph whose widget container carries a **negative top margin**, so the image overflows upward into the previous section.
2. Column `2a7de6c` (33%) — pale-yellow panel with heading, paragraph and button, vertically centred.

## Computed Styles (exact values from getComputedStyle)

### Section
- background: transparent; height **709.98px** at 1440
- **no padding** (`padding: 0`)
- position: relative

### Container
- max-width: **1140px**; margin-inline: auto
- display: flex; flex-direction: row; height 709.98px

### Column 1 — image (`59fafb1`)
- width **759.98px**; height 709.98px; display: flex
- widget container: **`margin: -50px 0 0`** ← the overlap that pulls the photo up over the *Guías expertos* section
- image `${ASSETS}/camping/1024.jpg`, intrinsic **1024 × 1024**
- rendered **759.98 × 759.98px** (square), so it extends 50px above and 0px below the column box
- `display: inline-block; max-width: 100%; aspect-ratio: 1024 / 1024`
- widget `text-align: center`; no border-radius, no shadow

### Column 2 — yellow panel (`2a7de6c`)
- width **379.98px**; height 709.98px
- widget wrap: `background-color: #f4f2be`; `padding: 40px 20px`; `display: flex; align-items: center`
- transition: `background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s`
- Content block starts at x:922 (20px inset), width **339.98px**

### Heading (`h2`)
- text: `Camping`
- font-size: **24px**; line-height: **24px**; font-weight: **700**
- color: **#373435**; text-align: left
- margin: 0 0 12px
- rendered at y:2145, box 340 × 36

### Paragraph
- font-size: **17px**; line-height: **27.2px**; font-weight: 400
- color: **#686c6a**; text-align: left
- margin: 0; width 339.98px; height 135.94px
- rendered at y:2181

### Button
- `<a class="elementor-button elementor-button-link elementor-size-sm">`
- text: `Mira los próximos destinos`
- font-size: **15px**; line-height: **15px**; font-weight: 400; color: #ffffff
- background-color: **#235652**; border-radius: **8px**; padding: **12px 24px**
- widget container **`margin: 30px 0 0`**
- width 246.55px; height 39px; transition 0.3s
- href: `https://guianatours.com.co/categoria-salidas/nuestros-proximos-destinos/`

## States & Behaviors
- **Section:** N/A — no scroll, click or time behaviour, no entrance animation, no parallax.
- **Button hover:** background **#235652 → #183f3c**, `transition: 0.3s`.
- **Image:** no hover effect.

### The overlap (important)
`margin-top: -50px` on the image widget container is the **only** cross-section overlap on the page. It must be preserved at ≥768px and **reset to `0` at ≤767px** (measured: `campingImgWrapMargin` is `-50px 0px 0px` at 1440 and 768, `0px` at 390).

## Assets
- `${ASSETS}/camping/1024.jpg` (1024 × 1024)

## Text Content (verbatim)
- Heading: `Camping`
- Paragraph: `Si quieres acampar en Chingaza con venados, en el páramo, con buenas instalaciones y aparte ver un cielo nocturno lleno de estrellas , te llevamos al interior del Parque.`
  (note the space before the comma after "estrellas" — reproduce exactly)
- Button: `Mira los próximos destinos`

## Responsive Behavior
- **Desktop (1440px):** 2 columns 760 + 380 inside the 1140px container. Image 760 × 760 with −50px top margin.
- **Tablet (768px):** the section goes **full-bleed** — container drops to 100% width, columns become **512 + 256** at x:0 and x:512. Section height 462. Image keeps `margin-top: -50px`.
- **Mobile (390px):** columns **stack**. Image 350 × 350 with `margin-top: 0`. Yellow panel below at 350 wide, keeps `padding: 40px 20px` and `background: #f4f2be`. Section height 711.
- **Breakpoints:** container goes full-bleed at **1024px**; columns stack at **767px**.
