import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);
    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was unsuccessful. Try again.');
  };

  return (
    <div className="auth-page" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--bg-light)', padding: '40px 20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--secondary-dark)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to track your application</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px',
            borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
          >
            {isLoading ? 'Processing...' : (
              <><LogIn size={20} /> Login</>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            shape="rectangular"
            size="large"
            width="320"
          />
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>Apply Now</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
