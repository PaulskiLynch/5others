create extension if not exists pgcrypto;

create type user_status as enum ('active', 'paused', 'suspended', 'deleted');
create type week_status as enum ('matching', 'active', 'closing', 'closed');
create type circle_status as enum ('forming', 'active', 'closed', 'dissolved_early');
create type membership_status as enum ('active', 'left', 'removed');
create type moderation_status as enum ('clean', 'flagged', 'removed');
create type mood as enum ('struggling', 'okay', 'good');
create type intent_category as enum (
  'fitness',
  'study',
  'recovery',
  'sobriety',
  'health_condition',
  'grief',
  'habit_change',
  'tough_week',
  'other'
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  auth_credential text not null unique,
  created_at timestamptz not null default now(),
  timezone text not null,
  locale text not null default 'en',
  status user_status not null default 'active',
  safety_flags text[] not null default '{}',
  strikes_count integer not null default 0 check (strikes_count >= 0)
);

create table if not exists weeks (
  id uuid primary key default gen_random_uuid(),
  start_at timestamptz not null unique,
  end_at timestamptz not null,
  status week_status not null default 'matching',
  created_at timestamptz not null default now()
);

create table if not exists intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  week_id uuid not null references weeks(id) on delete cascade,
  category intent_category not null,
  free_text text,
  timezone_band text not null,
  language text not null,
  created_at timestamptz not null default now(),
  unique (user_id, week_id)
);

create table if not exists circles (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references weeks(id) on delete cascade,
  category intent_category not null,
  language text not null,
  timezone_band text not null,
  member_count integer not null default 0 check (member_count >= 0),
  status circle_status not null default 'forming',
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references circles(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  pseudonym text not null,
  accent_color text not null,
  status membership_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (circle_id, user_id),
  unique (circle_id, pseudonym)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references circles(id) on delete cascade,
  membership_id uuid not null references memberships(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  moderation_status moderation_status not null default 'clean',
  created_at timestamptz not null default now(),
  removed_at timestamptz
);

create table if not exists message_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  reporter_membership_id uuid not null references memberships(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (message_id, reporter_membership_id)
);

create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references circles(id) on delete cascade,
  membership_id uuid not null references memberships(id) on delete cascade,
  day date not null,
  mood mood,
  note text,
  created_at timestamptz not null default now(),
  unique (membership_id, day)
);

create table if not exists safety_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id) on delete set null,
  circle_id uuid references circles(id) on delete set null,
  message_id uuid references messages(id) on delete set null,
  source text not null,
  severity text not null,
  status text not null default 'open',
  classifier_labels text[] not null default '{}',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists pilot_intake_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  timezone text not null,
  locale text not null default 'en',
  preferred_language text not null default 'en',
  cohort text not null default 'cardiobunny',
  category intent_category not null,
  age_range text not null default '30-44',
  starting_point text not null default 'restarting',
  support_style text not null default 'gentle_accountability',
  fitness_goal text,
  goal text not null,
  timezone_band text not null default 'UTC+0 to UTC+2',
  week_start date not null,
  week_end date not null,
  created_at timestamptz not null default now()
);

create index if not exists intents_week_idx on intents (week_id, category, language, timezone_band);
create index if not exists circles_week_idx on circles (week_id, status);
create index if not exists messages_circle_idx on messages (circle_id, created_at);
create index if not exists check_ins_circle_idx on check_ins (circle_id, day);
create index if not exists safety_events_status_idx on safety_events (status, created_at);

comment on table pilot_intake_requests is
'Temporary seed-cohort intake bridge while magic-link auth is still being wired.';

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
