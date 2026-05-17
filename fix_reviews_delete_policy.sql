-- SQL to enable administrators to delete inappropriate comments/reviews

-- 1. Drop existing policy to avoid conflicts
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;

-- 2. Create DELETE policy on reviews table for Admins
CREATE POLICY "Admins can delete reviews" ON public.reviews 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
