import React, { useState } from 'react';
import { UkerInfo } from '../types';

interface PointToPointViewProps {
  ukerMap: Record<string, UkerInfo>;
  onDownloadPDF: () => void;
}

export const PointToPointView: React.FC<PointToPointViewProps> = ({ ukerMap, onDownloadPDF }) => {
  const [metric, setMetric] = useState<'DPK' | 'TABUNGAN' | 'GIRO' | 'DEPOSITO'>('DPK');

  const branches = (Object.values(ukerMap) as UkerInfo[]).slice(0, 8);

  return (
    <div className="page-section active-page">
      <div className="header-content">
        <div className="header-top">
          <h2>Dashboard Point to Point (P.t.P)</h2>
          <button className="btn-action btn-download" onClick={onDownloadPDF}>
            <i className="fa-solid fa-file-pdf"></i> Unduh PDF
          </button>
        </div>

        <div className="filters">
          <div className="filter-item">
            <label className="text-label">METRIK P.T.P</label>
            <select value={metric} onChange={(e) => setMetric(e.target.value as any)}>
              <option value="DPK">DPK (Total Konsolidasi)</option>
              <option value="TABUNGAN">Tabungan</option>
              <option value="GIRO">Giro</option>
              <option value="DEPOSITO">Deposito</option>
            </select>
          </div>
          <div className="filter-item">
            <label className="text-label">PERIODE KOMPARASI</label>
            <select defaultValue="AUG26_VS_DEC25">
              <option value="AUG26_VS_DEC25">Aug-26 vs Dec-25 (YTD)</option>
              <option value="AUG26_VS_JUL26">Aug-26 vs Jul-26 (MTD)</option>
              <option value="AUG26_VS_JUN26">Aug-26 vs Jun-26 (QoQ)</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {branches.map((b, idx) => {
          const base = 850 + (idx % 5) * 180;
          const current = Math.round(base * 1.18);
          const delta = current - base;
          const pct = ((delta / base) * 100).toFixed(1);

          return (
            <div
              key={b.cabang + idx}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(112, 144, 176, 0.08)',
                border: '1px solid #edf2f7',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ color: '#2b3674', fontWeight: 800, fontSize: '1rem' }}>{b.cabang}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#8f9bba', fontWeight: 600 }}>Area {b.area}</span>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: '#e6fcf5',
                    color: '#05CD99',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                  }}
                >
                  +{pct}%
                </span>
              </div>

              <div style={{ margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: '#8f9bba' }}>Baseline: Rp {base} M</span>
                  <span style={{ fontWeight: 800, color: '#0857C3' }}>Current: Rp {current} M</span>
                </div>
                <div style={{ height: '8px', background: '#e0e5f2', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: '#0857C3', borderRadius: '4px' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', paddingTop: '10px', borderTop: '1px solid #f0f4f8' }}>
                <span style={{ color: '#8f9bba' }}>Pertumbuhan Nominal:</span>
                <span style={{ fontWeight: 800, color: '#05CD99' }}>+Rp {delta} Miliar</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
