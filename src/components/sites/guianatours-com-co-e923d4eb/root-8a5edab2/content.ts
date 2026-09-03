/**
 * Verbatim content extracted from https://guianatours.com.co/ (homepage).
 * Text taken with `element.textContent`; asset paths point at the downloaded originals.
 */
import type {
  GalleryItem,
  HeroSlide,
  NavLink,
  ProductCard,
  Review,
  SocialLink,
} from "@/types/guianatours-com-co-e923d4eb";

export const ASSETS = "/sites/guianatours-com-co-e923d4eb/root-8a5edab2";

const SALIDAS = "https://guianatours.com.co/categoria-salidas/nuestros-proximos-destinos/";

export const PHONE_LABEL = "+57 350 225 0680";
export const PHONE_HREF = "tel:350 225 0680";
export const EMAIL = "reservas@guianatours.com.co";

export const NAV_LINKS: NavLink[] = [
  { id: "nav-inicio", label: "Inicio", href: "https://guianatours.com.co/", active: true },
  { id: "nav-guia-natours", label: "Guía Natours", href: "https://guianatours.com.co/guia-notours/" },
  { id: "nav-calendario", label: "Calendario", href: "https://guianatours.com.co/calendarios/" },
  { id: "nav-proximas-salidas", label: "Próximas salidas", href: SALIDAS },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/GuiaNatours/", network: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/guianatours/?hl=en", network: "instagram" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UChPNJPoDs94rJT4uEl8IsfA",
    network: "youtube",
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-venados-chingaza",
    image: `${ASSETS}/hero/venados-chingaza.jpg`,
    heading: "Venados en Chingaza",
    description:
      "En este mágico recorrido te llevaremos a senderos en páramo y en bosque donde veremos: el embalse, frailejones, aves y con suerte el oso andino.",
    buttonLabel: "Mira los próximos destinos",
    href: SALIDAS,
  },
  {
    id: "hero-cascada-sueva",
    image: `${ASSETS}/hero/cascada-sueve.jpg`,
    heading: "Cascada de Sueva",
    description:
      "La Cascada de Sueva, Nemustén o Churumbelos es una hermosa caída de agua de aproximadamente 50 metros",
    buttonLabel: "Mira los próximos destinos",
    href: SALIDAS,
  },
  {
    id: "hero-chingaza-nocturna",
    image: `${ASSETS}/hero/chingaza-nocturna.jpg`,
    heading: "Chingaza Nocturna (Camping, fotografía de estrellas)",
    description:
      "¿Te gustaría acampar en medio del páramo, con venados a tu alrededor y mucha naturaleza?",
    buttonLabel: "Mira los próximos destinos",
    href: SALIDAS,
  },
  {
    id: "hero-laguna-siecha",
    image: `${ASSETS}/hero/laguna-de-siecha.jpg`,
    heading: "Laguna de Siecha",
    description:
      "Haremos una de las caminatas que realizaron nuestros antepasados hasta llegar a las Lagunas Sagradas de Siecha.",
    buttonLabel: "Mira los próximos destinos",
    href: SALIDAS,
  },
];

