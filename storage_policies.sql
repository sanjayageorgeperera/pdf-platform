-- Storage Policies for 'pdfs' bucket

-- 1. Allow public viewing of files
CREATE POLICY "Give public access to pdfs" ON storage.objects FOR SELECT USING (bucket_id = 'pdfs');

-- 2. Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pdfs' AND auth.role() = 'authenticated');
