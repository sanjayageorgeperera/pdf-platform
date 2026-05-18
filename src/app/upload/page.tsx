import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { uploadPdf } from './actions'
import UploadForm from './UploadForm'

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { error } = await searchParams;

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?message=You must be logged in to upload a PDF.')
  }

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Upload a PDF</h2>
        <p className="text-center mb-8" style={{ opacity: 0.7 }}>Share your knowledge with the community. Note: All files require admin approval before they are publicly visible.</p>
        
        <UploadForm uploadAction={uploadPdf} serverError={error} />
      </div>
    </div>
  )
}
