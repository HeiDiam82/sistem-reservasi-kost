import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="glass sticky top-0 z-50 py-4 shadow-sm">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="text-xl font-bold text-primary">KostReservation</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-primary font-medium">Beranda</Link>
          <Link to="/rooms" className="hover:text-primary font-medium">Kamar</Link>
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="font-medium text-accent">Admin</Link>
              )}
              <Link to="/profile" className="font-medium text-primary">Hai, {user.nama}</Link>
              <button 
                onClick={onLogout}
                className="bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-medium">Login</Link>
              <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-light">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
