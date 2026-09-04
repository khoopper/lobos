# Club de Lobos

Sitio web y panel de administración de Club de Lobos, construido con Next.js, Tailwind CSS y Supabase.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Supabase: contenido, autenticación y almacenamiento
- Vercel

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sitio: [http://localhost:3000](http://localhost:3000) · Administración: [http://localhost:3000/admin](http://localhost:3000/admin)

## Contenido y marca

```bash
npm run brand:generate  # regenera tamaños desde public/brand/lobos/source/logo-master.png
npm run seed            # aplica el contenido inicial de Club de Lobos a Supabase
```

El panel **Ajustes del sitio** también convierte un solo PNG transparente en logos, favicons, iconos móviles y tarjeta social, y publica el paquete completo.

## Verificación

```bash
npm run lint
npm run typecheck
npm run build
```

El esquema, las políticas RLS y los buckets están en `supabase/migrations`.
