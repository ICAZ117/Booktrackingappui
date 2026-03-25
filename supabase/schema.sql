-- ReadTrack production schema (run in Supabase SQL Editor)

create extension if not exists "pgcrypto";

create table if not exists public.books (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  title text not null,
  author text not null default 'Unknown Author',
  cover text not null default '',
  status text,
  rating numeric,
  progress numeric,
  pages integer,
  current_page integer,
  current_minutes integer,
  audio_duration integer,
  start_date text,
  finish_date text,
  date_read text,
  genre text,
  notes text,
  review text,
  format text,
  publisher text,
  year_published text,
  description text,
  categories text[],
  average_rating numeric,
  ratings_count integer,
  isbn text,
  stats jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.reading_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  book_id text not null,
  pages integer not null default 0,
  minutes integer not null default 0,
  date text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.bookshelves (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null,
  book_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.book_search_cache (
  key text primary key,
  payload jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- Goodreads-style foundation: persistent shared catalog
create table if not exists public.catalog_books (
  id uuid primary key default gen_random_uuid(),
  unique_key text not null unique,
  title text not null,
  author text not null,
  cover text,
  description text,
  genre text,
  genres text[],
  published_date text,
  language text,
  isbn text,
  format text,
  source text,
  external_id text,
  rating numeric,
  ratings_count integer,
  pages integer,
  is_box_set boolean not null default false,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_catalog_books_title on public.catalog_books using btree (title);
create index if not exists idx_catalog_books_author on public.catalog_books using btree (author);
create index if not exists idx_catalog_books_published_date on public.catalog_books using btree (published_date);
create index if not exists idx_catalog_books_search on public.catalog_books using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(author,'')));

alter table public.books enable row level security;
alter table public.reading_sessions enable row level security;
alter table public.bookshelves enable row level security;
alter table public.catalog_books enable row level security;

drop policy if exists "books_select_own" on public.books;
create policy "books_select_own" on public.books
for select using (auth.uid() = user_id);

drop policy if exists "books_insert_own" on public.books;
create policy "books_insert_own" on public.books
for insert with check (auth.uid() = user_id);

drop policy if exists "books_update_own" on public.books;
create policy "books_update_own" on public.books
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "books_delete_own" on public.books;
create policy "books_delete_own" on public.books
for delete using (auth.uid() = user_id);

drop policy if exists "sessions_select_own" on public.reading_sessions;
create policy "sessions_select_own" on public.reading_sessions
for select using (auth.uid() = user_id);

drop policy if exists "sessions_insert_own" on public.reading_sessions;
create policy "sessions_insert_own" on public.reading_sessions
for insert with check (auth.uid() = user_id);

drop policy if exists "sessions_update_own" on public.reading_sessions;
create policy "sessions_update_own" on public.reading_sessions
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "sessions_delete_own" on public.reading_sessions;
create policy "sessions_delete_own" on public.reading_sessions
for delete using (auth.uid() = user_id);

drop policy if exists "shelves_select_own" on public.bookshelves;
create policy "shelves_select_own" on public.bookshelves
for select using (auth.uid() = user_id);

drop policy if exists "shelves_insert_own" on public.bookshelves;
create policy "shelves_insert_own" on public.bookshelves
for insert with check (auth.uid() = user_id);

drop policy if exists "shelves_update_own" on public.bookshelves;
create policy "shelves_update_own" on public.bookshelves
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "shelves_delete_own" on public.bookshelves;
create policy "shelves_delete_own" on public.bookshelves
for delete using (auth.uid() = user_id);

drop policy if exists "catalog_books_read_auth" on public.catalog_books;
create policy "catalog_books_read_auth" on public.catalog_books
for select using (auth.uid() is not null);

drop policy if exists "catalog_books_insert_auth" on public.catalog_books;
create policy "catalog_books_insert_auth" on public.catalog_books
for insert with check (auth.uid() is not null);

drop policy if exists "catalog_books_update_auth" on public.catalog_books;
create policy "catalog_books_update_auth" on public.catalog_books
for update using (auth.uid() is not null) with check (auth.uid() is not null);

create or replace function public.update_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_books_updated_at on public.books;
create trigger trg_books_updated_at
before update on public.books
for each row execute procedure public.update_timestamp();

drop trigger if exists trg_bookshelves_updated_at on public.bookshelves;
create trigger trg_bookshelves_updated_at
before update on public.bookshelves
for each row execute procedure public.update_timestamp();

drop trigger if exists trg_catalog_books_updated_at on public.catalog_books;
create trigger trg_catalog_books_updated_at
before update on public.catalog_books
for each row execute procedure public.update_timestamp();
