alter table public.pilot_intake_requests
  add column if not exists fitness_goal text;
