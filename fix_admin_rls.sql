-- SQL to fix Admin visibility of pending documents

-- 1. Drop the old restricted SELECT policy
DROP POLICY IF EXISTS "Anyone can view approved documents." ON public.documents;

-- 2. Create a new SELECT policy allowing public to see 'approved' and Admins to see 'all' documents
CREATE POLICY "Anyone can view approved, admins can view all" ON public.documents 
FOR SELECT 
USING (
  status = 'approved' OR 
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
