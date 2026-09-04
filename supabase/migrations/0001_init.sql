-- GuiaNatours CMS schema
-- Site: guianatours-com-co-e923d4eb / root-8a5edab2
--
-- Apply with `supabase db push` once the project is linked, or paste this
-- whole file into the Supabase SQL Editor for a one-off bootstrap.

create extension if not exists pgcrypto;

-- ============================================================================
-- profiles — role gate. One row per auth.users row.
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'worker' check (role in ('admin', 'worker')),
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- SECURITY DEFINER: reads profiles bypassing RLS, so policies on OTHER tables
-- can call this without recursing back into profiles' own RLS.
create function public.current_role() returns text
  language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select public.current_role() = 'admin';
$$;

create function public.is_worker() returns boolean
  language sql stable security definer set search_path = public as $$
  select public.current_role() = 'worker';
$$;

create function public.is_staff() returns boolean
  language sql stable security definer set search_path = public as $$
  select public.current_role() in ('admin', 'worker');
$$;

-- A new Supabase Auth user gets a 'worker' profile row automatically (least
-- privilege by default). Promoting the first admin is a one-time manual step:
--   update public.profiles set role = 'admin' where id = '<uuid>';
-- Every subsequent admin/worker account is created through the admin panel's
-- service-role Server Action, never through this trigger's default role.
create function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- profiles RLS: read-only for the owning user and for admins. Deliberately NO
-- authenticated insert/update policy — role assignment only ever happens via
-- the service-role client (bypasses RLS), so a worker can never self-promote.
create policy "profiles: self can read own row"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: admin can read all rows"
  on public.profiles for select
  using (public.is_admin());

