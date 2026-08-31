import React, { useState, useRef, useEffect } from 'react';
import { UserAccount } from '../types';

interface NavbarProps {
  currentUser: UserAccount | null;
  onLogout: () => void;
  onToggleSidebar: () => void;
  isOnline?: boolean;
  onSync?: () => void;
  isSyncing?: boolean;
  lastSyncTime?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onToggleSidebar,
  isOnline = true,
  onSync = () => {},
  isSyncing = false,
  lastSyncTime,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shortName = currentUser?.nama ? currentUser.nama.split(' ').slice(0, 2).join(' ') : 'User';

  return (
    <div className="navbar">
      <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Menu">
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="logo-box">
        <i className="fa-solid fa-building-columns"></i>
      </div>

      <h1>Dashboard Kinerja</h1>
      <span className="subtitle">Enterprise System</span>

      {/* Sync pill */}
      <button
        onClick={onSync}
        disabled={isSyncing}
        style={{
          marginLeft: '18px',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'white',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: isSyncing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
        title="Klik untuk menyinkronkan data terbaru"
      >
        <i className={`fa-solid fa-rotate ${isSyncing ? 'fa-spin' : ''}`}></i>
        <span>{isSyncing ? 'Syncing...' : isOnline ? 'Live Sheets' : 'Offline Mode'}</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
        <div className="profile-container" ref={dropdownRef}>
          <div className="profile-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <i className="fa-solid fa-user-shield" style={{ color: '#71C5EB' }}></i>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.2 }}>
              <span className="admin-txt">{shortName}</span>
              <span style={{ fontSize: '0.65rem', color: '#c2e7ff', fontWeight: 600 }}>PN: {currentUser?.pn || '-'}</span>
            </div>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.7rem', opacity: 0.8, marginLeft: '4px' }}></i>
          </div>

          {isDropdownOpen && (
            <div className="dropdown-content">
              <div className="dropdown-header">
                <p>
                  Nama: <span>{currentUser?.nama || 'User'}</span>
                </p>
                <p>
                  PN: <span>{currentUser?.pn || '00000000'}</span>
                </p>
                {currentUser?.role && (
                  <p>
                    Jabatan: <span style={{ color: '#555', fontWeight: 600 }}>{currentUser.role}</span>
                  </p>
                )}
                {currentUser?.cabang && (
                  <p>
                    Cabang: <span style={{ color: '#555', fontWeight: 600 }}>{currentUser.cabang}</span>
                  </p>
                )}
              </div>
              <a
                className="dropdown-menu-item"
                style={{ color: '#dc2626', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Keluar / Logout
              </a>
            </div>
          )}
        </div>

        {/* Quick logout button on navbar */}
        <button
          onClick={onLogout}
          title="Keluar dari sistem (Logout)"
          style={{
            background: 'rgba(239, 68, 68, 0.18)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fee2e2',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.35)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
            e.currentTarget.style.color = '#fee2e2';
          }}
        >
          <i className="fa-solid fa-power-off"></i>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};
