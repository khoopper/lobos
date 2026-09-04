"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductCard as ProductCardData } from "@/types/guianatours-com-co-e923d4eb";
import { BookingDialog } from "./BookingDialog";

/**
 * WooCommerce loop card as rendered by Kadence with
 * `woo-archive-action-on-hover` + `woo-archive-image-hover-zoom`.
 *
 * Three things happen together on hover:
 *   .product-details   → translateY(-2rem)
 *   .product-action-wrap → bottom -2rem → -0.8rem, opacity 0 → 1
 *   primary image      → scale(1.07); secondary image opacity 0 → 1
 *
 * The "Ver salida" button opens the booking dialog instead of navigating —
 * there's no per-tour detail page yet, so the image/title still link to the
 * shared category URL (product.href) while the button is the real CTA.
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <li className="gn-product-card group relative flex flex-col overflow-hidden rounded-2xl bg-white">
      {/* .closest-booking-availability */}
      <div className="absolute left-0 top-0 z-[1] rounded-br-xl bg-white/95 px-4 py-2 text-xs leading-5 font-normal text-[var(--gn-palette-1)] backdrop-blur">
        <span>
          <b className="font-bold">Fecha:</b> {product.nextDeparture}
        </span>
      </div>

      {/* .woocommerce-loop-image-link */}
      <a
        href={product.href}
        className="relative block aspect-[4/5] w-full overflow-hidden"
        aria-label={product.title}
      >
        <Image
          src={product.image}
          alt={product.title}
          width={512}
          height={640}
          className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <Image
          src={product.hoverImage}
          alt=""
          aria-hidden="true"
          width={512}
          height={640}
          className="absolute inset-0 h-full min-h-full w-full object-cover opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100"
        />
      </a>

      {/* .product-details / .entry-content-wrap */}
      <div className="relative mx-[8.5px] flex flex-col rounded-[4px] bg-white px-4 pb-6 pt-4 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.17,0.67,0.35,0.95)] group-hover:-translate-y-8 group-focus-within:-translate-y-8">
        <h2 className="py-2 text-[15px] leading-[22.5px] font-semibold text-[var(--gn-palette-3)]">
          <a href={product.href}>{product.title}</a>
        </h2>
        <span className="mb-[14.569px] block text-[14.569px] leading-[23.31px] font-normal text-[var(--gn-palette-5)]">
          {product.currencySymbol ? <><span>{product.currencySymbol}</span>&nbsp;</> : null}{product.price}
        </span>

        {/* .product-action-wrap */}
        <div className="absolute inset-x-0 -bottom-8 px-4 opacity-0 transition-opacity duration-300 [transition-timing-function:cubic-bezier(0.17,0.67,0.35,0.95)] group-hover:bottom-[-12.8px] group-hover:opacity-100 group-focus-within:bottom-[-12.8px] group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setBookingOpen(true)}
            className="block w-full rounded-lg bg-[var(--gn-palette-1)] px-[17px] py-[6.8px] text-center text-[17px] leading-[27.2px] font-normal text-white transition-[color,background,border] duration-200 hover:bg-[var(--gn-palette-2)]"
          >
            {product.buttonLabel}
          </button>
        </div>
      </div>

      {bookingOpen ? (
        <BookingDialog onClose={() => setBookingOpen(false)} tourId={product.id} tourTitle={product.title} />
      ) : null}
    </li>
  );
}
