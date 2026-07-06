# Hosted Supabase Setup

This project can move from preview mode to real persistence without GitHub or
Vercel. The only requirement is a hosted Supabase project.

## 1. Create the project

In Supabase:

1. Create a new project for `5others`.
2. Choose a strong database password and save it outside the repo.
3. Wait for the database and API to finish provisioning.

## 2. Add environment variables

Create a local `.env.local` file in the project root using the values from your
Supabase project settings.

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Where to find them:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase dashboard -> Settings -> API -> Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase dashboard -> Settings -> API -> anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase dashboard -> Settings -> API -> service_role secret key

Important:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Keep `.env.local` out of git.

## 3. Load the schema

Open the Supabase SQL Editor and run the contents of:

- [supabase/schema.sql](C:\Users\paul\Documents\New%20project\CardioBunny\5Others.com\supabase\schema.sql)

That creates the Phase 1 tables for:

- users
- weeks
- intents
- circles
- memberships
- messages
- reports
- check-ins
- safety events
- pilot intake requests

## 4. Load the row-level security policies

After the schema succeeds, run:

- [supabase/rls.sql](C:\Users\paul\Documents\New%20project\CardioBunny\5Others.com\supabase\rls.sql)
- [supabase/cardiobunny-launch-update.sql](C:\Users\paul\Documents\New%20project\CardioBunny\5Others.com\supabase\cardiobunny-launch-update.sql)

This enables privacy policies for:

- signed-in users reading only their own `app_users` row
- members reading only circles they belong to
- members reading only memberships and messages inside their own circle
- members posting messages only through their own active membership

The CardioBunny launch update adds:

- explicit preferred language
- cohort marker
- age range
- starting point
- support style
- stored timezone band for simple matching

## 5. Verify the app path

Run locally:

```powershell
npm run dev
```

Then test:

1. Open `/join`
2. Submit the intake form
3. Confirm you land on `/waiting`
4. Confirm a row appears in `pilot_intake_requests` in Supabase Table Editor

If the env vars are missing, the app falls back to preview mode instead of
writing to Supabase. That is expected behavior.

For sign-in and the seeded real-circle path:

1. Open `/sign-in`
2. Request a magic link
3. Open the email and return through `/auth/callback`
4. Open `/my-circle`
5. Confirm the page loads and a new message you send appears in the thread

## 6. What is live today

These parts are already wired for hosted Supabase:

- optional admin client creation
- server-side intake submission
- schema-ready tables
- row-level security policies for circle reads and message writes
- preview-mode fallback when keys are absent

## 7. What still needs implementation

The next Supabase-backed steps are:

1. Magic-link auth
2. weekly `weeks` creation job
3. real multi-user matching instead of seeded circle bootstrap
4. richer moderation and check-in policies
5. production-grade audit of every policy path

The current intake table is a seed-cohort bridge, not the final auth model.
