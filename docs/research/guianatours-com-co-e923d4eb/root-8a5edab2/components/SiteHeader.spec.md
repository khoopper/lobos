# SiteHeader Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/SiteHeader.tsx`
- **Screenshot:** `docs/design-references/guianatours-com-co-e923d4eb/root-8a5edab2/section-header.png` (desktop), `section-header-mobile.png` (390px)
- **Interaction model:** static (desktop) · click-driven drawer (≤1024px)

## DOM Structure
`<header>` is an absolute overlay on the hero. Two stacked rows on desktop, one row on mobile.

- **Desktop (≥1025px)** — `.site-header-upper-inner-wrap`
  - Row 1 `.site-top-header-wrap` — left: logo link (bear + wordmark PNG); right: phone link then 3 social pills.
  - Row 2 `.site-main-header-wrap` — left: empty spacer; right: `<nav>` with 4 links, then cart button with count badge.
- **Mobile (≤1024px)** — `#mobile-header`: logo left; cart button and hamburger right.

## Computed Styles (exact values from getComputedStyle)

### Header root
- position: absolute; top: 0; left: 0; right: 0
- z-index: 100
- background: transparent (`rgba(0, 0, 0, 0)`)
- height: 133px desktop (83.47 + 50) · 75px at 768 · 92px at 390
- color: #ffffff (inherited by contact + nav)

### Row 1 (`.site-top-header-wrap`), desktop
- height: 83.47px; display: block; background: transparent
- inner wrap: max-width 1140px + 20px side padding; display: flex; justify-content: space-between
- left section width 533.61px; right section width 716.39px with justify-content: flex-end

### Logo (desktop + mobile)
- src: `${ASSETS}/brand/logo-oso.png`, intrinsic 320×266
- rendered: **92 × 76.47px** desktop · **90 × 75px** at 390 (x:5, y:7)
- alt: `Guía Natours`; wrapped in an anchor to `https://guianatours.com.co/` with aria-label `Guía Natours`

### Phone link (`.contact-button`)
- font-size: 17px; line-height: 27.2px; font-weight: 400; color: #ffffff
- display: flex; align-items: center
- margin: 10.2px 5.1px 0
- width: 167.58px; height: 27.19px
- transition: 0.1s linear
- icon: `PhoneAltIcon`, **17 × 17px**, currentColor (#ffffff), left of the label
- href: `tel:350 225 0680`; label: `+57 350 225 0680`

### Social pills (`.social-button`) × 3
- width: 34px; height: 34px
- background-color: #ffffff; color: #235652
- border-radius: 50px; display: flex; align-items: center; justify-content: center
- margin: 5.1px 2.55px 0
- transition: 0.2s ease-in-out
- glyph ≈ 17px, fill: currentColor
- Order: Facebook → Instagram → YouTube

### Row 2 (`.site-main-header-wrap`), desktop
- height: 50px; background: transparent; position: static (**not sticky** — see States & Behaviors)
- inner wrap max-width 1140px; display: flex; justify-content: space-between
- nav wrap width 470.95px; height 47.56px; display: flex

### Nav links
- font-size: 17px; line-height: 27.2px; font-weight: 400
- padding: 10.2px
- color: **#ffffff**; active item ("Inicio") **#f4f2be**
- transition: 0.2s ease-in-out
- measured widths: Inicio 66.25 · Guía Natours 131.59 · Calendario 112.14 · Próximas salidas 160.97

### Cart (desktop)
- anchor to `https://guianatours.com.co/carrito/`, aria-label `Carrito de la compra`
- padding: 3.4px 0 0 17px; display: flex; align-items: center; color: #ffffff
- `ShoppingCartIcon` rendered ≈ 24px
- count badge: text `0`, small circle at the icon's top-right

### Mobile header (≤1024px)
- `#mobile-header` height 91.81px at 390 (75px at 768); background transparent
- hamburger `#mobile-toggle`: 46.78 × 41.19px, padding 5.6px 8.4px, background `rgba(255,255,255,0.03)`, border-radius 8px, color #ffffff, `MenuIcon` 24px; at x:336 (390px viewport)
- cart button: 38 × 20px at x:289, colour #ffffff
- aria-labels: `Abrir menú` / `Carrito de la compra`

## States & Behaviors

### Sticky header — DOES NOT EXIST
- The live element carries the class `kadence-sticky-header`, but sticky never engages. At `scrollY = 900` the header's viewport `top` is `-900`, and no `.item-is-fixed` / `.item-is-stuck` element is ever created.
- **Implementation:** plain `position: absolute`. Do **not** add a scroll listener.

### Nav link hover
- **color:** #ffffff → #f4f2be · **transition:** 0.2s ease-in-out

### Social pill hover
- Background stays #ffffff, colour stays #235652 · **transition:** 0.2s ease-in-out (keep the transition declared)

### Mobile drawer (≤1024px)
- **Trigger:** click on `#mobile-toggle`
- **State A:** panel hidden off-canvas right, `aria-expanded="false"`
- **State B:** right-side panel visible with the 4 nav links stacked, `aria-expanded="true"`
- **Transition:** fade (`popup-drawer-animation-fade`)
- **Implementation approach:** React `useState` plus a fixed-position panel; close on link click and on Escape.

## Assets
- Logo: `public/sites/guianatours-com-co-e923d4eb/root-8a5edab2/brand/logo-oso.png`
- Icons: `PhoneAltIcon`, `FacebookIcon`, `InstagramIcon`, `YoutubeIcon`, `ShoppingCartIcon`, `MenuIcon`, `CloseIcon` from the site-shared icon module.

## Text Content (verbatim)
`+57 350 225 0680` · `Inicio` · `Guía Natours` · `Calendario` · `Próximas salidas` · `0`

## Responsive Behavior
- **Desktop (≥1025px):** two rows, full nav, 133px tall.
- **Tablet (768px):** mobile header, 75px tall, hamburger at x:697.
- **Mobile (390px):** mobile header, 92px tall, logo 90×75, hamburger at x:336.
- **Breakpoint:** layout switches at **1024px**.
