-- SQL to fix RLS policies for Quizzes, Questions, and User Scores

-- 1. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can insert quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can delete quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;
DROP POLICY IF EXISTS "Users can update their own scores" ON public.user_scores;

-- 2. Create INSERT policy on Quizzes for Admins
CREATE POLICY "Admins can insert quizzes" ON public.quizzes 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 3. Create DELETE policy on Quizzes for Admins
CREATE POLICY "Admins can delete quizzes" ON public.quizzes 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 4. Create INSERT policy on Questions for Admins
CREATE POLICY "Admins can insert questions" ON public.questions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 5. Create DELETE policy on Questions for Admins
CREATE POLICY "Admins can delete questions" ON public.questions 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 6. Create UPDATE policy on User Scores for users to update their high scores
CREATE POLICY "Users can update their own scores" ON public.user_scores
FOR UPDATE
USING (auth.uid() = user_id);
