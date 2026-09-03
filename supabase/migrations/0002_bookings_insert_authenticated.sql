-- Fix: the public booking form must work for a visitor who happens to have
-- an active admin/worker session in the same browser too, not just a truly
-- anonymous visitor. The original policy was scoped `to anon` only, so an
-- authenticated staff session (no dedicated INSERT policy existed for it)
-- got rejected by RLS instead of falling back to the anon policy.
drop policy "bookings: anon can create pending" on public.bookings;

create policy "bookings: anyone can create pending"
  on public.bookings for insert
  to anon, authenticated
  with check (status = 'pending');
