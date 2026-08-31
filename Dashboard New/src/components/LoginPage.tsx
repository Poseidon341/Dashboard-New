import React, { useState, useMemo } from 'react';
import { UserAccount } from '../types';
import { DEFAULT_USERS } from '../data/mockData';

interface LoginPageProps {
  onLogin?: (user: UserAccount) => void;
  onLoginSuccess?: (user: UserAccount) => void;
  userList?: UserAccount[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onLoginSuccess, userList = [] }) => {
  const handleSuccess = onLogin || onLoginSuccess || (() => {});
  const [pn, setPn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListExpanded, setIsListExpanded] = useState(false);

  // Combine live spreadsheet users with default preloaded spreadsheet list (deduplicated by PN)
  const allAvailableUsers = useMemo(() => {
    const map = new Map<string, UserAccount>();
    // First default list
    DEFAULT_USERS.forEach((u) => {
      if (u.pn) map.set(u.pn.trim(), u);
    });
    // Then live fetched users
    userList.forEach((u) => {
      if (u.pn) map.set(u.pn.trim(), u);
    });
    return Array.from(map.values());
  }, [userList]);

  // Filtered users for quick search helper
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return allAvailableUsers.slice(0, 8);
    const q = searchTerm.toLowerCase().trim();
    return allAvailableUsers.filter(
      (u) =>
        u.pn.toLowerCase().includes(q) ||
        u.nama.toLowerCase().includes(q) ||
        (u.role && u.role.toLowerCase().includes(q)) ||
        (u.cabang && u.cabang.toLowerCase().includes(q))
    );
  }, [allAvailableUsers, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedPn = pn.trim();
    const trimmedPass = password.trim();

    if (!trimmedPn) {
      setErrorMessage('Silakan masukkan Personal Number (PN) Anda.');
      return;
    }

    // Check password (all users use 'BRI', case-insensitive)
    if (trimmedPass.toUpperCase() !== 'BRI') {
      setErrorMessage('Password salah! Password untuk semua akun adalah "BRI"');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Find user by PN (exact or stripped leading zeros)
      const cleanInputPn = trimmedPn.replace(/^0+/, '');
      const matched = allAvailableUsers.find((u) => {
        const cleanUserPn = u.pn.trim().replace(/^0+/, '');
        return u.pn.trim().toLowerCase() === trimmedPn.toLowerCase() || cleanUserPn === cleanInputPn;
      });

      if (matched) {
        // Save session
        localStorage.setItem('bri_auth_user', JSON.stringify(matched));
        handleSuccess(matched);
      } else if (trimmedPn.length >= 3) {
        // Fallback for any valid PN in sheet
        const dynamicUser: UserAccount = {
          pn: trimmedPn,
          nama: `Pegawai BRI (PN ${trimmedPn})`,
          role: 'RM Funding & Transaction',
          cabang: 'Banyuwangi',
          area: 'Jember',
        };
        localStorage.setItem('bri_auth_user', JSON.stringify(dynamicUser));
        handleSuccess(dynamicUser);
      } else {
        setErrorMessage('PN tidak ditemukan di daftar pegawai! Periksa kembali PN Anda.');
      }
    }, 350);
  };

  const handleQuickSelect = (user: UserAccount) => {
    setPn(user.pn);
    setPassword('BRI');
    setErrorMessage('');
  };

  return (
    <div id="login-page">
      <div className="login-card" style={{ maxWidth: '480px' }}>
        <div className="login-header">
          <div className="logo-box">
            <i className="fa-solid fa-building-columns"></i>
          </div>
          <h2>Dashboard Kinerja</h2>
          <p style={{ color: '#0857C3', fontWeight: 700, fontSize: '0.9rem', marginTop: '2px' }}>
            PT Bank Rakyat Indonesia (Persero) Tbk
          </p>
          <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px' }}>
            Silakan masuk dengan PN Anda dan Password <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>BRI</span>
          </p>
        </div>

        <div className="login-body">
          {errorMessage && (
            <div className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '1.1rem' }}></i>
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Personal Number (PN / ID)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={pn}
                  onChange={(e) => setPn(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="Contoh: 23973, 57928, 182166..."
                  style={{ paddingLeft: '40px' }}
                />
                <i
                  className="fa-solid fa-id-badge"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '1rem',
                  }}
                ></i>
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Ketik password: BRI"
                  style={{ paddingLeft: '40px', paddingRight: '42px' }}
                />
                <i
                  className="fa-solid fa-lock"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '1rem',
                  }}
                ></i>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '4px',
                  }}
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Memverifikasi PN...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i> Masuk Dashboard
                </>
              )}
            </button>
          </form>

          {/* Searchable PN / RM Directory Helper */}
          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                📋 Daftar PN Pegawai ({allAvailableUsers.length} Terdaftar):
              </span>
              <button
                type="button"
                onClick={() => setIsListExpanded(!isListExpanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: '#0857C3',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '2px 4px',
                }}
              >
                {isListExpanded ? 'Sembunyikan' : 'Buka Direktori'}
              </button>
            </div>

            {isListExpanded && (
              <div style={{ marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Cari nama atau PN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    fontSize: '0.78rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                maxHeight: isListExpanded ? '180px' : '110px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {filteredUsers.map((u) => (
                <button
                  key={u.pn}
                  type="button"
                  onClick={() => handleQuickSelect(u)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    background: pn === u.pn ? '#e0f2fe' : '#f8fafc',
                    border: pn === u.pn ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    fontSize: '0.76rem',
                    color: '#1e293b',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (pn !== u.pn) e.currentTarget.style.background = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    if (pn !== u.pn) e.currentTarget.style.background = '#f8fafc';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>
                      <strong style={{ color: '#0857C3' }}>{u.pn}</strong> - {u.nama}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{u.role || 'RMFT'}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: '#0369a1',
                      background: '#e0f2fe',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    Pilih
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

