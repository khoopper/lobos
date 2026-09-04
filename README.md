# Guía Natours

Sitio web y panel de administración de Guía Natours, construido con Next.js, Tailwind CSS y Supabase.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** — base de datos, autenticación y almacenamiento de imágenes
- Despliegue en **Vercel**

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa con tus credenciales de Supabase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para el sitio público y
[http://localhost:3000/admin](http://localhost:3000/admin) para el panel de administración.

## Base de datos

El esquema completo (tablas, seguridad por fila, buckets de almacenamiento) está en
[`supabase/migrations`](supabase/migrations). Aplícalo pegando cada archivo, en orden, en el
**SQL Editor** de tu proyecto de Supabase.

Para poblar la base de datos con el contenido inicial del sitio:

```bash
npm run seed
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run check` | Lint + tipos + build |
| `npm run seed` | Siembra la base de datos con el contenido inicial |

## Estructura

```
src/
  app/                # Rutas (sitio público + panel /admin)
  components/          # Componentes del sitio y del panel
  lib/
    supabase/          # Clientes de Supabase (servidor, navegador, tipos)
    auth/               # Verificación de sesión y roles
    queries/            # Lecturas de contenido para el sitio público
    storage/            # Subida de imágenes
supabase/
  migrations/           # Esquema SQL y políticas de seguridad
scripts/
  seed-supabase.ts      # Siembra inicial de contenido
```
