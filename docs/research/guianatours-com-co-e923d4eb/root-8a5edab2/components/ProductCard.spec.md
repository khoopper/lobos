# ProductCard Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/ProductCard.tsx`
- **Screenshot:** `docs/design-references/guianatours-com-co-e923d4eb/root-8a5edab2/section-product-card.png`
- **Interaction model:** static at rest, **hover-driven** (three simultaneous effects)

## DOM Structure
`<li class="product">` (the card box, `overflow: hidden`) contains exactly three children:

1. `div.closest-booking-availability` — the "Próxima salida" badge, absolutely positioned at the card's top-left corner.
2. `a.woocommerce-loop-image-link` — the image well; holds the primary `<img>` and, layered on top, the absolutely-positioned `.secondary-product-image`.
3. `div.product-details` (`.entry-content-wrap`) — title, price, and (absolutely positioned, hidden at rest) `div.product-action-wrap` containing the button.

## Computed Styles (exact values from getComputedStyle)

### Card (`li.product`)
- background-color: #ffffff
- width: 346.66px (grid track); height: 324.36px at rest
- display: flex; flex-direction: column
- border-radius: **4px**
- box-shadow: **rgba(35, 86, 82, 0.2) 0px 20px 30px 0px**
- position: relative; overflow: **hidden**
- transition: all

### Badge (`.closest-booking-availability`)
- position: absolute; top: 0; left: 0; z-index: 1
- background-color: #ffffff; color: **#235652**
- padding: **7.2px 14.4px**
- font-size: **14.4px**; line-height: **23.04px**; font-weight: 400
- border-radius: **0 0 5px 0** (only the bottom-right corner is rounded)
- height 37.42px; width shrinks to content (229.89px for "Próxima salida: 12 Sep 2026")
- Inner markup: `<span><b>Próxima salida:</b> {date}</span>` — the label is **font-weight: 700**, the date stays 400. Both are #235652.

### Image well (`a.woocommerce-loop-image-link`)
- width: 346.66px; height: **207.98px** (600/360 aspect ratio)
- display: block; position: relative; overflow: hidden
- transition: 0.1s linear

### Primary image
- width: 100%; height: 207.98px; aspect-ratio: 600 / 360
- display: block; max-width: 100%

### Secondary (hover) image (`.secondary-product-image`)
- position: absolute; inset: 0
- width: 346.66px; height: 207.98px; min-height: 100%
- object-fit: **cover**
- opacity: **0** at rest
- transition: **opacity 0.4s, transform 2s cubic-bezier(0, 0, 0.4, 1.1)**

### Details block (`.product-details`)
- background-color: #ffffff
- padding: **16px 16px 24px**
- margin-inline: 8.5px; width: 329.66px; height: 116.38px
- display: flex; flex-direction: column
- border-radius: 4px; position: relative
- transition: **transform 0.3s cubic-bezier(0.17, 0.67, 0.35, 0.95)**

### Title (`.woocommerce-loop-product__title`)
- font-size: **15px**; line-height: **22.5px**; font-weight: **600**
- color: **#373435**
- padding: **8px 0**

### Price (`.price`)
- font-size: **14.569px**; line-height: **23.31px**; font-weight: 400
- color: **#686c6a**
- margin: 0 0 14.569px
- Markup: `$` (currency symbol span) + non-breaking space + amount, e.g. `$ 169.000`

### Action wrap (`.product-action-wrap`)
- position: absolute; left: 0; right: 0
- padding: 0 16px; width: 329.66px; height: 40.78px
- bottom: **-32px**; opacity: **0** at rest
- transition: **opacity 0.3s cubic-bezier(0.17, 0.67, 0.35, 0.95)**

### Button (`.button.add_to_cart_button`)
- font-size: 17px; line-height: 27.2px; font-weight: 400; color: #ffffff
- background-color: **#235652**; border-radius: **8px**
- padding: **6.8px 17px**; width: 100%; text-align: center
- transition: **color 0.2s, background 0.2s, border 0.2s**
- label: `Ver salida`

## States & Behaviors

### Card hover — three effects at once
Exact rules from the live stylesheet:

```css
li.product:hover .entry-content-wrap  { transform: translateY(-2rem); }
li.product:hover .product-action-wrap { bottom: -0.8rem; opacity: 1; }
.woo-archive-image-hover-zoom .woocommerce-loop-product__link:hover .attachment-woocommerce_thumbnail {
  opacity: 1; transform: scale(1.07);
}
```

| Element | State A (rest) | State B (hover) | Transition |
| --- | --- | --- | --- |
| `.product-details` | `transform: none` | `translateY(-2rem)` = **−32px** | `transform .3s cubic-bezier(.17,.67,.35,.95)` |
| `.product-action-wrap` | `opacity: 0; bottom: -32px` | `opacity: 1; bottom: -12.8px` | `opacity .3s cubic-bezier(.17,.67,.35,.95)` |
| primary image | `scale(1)` | `scale(1.07)` | `.1s linear` from the link |
| `.secondary-product-image` | `opacity: 0` | `opacity: 1` | `opacity .4s` |

- Trigger is `:hover` **or** `:focus-within` (both selectors are present in the source).
- The card's `overflow: hidden` clips the button until it slides into the card box.

### Button hover
- background **#235652 → #183f3c**, colour stays #ffffff, `transition: background .2s`

### Title link hover
- No colour change declared; colour stays #373435.

## Assets
Per-card image pairs (primary / hover) live under `public/sites/guianatours-com-co-e923d4eb/root-8a5edab2/products/`:
`farallones-sutatausa`, `lagunas-de-siecha`, `chingaza-kids`, `camping-chingaza` (`.jpg`) and `tatacoa`, `penas-blancas` (`.png`), each with a `-hover` sibling.

## Text Content (verbatim, all six cards)
| Title | Price | Próxima salida |
| --- | --- | --- |
| Farallones de Sutatausa | $ 169.000 | 12 Sep 2026 |
| Lagunas de Siecha | $ 199.000 | 12 Sep 2026 |
| Desierto de la Tatacoa (2 días) | $ 599.000 | 19 Sep 2026 a 20 Sep 2026 |
| Chingaza kids «Venaditos» | $ 179.000 | 19 Sep 2026 |
| Camping en Chingaza | $ 359.000 | 19 Sep 2026 a 20 Sep 2026 |
| Peñas Blancas Chingaza | $ 189.000 | 20 Sep 2026 |

Button label on every card: `Ver salida`.

## Responsive Behavior
- **Desktop (1440px):** card 346.66 × 324.36, image 346.66 × 207.98.
- **Tablet (768px):** card width 334px, same internals.
- **Mobile (390px):** card **330 × 314**, image **330 × 198**. Badge type stays 14.4px.
- Card internals do not change; only the grid track width does.
