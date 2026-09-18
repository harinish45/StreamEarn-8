create or replace function public.append_scheduler_item(
  p_category text,
  p_title text,
  p_description text,
  p_source text,
  p_url text,
  p_published_at timestamp with time zone,
  p_content_hash text
)
returns public.scheduler_items
language plpgsql
security definer
set search_path = public
as $function$
declare
  result public.scheduler_items;
begin
  if p_category not in ('ai_news','internships','scholarships','earnings') then
    raise exception 'invalid category';
  end if;
  if p_title is null or length(trim(p_title)) = 0 or length(p_title) > 500 then
    raise exception 'invalid title';
  end if;
  if p_url is null or p_url !~* '^https://' or length(p_url) > 2000 then
    raise exception 'invalid url';
  end if;

  insert into public.scheduler_items(
    category,title,description,source,url,published_at,content_hash
  )
  values (
    p_category,trim(p_title),coalesce(left(p_description,10000),''),
    coalesce(left(p_source,300),''),trim(p_url),p_published_at,p_content_hash
  )
  on conflict(category,content_hash) do nothing
  returning * into result;

  if result.id is null then
    select * into result
      from public.scheduler_items
     where category=p_category and content_hash=p_content_hash
     limit 1;
  end if;

  return result;
end;
$function$;
