-- Lightweight, self-hosted analytics: page views and CTA/tour clicks from the
-- public site, so the dashboard can show real traffic instead of nothing.
-- No third-party analytics script — visitors never leave this database.
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('page_view', 'tour_click', 'cta_click', 'social_click')),
  path text not null,
  label text,
  created_at timestamptz not null default now()
);

create index analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index analytics_events_type_created_idx on public.analytics_events (event_type, created_at desc);

alter table public.analytics_events enable row level security;

-- Any visitor (anon) or logged-in staff can log an event — write-only from
-- the client, same shape as the public booking form.
create policy "analytics: anyone can insert"
  on public.analytics_events for insert
  to anon, authenticated
  with check (event_type in ('page_view', 'tour_click', 'cta_click', 'social_click'));

-- Only admins can read the numbers back, on the dashboard.
create policy "analytics: admin can read"
  on public.analytics_events for select
  to authenticated
  using (public.is_admin());
