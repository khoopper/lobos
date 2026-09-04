"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  MenuIcon,
  PhoneAltIcon,
  ShoppingCartIcon,
  YoutubeIcon,
} from "@/components/sites/guianatours-com-co-e923d4eb/shared/icons";
import type { NavLink, SocialLink } from "@/types/guianatours-com-co-e923d4eb";

const CART_HREF = "https://guianatours.com.co/carrito/";
const HOME_HREF = "https://guianatours.com.co/";

const SOCIAL_GLYPH = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
} as const;

function Logo({ className, logoUrl }: { className?: string; logoUrl: string | null }) {
  return (
    <a href={HOME_HREF} aria-label="Club de Lobos" className={className}>
      <Image
        src={logoUrl ?? "/brand/lobos/logo-white-640.png"}
        alt="Club de Lobos"
        width={640}
        height={640}
        priority
        className="block h-auto w-[92px] max-[1024px]:w-[90px]"
      />
    </a>
  );
}

function CartButton({ className }: { className?: string }) {
  return (
    <a
      href={CART_HREF}
      aria-label="Carrito de la compra"
      className={cn("relative flex items-center text-white", className)}
    >
      <ShoppingCartIcon className="h-6 w-6" />
      <span className="absolute -right-1.5 -top-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[var(--gn-palette-1)] px-1 text-[10px] leading-none text-white">
        0
      </span>
    </a>
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <header className="absolute inset-x-0 top-0 z-[100] bg-transparent">
      {/* ---------- desktop header (>=1025px) ---------- */}
      <div className="hidden min-[1025px]:block">
        {/* row 1 — logo / contact / social */}
        <div className="h-[83.47px]">
          <div className="mx-auto flex h-full max-w-[1140px] items-start justify-between px-5">
            <Logo className="block" logoUrl={logoUrl} />
            <div className="flex items-start justify-end">
              <a
                href={phoneHref}
                className="mx-[5.1px] mt-[10.2px] flex h-[27.19px] items-center text-[17px] leading-[27.2px] font-normal text-white transition-[color] duration-100 ease-linear"
              >
                <PhoneAltIcon className="mr-[6px] h-[17px] w-[17px]" />
                <span>{phoneLabel}</span>
              </a>
              {socialLinks.map((social) => {
                const Glyph = SOCIAL_GLYPH[social.network];
                return (
                  <a
                    key={social.network}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-[2.55px] mt-[5.1px] flex h-[34px] w-[34px] items-center justify-center rounded-[50px] bg-white text-[var(--gn-palette-1)] transition-all duration-200 ease-in-out"
                  >
                    <Glyph className="h-[17px] w-[17px]" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* row 2 — primary navigation + cart */}
        <div className="h-[50px]">
          <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-5">
            <div aria-hidden="true" />
            <div className="flex items-center">
              <nav aria-label="Menú principal">
                <ul className="flex items-center">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        aria-current={link.active ? "page" : undefined}
                        className={cn(
                          "block p-[10.2px] text-[17px] leading-[27.2px] font-normal transition-colors duration-200 ease-in-out hover:text-[var(--gn-palette-7)]",
                          link.active ? "text-[var(--gn-palette-7)]" : "text-white",
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <CartButton className="pl-[17px] pt-[3.4px]" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- mobile header (<=1024px) ---------- */}
      <div className="min-[1025px]:hidden">
        <div className="flex h-[92px] items-center justify-between px-[5px] max-[767px]:h-[92px] min-[768px]:h-[75px] min-[768px]:px-5">
          <Logo className="block" logoUrl={logoUrl} />
          <div className="flex items-center gap-[10px]">
            <CartButton />
            <button
              type="button"
              id="mobile-toggle"
              aria-label="Abrir menú"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="flex h-[41.19px] w-[46.78px] items-center justify-center rounded-lg bg-white/[0.03] px-[8.4px] py-[5.6px] text-white"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- mobile drawer ---------- */}
      <div
        className={cn(
          "fixed inset-0 z-[999] transition-opacity duration-300 min-[1025px]:hidden",
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          tabIndex={-1}
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-black/50"
        />
        <div className="absolute inset-y-0 right-0 flex w-[300px] max-w-[85vw] flex-col bg-[var(--gn-palette-1)] p-6">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setDrawerOpen(false)}
            className="self-end p-2 text-white"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
          <nav aria-label="Menú móvil" className="mt-4">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    aria-current={link.active ? "page" : undefined}
                    className={cn(
                      "block py-3 text-[17px] leading-[27.2px] transition-colors duration-200 ease-in-out hover:text-[var(--gn-palette-7)]",
                      link.active ? "text-[var(--gn-palette-7)]" : "text-white",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
