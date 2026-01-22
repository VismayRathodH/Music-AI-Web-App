# Supabase Backend Management Tasks

Here is a guide for the backend team member to set up and manage the Supabase project.

## 1. Database Schema Setup

Run the following SQL in the **SQL Editor** to create the necessary tables.

### A. Create `songs` Table
This table stores metadata for the uploaded music files.
```sql
create table public.songs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  artist text,
  genre text,
  url text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security (RLS)
alter table public.songs enable row level security;
```

### B. Create `profiles` Table (User Data)
This table stores public user information that links to the private `auth.users` table.
```sql
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text,
  full_name text,
  avatar_url text
);

-- Enable RLS
alter table public.profiles enable row level security;
```

### C. Create `playlists` Tables (For Future Feature)
Prepare the backend for the "Add to Playlist" feature.
```sql
create table public.playlists (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

create table public.playlist_songs (
  playlist_id uuid references public.playlists(id) on delete cascade,
  song_id uuid references public.songs(id) on delete cascade,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (playlist_id, song_id)
);

alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;
```

---

## 2. Row Level Security (RLS) Policies

Secure the data so users can't delete each other's files. Run these in the **SQL Editor**.

### Policies for `songs`
```sql
-- 1. Everyone can view/play songs
create policy "Public songs are viewable by everyone"
  on public.songs for select
  using ( true );

-- 2. Authenticated users can upload songs
create policy "Users can insert their own songs"
  on public.songs for insert
  with check ( auth.uid() = user_id );

-- 3. Users can update their own songs
create policy "Users can update their own songs"
  on public.songs for update
  using ( auth.uid() = user_id );

-- 4. Users can delete their own songs
create policy "Users can delete their own songs"
  on public.songs for delete
  using ( auth.uid() = user_id );
```

### Policies for `profiles`
```sql
-- 1. Public profiles are viewable by everyone
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- 2. Users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- 3. Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );
```

---

## 3. Storage Configuration

Go to the **Storage** section in the Supabase Dashboard.

1. **Create a new Bucket**:
   - Name: `songs`
   - Public: `true` (Toggle "Public bucket" ON)
   - Formatting: Restrict to audio MIME types if desired (e.g., `audio/*`).

2. **Add Storage Policies** (Under Configuration > Policies for 'songs'):
   
   - **SELECT (Read access)**:
     - Policy Name: "Public Access"
     - Allowed operations: `SELECT`
     - Target roles: `anon`, `authenticated` (or just check "All")
     - Definition: `bucket_id = 'songs'`

   - **INSERT (Upload access)**:
     - Policy Name: "Authenticated Uploads"
     - Allowed operations: `INSERT`
     - Target roles: `authenticated`
     - Definition: `bucket_id = 'songs' AND auth.uid()::text = (storage.foldername(name))[1]`
     - *Note: This forces users to upload to a folder named after their User ID, e.g., `user_id/song.mp3`. The current frontend code does exactly this (`${user.id}/${Date.now()}.${fileExt}`).*

   - **DELETE (Delete access)**:
     - Policy Name: "Owner Delete"
     - Allowed operations: `DELETE`
     - Target roles: `authenticated`
     - Definition: `bucket_id = 'songs' AND auth.uid()::text = (storage.foldername(name))[1]`

---

## 4. Automation (Triggers)

Automatically create a user profile when a new user signs up. Run this in **SQL Editor**.

```sql
-- 1. Create the function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
