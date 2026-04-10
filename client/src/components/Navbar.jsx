import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-rose-100 text-medical-700' : 'text-slate-600 hover:bg-white hover:text-medical-700'
  }`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-rose-100/80 bg-white/85 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-medical-600 text-lg font-extrabold text-white shadow-glow">
            B+
          </div>
          <div>
            <p className="font-display text-xl text-slate-900">Emergency Blood Finder</p>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-400">Fast donor matching</p>
          </div>
        </Link>

        <button
          type="button"
          className="rounded-2xl border border-rose-200 p-3 text-slate-700 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/search" className={navLinkClass}>
            Search Donors
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/request" className={navLinkClass}>
              Emergency Request
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="ml-3 flex items-center gap-3">
              <div className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {user?.name}
              </div>
              <button type="button" className="medical-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-3 flex items-center gap-3">
              <Link to="/login" className="medical-button-secondary">
                Login
              </Link>
              <Link to="/signup" className="medical-button">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-rose-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={navLinkClass} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/search" className={navLinkClass} onClick={closeMenu}>
              Search Donors
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>
                Dashboard
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/request" className={navLinkClass} onClick={closeMenu}>
                Emergency Request
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
                Admin
              </NavLink>
            )}
            {isAuthenticated ? (
              <button type="button" className="medical-button mt-2" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="medical-button-secondary mt-2" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/signup" className="medical-button" onClick={closeMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

