# SiteFooter Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/SiteFooter.tsx`
- **Screenshot:** `docs/design-references/guianatours-com-co-e923d4eb/root-8a5edab2/section-footer.png`
- **Interaction model:** static · link hovers · form submit

## DOM Structure
`div.elementor-location-footer` holds **three** stacked Elementor sections:

1. `4da3f5a` — four columns: logo + registro · Mapa del sitio · Legal · Suscríbete (form).
2. `21cf77c` — contact bar: phone + email inline on the left, three social circles on the right.
3. `b4821ba` — copyright bar.

## Computed Styles (exact values from getComputedStyle)

### Section 1 (`4da3f5a`)
- background-color: **#235652**
- padding: **40px 20px 20px**
- height **392px** at 1440
- container max-width 1140px, `display: flex`
- four columns, each **285px** wide × 332px
- Each column's `.elementor-widget-wrap`: `padding: 20px`, `border-right: 1px solid #fbfaec` — **except the last column**, which has no border.

#### Column 1 — brand
- image `${ASSETS}/brand/logo-blanco.png` (white outline bear + "GuíaNat" wordmark), intrinsic 1080 × 1080
  - rendered **244 × 244px**, widget `text-align: center`, `margin-bottom: 20px`
- paragraph `Guía Natours S.A.S Registro Nacional de Turismo 213539`
  - font-size: **14px**; line-height: **14px**; font-weight: 400; color: **#ffffff**; text-align: **center**; margin 0

#### Column 2 — Mapa del sitio
- `<h3>` `Mapa del sitio`: font-size **18px**; line-height **18px**; font-weight **700**; color **#ffffff**; text-align **center**; widget `margin-bottom: 20px`
- vertical nav, `display: flex; flex-direction: column`, total height 96px (4 × 24px)
- links: font-size **14px**; line-height **20px**; font-weight 400; padding **2px 0**; `display: flex`
  - active "Inicio" → **#f4f2be**; the other three → **#ffffff**
  - `Inicio` · `Guía Natours` · `Calendario` · `Próximas salidas`

#### Column 3 — Legal
- `<h3>` `Legal`: identical to the Mapa del sitio heading (18px/18px, 700, #ffffff, centred, margin-bottom 20px)
- `<ul>` of 4 items, list height 101.56px
  - item: `padding: 0 0 2px`; `display: flex`; text-align **center**
  - text span: font-size **14px**; line-height **22.4px**; color **#ffffff**
  - all four open in a new tab (`target="_blank"`)

#### Column 4 — Suscríbete
- `<h3>` `Suscríbete`: 18px/18px, 700, #ffffff, centred, `margin-bottom: 10px`
- form (Elementor Forms, `form_id: ece7069`), three field groups each `padding: 0 5px; margin: 0 0 10px; height: 40px`
- **text input** — placeholder `Nombre y apellido`, name `form_fields[name]`, required
  - font-size **15px**; line-height **21px**; color **#1f2124**; background **#ffffff**
  - padding **6px 7.5px**; border **1px solid #69727d**; border-radius **8px**; width 245px; height 40px
- **email input** — placeholder `Email`, name `form_fields[email]`, required; styles identical to the text input
- **submit button** — label `Suscribirme`
  - font-size **15px**; line-height **15px**; color **#235652**; background-color **#f4f2be**
  - padding **0 24px**; border-radius **8px**; width 245px; height 40px; text-align center

### Section 2 (`21cf77c`) — contact bar
- background-color: **#235652**; padding **20px 20px 40px**; height **109px**
- two columns of **570px**, each wrap `padding: 10px; display: flex; align-items: center`
- **Left** — inline icon list, `margin: 0 -8px`, items `margin: 0 8px`
  - phone: `PhoneSolidIcon` **14 × 14px** white, then text `+57 350 225 0680`, `href="tel:350%20225%200680"`
  - email: `EnvelopeIcon` 14 × 14px white, then `reservas@guianatours.com.co`, `mailto:` link
  - text: font-size **14px**; line-height **22.4px**; color **#ffffff**; `padding-left: 5px`
- **Right** — three social circles, wrapper `text-align: right`, `gap: 0 5px`
  - each: **28 × 28px**, `border-radius: 50%`, background **#ffffff**, glyph **14 × 14px** filled **#235652**
  - `FacebookCircleIcon`, `InstagramBrandIcon`, `YoutubeBrandIcon`; all `target="_blank"`

### Section 3 (`b4821ba`) — copyright bar
- background-color: **#183f3c**; height **81.19px**; container 1140px, wrap `padding: 10px`
- paragraph: font-size **17px**; line-height **27.2px**; color **#ffffff**; text-align **center**; `margin: 17px 0`
- content: `© 2026 | Web diseñada por ` + link `Coudix` → `https://xn--diseodepaginasweb-ixb.co/` (`target="_blank" rel="noopener"`), also #ffffff

## States & Behaviors
- **Section:** N/A — no scroll, click or time behaviour.
- **Sitemap link hover:** #ffffff → **#f4f2be**
- **Legal link hover:** #ffffff → **#f4f2be**
- **Contact link hover:** no colour change declared
- **Submit button hover:** Elementor default — keep `transition: 0.3s`; background stays #f4f2be
- **Form submit:** the original POSTs to Elementor Forms. The clone has no backend (out of scope per the skill defaults) — render the real markup and prevent default on submit.

## Assets
- `${ASSETS}/brand/logo-blanco.png`
- Icons: `PhoneSolidIcon`, `EnvelopeIcon`, `FacebookCircleIcon`, `InstagramBrandIcon`, `YoutubeBrandIcon`

## Text Content (verbatim)
`Guía Natours S.A.S Registro Nacional de Turismo 213539` · `Mapa del sitio` · `Inicio` · `Guía Natours` · `Calendario` · `Próximas salidas` · `Legal` · `Términos y Condiciones` · `Políticas de privacidad` · `Políticas de Cancelación` · `Protocolos de bioseguridad` · `Suscríbete` · `Nombre y apellido` · `Email` · `Suscribirme` · `+57 350 225 0680` · `reservas@guianatours.com.co` · `© 2026 | Web diseñada por Coudix`

## Responsive Behavior
- **Desktop (1440px):** 4 columns × 285px with 1px dividers; sections 392 / 109 / 81px.
- **Tablet (768px):** still **4 columns**, 182px each, dividers kept; sections 329 / 126 / 81px.
- **Mobile (390px):** columns **stack** to 350px each, dividers removed. Footer logo grows **244px → 310px**. Contact row and social row both centre (`text-align: center`). Sections 1040 / 173 / 144px.
- **Breakpoint:** stacking at **767px**.
