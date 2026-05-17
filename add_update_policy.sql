-- SQL to add UPDATE and DELETE policies for Admins on documents table

-- 1. Drop existing policies if they somehow exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can update documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON public.documents;

-- 2. Create UPDATE policy for admins
CREATE POLICY "Admins can update documents" ON public.documents 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 3. Create DELETE policy for admins (to allow rejecting documents)
CREATE POLICY "Admins can delete documents" ON public.documents 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
