import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Enter email/phone, 2: Enter OTP & new password
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const {
    forgotPassword,
    verifyOtp,
    resetPassword
  } = useAuth();

  const navigate = useNavigate();

  const handleSendReset = async (e) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) {
      addToast(
        'Please enter your registered email address',
        'error'
      );
      return;
    }

    setLoading(true);

    try {
      const email = emailOrPhone.trim();

      await forgotPassword(email);

      setStep(2);

      addToast(
        'OTP has been sent to your registered email.',
        'success'
      );
    } catch (err) {
      console.error('Forgot password error:', err);

      addToast(
        err.message || 'Unable to send reset code.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

 const handleVerifyOtp = async (e) => {
  e.preventDefault();

  const enteredOtp = otp.join('');

  if (enteredOtp.length !== 6) {
    addToast(
      'Please enter the 6-digit OTP.',
      'error'
    );
    return;
  }

  if (!newPassword.trim()) {
    addToast(
      'Please enter a new password.',
      'error'
    );
    return;
  }

  if (newPassword.trim().length < 6) {
    addToast(
      'Password must be at least 6 characters.',
      'error'
    );
    return;
  }

  setLoading(true);

  try {
    const email = emailOrPhone.trim();

    // 1. Verify OTP
    await verifyOtp({
      email,
      otp: enteredOtp
    });

    // 2. Reset password
    await resetPassword({
      email,
      otp: enteredOtp,
      newPassword: newPassword
    });

    addToast(
      'Password updated successfully! Please login with your new password.',
      'success'
    );

    navigate('/login');
  } catch (err) {
    console.error(
      'Reset password error:',
      err
    );

    addToast(
      err.message ||
        'Invalid OTP or unable to reset password.',
      'error'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {step === 1 ? 'We will send you a verification code to recover your account.' : 'Enter the code and set your new password.'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email or Mobile Number
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="reader@bookloop.in or 9876543210"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Sending code...' : 'Send Reset Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3,4,5].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={otp[idx]}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...otp];
                      next[idx] = val;
                      setOtp(next);
                      if (val && e.target.nextElementSibling) {
                        e.target.nextElementSibling.focus();
                      }
                    }}
                    className="w-12 h-12 text-center font-bold text-lg border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Resetting...' : 'Update Password'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
