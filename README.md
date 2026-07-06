# 5Others.com

Phase 1 foundation for the new `5others` application.

The current build includes:

- product homepage aligned to the MVP brief
- seed-cohort intake flow at `/join`
- waiting-room state at `/waiting`
- circle experience shell at `/circle-demo`
- Supabase-ready schema and server scaffolding
- preview-mode fallback when Supabase keys are not present

## Local development

```powershell
npm install
npm run dev
```

## Verification

```powershell
npm run lint
npm run build
```

## Hosted Supabase

This project is ready to use a hosted Supabase project without GitHub or
Vercel.

Setup guide:

- [docs/hosted-supabase-setup.md](C:\Users\paul\Documents\New%20project\CardioBunny\5Others.com\docs\hosted-supabase-setup.md)

Schema file:

- [supabase/schema.sql](C:\Users\paul\Documents\New%20project\CardioBunny\5Others.com\supabase\schema.sql)

Environment template:

- [.env.example](C:\Users\paul\Documents\New%20project\CardioBunny\5Others.com\.env.example)

## Deployment later

We do not need GitHub or Vercel yet. Once the hosted Supabase project is in
place and the Phase 1 loop is further along, we can push and connect Vercel.
