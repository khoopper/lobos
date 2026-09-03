"use client";

import { useState, useTransition } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { updateSiteSettings } from "./actions";
import type { SiteSettingsData } from "@/lib/queries/site-content";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-[var(--gn-palette-3)]">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "h-10 rounded-lg border border-[#69727d] bg-white px-3 text-[15px] text-[#1f2124]";

interface FormState {
  logoHeader: { url: string; width: number; height: number } | null;
  logoFooter: { url: string; width: number; height: number } | null;
  favicon: { url: string; width: number; height: number } | null;
  phoneLabel: string;
  phoneHref: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  palette1: string;
  palette2: string;
  palette3: string;
  palette5: string;
  palette7: string;
  palette8: string;
  registro: string;
  copyright: string;
  creditLabel: string;
  creditHref: string;
}

function toFormState(s: SiteSettingsData): FormState {
  const social = (network: string) => s.socialLinks.find((l) => l.network === network)?.href ?? "";
  return {
    logoHeader: s.logoHeaderUrl ? { url: s.logoHeaderUrl, width: 320, height: 266 } : null,
    logoFooter: s.logoFooterUrl ? { url: s.logoFooterUrl, width: 1080, height: 1080 } : null,
    favicon: s.faviconUrl ? { url: s.faviconUrl, width: 32, height: 32 } : null,
    phoneLabel: s.phoneLabel,
    phoneHref: s.phoneHref,
    email: s.email,
    address: s.address ?? "",
    facebook: social("facebook"),
    instagram: social("instagram"),
    youtube: social("youtube"),
    palette1: s.palette[1],
    palette2: s.palette[2],
    palette3: s.palette[3],
    palette5: s.palette[5],
    palette7: s.palette[7],
    palette8: s.palette[8],
    registro: s.footerRegistro ?? "",
    copyright: s.footerCopyright,
    creditLabel: s.footerCreditLabel,
    creditHref: s.footerCreditHref ?? "",
  };
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-14 cursor-pointer rounded border border-[#69727d]"
      />
      <span className="text-sm text-[var(--gn-palette-3)]">{label}</span>
      <span className="font-mono text-xs text-[var(--gn-palette-5)]">{value}</span>
    </label>
  );
}

export function SettingsForm({ initial }: { initial: SiteSettingsData }) {
  const [state, setState] = useState<FormState>(() => toFormState(initial));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateSiteSettings({
        logoHeaderUrl: state.logoHeader?.url ?? null,
        logoFooterUrl: state.logoFooter?.url ?? null,
        faviconUrl: state.favicon?.url ?? null,
        phoneLabel: state.phoneLabel,
        phoneHref: state.phoneHref,
        email: state.email,
        address: state.address || null,
        socialFacebookUrl: state.facebook || null,
        socialInstagramUrl: state.instagram || null,
        socialYoutubeUrl: state.youtube || null,
        palette1: state.palette1,
        palette2: state.palette2,
        palette3: state.palette3,
        palette5: state.palette5,
        palette7: state.palette7,
        palette8: state.palette8,
        footerRegistro: state.registro || null,
        footerCopyright: state.copyright,
        footerCreditLabel: state.creditLabel,
        footerCreditHref: state.creditHref || null,
      });
      if (result.error) setMessage({ type: "error", text: result.error });
      else setMessage({ type: "success", text: "Guardado. Los cambios ya están en el sitio." });
    });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Logos</h2>
        <div className="flex flex-wrap gap-8">
          <ImageUploader
            bucket="site-assets"
            label="Logo del encabezado"
            value={state.logoHeader}
            onChange={(img) => set("logoHeader", img)}
          />
          <ImageUploader
            bucket="site-assets"
            label="Logo del pie de página"
            value={state.logoFooter}
            onChange={(img) => set("logoFooter", img)}
            previewClassName="h-32 w-32 rounded-lg bg-[var(--gn-palette-1)] object-contain p-2"
          />
          <ImageUploader
            bucket="site-assets"
            label="Favicon"
            value={state.favicon}
            onChange={(img) => set("favicon", img)}
            previewClassName="h-10 w-10 rounded object-cover"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Contacto</h2>
        <Field label="Teléfono (texto que se ve)">
          <input className={inputCls} value={state.phoneLabel} onChange={(e) => set("phoneLabel", e.target.value)} />
        </Field>
        <Field label="Teléfono (enlace, ej. tel:350 225 0680)">
          <input className={inputCls} value={state.phoneHref} onChange={(e) => set("phoneHref", e.target.value)} />
        </Field>
        <Field label="Correo">
          <input className={inputCls} value={state.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Dirección (opcional)">
          <input className={inputCls} value={state.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
      </section>

      <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Redes sociales</h2>
        <Field label="Facebook">
          <input className={inputCls} value={state.facebook} onChange={(e) => set("facebook", e.target.value)} />
        </Field>
        <Field label="Instagram">
          <input className={inputCls} value={state.instagram} onChange={(e) => set("instagram", e.target.value)} />
        </Field>
        <Field label="YouTube">
          <input className={inputCls} value={state.youtube} onChange={(e) => set("youtube", e.target.value)} />
        </Field>
      </section>

      <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Paleta de colores</h2>
        <ColorField label="Primario (botones, insignias)" value={state.palette1} onChange={(v) => set("palette1", v)} />
        <ColorField label="Primario oscuro (hover)" value={state.palette2} onChange={(v) => set("palette2", v)} />
        <ColorField label="Títulos" value={state.palette3} onChange={(v) => set("palette3", v)} />
        <ColorField label="Texto" value={state.palette5} onChange={(v) => set("palette5", v)} />
        <ColorField label="Acento claro" value={state.palette7} onChange={(v) => set("palette7", v)} />
        <ColorField label="Fondo" value={state.palette8} onChange={(v) => set("palette8", v)} />
      </section>

      <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-[var(--gn-palette-3)]">Pie de página</h2>
        <Field label="Registro (bajo el logo)">
          <input className={inputCls} value={state.registro} onChange={(e) => set("registro", e.target.value)} />
        </Field>
        <Field label="Texto de copyright">
          <input className={inputCls} value={state.copyright} onChange={(e) => set("copyright", e.target.value)} />
        </Field>
        <Field label="Crédito (nombre)">
          <input
            className={inputCls}
            value={state.creditLabel}
            onChange={(e) => set("creditLabel", e.target.value)}
          />
        </Field>
        <Field label="Crédito (enlace, opcional)">
          <input className={inputCls} value={state.creditHref} onChange={(e) => set("creditHref", e.target.value)} />
        </Field>
      </section>

      {message ? (
        <p className={message.type === "error" ? "text-sm text-red-600" : "text-sm text-green-700"}>
          {message.text}
        </p>
      ) : null}
      <button type="button" onClick={handleSave} disabled={pending} className="gn-button w-fit disabled:opacity-60">
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
