import React, { useState } from 'react';

interface FundingTransactionViewProps {
  onDownloadPDF: () => void;
}

export const FundingTransactionView: React.FC<FundingTransactionViewProps> = ({ onDownloadPDF }) => {
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'MERCHANT' | 'EDC_QRIS'>('PIPELINE');

  return (
    <div className="page-section active-page">
      <div className="header-content">
        <div className="header-top">
          <h2>Funding & Transaction Monitoring</h2>
          <button className="btn-action btn-download" onClick={onDownloadPDF}>
            <i className="fa-solid fa-file-pdf"></i> Unduh PDF
          </button>
        </div>

        <div className="filters">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn-action"
              style={{
                background: activeTab === 'PIPELINE' ? '#FF8F00' : '#f0f4f8',
                color: activeTab === 'PIPELINE' ? '#fff' : '#2b3674',
                border: '1px solid #e0e5f2',
              }}
              onClick={() => setActiveTab('PIPELINE')}
            >
              <i className="fa-solid fa-link"></i> Pipeline FT
            </button>
            <button
              className="btn-action"
              style={{
                background: activeTab === 'MERCHANT' ? '#FF8F00' : '#f0f4f8',
                color: activeTab === 'MERCHANT' ? '#fff' : '#2b3674',
                border: '1px solid #e0e5f2',
              }}
              onClick={() => setActiveTab('MERCHANT')}
            >
              <i className="fa-solid fa-store"></i> Akuisisi Merchant
            </button>
            <button
              className="btn-action"
              style={{
                background: activeTab === 'EDC_QRIS' ? '#FF8F00' : '#f0f4f8',
                color: activeTab === 'EDC_QRIS' ? '#fff' : '#2b3674',
                border: '1px solid #e0e5f2',
              }}
              onClick={() => setActiveTab('EDC_QRIS')}
            >
              <i className="fa-solid fa-satellite-dish"></i> EDC & QRIS Monitoring
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="summary-grid">
        <div className="sum-card" style={{ borderTopColor: '#FF8F00' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#FF8F00' }}>Pipeline Deals</h4>
            <i className="fa-solid fa-handshake" style={{ color: '#FF8F00' }}></i>
          </div>
          <div className="value-row">
            <div className="value">148 Deals</div>
            <span className="percent" style={{ background: '#fff3e0', color: '#FF8F00' }}>
              88.5%
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8f9bba' }}>Potensi DPK: Rp 420.5 Miliar</div>
        </div>

        <div className="sum-card" style={{ borderTopColor: '#05CD99' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#05CD99' }}>Merchant Aktif</h4>
            <i className="fa-solid fa-shop" style={{ color: '#05CD99' }}></i>
          </div>
          <div className="value-row">
            <div className="value">2,840</div>
            <span className="percent" style={{ background: '#e6fcf5', color: '#05CD99' }}>
              94.2%
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8f9bba' }}>Sales Volume: Rp 182.4 M / bln</div>
        </div>

        <div className="sum-card" style={{ borderTopColor: '#307FE2' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#307FE2' }}>EDC Produktif</h4>
            <i className="fa-solid fa-calculator" style={{ color: '#307FE2' }}></i>
          </div>
          <div className="value-row">
            <div className="value">1,120 Unit</div>
            <span className="percent" style={{ background: '#e3f2fd', color: '#307FE2' }}>
              89.0%
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8f9bba' }}>Rata-rata CASA: Rp 38.5 Jt</div>
        </div>

        <div className="sum-card" style={{ borderTopColor: '#0857C3' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#0857C3' }}>QRIS Merchant</h4>
            <i className="fa-solid fa-qrcode" style={{ color: '#0857C3' }}></i>
          </div>
          <div className="value-row">
            <div className="value">3,650 Unit</div>
            <span className="percent" style={{ background: '#e8f0fe', color: '#0857C3' }}>
              105.4%
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8f9bba' }}>Transaksi: 48,200 txn / bln</div>
        </div>
      </div>

      {/* Data Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 10px 25px rgba(112, 144, 176, 0.08)',
          border: '1px solid #edf2f7',
        }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2b3674', marginBottom: '16px' }}>
          <i className="fa-solid fa-list-check" style={{ color: '#0857C3', marginRight: '8px' }}></i>
          Daftar Inisiatif & Pipeline Funding
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8faff', borderBottom: '2px solid #e0e5f2', textAlign: 'left' }}>
              <th style={{ padding: '12px 14px', color: '#8f9bba' }}>NAMA NASABAH / MERCHANT</th>
              <th style={{ padding: '12px 14px', color: '#8f9bba' }}>PRODUK</th>
              <th style={{ padding: '12px 14px', color: '#8f9bba' }}>ESTIMASI SALDO</th>
              <th style={{ padding: '12px 14px', color: '#8f9bba' }}>RM PIC</th>
              <th style={{ padding: '12px 14px', color: '#8f9bba' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'PT Nusantara Megah Jaya', prod: 'Giro Bisnis & QLOLA', val: 'Rp 25.0 M', rm: 'Budi Santoso', status: 'Closing Deal' },
              { name: 'RS Permata Harapan Medika', prod: 'Payroll & Giro', val: 'Rp 14.5 M', rm: 'Siti Rahmawati', status: 'Negotiation' },
              { name: 'CV Makmur Sentosa Abadi', prod: 'EDC & QRIS Dinamis', val: 'Rp 4.2 M', rm: 'Agus Pratama', status: 'Implemented' },
              { name: 'Yayasan Bina Cendekia', prod: 'Deposito Berjangka', val: 'Rp 30.0 M', rm: 'Dewi Lestari', status: 'Closing Deal' },
              { name: 'Hotel Grand Majestic', prod: 'CASA Merchant EDC', val: 'Rp 8.7 M', rm: 'Maya Kusuma', status: 'Implemented' },
            ].map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f4f8' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#2b3674' }}>{item.name}</td>
                <td style={{ padding: '12px 14px', color: '#0857C3', fontWeight: 700 }}>{item.prod}</td>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#05CD99' }}>{item.val}</td>
                <td style={{ padding: '12px 14px', color: '#4b5563' }}>{item.rm}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: item.status === 'Implemented' ? '#e6fcf5' : '#e3f2fd',
                      color: item.status === 'Implemented' ? '#05CD99' : '#0857C3',
                    }}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
