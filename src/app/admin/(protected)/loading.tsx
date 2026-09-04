export default function AdminLoading() {
  return (
    <div aria-label="Cargando contenido" aria-live="polite" className="animate-pulse">
      <div className="h-3 w-28 rounded-full bg-black/10" />
      <div className="mt-4 h-8 w-64 max-w-full rounded-lg bg-black/10" />
      <div className="mt-3 h-4 w-[420px] max-w-full rounded-full bg-black/[0.07]" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="admin-card flex gap-4 p-5">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-black/10" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-28 rounded-full bg-black/10" />
              <div className="mt-3 h-3 w-full rounded-full bg-black/[0.07]" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
