import React, { useState } from 'react';
import { RMFTProfileData } from '../types';

interface PerformanceAppraisalViewProps {
  rmftProfiles: RMFTProfileData[];
  onDownloadPDF: () => void;
}

export const PerformanceAppraisalView: React.FC<PerformanceAppraisalViewProps> = ({
  rmftProfiles,
  onDownloadPDF,
}) => {
  const [tab, setTab] = useState<'RM' | 'MANAGER' | 'BOH' | 'SEGMEN'>('RM');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = rmftProfiles.filter(
    (rm) =>
      rm.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rm.pn.includes(searchTerm) ||
      rm.cabang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-section active-page">
      <div className="header-content">
        <div className="header-top">
          <h2>Performance Appraisal & Leaderboard</h2>
          <button className="btn-action btn-download" onClick={onDownloadPDF}>
            <i className="fa-solid fa-file-pdf"></i> Unduh PDF
          </button>
        </div>

        <div className="filters" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn-action"
              style={{
                background: tab === 'RM' ? '#0857C3' : '#f0f4f8',
                color: tab === 'RM' ? '#fff' : '#2b3674',
                border: '1px solid #e0e5f2',
              }}
              onClick={() => setTab('RM')}
            >
              <i className="fa-solid fa-trophy"></i> Ranking RM ({filtered.length})
            </button>
            <button
              className="btn-action"
              style={{
                background: tab === 'MANAGER' ? '#0857C3' : '#f0f4f8',
                color: tab === 'MANAGER' ? '#fff' : '#2b3674',
                border: '1px solid #e0e5f2',
              }}
              onClick={() => setTab('MANAGER')}
            >
              <i className="fa-solid fa-user-tie"></i> Ranking Manager
            </button>
            <button
              className="btn-action"
              style={{
                background: tab === 'BOH' ? '#0857C3' : '#f0f4f8',
                color: tab === 'BOH' ? '#fff' : '#2b3674',
                border: '1px solid #e0e5f2',
              }}
              onClick={() => setTab('BOH')}
            >
              <i className="fa-solid fa-building-shield"></i> Ranking BOH & SBOH
            </button>
            <button
              className="btn-action"
              style={{
                background: tab === 'SEGMEN' ? '#0857C3' : '#f0f4f8',
                color: tab === 'SEGMEN' ? '#fff' : '#2b3674',
                border: '1px solid #e0e5f2',
              }}
              onClick={() => setTab('SEGMEN')}
            >
              <i className="fa-solid fa-chart-pie"></i> Pencapaian Segmen
            </button>
          </div>

          <div style={{ minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Cari PN, Nama, Cabang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px',
                border: '2px solid #e0e5f2',
                borderRadius: '10px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(112, 144, 176, 0.08)',
          border: '1px solid #edf2f7',
          overflow: 'hidden',
          padding: '20px',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8faff', borderBottom: '2px solid #e0e5f2', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px', color: '#8f9bba', fontWeight: 800 }}>RANK</th>
                <th style={{ padding: '14px 16px', color: '#8f9bba', fontWeight: 800 }}>PN & NAMA</th>
                <th style={{ padding: '14px 16px', color: '#8f9bba', fontWeight: 800 }}>CABANG / AREA</th>
                <th style={{ padding: '14px 16px', color: '#8f9bba', fontWeight: 800 }}>JABATAN</th>
                <th style={{ padding: '14px 16px', color: '#8f9bba', fontWeight: 800 }}>TIER</th>
                <th style={{ padding: '14px 16px', color: '#8f9bba', fontWeight: 800, textAlign: 'right' }}>
                  SCORE TOTAL
                </th>
                <th style={{ padding: '14px 16px', color: '#8f9bba', fontWeight: 800, textAlign: 'right' }}>
                  DPK %
                </th>
                <th style={{ padding: '14px 16px', color: '#8f9bba', fontWeight: 800, textAlign: 'right' }}>
                  TABUNGAN %
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .sort((a, b) => b.score - a.score)
                .map((rm, idx) => {
                  const medalColor =
                    idx === 0
                      ? '#FF8F00'
                      : idx === 1
                      ? '#94a3b8'
                      : idx === 2
                      ? '#cd7f32'
                      : '#cbd5e1';
                  const tierColor =
                    rm.tier === 'Tier 1'
                      ? '#05CD99'
                      : rm.tier === 'Tier 2'
                      ? '#307FE2'
                      : rm.tier === 'Tier 3'
                      ? '#FF8F00'
                      : '#EE5D50';

                  return (
                    <tr
                      key={rm.pn}
                      style={{
                        borderBottom: '1px solid #f0f4f8',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fbfcfe')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: idx < 3 ? medalColor : '#f0f4f8',
                            color: idx < 3 ? 'white' : '#2b3674',
                            fontSize: '0.8rem',
                            fontWeight: 900,
                          }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0857C3' }}>{rm.nama}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8f9bba' }}>PN: {rm.pn}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#2b3674' }}>{rm.cabang}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8f9bba' }}>Area {rm.area}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#4b5563', fontWeight: 600 }}>
                        {rm.jabatan}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: tierColor,
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                          }}
                        >
                          {rm.tier}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          textAlign: 'right',
                          fontWeight: 900,
                          fontSize: '1.05rem',
                          color: '#2b3674',
                        }}
                      >
                        {rm.score.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: rm.kpi.dpk.pct >= 100 ? '#05CD99' : '#EE5D50',
                        }}
                      >
                        {rm.kpi.dpk.pct.toFixed(1)}%
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: rm.kpi.saltab.pct >= 100 ? '#05CD99' : '#EE5D50',
                        }}
                      >
                        {rm.kpi.saltab.pct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
