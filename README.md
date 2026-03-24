
# Book Tracking App UI

This project started as a Figma Make prototype and has been upgraded toward production with:
- Supabase auth + user data sync
- Live book search from external providers (Google Books + Open Library fallback)
- Import/export flows for library migration

Original design source: https://www.figma.com/design/SpiJwwrnvSAfGuGyK8qbhw/Book-Tracking-App-UI

## Local setup

1. Install dependencies:
`npm i`

2. Create env file:
`cp .env.example .env`

3. Fill in Supabase values in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PROJECT_ID` (optional if URL is present)

4. Run database schema in Supabase SQL editor:
- `supabase/schema.sql`

5. Start the app:
`npm run dev`

## Notes

- If Supabase env vars are not configured, the app falls back to local storage mode.
- Live search can use an optional server endpoint via `VITE_BOOK_SEARCH_ENDPOINT`.
  
