"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CloseIcon, FacebookIcon, InstagramIcon, MenuIcon, PhoneAltIcon, YoutubeIcon } from "@/components/sites/guianatours-com-co-e923d4eb/shared/icons";
import type { NavLink, SocialLink } from "@/types/guianatours-com-co-e923d4eb";

const SOCIAL_GLYPH = { facebook: FacebookIcon, instagram: InstagramIcon, youtube: YoutubeIcon } as const;

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function Logo({ logoUrl, className }: { logoUrl: string | null; className?: string }) {
  return (
    <Link href="/" aria-label="Club de Lobos — Inicio" className={cn("block shrink-0", className)}>
      <Image
        src={logoUrl ?? "/brand/lobos/logo-white-640.png"}
        alt="Club de Lobos"
        width={640}
        height={640}
        priority
        className="h-[78px] w-[78px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,.25)] max-md:h-16 max-md:w-16"
      />
    </Link>
  );
}

export interface SiteHeaderProps {
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  phoneLabel: string;
  phoneHref: string;
  logoUrl: string | null;
}

export function SiteHeader({ navLinks, socialLinks, phoneLabel, phoneHref, logoUrl }: SiteHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <header className="absolute inset-x-0 top-0 z-[100] border-b border-white/15 bg-gradient-to-b from-black/65 to-transparent text-white">
      <div className="mx-auto flex h-[108px] max-w-[1220px] items-center gap-8 px-6 max-md:h-[84px] max-md:px-4">
        <Logo logoUrl={logoUrl} />

        <nav aria-label="Navegación principal" className="hidden min-w-0 flex-1 items-center justify-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={isExternal(link.href) ? "_blank" : undefined}
              rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
              className="whitespace-nowrap text-sm font-semibold tracking-wide text-white/90 transition-colors hover:text-[var(--gn-palette-7)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <a href={phoneHref} className="flex items-center gap-2 text-xs font-semibold text-white transition-colors hover:text-[var(--gn-palette-7)]">
            <PhoneAltIcon className="h-4 w-4" />
            <span>{phoneLabel}</span>
          </a>
          {socialLinks.map((social) => {
            const Glyph = SOCIAL_GLYPH[social.network];
            return (
              <a key={social.network} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--gn-palette-1)] transition-transform hover:-translate-y-0.5">
                <Glyph className="h-[17px] w-[17px]" />
              </a>
            );
          })}
        </div>

        <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Abrir menú" className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 lg:hidden">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      <div className={cn("fixed inset-0 z-[110] bg-black/55 transition-opacity lg:hidden", drawerOpen ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside className={cn("fixed right-0 top-0 z-[120] flex h-dvh w-[min(86vw,360px)] flex-col bg-[var(--gn-palette-2)] p-6 shadow-2xl transition-transform duration-300 lg:hidden", drawerOpen ? "translate-x-0" : "translate-x-full")} aria-hidden={!drawerOpen}>
        <div className="mb-8 flex items-center justify-between">
          <span className="text-sm font-bold tracking-[.16em] text-white">CLUB DE LOBOS</span>
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar menú" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Navegación móvil" className="flex flex-col">
          {navLinks.map((link) => (
            <a key={link.id} href={link.href} target={isExternal(link.href) ? "_blank" : undefined} rel={isExternal(link.href) ? "noopener noreferrer" : undefined} onClick={() => setDrawerOpen(false)} className="border-b border-white/10 py-4 text-base font-semibold text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto space-y-5 pt-8">
          <a href={phoneHref} className="flex items-start gap-3 text-sm text-white">
            <PhoneAltIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gn-palette-7)]" />
            {phoneLabel}
          </a>
          <div className="flex gap-3">
            {socialLinks.map((social) => {
              const Glyph = SOCIAL_GLYPH[social.network];
              return <a key={social.network} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--gn-palette-1)]"><Glyph className="h-5 w-5" /></a>;
            })}
          </div>
        </div>
      </aside>
    </header>
  );
}
