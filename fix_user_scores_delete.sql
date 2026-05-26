-- Allow admins to delete user scores when deleting a quiz
CREATE POLICY "Admins can delete user scores" ON public.user_scores
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
