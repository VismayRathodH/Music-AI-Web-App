-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
-- Linked to auth.users, stores public user profile data
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  minutes_listened INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- TRIGGER for New Users
-- Automatically creates a profile entry when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- SONGS TABLE
-- Stores metadata for uploaded music
CREATE TABLE songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT, -- Can be linked to an 'artists' table later if desired
  album TEXT,
  genre TEXT,
  duration INTEGER, -- duration in seconds
  url TEXT NOT NULL, -- Supabase Storage URL
  cover_url TEXT, -- Supabase Storage URL for cover art
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Uploader
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Songs
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Songs are public." 
  ON songs FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload songs." 
  ON songs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own songs." 
  ON songs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own songs." 
  ON songs FOR DELETE USING (auth.uid() = user_id);


-- PLAYLISTS TABLE
CREATE TABLE playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Playlists
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public playlists are viewable by everyone." 
  ON playlists FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own private playlists." 
  ON playlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create playlists." 
  ON playlists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists." 
  ON playlists FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists." 
  ON playlists FOR DELETE USING (auth.uid() = user_id);


-- PLAYLIST_SONGS JOIN TABLE
CREATE TABLE playlist_songs (
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (playlist_id, song_id)
);

-- RLS for Playlist Songs
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Playlist songs include public or owned playlists." 
  ON playlist_songs FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND (playlists.is_public = true OR playlists.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can add songs to own playlists." 
  ON playlist_songs FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove songs from own playlists." 
  ON playlist_songs FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_songs.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );


-- STORAGE BUCKETS (Optional DDL for tracking purposes, usually done in UI)
-- Insert row into storage.buckets if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Simplified)
-- Allow public read access
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id IN ('songs', 'covers') );

-- Allow authenticated uploads
CREATE POLICY "Authenticated Uploads"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id IN ('songs', 'covers') AND auth.role() = 'authenticated' );


-- AI_PLAYLISTS TABLE
CREATE TABLE ai_playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  songs JSONB NOT NULL,
  cover TEXT,
  color TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE ai_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI playlists." 
  ON ai_playlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI playlists." 
  ON ai_playlists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI playlists." 
  ON ai_playlists FOR DELETE USING (auth.uid() = user_id);


-- LIKED_SONGS TABLE
CREATE TABLE liked_songs (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  song_id TEXT NOT NULL, -- Storing the ID (can be YouTube videoId)
  song_data JSONB, -- Optional: store metadata to avoid refetching
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, song_id)
);

ALTER TABLE liked_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own liked songs." 
  ON liked_songs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can like songs." 
  ON liked_songs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike songs." 
  ON liked_songs FOR DELETE USING (auth.uid() = user_id);
  