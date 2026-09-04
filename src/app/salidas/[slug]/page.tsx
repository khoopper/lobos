import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  Camera,
  CircleDollarSign,
  Clock3,
  Compass,
  Gauge,
  Mountain,
  Route,
  Thermometer,
  TrendingUp,
  Trees,
  TentTree,
  UsersRound,
  Waves,
} from "lucide-react";
import { CookieNotice } from "@/components/CookieNotice";
import { SiteFooter } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/SiteFooter";
import { SiteHeader } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/SiteHeader";
import { TourBookingPanel } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/TourBookingPanel";
import {
  getNavLinks,
  getPublishedTourSlugs,
  getSiteSettings,
  getTourBySlug,
} from "@/lib/queries/site-content";
import { getStoredTourDetailRecord, resolveTourDetailCopy } from "@/lib/queries/tour-details";
import type { TourIconId } from "@/lib/tour-details";

export const revalidate = 86400;
export const dynamicParams = true;

interface TourPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [tour, storedDetails] = await Promise.all([getTourBySlug(slug), getStoredTourDetailRecord()]);
  if (!tour) return { title: "Salida no encontrada | Club de Lobos" };
  const duration = getDuration(tour.departureStart, tour.departureEnd);
  const price = [tour.currencySymbol, tour.price].filter(Boolean).join(" ");
  const detail = resolveTourDetailCopy({ id: tour.id, slug, duration, price }, storedDetails);
  return {
    title: `${tour.title} | Club de Lobos`,
    description: detail.lead,
    openGraph: {
      title: `${tour.title} | Club de Lobos`,
      description: detail.lead,
      images: [{ url: tour.imageUrl, width: tour.imageWidth, height: tour.imageHeight }],
    },
  };
}

function getDuration(start: string, end: string | null) {
  if (!end) return "1 día";
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  const days = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1);
  return `${days} días`;
}

const FACT_ICONS: Record<TourIconId, typeof Activity> = {
  compass: Compass,
  activity: Activity,
  gauge: Gauge,
  clock: Clock3,
  mountain: Mountain,
  elevation: TrendingUp,
  temperature: Thermometer,
  trees: Trees,
  route: Route,
  people: UsersRound,
  price: CircleDollarSign,
  tent: TentTree,
  camera: Camera,
  waves: Waves,
};

