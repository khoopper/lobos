import Image from "next/image";
import { EnvelopeIcon, FacebookIcon, InstagramIcon, PhoneSolidIcon, YoutubeIcon } from "@/components/sites/guianatours-com-co-e923d4eb/shared/icons";
import type { NavLink, SocialLink } from "@/types/guianatours-com-co-e923d4eb";

const SOCIAL_GLYPH = { facebook: FacebookIcon, instagram: InstagramIcon, youtube: YoutubeIcon } as const;

export interface SiteFooterProps {
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  phoneLabel: string;
  phoneHref: string;
  email: string;
  logoUrl: string | null;
  registro: string | null;
  copyright: string;
  creditLabel: string;
  creditHref: string | null;
}

export function SiteFooter({ navLinks, socialLinks, phoneLabel, phoneHref, email, logoUrl, registro, copyright, creditLabel, creditHref }: SiteFooterProps) {
  const instagram = socialLinks.find((social) => social.network === "instagram");
  return (
    <footer className="mt-14 bg-[var(--gn-palette-1)] text-white" id="contacto">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-14 md:grid-cols-[1.2fr_.8fr_1fr]">
        <div>
          <Image src={logoUrl ?? "/brand/lobos/logo-white-1024.png"} alt="Club de Lobos" width={1024} height={1024} className="mb-5 h-32 w-32 object-contain" />
          <p className="max-w-sm text-sm leading-6 text-white/80">Somos un club de amigos que disfruta la aventura, el senderismo, el camping y vivir cada ruta al máximo.</p>
          {registro ? <p className="mt-3 text-xs font-semibold uppercase tracking-[.16em] text-[var(--gn-palette-7)]">{registro}</p> : null}
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[.16em]">Explora</h2>
          <nav aria-label="Mapa del sitio" className="flex flex-col gap-3">
            {navLinks.map((link) => <a key={link.id} href={link.href} className="text-sm text-white/80 transition-colors hover:text-[var(--gn-palette-7)]">{link.label}</a>)}
          </nav>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[.16em]">Hablemos de tu próxima aventura</h2>
          <div className="space-y-3">
            <a href={phoneHref} className="flex items-start gap-3 text-sm text-white/85 hover:text-white"><PhoneSolidIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gn-palette-7)]" /><span>{phoneLabel}</span></a>
            {email ? <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-white/85 hover:text-white"><EnvelopeIcon className="h-4 w-4 text-[var(--gn-palette-7)]" />{email}</a> : null}
          </div>
          {instagram ? <a href={instagram.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-lg bg-[var(--gn-palette-7)] px-5 py-3 text-sm font-bold text-[var(--gn-palette-2)] transition-transform hover:-translate-y-0.5">Escríbenos en Instagram</a> : null}
          <div className="mt-5 flex gap-2">
            {socialLinks.map((social) => { const Glyph = SOCIAL_GLYPH[social.network]; return <a key={social.network} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--gn-palette-1)]"><Glyph className="h-4 w-4" /></a>; })}
          </div>
        </div>
      </div>

      <div className="bg-[var(--gn-palette-2)] px-6 py-5">
        <p className="mx-auto max-w-[1180px] text-center text-xs text-white/70">
          {copyright}{creditLabel ? <> {creditHref ? <a href={creditHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-white">{creditLabel}</a> : <span className="font-semibold text-white">{creditLabel}</span>}</> : null}
        </p>
      </div>
    </footer>
  );
}
