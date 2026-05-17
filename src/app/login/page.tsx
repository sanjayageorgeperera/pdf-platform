import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const { message, error } = await searchParams;

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '100vh' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Welcome Back</h2>
        <p className="text-center mb-8" style={{ opacity: 0.7 }}>Sign in or create an account</p>
        
        <form className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>}
          {message && <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>{message}</p>}

          <div className="flex gap-4 mt-4">
            <button formAction={login} className="btn btn-primary" style={{ flex: 1 }}>Login</button>
            <button formAction={signup} className="btn btn-secondary" style={{ flex: 1 }}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  )
}
