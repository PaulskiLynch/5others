alter table public.pilot_intake_requests
  add column if not exists preferred_language text not null default 'en',
  add column if not exists cohort text not null default 'cardiobunny',
  add column if not exists age_range text not null default '30-44',
  add column if not exists starting_point text not null default 'restarting',
  add column if not exists support_style text not null default 'gentle_accountability',
  add column if not exists timezone_band text not null default 'UTC+0 to UTC+2';

update public.pilot_intake_requests
set
  preferred_language = lower(split_part(locale, '-', 1)),
  cohort = 'cardiobunny',
  timezone_band = case
    when timezone_band is null or timezone_band = '' then 'UTC+0 to UTC+2'
    else timezone_band
  end
where
  preferred_language is null
  or cohort is null
  or timezone_band is null
  or timezone_band = '';
