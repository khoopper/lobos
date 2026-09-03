# Behaviour Bible — guianatours.com.co/

Findings from the mandatory interaction sweep (scroll / click / hover / responsive) at 1440, 768 and 390px.

## Scroll sweep

| Observation | Result |
| --- | --- |
| Header changes on scroll? | **No.** `#masthead` is `position: absolute; top: 0; z-index: 100`. It carries the class `kadence-sticky-header` but sticky never activates: at `scrollY = 900` the header's viewport `top` is `-900` and no `.item-is-fixed` / `.item-is-stuck` element exists anywhere in the DOM. The header simply scrolls out of view. |
| Entrance animations on viewport enter? | **No.** No `elementor-invisible`, no `data-settings` with `animation`, no IntersectionObserver-driven reveals. Sections are painted at full opacity from load. |
| Scroll-snap? | **No.** No `scroll-snap-type` on any container. |
| Parallax layers? | **No.** Hero background is a plain `background-size: cover` div inside the swiper slide, no `background-attachment: fixed`, no transform on scroll. |
| Smooth-scroll library? | **No.** No `.lenis`, no `.locomotive-scroll`, no custom scroll wrapper. Native browser scrolling. |
| Scroll-driven tab/accordion switching? | **No.** The page has no tabbed or accordion content. |
| Lazy loading | WP Rocket `lazyload.min.js` swaps `data-src` → `src` and adds `.lazyloaded`. Purely a loading optimisation, no visual transition. Reproduce with `next/image` defaults (`loading="lazy"` below the fold, `priority` on the hero). |

**Conclusion: the page has no scroll-driven behaviour at all.** The only motion on the page is the hero autoplay and CSS hover transitions.

## Hero slider (`f2b8b96` → Elementor Slides widget `9c99a12`)

Raw `data-settings`:

```json
{"navigation":"both","autoplay":"yes","pause_on_hover":"yes","pause_on_interaction":"yes",
 "autoplay_speed":5000,"infinite":"yes","transition":"slide","transition_speed":500}
```

- **INTERACTION MODEL: time-driven (autoplay) + click-driven (arrows).**
- 4 slides, infinite loop, advances every **5000ms**, slide transition **500ms**, `transition: slide` (horizontal translate).
- Autoplay **pauses on hover** and **stops permanently on user interaction** (`pause_on_interaction: yes`).
- `navigation: "both"` = arrows **and** pagination dots. Only the arrows are visible in the rendered output — the pagination container renders empty (`elementor-pagination-position-inside` with no bullets painted). Reproduce arrows only.
- Arrows: 25×25px, `font-size: 25px`, colour `rgba(237, 237, 237, 0.9)`, `position: absolute; top: 50%; transform: translateY(-12.5px)`, `left: 10px` / `right: 10px`, `z-index: 1`. Icon = Elementor `eicon-chevron-left` / `-right` (1000×1000 viewBox).
- Each slide is a link: the whole `.swiper-slide-inner` is an `<a href="…/categoria-salidas/nuestros-proximos-destinos/">`. The "button" inside is a `<div>`, not a nested anchor.
- **No overlay tint.** `.elementor-background-overlay` does not exist; `.swiper-slide-bg` has `opacity: 1`, `filter: none`, `mix-blend-mode: normal`. The dark look comes from the photographs themselves. Section fallback background is `#183f3c`.

## Click sweep

| Element | Behaviour |
| --- | --- |
| Hero arrows | Advance/rewind one slide, 500ms slide transition. |
| Hero slide (whole inner) | Navigates to `/categoria-salidas/nuestros-proximos-destinos/`. |
| Nav links | Plain navigation. No dropdowns — no `.menu-item-has-children` in the primary menu except the cart item. |
| Cart icon (desktop) | Link to `/carrito/`; hovering opens an empty mini-cart dropdown. Badge shows `0`. |
| Cart icon (mobile) | `<button data-toggle-target="#cart-drawer">` — opens a right-side slide-in drawer. |
| Hamburger (≤1024px) | `<button id="mobile-toggle" data-toggle-target="#mobile-drawer">` — opens a right-side slide-in drawer with the 4 nav links; adds `showing-popup-drawer-from-right` to `<body>`. Animation `fade`. |
| Product card | Image + title link to the product page; the "Ver salida" button is a WooCommerce ajax add-to-cart. |
| Gallery items | `data-elementor-open-lightbox="yes"` slideshow — would open Elementor's lightbox. Non-functional in production because the gallery never renders. |
| Footer form | POSTs to Elementor Forms (`form_id: ece7069`). Fields: `form_fields[name]` (required), `form_fields[email]` (required), submit "Suscribirme". |
| Trustindex slider | Auto-advances every 6s (`data-pager-autoplay-timeout="6"`), layout id 5, category `slider`, 4 columns. "Leer más" expands truncated review text (`ti-review-text-mode-readmore`). |

