-- Tours now list up to 10 discrete departure dates instead of a single
-- start/end range. The public booking form only ever offers these exact
-- dates (see createBooking's server-side check in
-- src/app/actions/bookings.ts) — never a free date picker.
alter table public.tours add column departure_dates jsonb not null default '[]'::jsonb;

update public.tours set departure_dates = jsonb_build_array(departure_start::text);

alter table public.tours
  drop column departure_start,
  drop column departure_end;

alter table public.tours add constraint tours_departure_dates_length check (jsonb_array_length(departure_dates) between 1 and 10);
