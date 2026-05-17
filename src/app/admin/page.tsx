import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { approveDocument, rejectDocument } from './actions'

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient()

  // Verify Admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role?.trim().toLowerCase() || 'user';

  if (userRole !== 'admin') {
    return (
      <div className="container mt-8 text-center">
        <h2>Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    )
  }

  // Fetch pending documents
  const { data: pendingDocs, error: queryError } = await supabase
    .from('documents')
    .select('*, profiles(full_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (queryError) {
    console.error('Admin Fetch Error:', queryError)
  } else {
    console.log('Admin Fetch Success, Count:', pendingDocs?.length, pendingDocs)
  }

  return (
    <div className="container mt-8 animate-fade-in">
      <h1 className="mb-8">Admin Dashboard - Approvals</h1>

      {pendingDocs && pendingDocs.length > 0 ? (
        <div className="grid gap-4">
          {pendingDocs.map((doc) => (
            <div key={doc.id} className="card flex justify-between items-center" style={{ padding: '1rem 1.5rem' }}>
              <div>
                <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>{doc.title}</h3>
                <p style={{ opacity: 0.7, fontSize: '0.875rem' }} className="mb-2">{doc.description}</p>
                <div className="flex gap-4" style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                  <span>Uploader: {doc.profiles?.full_name || 'Unknown'}</span>
                  <span>Date: {new Date(doc.created_at).toLocaleDateString()}</span>
                  <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>View PDF File</a>
                </div>
              </div>
              <div className="flex gap-2">
                <form action={approveDocument}>
                  <input type="hidden" name="document_id" value={doc.id} />
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--success)', color: 'white' }}>Approve</button>
                </form>
                <form action={rejectDocument}>
                  <input type="hidden" name="document_id" value={doc.id} />
                  <button type="submit" className="btn btn-secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Reject</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-8" style={{ borderStyle: 'dashed', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ opacity: 0.5 }}>No pending documents to approve.</p>
        </div>
      )}
    </div>
  )
}
