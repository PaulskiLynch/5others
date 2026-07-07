create table if not exists message_support_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references messages(id) on delete cascade,
  membership_id uuid not null references memberships(id) on delete cascade,
  kind text not null check (kind in ('heart', 'hug', 'support')),
  created_at timestamptz not null default now(),
  unique (message_id, membership_id, kind)
);

create index if not exists message_support_reactions_message_idx
  on message_support_reactions (message_id, created_at);

alter table public.message_support_reactions enable row level security;

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
