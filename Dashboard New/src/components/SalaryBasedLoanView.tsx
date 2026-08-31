import React from 'react';

interface SalaryBasedLoanViewProps {
  onDownloadPDF: () => void;
}

export const SalaryBasedLoanView: React.FC<SalaryBasedLoanViewProps> = ({ onDownloadPDF }) => {
  return (
    <div className="page-section active-page">
      <div className="header-content">
        <div className="header-top">
          <h2>Salary Based Loan (SBL / Briguna)</h2>
          <button className="btn-action btn-download" onClick={onDownloadPDF}>
            <i className="fa-solid fa-file-pdf"></i> Unduh PDF
          </button>
        </div>
      </div>

      <div className="summary-grid">
        <div className="sum-card" style={{ borderTopColor: '#0857C3' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#0857C3' }}>Total Baki Debet SBL</h4>
            <i className="fa-solid fa-money-bill-transfer" style={{ color: '#0857C3' }}></i>
          </div>
          <div className="value-row">
            <div className="value">Rp 842.6 M</div>
            <span className="percent" style={{ background: '#e8f0fe', color: '#0857C3' }}>
              103.8%
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8f9bba' }}>YTD Growth: +12.4%</div>
        </div>

        <div className="sum-card" style={{ borderTopColor: '#FF8F00' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#FF8F00' }}>Disbursement Bulan Ini</h4>
            <i className="fa-solid fa-hand-holding-dollar" style={{ color: '#FF8F00' }}></i>
          </div>
          <div className="value-row">
            <div className="value">Rp 48.2 M</div>
            <span className="percent" style={{ background: '#fff3e0', color: '#FF8F00' }}>
              95.4%
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8f9bba' }}>Total Debitur: 342 NOA</div>
        </div>

        <div className="sum-card" style={{ borderTopColor: '#05CD99' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#05CD99' }}>NPL SBL</h4>
            <i className="fa-solid fa-shield-halved" style={{ color: '#05CD99' }}></i>
          </div>
          <div className="value-row">
            <div className="value">0.42%</div>
            <span className="percent" style={{ background: '#e6fcf5', color: '#05CD99' }}>
              Sehat (A)
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8f9bba' }}>Threshold Max: 1.50%</div>
        </div>

        <div className="sum-card" style={{ borderTopColor: '#307FE2' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#307FE2' }}>Payroll Cross-Sell</h4>
            <i className="fa-solid fa-users-rectangle" style={{ color: '#307FE2' }}></i>
          </div>
          <div className="value-row">
            <div className="value">74.6%</div>
            <span className="percent" style={{ background: '#e3f2fd', color: '#307FE2' }}>
              Optimal
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#8f9bba' }}>Potensi Baru: 1,820 Rekening</div>
        </div>
      </div>
    </div>
  );
};
