create table if not exists notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  cohort text not null default 'cardiobunny',
  notification_type text not null,
  week_start date not null,
  status text not null default 'sent',
  provider text not null default 'resend',
  provider_message_id text,
  error_message text,
  preview_payload jsonb,
  created_at timestamptz not null default now(),
  unique (email, notification_type, week_start)
);

create index if not exists notification_deliveries_week_idx
  on notification_deliveries (notification_type, week_start, created_at);

alter table public.notification_deliveries enable row level security;
