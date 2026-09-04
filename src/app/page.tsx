import { SiteHeader } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/SiteHeader";
import { HeroSlider } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/HeroSlider";
import { ProximosDestinos } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/ProximosDestinos";
import { GuiasExpertos } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/GuiasExpertos";
import { CampingSection } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/CampingSection";
import { ReviewsSection } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/ReviewsSection";
import { FotografiasSemana } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/FotografiasSemana";
import { SiteFooter } from "@/components/sites/guianatours-com-co-e923d4eb/root-8a5edab2/SiteFooter";
import {
  getContentBlocks,
  getGalleryItems,
  getHeroSlides,
  getNavLinks,
  getReviews,
  getSiteSettings,
  getTours,
} from "@/lib/queries/site-content";

export default async function Home() {
  const [settings, navLinks, heroSlides, tours, blocks, gallery, reviewsData] = await Promise.all([
    getSiteSettings(),
    getNavLinks(),
    getHeroSlides(),
    getTours(),
    getContentBlocks(),
    getGalleryItems(),
    getReviews(),
  ]);

  return (
    <div
      className="relative w-full"
      style={
        {
          "--gn-palette-1": settings.palette[1],
          "--gn-palette-2": settings.palette[2],
          "--gn-palette-3": settings.palette[3],
          "--gn-palette-5": settings.palette[5],
          "--gn-palette-7": settings.palette[7],
          "--gn-palette-8": settings.palette[8],
        } as React.CSSProperties
      }
    >
      <SiteHeader
        navLinks={navLinks}
        socialLinks={settings.socialLinks}
        phoneLabel={settings.phoneLabel}
        phoneHref={settings.phoneHref}
        logoUrl={settings.logoHeaderUrl}
      />
      <main className="w-full">
        <HeroSlider slides={heroSlides} />
        <ProximosDestinos tours={tours} />
        <GuiasExpertos block={blocks.guias} />
        <CampingSection block={blocks.camping} />
        <ReviewsSection reviews={reviewsData.reviews} summary={reviewsData.summary} />
        <FotografiasSemana block={blocks.fotografias} gallery={gallery} />
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
    </div>
  );
}