**No tabs, no pills, no modals, no accordions, no cycling content anywhere else on the page.**

## Hover sweep

Exact rules lifted from the live stylesheets.

### Product card (`ul.products.woo-archive-action-on-hover.woo-archive-image-hover-zoom li.product`)

Three things happen simultaneously on `:hover` / `:focus-within`:

```css
li.product:hover .entry-content-wrap  { transform: translateY(-2rem); }
li.product:hover .product-action-wrap { bottom: -0.8rem; opacity: 1; }
.woo-archive-image-hover-zoom .woocommerce-loop-product__link:hover .attachment-woocommerce_thumbnail {
  opacity: 1; transform: scale(1.07);
}
```

Resting state and transitions:

| Element | Rest | Hover | Transition |
| --- | --- | --- | --- |
| `.product-details` (`.entry-content-wrap`) | `transform: none` | `translateY(-2rem)` = −32px | `transform .3s cubic-bezier(.17,.67,.35,.95)` |
| `.product-action-wrap` | `opacity: 0; bottom: -32px` | `opacity: 1; bottom: -12.8px` | `opacity .3s cubic-bezier(.17,.67,.35,.95)` |
| primary image | `scale(1)` | `scale(1.07)` | inherits the link's `.1s linear` |
| `.secondary-product-image` | `opacity: 0` (absolute, `object-fit: cover`, `min-height: 100%`) | `opacity: 1` | `opacity .4s, transform 2s cubic-bezier(0,0,.4,1.1)` |

The card itself has `overflow: hidden`, so the button sliding up from below is clipped until it enters the card box.

### Buttons

```css
.woocommerce ul.products.woo-archive-btn-button .button:hover {
  color: var(--global-palette-btn-hover);      /* #ffffff */
  background: var(--global-palette-btn-bg-hover); /* #183f3c */
}
```

All Elementor buttons (`.elementor-button`) use the same pair: `#235652` → `#183f3c`, `transition: .3s` (card button uses `color .2s, background .2s, border .2s`).

### Header

| Element | Rest | Hover |
| --- | --- | --- |
| Nav link | `#ffffff` (active "Inicio" is `#f4f2be`) | `#f4f2be`, `transition: .2s ease-in-out` |
| Social pill | bg `#ffffff`, icon `#235652`, 34px circle | bg stays white, `transition: .2s ease-in-out` |
| Phone link | `#ffffff` | `transition: .1s linear` |

### Footer

| Element | Rest | Hover |
| --- | --- | --- |
| Sitemap nav links | `#ffffff` (active "Inicio" `#f4f2be`) | `#f4f2be` |
| Legal list links | text `#ffffff` | `#f4f2be` |
| Contact / social icons | white circles, `#235652` glyph | unchanged |

### Gallery (as designed)

`overlay_background: "yes"` + `content_hover_animation: "fade-in"` — a dark overlay fades in over the thumbnail on hover.

## Responsive sweep

Measured layout deltas (full numbers in `measurements.json`).

### 1440px → 768px

- Desktop header (133px, two rows) is replaced by the **Kadence mobile header** (75px, one row: logo left / cart + hamburger right). Threshold is **1024px**.
- Hero 700px → **450px**. Heading stays 35px, description stays 17px, inner padding stays 50px.
- Product grid `3 × 346.66px` → `2 × 334px`, gap stays 40px. Section height 832 → 1173.
- Guías: stays 3 columns, shrinking to 243 / 239 / 243.
- Camping: section goes **full-bleed** (`x: 0, w: 768`), columns 512 + 256. Image `margin-top: -50px` retained.
- Footer: 4 columns retained at 182px each; column dividers still visible.

### 768px → 390px

- Header 75px → **92px** (logo renders at 90×75, hamburger 47×41 at `x: 336`, cart button 38×20 at `x: 289`).
- Hero heading **35px → 23px** (`line-height: 23px`), description **17px → 13px** (`line-height: 18.2px`), inner padding **50px → 30px**. Height stays 450px. Arrows unchanged at 25px, `left/right: 10px`.
- Product grid → **1 × 330px**. Card 330×314, image 330×198. Section height 1173 → 2253.
- Guías: columns **stack** (350px wide each) — heading+button block first, then the two photos at 350×297 and 350×293.
- Camping: columns **stack**, image 350×350, `margin-top` resets to **0**. Yellow panel keeps `padding: 40px 20px`, bg `#f4f2be`.
- Footer: 4 columns **stack** at 350px, dividers removed. Footer logo 244px → **310px**. Contact row and social row both centre (`text-align: center`).
- Section heights: footer block 392 → 1040, contact bar 109 → 173, copyright 81 → 144.

## What the page does NOT do

Confirmed absent, so do not build them: sticky header, scroll reveals, parallax, scroll-snap, smooth-scroll library, tabs, pills, accordions, modals, dark↔light section transitions, scroll progress indicators, video or canvas content, Lottie.