const INFORMATION_SECTIONS = [
  {
    title: "Antes de salir",
    body: "Te enviaremos el punto de encuentro, horario definitivo y recomendaciones cuando confirmemos tu solicitud.",
  },
  {
    title: "Qué haremos",
    body: "Compartiremos la ruta con la manada, respetando el ritmo del grupo, el entorno y las indicaciones de seguridad.",
  },
  {
    title: "Qué incluye",
    body: "Coordinación previa, acompañamiento del grupo y orientación general durante la experiencia. Los servicios específicos se detallan al confirmar.",
  },
  {
    title: "Qué llevar",
    body: "Ropa cómoda, calzado adecuado, agua, protección solar y los artículos particulares que indiquemos para el destino.",
  },
  {
    title: "Qué no llevar",
    body: "Evita objetos innecesarios, envases desechables y cualquier elemento que pueda afectar el entorno o dificultar la caminata.",
  },
] as const;

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;
  const [tour, settings, navLinks, storedDetails] = await Promise.all([
    getTourBySlug(slug),
    getSiteSettings(),
    getNavLinks("/proximas-salidas"),
    getStoredTourDetailRecord(),
  ]);
  if (!tour) notFound();

  const duration = getDuration(tour.departureStart, tour.departureEnd);
  const price = [tour.currencySymbol, tour.price].filter(Boolean).join(" ");
  const detail = resolveTourDetailCopy({ id: tour.id, slug, duration, price }, storedDetails);

  return (
    <div
      className="relative w-full bg-white"
      style={{
        "--gn-palette-1": settings.palette[1],
        "--gn-palette-2": settings.palette[2],
        "--gn-palette-3": settings.palette[3],
        "--gn-palette-5": settings.palette[5],
        "--gn-palette-7": settings.palette[7],
        "--gn-palette-8": settings.palette[8],
      } as React.CSSProperties}
    >
      <SiteHeader
        navLinks={navLinks}
        socialLinks={settings.socialLinks}
        phoneLabel={settings.phoneLabel}
        phoneHref={settings.phoneHref}
        logoUrl={settings.logoHeaderUrl}
      />

      <section className="relative h-[190px] overflow-hidden bg-[var(--gn-palette-2)] sm:h-[230px]">
        <Image
          src={tour.imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-[var(--gn-palette-2)]/70" />
      </section>

      <main className="px-5 py-10 sm:py-14">
        <div className="mx-auto max-w-[1140px]">
          <Link
            href="/proximas-salidas"
            className="mb-6 inline-flex text-sm font-semibold text-[var(--gn-palette-1)] hover:underline"
          >
            ← Volver a próximas aventuras
          </Link>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
            <article className="min-w-0">
              <header>
                <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--gn-palette-1)]">
                  Club de Lobos · El Salvador
                </p>
                <h1 className="mt-2 text-3xl font-extrabold leading-tight text-[var(--gn-palette-3)] sm:text-4xl">
                  {tour.title}
                </h1>
                <h2 className="mt-1 text-lg font-bold text-[var(--gn-palette-3)]">Información general de la salida</h2>
              </header>

              <div className="mt-8 space-y-5 text-[17px] leading-7 text-[var(--gn-palette-5)]">
                <p className="font-medium text-[var(--gn-palette-3)]">{detail.lead}</p>
                {detail.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>

              <section aria-label="Datos de la salida" className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
                {detail.facts.map((fact) => {
                  const Icon = FACT_ICONS[fact.icon] ?? Activity;
                  return (
                    <div key={fact.key} className="flex min-h-36 flex-col items-center justify-center bg-[var(--gn-palette-7)] p-3 text-center">
                      <Icon strokeWidth={1.55} className="mb-3 h-11 w-11 text-[var(--gn-palette-1)]" />
                      <strong className="text-sm text-[var(--gn-palette-3)]">{fact.label}</strong>
                      <span className="mt-1 text-[11px] leading-4 text-[var(--gn-palette-5)]">{fact.value}</span>
                    </div>
                  );
                })}
              </section>

              <section className="mt-10 rounded-2xl bg-[var(--gn-palette-8)] p-5 sm:p-7">
                <h2 className="text-xl font-extrabold text-[var(--gn-palette-3)]">Itinerario general</h2>
                <div className="mt-5 space-y-5 border-l-2 border-[var(--gn-palette-7)] pl-5">
                  <div>
                    <p className="font-bold text-[var(--gn-palette-1)]">Punto de encuentro</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--gn-palette-5)]">Lugar y hora por confirmar con las personas inscritas.</p>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--gn-palette-1)]">Experiencia</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--gn-palette-5)]">Recorrido, pausas y actividades de acuerdo con el destino y las condiciones del día.</p>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--gn-palette-1)]">Regreso</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--gn-palette-5)]">El horario estimado se compartirá junto con el itinerario definitivo.</p>
                  </div>
                </div>
              </section>

              <section className="mt-8 divide-y divide-black/10 border-y border-black/10">
                {INFORMATION_SECTIONS.map((section) => (
                  <details key={section.title} className="group py-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-bold text-[var(--gn-palette-3)]">
                      {section.title}
                      <span className="text-xl font-normal text-[var(--gn-palette-1)] transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-5 pr-8 text-sm leading-6 text-[var(--gn-palette-5)]">{section.body}</p>
                  </details>
                ))}
              </section>
            </article>

            <TourBookingPanel
              tourId={tour.id}
              tourTitle={tour.title}
              departureStart={tour.departureStart}
              duration={duration}
              price={price}
            />
          </div>
        </div>
      </main>

      <SiteFooter
        navLinks={navLinks}
        socialLinks={settings.socialLinks}
        phoneLabel={settings.phoneLabel}
        phoneHref={settings.phoneHref}
        email={settings.email}
        logoUrl={settings.logoFooterUrl}
        registro={settings.footerRegistro}
        copyright={settings.footerCopyright}
        creditLabel={settings.footerCreditLabel}
        creditHref={settings.footerCreditHref}
      />
      <CookieNotice />
    </div>
  );
}