export const PRODUCTS: ProductCard[] = [
  {
    id: "tour-farallones-sutatausa",
    title: "Farallones de Sutatausa",
    price: "169.000",
    currencySymbol: "$",
    nextDeparture: "12 Sep 2026",
    image: `${ASSETS}/products/farallones-sutatausa.jpg`,
    hoverImage: `${ASSETS}/products/farallones-sutatausa-hover.jpg`,
    href: "https://guianatours.com.co/salida/farallones-sutatausa/",
    buttonLabel: "Ver salida",
  },
  {
    id: "tour-lagunas-siecha",
    title: "Lagunas de Siecha",
    price: "199.000",
    currencySymbol: "$",
    nextDeparture: "12 Sep 2026",
    image: `${ASSETS}/products/lagunas-de-siecha.jpg`,
    hoverImage: `${ASSETS}/products/lagunas-de-siecha-hover.jpg`,
    href: "https://guianatours.com.co/salida/lagunas-de-siecha/",
    buttonLabel: "Ver salida",
  },
  {
    id: "tour-tatacoa",
    title: "Desierto de la Tatacoa (2 días)",
    price: "599.000",
    currencySymbol: "$",
    nextDeparture: "19 Sep 2026 a 20 Sep 2026",
    image: `${ASSETS}/products/tatacoa.png`,
    hoverImage: `${ASSETS}/products/tatacoa-hover.png`,
    href: "https://guianatours.com.co/salida/tatacoa/",
    buttonLabel: "Ver salida",
  },
  {
    id: "tour-chingaza-kids",
    title: "Chingaza kids «Venaditos»",
    price: "179.000",
    currencySymbol: "$",
    nextDeparture: "19 Sep 2026",
    image: `${ASSETS}/products/chingaza-kids.jpg`,
    hoverImage: `${ASSETS}/products/chingaza-kids-hover.jpg`,
    href: "https://guianatours.com.co/salida/chingaza-kids-venaditos/",
    buttonLabel: "Ver salida",
  },
  {
    id: "tour-camping-chingaza",
    title: "Camping en Chingaza",
    price: "359.000",
    currencySymbol: "$",
    nextDeparture: "19 Sep 2026 a 20 Sep 2026",
    image: `${ASSETS}/products/camping-chingaza.jpg`,
    hoverImage: `${ASSETS}/products/camping-chingaza-hover.jpg`,
    href: "https://guianatours.com.co/salida/chingaza-nocturna/",
    buttonLabel: "Ver salida",
  },
  {
    id: "tour-penas-blancas",
    title: "Peñas Blancas Chingaza",
    price: "189.000",
    currencySymbol: "$",
    nextDeparture: "20 Sep 2026",
    image: `${ASSETS}/products/penas-blancas.png`,
    hoverImage: `${ASSETS}/products/penas-blancas-hover.png`,
    href: "https://guianatours.com.co/salida/penas-blancas-chingaza/",
    buttonLabel: "Ver salida",
  },
];

export const GUIAS = {
  heading: "Guías expertos locales",
  buttonLabel: "Mira las próximas salidas",
  buttonHref: SALIDAS,
  images: [
    { src: `${ASSETS}/guias/guia-natours.jpg`, width: 439, height: 373 },
    { src: `${ASSETS}/guias/caminata-natural.jpg`, width: 446, height: 373 },
  ],
};

export const CAMPING = {
  heading: "Camping",
  body: "Si quieres acampar en Chingaza con venados, en el páramo, con buenas instalaciones y aparte ver un cielo nocturno lleno de estrellas , te llevamos al interior del Parque.",
  buttonLabel: "Mira los próximos destinos",
  buttonHref: SALIDAS,
  image: { src: `${ASSETS}/camping/1024.jpg`, width: 1024, height: 1024 },
};

export const FOTOGRAFIAS = {
  heading: "Fotografías de la semana",
  body: "Si quieres acampar en Chingaza con venados, en el páramo, con buenas instalaciones y aparte ver un cielo nocturno lleno de estrellas , te llevamos al interior del Parque.",
};

const UPLOADS = "https://guianatours.com.co/wp-content/uploads";

export const GALLERY: GalleryItem[] = [
  { id: "gallery-dsc-4263", thumb: `${ASSETS}/gallery/dsc-4263.png`, full: `${UPLOADS}/2022/09/DSC_4263.png`, title: "DSC_4263", width: 300, height: 200 },
  { id: "gallery-1", thumb: `${ASSETS}/gallery/1.jpg`, full: `${UPLOADS}/2022/03/1.jpg`, title: "1", width: 300, height: 202 },
  { id: "gallery-dsc-0452", thumb: `${ASSETS}/gallery/dsc-0452.jpg`, full: `${UPLOADS}/2021/11/DSC_0452.jpg`, title: "siecha", width: 300, height: 200 },
  { id: "gallery-camping", thumb: `${ASSETS}/gallery/camping.jpg`, full: `${UPLOADS}/2021/11/1024.jpg`, title: "camping", width: 300, height: 300 },
  { id: "gallery-chingaza-nocturna", thumb: `${ASSETS}/gallery/chingaza-nocturna.jpeg`, full: `${UPLOADS}/2022/09/chingaza-nocturna.jpeg`, title: "chingaza nocturna", width: 200, height: 300 },
  { id: "gallery-chingaza-kids", thumb: `${ASSETS}/gallery/chingaza-kids.jpeg`, full: `${UPLOADS}/2022/09/chingaza.kids_.jpeg`, title: "chingaza.kids", width: 200, height: 300 },
  { id: "gallery-farallones", thumb: `${ASSETS}/gallery/farallones.jpeg`, full: `${UPLOADS}/2022/09/farallones.jpeg`, title: "farallones", width: 300, height: 200 },
  { id: "gallery-kids", thumb: `${ASSETS}/gallery/kids.jpeg`, full: `${UPLOADS}/2022/09/kids.jpeg`, title: "kids", width: 203, height: 300 },
  { id: "gallery-siecha", thumb: `${ASSETS}/gallery/siecha.jpeg`, full: `${UPLOADS}/2022/09/siecha.jpeg`, title: "siecha", width: 300, height: 200 },
  { id: "gallery-sueva", thumb: `${ASSETS}/gallery/sueva.jpeg`, full: `${UPLOADS}/2022/09/sueva.jpeg`, title: "sueva", width: 300, height: 215 },
  { id: "gallery-venados", thumb: `${ASSETS}/gallery/venados.jpeg`, full: `${UPLOADS}/2022/09/venados.jpeg`, title: "venados", width: 300, height: 200 },
];

