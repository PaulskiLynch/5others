create or replace function public.current_auth_email()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

create or replace function public.current_app_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.app_users
  where auth_credential = public.current_auth_email()
  limit 1;
$$;

create or replace function public.is_member_of_circle(target_circle uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.memberships
    where circle_id = target_circle
      and user_id = public.current_app_user_id()
      and status = 'active'
  );
$$;

grant execute on function public.current_auth_email() to authenticated;
grant execute on function public.current_app_user_id() to authenticated;
grant execute on function public.is_member_of_circle(uuid) to authenticated;

alter table public.app_users enable row level security;
alter table public.weeks enable row level security;
alter table public.intents enable row level security;
alter table public.circles enable row level security;
alter table public.memberships enable row level security;
alter table public.messages enable row level security;
alter table public.message_support_reactions enable row level security;
alter table public.message_reports enable row level security;
alter table public.check_ins enable row level security;
alter table public.safety_events enable row level security;
alter table public.pilot_intake_requests enable row level security;
alter table public.notification_deliveries enable row level security;

drop policy if exists "app_users_select_own" on public.app_users;
create policy "app_users_select_own"
on public.app_users
for select
to authenticated
using (auth_credential = public.current_auth_email());

drop policy if exists "app_users_update_own" on public.app_users;
create policy "app_users_update_own"
on public.app_users
for update
to authenticated
using (auth_credential = public.current_auth_email())
with check (auth_credential = public.current_auth_email());

drop policy if exists "weeks_select_member_weeks" on public.weeks;
create policy "weeks_select_member_weeks"
on public.weeks
for select
to authenticated
using (
  exists (
    select 1
    from public.circles
    where circles.week_id = weeks.id
      and public.is_member_of_circle(circles.id)
  )
);

drop policy if exists "intents_select_own" on public.intents;
create policy "intents_select_own"
on public.intents
for select
to authenticated
using (user_id = public.current_app_user_id());

drop policy if exists "intents_insert_own" on public.intents;
create policy "intents_insert_own"
on public.intents
for insert
to authenticated
with check (user_id = public.current_app_user_id());

drop policy if exists "intents_update_own" on public.intents;
create policy "intents_update_own"
on public.intents
for update
to authenticated
using (user_id = public.current_app_user_id())
with check (user_id = public.current_app_user_id());

drop policy if exists "circles_select_member_circle" on public.circles;
create policy "circles_select_member_circle"
on public.circles
for select
to authenticated
using (public.is_member_of_circle(id));

drop policy if exists "memberships_select_member_circle" on public.memberships;
create policy "memberships_select_member_circle"
on public.memberships
for select
to authenticated
using (public.is_member_of_circle(circle_id));

drop policy if exists "messages_select_member_circle" on public.messages;
create policy "messages_select_member_circle"
on public.messages
for select
to authenticated
using (public.is_member_of_circle(circle_id));

drop policy if exists "messages_insert_own_membership" on public.messages;
create policy "messages_insert_own_membership"
on public.messages
for insert
to authenticated
with check (
  moderation_status = 'clean'
  and exists (
    select 1
    from public.memberships
    where memberships.id = messages.membership_id
      and memberships.circle_id = messages.circle_id
      and memberships.user_id = public.current_app_user_id()
      and memberships.status = 'active'
  )
);

drop policy if exists "message_support_reactions_select_member_circle" on public.message_support_reactions;
create policy "message_support_reactions_select_member_circle"
on public.message_support_reactions
for select
to authenticated
using (
  exists (
    select 1
    from public.messages
    where messages.id = message_support_reactions.message_id
      and public.is_member_of_circle(messages.circle_id)
  )
);

drop policy if exists "message_support_reactions_insert_own_membership" on public.message_support_reactions;
create policy "message_support_reactions_insert_own_membership"
on public.message_support_reactions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.messages
    join public.memberships on memberships.id = message_support_reactions.membership_id
    where messages.id = message_support_reactions.message_id
      and memberships.circle_id = messages.circle_id
      and memberships.user_id = public.current_app_user_id()
      and memberships.status = 'active'
  )
);

drop policy if exists "message_support_reactions_delete_own_membership" on public.message_support_reactions;
create policy "message_support_reactions_delete_own_membership"
on public.message_support_reactions
for delete
to authenticated
using (
  exists (
    select 1
    from public.memberships
    where memberships.id = message_support_reactions.membership_id
      and memberships.user_id = public.current_app_user_id()
      and memberships.status = 'active'
  )
);

drop policy if exists "check_ins_select_member_circle" on public.check_ins;
create policy "check_ins_select_member_circle"
on public.check_ins
for select
to authenticated
using (public.is_member_of_circle(circle_id));

drop policy if exists "check_ins_insert_own_membership" on public.check_ins;
create policy "check_ins_insert_own_membership"
on public.check_ins
for insert
to authenticated
with check (
  exists (
    select 1
    from public.memberships
    where memberships.id = check_ins.membership_id
      and memberships.circle_id = check_ins.circle_id
      and memberships.user_id = public.current_app_user_id()
      and memberships.status = 'active'
  )
);
