-- Tours can now carry 1-5 photos (a small gallery) instead of a fixed
-- primary + hover pair. Replaces the 6 flat image columns with one ordered
-- JSONB array: [{ "url": "...", "width": 1200, "height": 800 }, ...].
-- images[0] is the card thumbnail / detail-page hero; images[1], if present,
-- is still used for the card's hover-swap effect — see
-- src/lib/queries/site-content.ts getTours().
alter table public.tours add column images jsonb not null default '[]'::jsonb;

update public.tours set images = (
  select jsonb_agg(img) from (
    values
      (jsonb_build_object('url', image_url, 'width', image_w, 'height', image_h)),
      (case when hover_image_url is not null
        then jsonb_build_object('url', hover_image_url, 'width', hover_image_w, 'height', hover_image_h)
        else null end)
  ) as t(img)
  where img is not null
);

alter table public.tours
  drop column image_url,
  drop column image_w,
  drop column image_h,
  drop column hover_image_url,
  drop column hover_image_w,
  drop column hover_image_h;

alter table public.tours add constraint tours_images_length check (jsonb_array_length(images) between 1 and 5);
