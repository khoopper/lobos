# FotografiasSemana Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/FotografiasSemana.tsx`
- **Screenshots:** `section-fotos.png` (heading block), `section-galeria.png` (collapsed gallery on the live site)
- **Interaction model:** static heading + **hover-driven** gallery overlay, click opens a lightbox

This component covers two adjacent Elementor sections that read as one block: the heading section `60df0cd` and the gallery section `48229f1`.

## DOM Structure
1. `<section data-id="60df0cd">` → boxed container → `<h2>` + `<p>`, both centred.
2. `<section data-id="48229f1">` (full-bleed) → `div.elementor-gallery__container` → 11 `<a class="e-gallery-item">`, each holding a `div.e-gallery-image` (background-image) and a `div.elementor-gallery-item__overlay`.

## Computed Styles (exact values from getComputedStyle)

### Heading section (`60df0cd`)
- padding: **40px 20px 10px**; background: transparent
- height 160px at 1440

### Heading (`h2`)
- text: `Fotografías de la semana`
- font-size: **24px**; line-height: **24px**; font-weight: **700**
- color: **#373435**; text-align: **center**
- margin: 0 0 12px; width 1120px

### Paragraph
- font-size: **17px**; line-height: **27.2px**; font-weight: 400
- color: **#686c6a**; text-align: **center**
- margin: 0; width 1120px; height 54.38px (wraps to 2 lines at 1440)

### Gallery section (`48229f1`)
- full-bleed (`elementor-section-full_width`); container width 1405px at 1440 (10px side inset)
- **height 21px on the live site** — see States & Behaviors

### Gallery settings (raw `data-settings`)
```json
{"gallery_layout":"justified","ideal_row_height":{"unit":"px","size":300},
 "ideal_row_height_tablet":{"unit":"px","size":150},
 "ideal_row_height_mobile":{"unit":"px","size":150},
 "gap":{"unit":"px","size":10},"gap_tablet":{"unit":"px","size":10},
 "gap_mobile":{"unit":"px","size":10},"lazyload":"yes","link_to":"file",
 "overlay_background":"yes","content_hover_animation":"fade-in"}
```

So: **justified rows**, ideal row height **300px** desktop / **150px** tablet and mobile, **10px** gap, items link to the full-size file, dark overlay fades in on hover.

## States & Behaviors

### The live gallery is broken — deliberate deviation
All 11 `<a class="e-gallery-item">` elements exist in the DOM with `data-thumbnail`, `data-width` and `data-height`, but Elementor's `e-gallery` layout script never runs. Every `.e-gallery-image` stays 0px tall and the section collapses to **21px**. Verified with a real (input-event) scroll plus IntersectionObserver trigger at 1440, 768 and 390 — `firstItemRect.height` is `0` and `backgroundImage` is `none` in every case.

**Decision:** build the gallery the way Elementor intends (justified rows from the real thumbnails and their real intrinsic sizes) rather than shipping an empty 21px div. Recorded in `ARTIFACT_MANIFEST.md`.

### Item hover (as designed)
- **Trigger:** `:hover` on `.e-gallery-item`
- **State A:** overlay `opacity: 0`
- **State B:** dark overlay `opacity: 1` over the thumbnail
- **Transition:** fade-in (`content_hover_animation: "fade-in"`)

### Item click
- `data-elementor-open-lightbox="yes"`, `data-elementor-lightbox-slideshow="e5ab0c6"` — opens Elementor's lightbox slideshow.
- **Implementation approach:** anchor to the full-size image (`link_to: "file"`), `target="_blank"`. A full lightbox is out of scope per the skill's defaults.

## Assets
Eleven thumbnails under `${ASSETS}/gallery/`, with their intrinsic sizes (needed to compute justified row ratios):

| File | w × h | Lightbox title |
| --- | --- | --- |
| `dsc-4263.png` | 300 × 200 | DSC_4263 |
| `1.jpg` | 300 × 202 | 1 |
| `dsc-0452.jpg` | 300 × 200 | siecha |
| `camping.jpg` | 300 × 300 | camping |
| `chingaza-nocturna.jpeg` | 200 × 300 | chingaza nocturna |
| `chingaza-kids.jpeg` | 200 × 300 | chingaza.kids |
| `farallones.jpeg` | 300 × 200 | farallones |
| `kids.jpeg` | 203 × 300 | kids |
| `siecha.jpeg` | 300 × 200 | siecha |
| `sueva.jpeg` | 300 × 215 | sueva |
| `venados.jpeg` | 300 × 200 | venados |

Full-size originals stay on the source domain (they are the lightbox targets, not rendered assets).

## Text Content (verbatim)
- Heading: `Fotografías de la semana`
- Paragraph: `Si quieres acampar en Chingaza con venados, en el páramo, con buenas instalaciones y aparte ver un cielo nocturno lleno de estrellas , te llevamos al interior del Parque.`
  (identical to the Camping paragraph, including the space before the comma)

## Responsive Behavior
- **Desktop (1440px):** heading section 160px; gallery rows target **300px** height, 10px gap, 10px side inset.
- **Tablet (768px):** heading section 188px; gallery rows target **150px**.
- **Mobile (390px):** heading section 242px (paragraph wraps to more lines); gallery rows target **150px**.
- Heading and paragraph stay centred at every width.
