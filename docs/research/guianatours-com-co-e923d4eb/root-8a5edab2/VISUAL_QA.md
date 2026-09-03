# Visual QA — clone vs. original

Method: both pages loaded in the same Chromium build at identical viewports, fully scrolled to
settle lazy-loading, then every section's bounding box measured. Original numbers come from
`measurements.json`; clone numbers from the live dev server.

## Desktop — 1440 × 900

| Section | Original h | Clone h | Δ |
| --- | --- | --- | --- |
| SiteHeader | 133 | 133 | **0** |
| HeroSlider | 700 | 700 | **0** |
| ProximosDestinos | 832 | 832 | **0** |
| GuiasExpertos | 379 | 379 | **0** |
| CampingSection | 710 | 710 | **0** |
| ReviewsSection | 271¹ | 294 | +23 ¹ |
| Fotografías (heading) | 160 | 160 | **0** |
| Gallery | 21² | 920 | +899 ² |
| Footer — columns | 392 | 392 | **0** |
| Footer — contact bar | 109 | 108 | −1 |
| Footer — copyright | 81 | 81 | **0** |

Also matching exactly: product grid `346.656px 346.672px 346.656px` at 1120px wide with a 40px gap;
card shadow `rgba(35, 86, 82, 0.2) 0px 20px 30px 0px`; body `Montserrat 17px / 27.2px` on `#fbfaec`;
h2 `24px / 24px #373435`.

## Mobile — 390 × 844

| Section | Original h | Clone h | Δ |
| --- | --- | --- | --- |
| SiteHeader | 92 | 92 | **0** |
| HeroSlider | 450 | 450 | **0** |
| ProximosDestinos | 2253 | 2253 | **0** |
| GuiasExpertos | 755 | 755 | **0** |
| CampingSection | 711 | 711 | **0** |
| ReviewsSection | 20¹ | 776 | ¹ |
| Fotografías (heading) | 242 | 242 | **0** |
| Gallery | 21² | 1270 | ² |
| Footer — columns | 1040 | 1036 | −4 |
| Footer — contact bar | 173 | 173 | **0** |
| Footer — copyright | 144 | 144 | **0** |

Product grid `330px` single column, matching exactly.

¹ Trustindex widget rebuilt locally — see `ARTIFACT_MANIFEST.md`.
² Elementor gallery is broken on the live site and collapses to 21px; the clone builds it as
configured — see `ARTIFACT_MANIFEST.md`.

## Remaining discrepancies

| # | Where | Δ | Cause |
| --- | --- | --- | --- |
| 1 | Footer legal list, mobile | 4px | The source's list items compute to 25.5px each against the clone's 24.4px; the difference is Kadence's line-height rounding on that widget. |
| 2 | Footer contact bar, desktop | 1px | Sub-pixel rounding on the inline icon list. |

Nothing else differs by more than a pixel outside the two documented deviations.

## Behaviours verified in the clone

| Behaviour | Expected | Observed |
| --- | --- | --- |
| Hero autoplay | advances every 5000ms | `translateX(0)` → `-1440px` after 5.6s ✓ |
| Hero next arrow | advances one slide, 500ms | `-1440px` → `-2880px` ✓ |
| `pause_on_interaction` | autoplay stops permanently after a click | unchanged after a further 6s ✓ |
| Card details on hover | `translateY(-2rem)` | `translate: 0px -32px` ✓ |
| Card button on hover | `opacity 0 → 1`, `bottom -2rem → -0.8rem` | `0 → 1`, `-32px → -12.8px` ✓ |
| Card primary image on hover | `scale(1.07)` | `scale: 1.07` ✓ |
| Card secondary image on hover | `opacity 0 → 1` | `0 → 1` ✓ |
| Button hover | `#235652 → #183f3c` | `rgb(35,86,82) → rgb(24,63,60)` ✓ |
| Mobile drawer | opens on tap, closes on Escape | `aria-expanded false → true → false`, 4 links ✓ |
| Header sticky | must NOT stick | scrolls away with the page ✓ |

No console errors and no page errors at either viewport. No broken images (0 of 29).

## Build

`npm run check` (lint + typecheck + build) passes clean.
