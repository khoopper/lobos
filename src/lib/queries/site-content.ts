import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem, HeroSlide, NavLink, ProductCard, Review, SocialLink } from "@/types/guianatours-com-co-e923d4eb";

const ADVENTURES_HREF = "/#proximas-aventuras";
const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"] as const;

function formatDeparture(start: string, end: string | null): string {
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d} ${MONTHS_ES[m - 1]} ${y}`;
  };
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

export interface SiteSettingsData {
  logoHeaderUrl: string | null;
  logoFooterUrl: string | null;
  faviconUrl: string | null;
  phoneLabel: string;
  phoneHref: string;
  email: string;
  address: string | null;
  socialLinks: SocialLink[];
  palette: { 1: string; 2: string; 3: string; 5: string; 7: string; 8: string };
  footerRegistro: string | null;
  footerCopyright: string;
  footerCreditLabel: string;
  footerCreditHref: string | null;
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  const socialLinks: SocialLink[] = [];
  if (data?.social_facebook_url) socialLinks.push({ label: "Facebook", href: data.social_facebook_url, network: "facebook" });
  if (data?.social_instagram_url) socialLinks.push({ label: "Instagram", href: data.social_instagram_url, network: "instagram" });
  if (data?.social_youtube_url) socialLinks.push({ label: "YouTube", href: data.social_youtube_url, network: "youtube" });

  return {
    logoHeaderUrl: data?.logo_header_url ?? "/brand/lobos/logo-white-640.png",
    logoFooterUrl: data?.logo_footer_url ?? "/brand/lobos/logo-white-1024.png",
    faviconUrl: data?.favicon_url ?? "/brand/lobos/favicon-32.png",
    phoneLabel: data?.phone_label ?? "+503 7952-8033 / +503 7554-6785",
    phoneHref: data?.phone_href ?? "tel:+50379528033",
    email: data?.email ?? "",
    address: data?.address ?? null,
    socialLinks,
    palette: {
      1: data?.palette_1 ?? "#1b3a2d",
      2: data?.palette_2 ?? "#0b0f0d",
      3: data?.palette_3 ?? "#17201a",
      5: data?.palette_5 ?? "#556057",
      7: data?.palette_7 ?? "#e5b45f",
      8: data?.palette_8 ?? "#f5f3eb",
    },
    footerRegistro: data?.footer_registro ?? "El Salvador · Aventuras desde 2018",
    footerCopyright: data?.footer_copyright ?? `© ${new Date().getFullYear()} Club de Lobos.`,
    footerCreditLabel: data?.footer_credit_label ?? "",
    footerCreditHref: data?.footer_credit_href ?? null,
  };
});

export async function getNavLinks(): Promise<NavLink[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("nav_links").select("id, label, href").eq("is_active", true).order("sort_order");
  return (data ?? []).map((link) => ({ ...link, active: link.href === "/" }));
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_slides")
    .select("id, image_url, heading, description, button_label, href")
    .order("sort_order");
  return (data ?? []).map((slide) => ({
    id: slide.id,
    image: slide.image_url,
    heading: slide.heading,
    description: slide.description,
    buttonLabel: slide.button_label,
    href: slide.href,
  }));
}

export async function getTours(): Promise<ProductCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tours")
    .select("id, title, price, currency_symbol, departure_start, departure_end, image_url, hover_image_url, button_label")
    .order("sort_order");
  return (data ?? []).map((tour) => ({
    id: tour.id,
    title: tour.title,
    price: tour.price,
    currencySymbol: tour.currency_symbol,
    nextDeparture: formatDeparture(tour.departure_start, tour.departure_end),
    image: tour.image_url,
    hoverImage: tour.hover_image_url ?? tour.image_url,
    href: ADVENTURES_HREF,
    buttonLabel: tour.button_label,
  }));
}

export interface GuiasBlock {
  heading: string;
  buttonLabel: string;
  buttonHref: string;
  images: { src: string; width: number; height: number }[];
}

export interface CampingBlock {
  heading: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  image: { src: string; width: number; height: number } | null;
}

export interface FotografiasBlock { heading: string; body: string }

export async function getContentBlocks(): Promise<{ guias: GuiasBlock; camping: CampingBlock; fotografias: FotografiasBlock }> {
  const supabase = await createClient();
  const { data } = await supabase.from("content_blocks").select("key, data");
  const byKey = Object.fromEntries((data ?? []).map((block) => [block.key, block.data]));
  return {
    guias: (byKey.guias as unknown as GuiasBlock) ?? { heading: "", buttonLabel: "", buttonHref: ADVENTURES_HREF, images: [] },
    camping: (byKey.camping as unknown as CampingBlock) ?? { heading: "", body: "", buttonLabel: "", buttonHref: ADVENTURES_HREF, image: null },
    fotografias: (byKey.fotografias as unknown as FotografiasBlock) ?? { heading: "", body: "" },
  };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("gallery_items").select("id, image_url, image_w, image_h, title").order("sort_order");
  return (data ?? []).map((item) => ({
    id: item.id,
    thumb: item.image_url,
    full: item.image_url,
    title: item.title,
    width: item.image_w,
    height: item.image_h,
  }));
}

export interface ReviewsData { reviews: Review[]; summary: { rating: string; countLabel: string; stars: number } }

export async function getReviews(): Promise<ReviewsData> {
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select("id, author, review_date, rating, body_text").order("sort_order");
  const reviews: Review[] = (data ?? []).map((review) => ({
    id: review.id,
    author: review.author,
    relativeDate: relativeYearsAgo(review.review_date),
    isoDate: review.review_date,
    rating: review.rating,
    text: review.body_text,
  }));
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  return {
    reviews,
    summary: {
      rating: average ? average.toFixed(1) : "",
      countLabel: `${reviews.length} ${reviews.length === 1 ? "testimonio" : "testimonios"}`,
      stars: Math.round(average),
    },
  };
}

function relativeYearsAgo(isoDate: string): string {
  const years = Math.max(0, new Date().getFullYear() - new Date(isoDate).getFullYear());
  if (years === 0) return "recientemente";
  return years === 1 ? "hace 1 año" : `hace ${years} años`;
}
