// components/TokenExpirationHandler.js
'use client';
import { useEffect } from 'react';
import { isTokenExpired } from '../utils/auth';

function TokenExpirationHandler() {
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        console.log('Token expired and removed from local storage');
        // Optionally, trigger a logout, redirect, or notify the user here
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return null; // This component doesn’t render any UI
}

export default TokenExpirationHandler;
