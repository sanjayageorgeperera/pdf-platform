'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signout, makeMeAdmin } from '@/app/login/actions';

interface NavbarProps {
  user: any;
  userRole: string;
}

export default function Navbar({ user, userRole }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="navbar-header glass">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo" onClick={closeMenu}>
          PDF<span>Hub</span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className={`menu-toggle ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle Navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Nav Links */}
        <nav className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <div className="nav-group">
            <Link 
              href="/pdfs" 
              className={`nav-link ${isActive('/pdfs') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Explore
            </Link>
            <Link 
              href="/quizzes" 
              className={`nav-link ${isActive('/quizzes') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Quizzes
            </Link>
            <Link 
              href="/discussions" 
              className={`nav-link ${isActive('/discussions') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Discussions
            </Link>
          </div>

          <div className="nav-group-user">
            {user ? (
              <>
                {userRole === 'admin' && (
                  <Link 
                    href="/admin" 
                    className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    Admin Panel
                  </Link>
                )}
                <span className="user-role-badge">Role: {userRole}</span>
                {userRole === 'user' && (
                  <form action={makeMeAdmin} className="nav-form">
                    <button type="submit" className="btn btn-dev">Make Admin (Dev)</button>
                  </form>
                )}
                <Link 
                  href="/dashboard" 
                  className={`nav-link dashboard-btn ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <form action={signout} className="nav-form">
                  <button type="submit" className="btn btn-logout" onClick={closeMenu}>Logout</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary login-btn" onClick={closeMenu}>
                  Login
                </Link>
                <Link href="/login" className="btn btn-primary login-btn" onClick={closeMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
