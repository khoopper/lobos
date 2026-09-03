# Page Topology — guianatours.com.co/

- **Source URL:** https://guianatours.com.co/
- **site-key:** `guianatours-com-co-e923d4eb`
- **page-key:** `root-8a5edab2`
- **Destination route:** `/` → `src/app/page.tsx`
- **Stack of origin:** WordPress 7.0.3 + Kadence theme (child `coudix-child`) + Elementor Pro 4.0.5 + WooCommerce 10.3.7 + YITH Booking. Language `es_ES`.
- **Page height (desktop 1440):** 3498px · tablet 768: 3208px · mobile 390: 5903px

## Global foundation

| Token | Value |
| --- | --- |
| `--gn-palette-1` | `#235652` (primary teal — buttons, badges, footer bg) |
| `--gn-palette-2` | `#183f3c` (dark teal — button hover, copyright bar, hero fallback bg) |
| `--gn-palette-3/4` | `#373435` (headings) |
| `--gn-palette-5/6` | `#686c6a` (body text) |
| `--gn-palette-7` | `#f4f2be` (pale yellow — camping panel, active nav link, subscribe button) |
| `--gn-palette-8` | `#fbfaec` (cream — page background, destinos section) |
| `--gn-palette-9` | `#ffffff` |
| Body type | Montserrat 400, 17px / 27.2px, color `#686c6a` |
| Headings | Montserrat 700 |
| Container | `max-width: 1140px` (Elementor boxed), section side padding 20px |
| Page bg | `#fbfaec` |

Fonts: **Montserrat** (weights 400 and 700) via Google Fonts. Loaded in `src/app/layout.tsx` with `next/font/google`.

## Section order (top → bottom)

| # | Name | Elementor `data-id` | Desktop y / h | Layer | Interaction model |
| --- | --- | --- | --- | --- | --- |
| — | **SiteHeader** | `#masthead` | 0 / 133 | `position:absolute; z-index:100` overlay on hero | static (mobile: drawer toggle) |
| 0 | **HeroSlider** | `f2b8b96` | 0 / 700 | flow | time-driven (autoplay 5s) + click arrows |
| 1 | **ProximosDestinos** | `a3125aa` | 700 / 832 | flow | static grid; hover-driven cards |
| 2 | **GuiasExpertos** | `56e43f8` | 1532 / 379 | flow | static |
| 3 | **CampingSection** | `11044c1` | 1911 / 710 | flow (image overflows −50px up) | static |
| 4 | **ReviewsSection** | `f59f585` | 2661 / 20¹ | flow | time-driven slider (3rd-party Trustindex) |
| 5 | **FotografiasHeading** | `60df0cd` | 2681 / 160 | flow | static |
| 6 | **FotografiasGallery** | `48229f1` | 2841 / 21² | flow | hover overlay + lightbox |
| — | **SiteFooter** | `.elementor-location-footer` | 2862 / 582 | flow | static; form submit |

¹ The Trustindex Google-reviews widget loads asynchronously from `cdn.trustindex.io`. It measures 20px until the script resolves, then expands to ~251px. Real content captured (see `BEHAVIORS.md`).

² **The Elementor justified gallery is broken in production.** All 11 `<a class="e-gallery-item">` elements are in the DOM with `data-thumbnail` / `data-width` / `data-height`, but the `e-gallery` layout script never runs, so every `.e-gallery-image` stays 0px tall and the section collapses to 21px. Verified with a real scroll + IntersectionObserver trigger at 1440, 768 and 390. See `ARTIFACT_MANIFEST.md` for the deliberate deviation.

## Layout structure

- Single scroll container (`document.documentElement`). No smooth-scroll library (no Lenis / Locomotive), no scroll-snap, no `animation-timeline`.
- Every section except the hero and the gallery is *boxed*: a `max-width: 1140px` centred container inside a full-bleed section with `padding-inline: 20px`.
- The hero is `full_width`: the swiper spans 100vw; only its text block is constrained to `max-width: 1280px` with `padding: 50px`.
- The header is **absolutely positioned** over the hero (`transparent-header` body class). It has the `kadence-sticky-header` class but sticky is **not** active — the header scrolls away with the page (verified: `#masthead` `top` goes to `-900` at `scrollY = 900`, no `.item-is-fixed` element ever appears).
- **Camping section overlap:** the left image column's `.elementor-widget-container` carries `margin-top: -50px`, so the 760×760 photo pulls up over the bottom of the *Guías expertos* section. This is the only cross-section overlap on the page. It resets to `margin: 0` on mobile (≤767).

## Breakpoints

| Range | Behaviour |
| --- | --- |
| ≥ 1025px | Desktop header (2 rows: contact/social bar + nav bar). Product grid 3 columns. |
| ≤ 1024px | Kadence **mobile header** takes over: single 75–92px row with logo, cart button, hamburger. Camping section goes full-bleed (container drops to 100%). |
| 576–1023px | Product grid 2 columns (`grid-sm-col-2`). |
| ≤ 767px | Elementor mobile: hero heading 35px → 23px, description 17px → 13px, hero inner padding 50px → 30px. Guías columns stack. Camping columns stack, image margin-top resets to 0. Footer columns stack, footer logo grows to 310px, contact + social rows centre. |
| < 576px | Product grid 1 column. |

Hero height: 700px desktop → 450px at ≤1024px (both tablet and mobile measured at 450px).

## Component roots

- Components: `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/`
- Shared icons: `src/components/sites/guianatours-com-co-e923d4eb/shared/icons.tsx`
- Types: `src/types/guianatours-com-co-e923d4eb.ts`
- Content: `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/content.ts`
- Assets: `public/sites/guianatours-com-co-e923d4eb/root-8a5edab2/`
