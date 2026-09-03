# GuiasExpertos Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/GuiasExpertos.tsx`
- **Screenshot:** `docs/design-references/guianatours-com-co-e923d4eb/root-8a5edab2/section-guias.png`
- **Interaction model:** **static** (button hover only)

## DOM Structure
`<section>` (`data-id="56e43f8"`) → boxed container → three equal Elementor columns:

1. Column `069b825` — heading `<h2>` + link button, vertically centred.
2. Column `efdce37` — photo of a guide.
3. Column `1c44854` — photo of hikers.

## Computed Styles (exact values from getComputedStyle)

### Section
- padding: **60px 20px 0**
- background: transparent (page cream #fbfaec shows through)
- height 378.80px at 1440; position: relative

### Container
- max-width: **1140px**; margin-inline: auto
- display: flex; flex-direction: row
- height 318.80px

### Column 1 — text column (`069b825`)
- width **379.98px**; display: flex
- inner widget wrap: `padding: 10px; margin-bottom: 50px; display: flex; align-items: center` (height 268.80px)
- So the heading/button block is **vertically centred** against the two photos.

### Heading (`h2`)
- text: `Guías expertos locales`
- font-size: **24px**; line-height: **24px**; font-weight: **700**
- color: **#373435**; text-align: **left**
- margin: 0 0 12px; widget wrapper adds `margin-bottom: 20px`
- rendered at x:153, y:1679, 360 × 36 (widget box)

### Button
- `<a class="elementor-button elementor-button-link elementor-size-sm">`
- text: `Mira las próximas salidas`
- font-size: **15px**; line-height: **15px**; font-weight: 400; color: #ffffff
- background-color: **#235652**; border-radius: **8px**
- padding: **12px 24px**; display: inline-block; text-align: center
- transition: **0.3s**; width 232.47px; height 39px
- href: `https://guianatours.com.co/categoria-salidas/nuestros-proximos-destinos/`
- rendered at x:153, y:1735

### Column 2 — guide photo (`efdce37`)
- column width **374.97px**, full height 318.80px
- image `${ASSETS}/guias/guia-natours.jpg`, intrinsic **439 × 373**
- rendered **374.97 × 318.59px**, `display: inline-block`, `max-width: 100%`, aspect-ratio 439/373
- widget `text-align: center`; no border-radius, no shadow

### Column 3 — hikers photo (`1c44854`)
- column width **381.20px**, height 318.80px
- image `${ASSETS}/guias/caminata-natural.jpg`, intrinsic **446 × 373**
- rendered **381.20 × 318.80px**, aspect-ratio 446/373

The two photos butt directly against each other with no gap (columns are adjacent, no column-gap padding on these two).

## States & Behaviors
- **Section:** N/A — no scroll, click or time behaviour, no entrance animation.
- **Button hover:** background **#235652 → #183f3c**, colour stays #ffffff, `transition: 0.3s`.
- **Images:** no hover effect declared.

## Assets
- `${ASSETS}/guias/guia-natours.jpg` (439 × 373)
- `${ASSETS}/guias/caminata-natural.jpg` (446 × 373)

## Text Content (verbatim)
- Heading: `Guías expertos locales`
- Button: `Mira las próximas salidas`

## Responsive Behavior
- **Desktop (1440px):** 3 columns at x 150 / 530 / 905, widths 380 / 375 / 381, section height 379.
- **Tablet (768px):** still **3 columns**, widths 243 / 239 / 243, section height 264. Columns shrink, they do not stack.
- **Mobile (390px):** columns **stack** to a single 350px column: text block first (height 125), then guide photo 350 × 297, then hikers photo 350 × 293. Section height 755. Section padding stays `40px 20px 0`.
- **Breakpoint:** stacking happens at **767px** (Elementor mobile).
