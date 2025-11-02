'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Let's Print
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">
                  {user.firstName} {user.lastName} ({user.role})
                </span>
                <Link
                  href={`/dashboard/${user.role === UserRole.CLIENT ? 'client' : user.role === UserRole.STARTUP_OWNER ? 'startup' : user.role === UserRole.PRODUCTION_OWNER ? 'production' : 'admin'}`}
                  className="hover:text-blue-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
