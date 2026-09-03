# ReviewsSection Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/ReviewsSection.tsx`
- **Screenshot:** `docs/design-references/guianatours-com-co-e923d4eb/root-8a5edab2/section-resenas.png` (captures the pre-hydration collapsed state — the widget is async)
- **Interaction model:** **time-driven** slider (third-party Trustindex widget, 6s autoplay)

## Source of the content
The section (`data-id="f59f585"`) holds a single Elementor `shortcode` widget (`data-id="7495bd3"`) that injects the **Trustindex Google reviews** widget from `cdn.trustindex.io`.

Widget attributes read from the live DOM:

```
class="ti-widget ti-goog ti-disable-font ti-show-rating-text ti-review-text-mode-readmore ti-text-align-left"
data-layout-id="5"  data-layout-category="slider"  data-set-id="blue"
data-language="es"  data-review-target-width="275"  data-pager-autoplay-timeout="6"
data-plugin-version="13.3.1"
```

Container: `div.ti-widget-container.ti-col-4` with `align-items: flex-start` → **4 columns**.

Because it is loaded asynchronously the section measures **20px** until the script resolves, then expands to **~251px** (widget) / **270.78px** (section). Both states were observed.

## Computed Styles (exact values from getComputedStyle)

### Section (`f59f585`)
- margin: **40px 0 0**; padding: 0
- background: transparent
- width 1425px; height 270.78px once loaded (20px before)

### Widget box
- width **1120px** (inside the 1140px container); height 250.78px
- font: inherited Montserrat 17px / 27.2px, colour #686c6a

### Rating header (`.ti-footer.ti-footer-grid.source-Google`)
- `margin-top: 52px`
- `.ti-rating` → text `EXCELENTE`, `<strong>`, class `ti-rating-large`
- `.ti-stars.star-lg` → five `img.ti-star`, each **30 × 30px** rendered (17 × 17 intrinsic), `margin: 0 1px 0 0`
- count line: `A base de 2976 reseñas`

### Review card
- target width **275px**, 4 visible per page
- author name, relative date (`hace 4 años`), 5 stars, review text
- long text is clamped with a `Leer más` toggle (`ti-review-text-mode-readmore`)
- avatar: `https://cdn.trustindex.io/assets/platform/Google/icon.svg` (Google G mark)

## States & Behaviors

### Autoplay
- **Trigger:** timer, `data-pager-autoplay-timeout="6"` → advances every **6000 ms**.
- **Implementation approach:** local `useState` index + `setInterval`, paged 4-at-a-time on desktop.

### "Leer más"
- **Trigger:** click. **State A:** text clamped. **State B:** full text shown.

### Third-party dependency — deliberate deviation
The original pulls this widget from `cdn.trustindex.io`. The clone reproduces the **rendered output** with the six real reviews captured from the live DOM rather than embedding the third-party script, because loading it would require the site's own Trustindex account. Recorded in `ARTIFACT_MANIFEST.md`.

## Assets
- `StarIcon` from the site-shared icon module (replaces the Trustindex star SVG served from their CDN).

## Text Content (verbatim)
- `EXCELENTE`
- `A base de 2976 reseñas`

| Author | Date | Rating | Text |
| --- | --- | --- | --- |
| Manuel Nacho | hace 4 años | 5 | El Parque Natural es un lugar completamente mágico. Poder recorrer un páramo y luego un bosque alto Andino es un privilegio natural que tenemos cerca a Bogotá.Lo único que tendrían que implementar sería que en la charla de inducción en Piedras Gordas tuvieran al menos los vídeos subtitulados en inglés para los visitantes extranjeros. |
| wilber cifuentes ruiz | hace 4 años | 5 | Hermoso lugar |
| Sergio Velasquez | hace 4 años | 5 | Excelente |
| Luis Sabogal | hace 4 años | 5 | Es un paisaje fuera de lo comun |
| LaMolina Chiquita | hace 4 años | 5 | Un lugar lleno de vida y paz... En un lugar cin increíbles paisajes |
| Luz Elena Martinez Martinez | hace 4 años | 5 | Genial |

Typos and spacing are reproduced verbatim from the source.

## Responsive Behavior
- **Desktop (1440px):** 4 review cards per page, rating header on the left.
- **Tablet (768px):** cards narrow; 2 per page at a 275px target width.
- **Mobile (390px):** 1 card per page, rating header stacks above.
- Section keeps `margin-top: 40px` at every width.