-- ============================================================================
-- site_settings — singleton row: logos, contact, socials, palette, footer.
-- ============================================================================
create table public.site_settings (
  id integer primary key default 1 check (id = 1),
  logo_header_url text,
  logo_footer_url text,
  favicon_url text,
  phone_label text not null default '+503 7952-8033 / +503 7554-6785',
  phone_href text not null default 'tel:+50379528033',
  email text not null default '',
  address text,
  social_facebook_url text,
  social_instagram_url text,
  social_youtube_url text,
  palette_1 text not null default '#235652',
  palette_2 text not null default '#183f3c',
  palette_3 text not null default '#373435',
  palette_5 text not null default '#686c6a',
  palette_7 text not null default '#f4f2be',
  palette_8 text not null default '#fbfaec',
  footer_registro text,
  footer_copyright text not null default '© 2026 Club de Lobos.',
  footer_credit_label text not null default '',
  footer_credit_href text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (
  id, logo_header_url, logo_footer_url, favicon_url, address,
  social_instagram_url, footer_registro
)
values (
  1,
  '/brand/lobos/logo-white-640.png',
  '/brand/lobos/logo-white-1024.png',
  '/brand/lobos/favicon-32.png',
  'El Salvador',
  'https://www.instagram.com/lobos_sv/',
  'El Salvador · Senderismo, camping y viajes en manada'
);

alter table public.site_settings enable row level security;

create policy "site_settings: public can read"
  on public.site_settings for select
  using (true);

create policy "site_settings: admin can write"
  on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- nav_links — main menu
-- ============================================================================
create table public.nav_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.nav_links enable row level security;

create policy "nav_links: public can read"
  on public.nav_links for select
  using (true);

create policy "nav_links: admin can write"
  on public.nav_links for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- hero_slides — hero carousel
-- ============================================================================
create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_w integer not null,
  image_h integer not null,
  heading text not null,
  description text not null,
  button_label text not null default 'Mira los próximos destinos',
  href text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.hero_slides enable row level security;

create policy "hero_slides: public can read published"
  on public.hero_slides for select
  using (is_published = true);

create policy "hero_slides: admin can read all"
  on public.hero_slides for select
  using (public.is_admin());

create policy "hero_slides: admin can write"
  on public.hero_slides for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- tours — "Próximos destinos" cards
-- ============================================================================
create table public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  price text not null,
  currency_symbol text not null default '$',
  departure_start date not null,
  departure_end date,
  image_url text not null,
  image_w integer not null,
  image_h integer not null,
  hover_image_url text,
  hover_image_w integer,
  hover_image_h integer,
  button_label text not null default 'Ver salida',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.tours enable row level security;

create policy "tours: public can read published"
  on public.tours for select
  using (is_published = true);

-- Staff (admin + worker) can see every tour regardless of publish state, so a
-- booking referencing an unpublished tour still resolves for the worker view.
create policy "tours: staff can read all"
  on public.tours for select
  using (public.is_staff());

create policy "tours: admin can write"
  on public.tours for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- content_blocks — generic single-row-per-key JSONB blocks for the fixed
-- "Guías expertos", "Camping" and "Fotografías de la semana" sections.
-- ============================================================================
create table public.content_blocks (
  key text primary key check (key in ('guias', 'camping', 'fotografias')),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.content_blocks (key, data) values
  ('guias', '{"heading":"Aventuras que nos conectan","buttonLabel":"Mira la próxima salida","buttonHref":"/#proximas-aventuras","images":[]}'::jsonb),
  ('camping', '{"heading":"Somos Club de Lobos","body":"Somos un club de amigos que nos encanta la aventura: senderismo, viajes, camping y vivir cada experiencia al máximo.","buttonLabel":"Síguenos en Instagram","buttonHref":"https://www.instagram.com/lobos_sv/","image":null}'::jsonb),
  ('fotografias', '{"heading":"Historias de la manada","body":"Momentos, rutas y paisajes compartidos por Club de Lobos."}'::jsonb);

alter table public.content_blocks enable row level security;

create policy "content_blocks: public can read"
  on public.content_blocks for select
  using (true);

create policy "content_blocks: admin can write"
  on public.content_blocks for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- gallery_items — "Fotografías de la semana" justified gallery
-- ============================================================================
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_w integer not null,
  image_h integer not null,
  title text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

create policy "gallery_items: public can read published"
  on public.gallery_items for select
  using (is_published = true);

create policy "gallery_items: admin can read all"
  on public.gallery_items for select
  using (public.is_admin());

create policy "gallery_items: admin can write"
  on public.gallery_items for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- reviews — curated review list (the original's Trustindex widget is not real)
-- ============================================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  review_date date not null,
  rating smallint not null check (rating between 1 and 5),
  body_text text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "reviews: public can read published"
  on public.reviews for select
  using (is_published = true);

create policy "reviews: admin can read all"
  on public.reviews for select
  using (public.is_admin());

create policy "reviews: admin can write"
  on public.reviews for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- bookings — reservations. Public can only create one; staff can view; only
-- admin can update/delete. This is the table the worker role exists to see.
-- ============================================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  tour_id uuid not null references public.tours (id) on delete restrict,
  requested_date date not null,
  num_people integer not null check (num_people between 1 and 50),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- Public can only INSERT, and only ever as 'pending' — a client can never
-- create a pre-confirmed booking by tampering with the request payload.
create policy "bookings: anon can create pending"
  on public.bookings for insert
  to anon
  with check (status = 'pending');

create policy "bookings: staff can read"
  on public.bookings for select
  using (public.is_staff());

-- Worker is explicitly read-only ("únicamente podrá ver") — no update/delete
-- policy is granted to the worker role at all, only to admin.
create policy "bookings: admin can update"
  on public.bookings for update
  using (public.is_admin()) with check (public.is_admin());

create policy "bookings: admin can delete"
  on public.bookings for delete
  using (public.is_admin());

-- ============================================================================
-- updated_at maintenance
-- ============================================================================
create function public.touch_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_site_settings before update on public.site_settings
  for each row execute function public.touch_updated_at();

create trigger touch_content_blocks before update on public.content_blocks
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Storage buckets: low-churn brand assets vs. high-churn content media.
-- Client-supplied Content-Type headers are spoofable — allowed_mime_types is
-- enforced by Storage itself, not just the app layer.
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-assets', 'site-assets', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/x-icon']),
  ('media', 'media', true, 8388608, array['image/png', 'image/jpeg', 'image/webp']);

create policy "site-assets: public can read"
  on storage.objects for select
  using (bucket_id = 'site-assets');

create policy "site-assets: admin can write"
  on storage.objects for all
  using (bucket_id = 'site-assets' and public.is_admin())
  with check (bucket_id = 'site-assets' and public.is_admin());

create policy "media: public can read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media: admin can write"
  on storage.objects for all
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
