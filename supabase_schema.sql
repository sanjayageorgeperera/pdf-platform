-- Users table is handled by Supabase Auth (auth.users), but we can create a public profile table linked to it.

CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users on delete cascade not null primary key,
  full_name text,
  role text default 'user', -- 'admin' or 'user'
  total_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents (PDFs) Table
CREATE TABLE public.documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  file_url text not null,
  uploader_id uuid references public.profiles(id) not null,
  view_count integer default 0,
  download_count integer default 0,
  status text default 'pending', -- 'pending' or 'approved'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews/Comments Table
CREATE TABLE public.reviews (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quizzes Table
CREATE TABLE public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions Table
CREATE TABLE public.questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  options jsonb not null, -- e.g., ["Option A", "Option B", "Option C"]
  correct_answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Scores Table
CREATE TABLE public.user_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  quiz_id uuid references public.quizzes(id) not null,
  score integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, quiz_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;

-- Basic Policies (can be refined later)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Approved documents are viewable by everyone." ON public.documents FOR SELECT USING (status = 'approved' OR auth.uid() = uploader_id);
CREATE POLICY "Authenticated users can upload documents." ON public.documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can write reviews." ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Quizzes are viewable by everyone." ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone." ON public.questions FOR SELECT USING (true);

CREATE POLICY "Users can view their own scores." ON public.user_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can submit scores." ON public.user_scores FOR INSERT WITH CHECK (auth.role() = 'authenticated');