export const REVIEWS_SUMMARY = {
  rating: "EXCELENTE",
  countLabel: "A base de 2976 reseñas",
  stars: 5,
};

export const REVIEWS: Review[] = [
  {
    id: "review-manuel-nacho",
    author: "Manuel Nacho",
    relativeDate: "hace 4 años",
    isoDate: "2022-02-03",
    rating: 5,
    text: "El Parque Natural es un lugar completamente mágico. Poder recorrer un páramo y luego un bosque alto Andino es un privilegio natural que tenemos cerca a Bogotá.Lo único que tendrían que implementar sería que en la charla de inducción en Piedras Gordas tuvieran al menos los vídeos subtitulados en inglés para los visitantes extranjeros.",
  },
  {
    id: "review-wilber-cifuentes",
    author: "wilber cifuentes ruiz",
    relativeDate: "hace 4 años",
    isoDate: "2022-01-31",
    rating: 5,
    text: "Hermoso lugar",
  },
  {
    id: "review-sergio-velasquez",
    author: "Sergio Velasquez",
    relativeDate: "hace 4 años",
    isoDate: "2022-01-30",
    rating: 5,
    text: "Excelente",
  },
  {
    id: "review-luis-sabogal",
    author: "Luis Sabogal",
    relativeDate: "hace 4 años",
    isoDate: "2022-01-24",
    rating: 5,
    text: "Es un paisaje fuera de lo comun",
  },
  {
    id: "review-lamolina-chiquita",
    author: "LaMolina Chiquita",
    relativeDate: "hace 4 años",
    isoDate: "2022-01-22",
    rating: 5,
    text: "Un lugar lleno de vida y paz... En un lugar cin increíbles paisajes",
  },
  {
    id: "review-luz-elena-martinez",
    author: "Luz Elena Martinez Martinez",
    relativeDate: "hace 4 años",
    isoDate: "2022-01-21",
    rating: 5,
    text: "Genial",
  },
];

export const FOOTER = {
  registro: "Guía Natours S.A.S Registro Nacional de Turismo 213539",
  sitemapHeading: "Mapa del sitio",
  legalHeading: "Legal",
  subscribeHeading: "Suscríbete",
  legalLinks: [
    { label: "Términos y Condiciones", href: "https://guianatours.com.co/terminos-y-condiciones/" },
    { label: "Políticas de privacidad", href: "https://guianatours.com.co/politicas-de-privacidad/" },
    { label: "Políticas de Cancelación", href: "https://guianatours.com.co/politicas-de-cancelacion/" },
    {
      label: "Protocolos de bioseguridad",
      href: "https://guianatours.com.co/wp-content/uploads/2021/11/bioseguridad.pdf",
    },
  ],
  form: {
    namePlaceholder: "Nombre y apellido",
    emailPlaceholder: "Email",
    submitLabel: "Suscribirme",
  },
  copyright: "© 2026 | Web diseñada por ",
  // Original site credited "Coudix" (its builder); this clone is credited to khoopper instead.
  designer: { label: "khoopper", href: null as string | null },
};
