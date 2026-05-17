-- Add category column to documents table

ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'General';
