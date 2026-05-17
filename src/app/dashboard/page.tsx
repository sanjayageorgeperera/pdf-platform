import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signout } from '../login/actions'
import { deleteDocument } from '../pdfs/[id]/actions'
import { updateProfile } from './actions'

interface PageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { error: errorParam, message: messageParam } = await searchParams

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch user's uploaded PDFs
  const { data: myDocs } = await supabase
    .from('documents')
    .select('*')
    .eq('uploader_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container animate-fade-in mt-8" style={{ paddingBottom: '4rem' }}>
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-header-actions">
          <Link href="/upload" className="btn btn-primary">Upload PDF</Link>
          <form>
            <button formAction={signout} className="btn btn-secondary">Sign Out</button>
          </form>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1" style={{ height: 'fit-content' }}>
          <h3 className="mb-4">Profile Info</h3>

          {errorParam && (
            <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              ⚠️ {errorParam}
            </div>
          )}
          {messageParam && (
            <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              ✅ {messageParam}
            </div>
          )}

          <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label htmlFor="full_name" style={{ display: 'block', fontSize: '0.85rem', opacity: 0.5, marginBottom: '0.25rem' }}>Full Name</label>
              <input 
                type="text" 
                id="full_name" 
                name="full_name" 
                defaultValue={profile?.full_name || ''} 
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.5, margin: '0 0 0.15rem 0' }}>Email Address</p>
              <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem', opacity: 0.8, overflowWrap: 'anywhere' }}>{user.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.5, margin: '0 0 0.15rem 0' }}>Account Role</p>
              <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem', opacity: 0.8, textTransform: 'capitalize' }}>{profile?.role || 'user'}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', opacity: 0.5, margin: '0 0 0.15rem 0' }}>Total Points Score</p>
              <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem', color: 'var(--accent)' }}>🏆 {profile?.total_score || 0} pts</p>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Update Profile Name
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ margin: 0 }}>Your Uploaded PDFs</h3>
            <span style={{ fontSize: '0.85rem', opacity: 0.5 }}>Total: {myDocs?.length || 0}</span>
          </div>

          {myDocs && myDocs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myDocs.map((doc) => {
                const deleteAction = deleteDocument.bind(null, doc.id)
                const isPending = doc.status === 'pending'

                return (
                  <div 
                    key={doc.id} 
                    className="card dashboard-list-card hover:border-violet-500/30 transition-all duration-300"
                  >
                    <div className="dashboard-card-content">
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        {isPending ? (
                          <span style={{
                            fontSize: '0.725rem',
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            color: '#fbbf24',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontWeight: 700
                          }}>
                            ⏳ Pending Approval
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.725rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            color: '#34d399',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontWeight: 700
                          }}>
                            ✅ Approved
                          </span>
                        )}
                        <span style={{
                          fontSize: '0.725rem',
                          background: 'rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.7)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontWeight: 600
                        }}>
                          🌐 {doc.language || 'English'}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                        {doc.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>
                        {doc.category || 'General'} • Views: {doc.view_count || 0}
                      </p>
                    </div>

                    <div className="dashboard-card-actions">
                      {!isPending && (
                        <Link 
                          href={`/pdfs/${doc.id}`} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                        >
                          Read
                        </Link>
                      )}
                      
                      <Link 
                        href={`/dashboard/edit/${doc.id}`} 
                        className="btn btn-secondary" 
                        style={{ 
                          padding: '0.5rem 1rem', 
                          fontSize: '0.85rem', 
                          textDecoration: 'none',
                          borderColor: 'var(--primary)',
                          color: 'var(--primary)'
                        }}
                      >
                        ✏️ Edit
                      </Link>

                      <form action={deleteAction}>
                        <button 
                          type="submit" 
                          className="btn btn-secondary" 
                          style={{ 
                            padding: '0.5rem 1rem', 
                            fontSize: '0.85rem',
                            borderColor: 'var(--danger)',
                            color: 'var(--danger)'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card text-center py-8" style={{ borderStyle: 'dashed', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ opacity: 0.5, margin: '0 0 1rem 0' }}>You haven't uploaded any PDFs yet.</p>
              <Link href="/upload" className="btn btn-primary">Upload New PDF</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
