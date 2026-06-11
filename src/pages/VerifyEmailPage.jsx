import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link might be invalid or expired.');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token, verifyEmail, navigate]);

  return (
    <div className="auth-page" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--bg-light)', padding: '40px 20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <Loader2 size={48} color="var(--primary-red)" style={{ animation: 'spin 1s linear infinite' }} />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary-dark)' }}>Verifying Email</h2>
            <p style={{ color: 'var(--text-muted)' }}>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <CheckCircle size={56} color="#10b981" />
            <h2 style={{ fontSize: '1.5rem', color: '#10b981' }}>Success!</h2>
            <p style={{ color: 'var(--text-muted)' }}>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <XCircle size={56} color="#ef4444" />
            <h2 style={{ fontSize: '1.5rem', color: '#ef4444' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-muted)' }}>{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block', width: '100%' }}>
              Go to Login
            </Link>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default VerifyEmailPage;
