import React from 'react';
import { useSelector } from 'react-redux';
import PublicNavbar from './PublicNavbar';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const isAuthenticated = !!user;

  // Render appropriate navbar based on authentication status and role
  if (!isAuthenticated) {
    return <PublicNavbar />;
  }
  
  if (user?.role === 'user') {
    return <UserNavbar />;
  }
  
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return <AdminNavbar />;
  }
  
  // Fallback to public navbar
  return <PublicNavbar />;
};

export default Navbar;