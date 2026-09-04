import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import type { SiteSettingsData } from "@/lib/queries/site-content";

function absoluteUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Organization schema — the branded-search win: gives Google a name, logo
 * and verified social profiles to attach to a "Club de Lobos" query. */
export function buildOrganizationJsonLd(settings: SiteSettingsData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(settings.logoHeaderUrl),
    description: "Club de amigos que organiza senderismo, camping, viajes y aventuras guiadas por El Salvador.",
    sameAs: settings.socialLinks.map((link) => link.href),
    ...(settings.phoneHref
      ? {
          contactPoint: [{
            "@type": "ContactPoint",
            telephone: settings.phoneLabel,
            contactType: "customer service",
            areaServed: "SV",
            availableLanguage: ["es"],
          }],
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface TourEventInput {
  title: string;
  slug: string;
  departureStart: string;
  departureEnd: string | null;
  description: string;
  imageUrl?: string;
  price: string;
}

/** Free-text prices ("Consultar") don't map to a valid Offer — only emit
 * one when the admin's price field is actually a number. */
function parsePrice(price: string): number | null {
  const numeric = price.replace(/[^0-9.]/g, "");
  const value = Number(numeric);
  return numeric && Number.isFinite(value) && value > 0 ? value : null;
}

/** Event schema — El Salvador tour operators rank in Google's event/trip
 * rich results with startDate + location + offers, not a generic Product. */
export function buildTourEventJsonLd(tour: TourEventInput) {
  const url = `${SITE_URL}/salidas/${encodeURIComponent(tour.slug)}`;
  const price = parsePrice(tour.price);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: tour.title,
    startDate: tour.departureStart,
    endDate: tour.departureEnd ?? tour.departureStart,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: tour.description,
    image: tour.imageUrl ? [tour.imageUrl] : undefined,
    url,
    location: {
      "@type": "Place",
      name: "El Salvador",
      address: { "@type": "PostalAddress", addressCountry: "SV" },
    },
    organizer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
  };
}

/** `<` is escaped so a title/description containing "</script>" can never
 * break out of the tag when this is injected via dangerouslySetInnerHTML. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
