# HeroSlider Specification

## Overview
- **Target file:** `src/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/HeroSlider.tsx`
- **Screenshot:** `docs/design-references/guianatours-com-co-e923d4eb/root-8a5edab2/section-hero.png`
- **Interaction model:** **time-driven** (autoplay 5000ms) **plus click-driven** (prev/next arrows). Not scroll-driven.

## DOM Structure
Full-bleed `<section>` → swiper viewport → 4 slides. Each slide is
`div.swiper-slide` → `div.swiper-slide-bg` (background-image) + `a.swiper-slide-inner` → `div.swiper-slide-contents` → heading / description / button div.
Arrows are siblings of the viewport, absolutely positioned.

## Computed Styles (exact values from getComputedStyle)

### Section
- background-color: #183f3c (fallback behind the photos)
- height: **700px** desktop · **450px** at ≤1024px
- position: relative; width: 100%

### `.swiper-slide-bg`
- background-size: cover; background-position: 50% 50%; background-color: #183f3c
- opacity: 1; filter: none; mix-blend-mode: normal — **there is no overlay tint**; the dark look comes from the photographs themselves

### `.swiper-slide-inner` (the link)
- position: absolute; inset: 0
- max-width: **1280px**; margin-inline: auto
- padding: **50px** desktop · **30px** at 390
- display: flex; align-items: **flex-end**; justify-content: **flex-start**
- color: #ffffff; text-align: left
- transition: 0.1s linear
- href: `https://guianatours.com.co/categoria-salidas/nuestros-proximos-destinos/`

### `.elementor-slide-heading`
- font-size: **35px** (→ **23px** at ≤767); line-height: **35px** (→ 23px)
- font-weight: 700; color: #ffffff
- margin: 0 0 5px
- width: **600px** desktop (330px at 390)

### `.elementor-slide-description`
- font-size: **17px** (→ **13px** at ≤767); line-height: **23.8px** (→ 18.2px)
- font-weight: 400; color: #ffffff
- margin: 0 0 30px
- width: 600px desktop (330px at 390)

### `.elementor-slide-button`
- Rendered as a **div**, not a nested anchor (the whole slide is the link).
- font-size: 15px; line-height: 15px; font-weight: 400; color: #ffffff
- background-color: **#235652**; border-radius: **8px**
- padding: **12px 24px**; display: inline-block; text-align: center
- transition: 0.3s · hover background **#183f3c**

### Arrows
- width: 25px; height: 25px; font-size: 25px
- color: **rgba(237, 237, 237, 0.9)**
- position: absolute; top: 50%; transform: translateY(-12.5px)
- left: 10px / right: 10px; z-index: 1
- icons: `ChevronLeftIcon` / `ChevronRightIcon` (1000×1000 viewBox)

## States & Behaviors

### Autoplay
- **Trigger:** timer. Raw widget settings:
  `{"navigation":"both","autoplay":"yes","pause_on_hover":"yes","pause_on_interaction":"yes","autoplay_speed":5000,"infinite":"yes","transition":"slide","transition_speed":500}`
- Advances every **5000 ms**, wraps infinitely.
- **Pauses on hover**; **stops permanently after any user interaction** (arrow click).

### Slide transition
- **Type:** horizontal slide (translateX of the whole track), **500 ms**.
- **Implementation approach:** flex track of 4 slides at `width: 400%`, `transform: translateX(calc(index * -25%))`, `transition: transform 500ms ease`.
- `navigation: "both"` requests arrows *and* bullets, but the pagination container renders empty on the live site. **Build arrows only.**

### Arrow hover
- No colour change is declared; keep `transition: all`.

## Assets
- `${ASSETS}/hero/venados-chingaza.jpg`
- `${ASSETS}/hero/cascada-sueve.jpg`
- `${ASSETS}/hero/chingaza-nocturna.jpg`
- `${ASSETS}/hero/laguna-de-siecha.jpg`
- Icons: `ChevronLeftIcon`, `ChevronRightIcon`

## Per-State Content (one per slide) — verbatim
1. **Venados en Chingaza** — "En este mágico recorrido te llevaremos a senderos en páramo y en bosque donde veremos: el embalse, frailejones, aves y con suerte el oso andino."
2. **Cascada de Sueva** — "La Cascada de Sueva, Nemustén o Churumbelos es una hermosa caída de agua de aproximadamente 50 metros"
3. **Chingaza Nocturna (Camping, fotografía de estrellas)** — "¿Te gustaría acampar en medio del páramo, con venados a tu alrededor y mucha naturaleza?"
4. **Laguna de Siecha** — "Haremos una de las caminatas que realizaron nuestros antepasados hasta llegar a las Lagunas Sagradas de Siecha."

All four buttons read **"Mira los próximos destinos"** and link to the same category URL.

## Responsive Behavior
- **Desktop (1440px):** 700px tall, heading 35px, padding 50px.
- **Tablet (768px):** 450px tall, heading still 35px, padding still 50px.
- **Mobile (390px):** 450px tall, heading 23px, description 13px, padding 30px, text block 330px wide.
- **Breakpoints:** height changes at **1024px**; type scale changes at **767px**.
