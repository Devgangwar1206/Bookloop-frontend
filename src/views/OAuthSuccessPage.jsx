import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    localStorage.setItem('token', token);

    loadUser()
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      });
  }, [searchParams, navigate, loadUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Please wait while we complete Google authentication.
        </p>
      </div>
    </div>
  );
}