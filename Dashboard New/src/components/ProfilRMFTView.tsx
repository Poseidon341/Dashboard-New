import React, { useMemo, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { UkerInfo, RMFTProfileData } from '../types';
import { FilterBar } from './FilterBar';

interface ProfilRMFTViewProps {
  ukerMap: Record<string, UkerInfo>;
  rmftProfiles: RMFTProfileData[];
  selectedArea: string;
  onAreaChange: (area: string) => void;
  selectedCabang: string;
  onCabangChange: (cabang: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  statusText: string;
  isOnline: boolean;
  onDownloadPDF: () => void;
}

export type JabatanType = 'BUSINESS' | 'BRANCH' | 'UNIT';

export interface KPIDefinition {
  key: keyof RMFTProfileData['kpi'];
  label: string;
  shortLabel: string;
  category: 'DPK' | 'TRANSAKSI' | 'CROSS_SELL';
  icon: string;
  colorClass: 'blue' | 'orange' | 'green' | 'red';
  isMoney: boolean;
  unit: string;
  bobot: {
    BUSINESS: number;
    BRANCH: number;
    UNIT: number;
  };
}

export const KPI_DEFINITIONS: KPIDefinition[] = [
  {
    key: 'dpk',
    label: 'Daily Average DPK Retail',
    shortLabel: 'Daily Avg. DPK',
    category: 'DPK',
    icon: 'fa-chart-line',
    colorClass: 'blue',
    isMoney: true,
    unit: 'Rp',
    bobot: { BUSINESS: 10, BRANCH: 15, UNIT: 10 },
  },
  {
    key: 'saltab',
    label: 'Posisi Saldo Tabungan',
    shortLabel: 'Saldo Tabungan',
    category: 'DPK',
    icon: 'fa-piggy-bank',
    colorClass: 'orange',
    isMoney: true,
    unit: 'Rp',
    bobot: { BUSINESS: 10, BRANCH: 15, UNIT: 20 },
  },
  {
    key: 'avgcasa',
    label: 'Daily Average CASA EDC Merchant',
    shortLabel: 'Avg. CASA Merch',
    category: 'DPK',
    icon: 'fa-vault',
    colorClass: 'green',
    isMoney: true,
    unit: 'Rp',
    bobot: { BUSINESS: 10, BRANCH: 0, UNIT: 0 },
  },
  {
    key: 'brimo',
    label: 'Jumlah User Aktif BRImo',
    shortLabel: 'User Aktif BRImo',
    category: 'TRANSAKSI',
    icon: 'fa-mobile-screen-button',
    colorClass: 'red',
    isMoney: false,
    unit: 'User',
    bobot: { BUSINESS: 5, BRANCH: 15, UNIT: 15 },
  },
  {
    key: 'avggiro',
    label: 'Daily Average Giro Retail',
    shortLabel: 'Daily Avg. Giro',
    category: 'DPK',
    icon: 'fa-money-check-dollar',
    colorClass: 'blue',
    isMoney: true,
    unit: 'Rp',
    bobot: { BUSINESS: 10, BRANCH: 0, UNIT: 0 },
  },
  {
    key: 'svedc',
    label: 'Sales Volume Merchant EDC',
    shortLabel: 'SV Merchant EDC',
    category: 'TRANSAKSI',
    icon: 'fa-receipt',
    colorClass: 'orange',
    isMoney: true,
    unit: 'Rp',
    bobot: { BUSINESS: 5, BRANCH: 5, UNIT: 0 },
  },
  {
    key: 'edcprod',
    label: 'Jumlah Merchant EDC Produktif',
    shortLabel: 'Merchant EDC Prod',
    category: 'TRANSAKSI',
    icon: 'fa-credit-card',
    colorClass: 'green',
    isMoney: false,
    unit: 'Unit',
    bobot: { BUSINESS: 10, BRANCH: 7.5, UNIT: 0 },
  },
  {
    key: 'qlola',
    label: 'User Aktif QLOLA',
    shortLabel: 'User Aktif QLOLA',
    category: 'TRANSAKSI',
    icon: 'fa-building-columns',
    colorClass: 'red',
    isMoney: false,
    unit: 'User',
    bobot: { BUSINESS: 5, BRANCH: 0, UNIT: 0 },
  },
  {
    key: 'avgtab',
    label: 'Daily Average Tabungan',
    shortLabel: 'Daily Avg. Tab',
    category: 'DPK',
    icon: 'fa-coins',
    colorClass: 'blue',
    isMoney: true,
    unit: 'Rp',
    bobot: { BUSINESS: 20, BRANCH: 25, UNIT: 25 },
  },
  {
    key: 'svqris',
    label: 'Sales Volume Merchant QRIS',
    shortLabel: 'SV Merchant QRIS',
    category: 'TRANSAKSI',
    icon: 'fa-chart-simple',
    colorClass: 'orange',
    isMoney: true,
    unit: 'Rp',
    bobot: { BUSINESS: 0, BRANCH: 5, UNIT: 10 },
  },
  {
    key: 'qrisprod',
    label: 'Jumlah Merchant QRIS Produktif',
    shortLabel: 'Merchant QRIS Prod',
    category: 'TRANSAKSI',
    icon: 'fa-qrcode',
    colorClass: 'green',
    isMoney: false,
    unit: 'Unit',
    bobot: { BUSINESS: 0, BRANCH: 7.5, UNIT: 15 },
  },
  {
    key: 'holding',
    label: 'Product Holding Ratio',
    shortLabel: 'Product Holding',
    category: 'CROSS_SELL',
    icon: 'fa-layer-group',
    colorClass: 'red',
    isMoney: false,
    unit: 'Ratio',
    bobot: { BUSINESS: 5, BRANCH: 5, UNIT: 5 },
  },
  {
    key: 'payroll',
    label: 'New Account Payroll',
    shortLabel: 'New Payroll',
    category: 'CROSS_SELL',
    icon: 'fa-id-card-clip',
    colorClass: 'blue',
    isMoney: false,
    unit: 'NOA',
    bobot: { BUSINESS: 10, BRANCH: 0, UNIT: 0 },
  },
];

const formatNumber = (val: number, isMoney = false): string => {
  if (val === 0 || isNaN(val) || !val) return '0';
  if (!isMoney) return val.toLocaleString('id-ID', { maximumFractionDigits: 2 });
  if (val >= 1_000_000_000_000) return (val / 1_000_000_000_000).toFixed(2) + ' T';
  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(2) + ' M';
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(2) + ' Jt';
  return val.toLocaleString('id-ID');
};

const getPointFromPct = (pct: number): number => {
  if (pct >= 100) return 4;
  if (pct > 85) return 3;
  if (pct >= 65) return 2;
  return 1;
};

const getTierFromScore = (score: number): { tier: string; color: string; label: string } => {
  if (score >= 3.0) return { tier: 'Tier 1', color: '#05CD99', label: 'Sangat Baik (Exceed)' };
  if (score > 2.5) return { tier: 'Tier 2', color: '#307FE2', label: 'Baik (On Target)' };
  if (score >= 2.0) return { tier: 'Tier 3', color: '#FF8F00', label: 'Cukup (Need Improvement)' };
  return { tier: 'Tier 4', color: '#EE5D50', label: 'Kurang (Underperformed)' };
};

export const ProfilRMFTView: React.FC<ProfilRMFTViewProps> = ({
  ukerMap,
  rmftProfiles,
  selectedArea,
  onAreaChange,
  selectedCabang,
  onCabangChange,
  onSync,
  isSyncing,
  statusText,
  isOnline,
  onDownloadPDF,
}) => {
  const [selectedRMSearch, setSelectedRMSearch] = useState<string>('');
  const [roleOverride, setRoleOverride] = useState<JabatanType | null>(null);
  const [filterActiveKPIOnly, setFilterActiveKPIOnly] = useState<boolean>(false);

  // Filter available RMs based on Area & Cabang
  const availableRMs = useMemo(() => {
    return rmftProfiles.filter((rm) => {
      let isMatch = true;
      if (selectedCabang !== 'ALL') {
        isMatch = rm.cabang.toLowerCase().includes(selectedCabang.toLowerCase());
      } else if (selectedArea !== 'ALL') {
        isMatch = rm.area.toLowerCase().includes(selectedArea.toLowerCase());
      }
      return isMatch;
    });
  }, [rmftProfiles, selectedArea, selectedCabang]);

  const datalistOptions = useMemo(() => {
    return availableRMs.map((rm) => `${rm.pn} - ${rm.nama}`);
  }, [availableRMs]);

  // Set default selected RM if none or filter changes
  useEffect(() => {
    if (availableRMs.length > 0) {
      const currentExists = availableRMs.some(
        (rm) => `${rm.pn} - ${rm.nama}` === selectedRMSearch || rm.pn === selectedRMSearch.split(' - ')[0]
      );
      if (!currentExists) {
        setSelectedRMSearch(`${availableRMs[0].pn} - ${availableRMs[0].nama}`);
      }
    } else {
      setSelectedRMSearch('');
    }
  }, [availableRMs]);

  // Reset role override when RM selection changes
  useEffect(() => {
    setRoleOverride(null);
  }, [selectedRMSearch]);

  // Find active profile
  const activeProfile = useMemo(() => {
    if (!selectedRMSearch || availableRMs.length === 0) return null;
    const searchPn = selectedRMSearch.split(' - ')[0].trim();
    const searchNama = selectedRMSearch.includes(' - ')
      ? selectedRMSearch.substring(selectedRMSearch.indexOf(' - ') + 3).trim()
      : selectedRMSearch;

    return (
      availableRMs.find(
        (rm) =>
          rm.pn === searchPn ||
          rm.nama.toLowerCase() === searchNama.toLowerCase() ||
          `${rm.pn} - ${rm.nama}` === selectedRMSearch
      ) || availableRMs[0]
    );
  }, [selectedRMSearch, availableRMs]);

  // Determine Jabatan type
  const currentJabatanType: JabatanType = useMemo(() => {
    if (roleOverride) return roleOverride;
    if (!activeProfile) return 'BUSINESS';
    const j = activeProfile.jabatan.toUpperCase();
    if (j.includes('UNIT')) return 'UNIT';
    if (j.includes('BRANCH') || j.includes('CABANG') || j.includes('KCP')) return 'BRANCH';
    return 'BUSINESS';
  }, [activeProfile, roleOverride]);

  // Dynamic KPI Score calculation based on Jabatan weights
  const computedKPI = useMemo(() => {
    if (!activeProfile) return null;

    let totalWeightedScore = 0;
    let totalBobot = 0;
    let pointCounts = { 4: 0, 3: 0, 2: 0, 1: 0 };

    const items = KPI_DEFINITIONS.map((def) => {
      const rawKPI = activeProfile.kpi[def.key] || { realisasi: 0, target: 1, pct: 0, score: 1 };
      const realisasi = rawKPI.realisasi || 0;
      const target = rawKPI.target || 1;
      const pct = target > 0 ? (realisasi / target) * 100 : 0;
      const point = getPointFromPct(pct);
      const bobot = def.bobot[currentJabatanType];
      const isApplicable = bobot > 0;
      const weightedScore = isApplicable ? point * (bobot / 100) : 0;

      if (isApplicable) {
        totalWeightedScore += weightedScore;
        totalBobot += bobot;
        pointCounts[point as 1 | 2 | 3 | 4] += 1;
      }

      return {
        ...def,
        realisasi,
        target,
        pct,
        point,
        bobot,
        isApplicable,
        weightedScore,
      };
    });

    const finalScore = parseFloat(totalWeightedScore.toFixed(2));
    const tierInfo = getTierFromScore(finalScore);

    return {
      items,
      totalWeightedScore: finalScore,
      totalBobot,
      tierInfo,
      pointCounts,
    };
  }, [activeProfile, currentJabatanType]);

  // Trigger celebration confetti for Tier 1
  useEffect(() => {
    if (computedKPI && computedKPI.totalWeightedScore >= 3.0) {
      try {
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#05CD99', '#307FE2', '#FF8F00'],
        });
      } catch (e) {
        // ignore in iframe
      }
    }
  }, [computedKPI?.totalWeightedScore, activeProfile?.pn]);

  // Dynamic Title
  const dynamicTitle = useMemo(() => {
    let title = 'Profil Kinerja RMFT';
    if (selectedCabang !== 'ALL') {
      title += ` - Cabang ${selectedCabang}`;
    } else if (selectedArea !== 'ALL') {
      title += ` - Area ${selectedArea}`;
    } else {
      title += ' - Seluruh Area';
    }
    return title;
  }, [selectedArea, selectedCabang]);

  return (
    <div id="page-rmft" className="page-section active-page">
      <div className="header-content">
        <div className="header-top">
          <div>
            <h2>{dynamicTitle}</h2>
            <p style={{ color: '#8f9bba', fontSize: '0.85rem', marginTop: '2px', fontWeight: 600 }}>
              Monitoring Detail Realisasi & Bobot KPI Individu Berdasarkan Jabatan
            </p>
          </div>
          <button className="btn-action btn-sync" onClick={onSync} disabled={isSyncing}>
            <i className={`fa-solid fa-rotate ${isSyncing ? 'fa-spin' : ''}`}></i>
            {isSyncing ? 'Menyinkronkan...' : 'Sync Data'}
          </button>
        </div>

        <FilterBar
          ukerMap={ukerMap}
          selectedArea={selectedArea}
          onAreaChange={onAreaChange}
          selectedCabang={selectedCabang}
          onCabangChange={onCabangChange}
          selectedSegmen="ALL"
          onSegmenChange={() => {}}
          selectedDate=""
          onDateChange={() => {}}
          onSync={onSync}
          isSyncing={isSyncing}
          statusText={statusText}
          isOnline={isOnline}
          showRMSelect={true}
          rmSearchVal={selectedRMSearch}
          onRMSearchChange={setSelectedRMSearch}
          rmDatalistOptions={datalistOptions}
          onDownloadPDF={onDownloadPDF}
        />
      </div>

      {!activeProfile || !computedKPI ? (
        <div className="empty-state">
          <i className="fa-solid fa-user-slash"></i>
          <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2b3674' }}>
            Tidak ada RM ditemukan di filter yang dipilih
          </p>
          <p style={{ marginTop: '6px' }}>Silakan pilih Area atau Cabang lain dari dropdown di atas.</p>
        </div>
      ) : (
        <div className="rmft-wrapper">
          {/* LEFT COLUMN: PROFIL & SCORE */}
          <div className="rmft-left">
            <div className="rmft-profile-card">
              <div className="rmft-profile-header">
                <i className="fa-solid fa-address-card"></i> Profil RMFT
              </div>
              <div className="rmft-profile-body">
                <div className="rmft-photo-box">
                  <div className="rmft-photo-placeholder">
                    <i className="fa-solid fa-user-tie"></i>
                  </div>
                </div>

                <table className="rmft-info-table">
                  <tbody>
                    <tr>
                      <td className="lbl">Cabang</td>
                      <td className="val">{activeProfile.cabang}</td>
                    </tr>
                    <tr>
                      <td className="lbl">Nama RM</td>
                      <td className="val">
                        <span className="val-highlight">{activeProfile.nama}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="lbl">PN</td>
                      <td className="val">{activeProfile.pn}</td>
                    </tr>
                    <tr>
                      <td className="lbl">Unit Kerja</td>
                      <td className="val">{activeProfile.uker}</td>
                    </tr>
                    <tr>
                      <td className="lbl">Status</td>
                      <td className="val">{activeProfile.status}</td>
                    </tr>
                    <tr>
                      <td className="lbl">TMT</td>
                      <td className="val">{activeProfile.tmt}</td>
                    </tr>
                    <tr>
                      <td className="lbl">Jabatan</td>
                      <td className="val" style={{ fontSize: '0.8rem' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background:
                              currentJabatanType === 'BUSINESS'
                                ? '#e3f2fd'
                                : currentJabatanType === 'BRANCH'
                                ? '#fff3e0'
                                : '#e6fcf5',
                            color:
                              currentJabatanType === 'BUSINESS'
                                ? '#0857C3'
                                : currentJabatanType === 'BRANCH'
                                ? '#FF8F00'
                                : '#05CD99',
                            fontWeight: 800,
                          }}
                        >
                          {activeProfile.jabatan}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="lbl">Masa Kerja</td>
                      <td className="val">{activeProfile.masakerja} Bulan</td>
                    </tr>
                    <tr>
                      <td className="lbl">JG / PG</td>
                      <td className="val">
                        {activeProfile.jg} / {activeProfile.pg}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Score & Tier Card */}
            <div className="rmft-score-card">
              <div className="rmft-score-title">
                <i className="fa-solid fa-star" style={{ color: '#ffeb3b' }}></i> Score Total
              </div>
              <div className="rmft-score-val">{computedKPI.totalWeightedScore.toFixed(2)}</div>
              <div
                className="rmft-tier-box"
                style={{
                  background: computedKPI.tierInfo.color,
                  color: 'white',
                }}
              >
                {computedKPI.tierInfo.tier}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8f9bba', marginTop: '8px', fontWeight: 700 }}>
                {computedKPI.tierInfo.label}
              </div>

              {/* Point counts mini pill breakdown */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid #f0f4f8',
                }}
              >
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#e6fcf5', color: '#05CD99', borderRadius: '4px', fontWeight: 800 }}>
                  P4: {computedKPI.pointCounts[4]}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#e3f2fd', color: '#307FE2', borderRadius: '4px', fontWeight: 800 }}>
                  P3: {computedKPI.pointCounts[3]}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#fff3e0', color: '#FF8F00', borderRadius: '4px', fontWeight: 800 }}>
                  P2: {computedKPI.pointCounts[2]}
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#feebee', color: '#EE5D50', borderRadius: '4px', fontWeight: 800 }}>
                  P1: {computedKPI.pointCounts[1]}
                </span>
              </div>
            </div>

            {/* Role Switcher Selector for Simulation */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 10px 25px rgba(112, 144, 176, 0.08)',
                border: '1px solid #edf2f7',
                marginTop: '16px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#8f9bba', textTransform: 'uppercase', marginBottom: '8px' }}>
                <i className="fa-solid fa-sliders" style={{ color: '#0857C3', marginRight: '6px' }}></i>
                Simulasi Bobot Jabatan
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setRoleOverride('BUSINESS')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: currentJabatanType === 'BUSINESS' ? '2px solid #0857C3' : '1px solid #e0e5f2',
                    background: currentJabatanType === 'BUSINESS' ? '#eef4ff' : '#f8faff',
                    color: currentJabatanType === 'BUSINESS' ? '#0857C3' : '#2b3674',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>RM FT Bisnis / Business</span>
                  {currentJabatanType === 'BUSINESS' && <i className="fa-solid fa-check-circle" style={{ color: '#0857C3' }}></i>}
                </button>

                <button
                  type="button"
                  onClick={() => setRoleOverride('BRANCH')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: currentJabatanType === 'BRANCH' ? '2px solid #FF8F00' : '1px solid #e0e5f2',
                    background: currentJabatanType === 'BRANCH' ? '#fff8ec' : '#f8faff',
                    color: currentJabatanType === 'BRANCH' ? '#FF8F00' : '#2b3674',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>RM FT Cabang / Branch</span>
                  {currentJabatanType === 'BRANCH' && <i className="fa-solid fa-check-circle" style={{ color: '#FF8F00' }}></i>}
                </button>

                <button
                  type="button"
                  onClick={() => setRoleOverride('UNIT')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: currentJabatanType === 'UNIT' ? '2px solid #05CD99' : '1px solid #e0e5f2',
                    background: currentJabatanType === 'UNIT' ? '#e6fcf5' : '#f8faff',
                    color: currentJabatanType === 'UNIT' ? '#05CD99' : '#2b3674',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>RM FT Unit</span>
                  {currentJabatanType === 'UNIT' && <i className="fa-solid fa-check-circle" style={{ color: '#05CD99' }}></i>}
                </button>
              </div>

              {roleOverride && (
                <button
                  type="button"
                  onClick={() => setRoleOverride(null)}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: '#8f9bba',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reset ke Jabatan Asli
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: 13 KPI BOXES & WEIGHTS */}
          <div className="rmft-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div className="rmft-main-title" style={{ margin: 0 }}>
                Rincian Pencapaian Produktivitas RMFT
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8f9bba' }}>
                  Filter Kartu:
                </span>
                <button
                  type="button"
                  onClick={() => setFilterActiveKPIOnly(!filterActiveKPIOnly)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: '1px solid #e0e5f2',
                    background: filterActiveKPIOnly ? '#0857C3' : '#ffffff',
                    color: filterActiveKPIOnly ? '#ffffff' : '#2b3674',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className={`fa-solid ${filterActiveKPIOnly ? 'fa-filter' : 'fa-list'}`} style={{ marginRight: '6px' }}></i>
                  {filterActiveKPIOnly ? 'KPI Dinilai Saja' : 'Tampilkan Semua (13 KPI)'}
                </button>
              </div>
            </div>

            {/* 13 KPI Grid */}
            <div className="rmft-kpi-grid">
              {computedKPI.items
                .filter((item) => !filterActiveKPIOnly || item.isApplicable)
                .map((item) => {
                  const pointColor =
                    item.point === 4
                      ? '#05CD99'
                      : item.point === 3
                      ? '#307FE2'
                      : item.point === 2
                      ? '#FF8F00'
                      : '#EE5D50';

                  return (
                    <div
                      key={item.key}
                      className="kpi-box"
                      style={{
                        opacity: item.isApplicable ? 1 : 0.65,
                        border: item.isApplicable ? undefined : '1px dashed #cbd5e1',
                      }}
                    >
                      <div className={`kpi-head ${item.colorClass}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className={`fa-solid ${item.icon}`} style={{ fontSize: '0.85rem' }}></i>
                          <span>{item.shortLabel}</span>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                          {item.pct.toFixed(0)}% | {item.point}
                        </span>
                      </div>

                      <div className="kpi-body">
                        <div className="kpi-body-col">
                          <div className="kpi-row">
                            <span className="lbl">Realisasi</span>
                            <span className="val kpi-val-realisasi" style={{ color: pointColor }}>
                              {formatNumber(item.realisasi, item.isMoney)}
                            </span>
                          </div>
                        </div>
                        <div className="kpi-body-col">
                          <div className="kpi-row">
                            <span className="lbl">Target</span>
                            <span className="val">{formatNumber(item.target, item.isMoney)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* TABEL MATRIKS BOBOT KPI & PENILAIAN */}
            <div className="kpi-bobot-container" style={{ marginTop: '24px' }}>
              <div className="kpi-bobot-title">
                <i className="fa-solid fa-table-list" style={{ color: '#0857C3' }}></i>
                <span>
                  Matriks Bobot KPI & Penilaian Terperinci (Jabatan: {currentJabatanType})
                </span>
              </div>

              <div style={{ overflowX: 'auto', padding: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8faff', borderBottom: '2px solid #e0e5f2', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', color: '#8f9bba', fontWeight: 800 }}>NO</th>
                      <th style={{ padding: '10px 12px', color: '#8f9bba', fontWeight: 800 }}>INDIKATOR KPI</th>
                      <th style={{ padding: '10px 12px', color: '#8f9bba', fontWeight: 800 }}>REALISASI</th>
                      <th style={{ padding: '10px 12px', color: '#8f9bba', fontWeight: 800 }}>TARGET</th>
                      <th style={{ padding: '10px 12px', color: '#8f9bba', fontWeight: 800, textAlign: 'center' }}>
                        ACH (%)
                      </th>
                      <th
                        style={{
                          padding: '10px 12px',
                          color: '#0857C3',
                          fontWeight: 800,
                          textAlign: 'center',
                          background: currentJabatanType === 'BUSINESS' ? '#eef4ff' : 'transparent',
                        }}
                      >
                        BOBOT BISNIS
                      </th>
                      <th
                        style={{
                          padding: '10px 12px',
                          color: '#FF8F00',
                          fontWeight: 800,
                          textAlign: 'center',
                          background: currentJabatanType === 'BRANCH' ? '#fff8ec' : 'transparent',
                        }}
                      >
                        BOBOT BRANCH
                      </th>
                      <th
                        style={{
                          padding: '10px 12px',
                          color: '#05CD99',
                          fontWeight: 800,
                          textAlign: 'center',
                          background: currentJabatanType === 'UNIT' ? '#e6fcf5' : 'transparent',
                        }}
                      >
                        BOBOT UNIT
                      </th>
                      <th style={{ padding: '10px 12px', color: '#8f9bba', fontWeight: 800, textAlign: 'center' }}>
                        POIN (1-4)
                      </th>
                      <th style={{ padding: '10px 12px', color: '#2b3674', fontWeight: 900, textAlign: 'right' }}>
                        SKOR TERTIMBANG
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {computedKPI.items.map((item, idx) => {
                      const pointColor =
                        item.point === 4
                          ? '#05CD99'
                          : item.point === 3
                          ? '#307FE2'
                          : item.point === 2
                          ? '#FF8F00'
                          : '#EE5D50';

                      return (
                        <tr
                          key={item.key}
                          style={{
                            borderBottom: '1px solid #f0f4f8',
                            background: item.isApplicable ? 'transparent' : '#fafafa',
                          }}
                        >
                          <td style={{ padding: '10px 12px', color: '#8f9bba', fontWeight: 700 }}>{idx + 1}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 800, color: '#2b3674' }}>
                            <i className={`fa-solid ${item.icon}`} style={{ marginRight: '8px', color: '#8f9bba' }}></i>
                            {item.label}
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0857C3' }}>
                            {formatNumber(item.realisasi, item.isMoney)}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#4b5563' }}>
                            {formatNumber(item.target, item.isMoney)}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: pointColor }}>
                            {item.pct.toFixed(1)}%
                          </td>
                          <td
                            style={{
                              padding: '10px 12px',
                              textAlign: 'center',
                              fontWeight: 700,
                              background: currentJabatanType === 'BUSINESS' ? '#eef4ff' : 'transparent',
                              color: item.bobot.BUSINESS > 0 ? '#0857C3' : '#cbd5e1',
                            }}
                          >
                            {item.bobot.BUSINESS > 0 ? `${item.bobot.BUSINESS}%` : '-'}
                          </td>
                          <td
                            style={{
                              padding: '10px 12px',
                              textAlign: 'center',
                              fontWeight: 700,
                              background: currentJabatanType === 'BRANCH' ? '#fff8ec' : 'transparent',
                              color: item.bobot.BRANCH > 0 ? '#FF8F00' : '#cbd5e1',
                            }}
                          >
                            {item.bobot.BRANCH > 0 ? `${item.bobot.BRANCH}%` : '-'}
                          </td>
                          <td
                            style={{
                              padding: '10px 12px',
                              textAlign: 'center',
                              fontWeight: 700,
                              background: currentJabatanType === 'UNIT' ? '#e6fcf5' : 'transparent',
                              color: item.bobot.UNIT > 0 ? '#05CD99' : '#cbd5e1',
                            }}
                          >
                            {item.bobot.UNIT > 0 ? `${item.bobot.UNIT}%` : '-'}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '24px',
                                height: '24px',
                                lineHeight: '24px',
                                borderRadius: '50%',
                                background: pointColor,
                                color: 'white',
                                fontWeight: 900,
                                fontSize: '0.75rem',
                              }}
                            >
                              {item.point}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#2b3674' }}>
                            {item.isApplicable ? item.weightedScore.toFixed(2) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8faff', borderTop: '2px solid #0857C3', fontWeight: 900 }}>
                      <td colSpan={5} style={{ padding: '12px', color: '#2b3674', fontSize: '0.9rem' }}>
                        TOTAL EVALUASI ({currentJabatanType})
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#0857C3',
                          background: currentJabatanType === 'BUSINESS' ? '#eef4ff' : 'transparent',
                        }}
                      >
                        100%
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#FF8F00',
                          background: currentJabatanType === 'BRANCH' ? '#fff8ec' : 'transparent',
                        }}
                      >
                        100%
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#05CD99',
                          background: currentJabatanType === 'UNIT' ? '#e6fcf5' : 'transparent',
                        }}
                      >
                        100%
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#8f9bba' }}>-</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#0857C3', fontSize: '1.1rem' }}>
                        {computedKPI.totalWeightedScore.toFixed(2)} ({computedKPI.tierInfo.tier})
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* GRADE LEGEND & TIERS CARD */}
            <div className="kpi-bobot-container" style={{ marginTop: '20px' }}>
              <div className="kpi-bobot-title">
                <i className="fa-solid fa-graduation-cap" style={{ color: '#FF8F00' }}></i>
                <span>Pedoman Penilaian Poin & Standar Kategori Tier</span>
              </div>
              <div className="kpi-bobot-body" style={{ padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', width: '100%' }}>
                  <div style={{ background: '#f8faff', borderRadius: '12px', padding: '14px', border: '1px solid #e0e5f2' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0857C3', marginBottom: '8px' }}>
                      <i className="fa-solid fa-bullseye" style={{ marginRight: '6px' }}></i> Kriteria Poin KPI
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#e6fcf5', borderRadius: '6px' }}>
                        <b>Poin 4 (Sangat Baik)</b>
                        <span style={{ color: '#05CD99', fontWeight: 800 }}>Pencapaian ≥ 100%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#e3f2fd', borderRadius: '6px' }}>
                        <b>Poin 3 (Baik)</b>
                        <span style={{ color: '#307FE2', fontWeight: 800 }}>&gt; 85.0% - &lt; 100%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#fff3e0', borderRadius: '6px' }}>
                        <b>Poin 2 (Cukup)</b>
                        <span style={{ color: '#FF8F00', fontWeight: 800 }}>≥ 65.0% - ≤ 85.0%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#feebee', borderRadius: '6px' }}>
                        <b>Poin 1 (Kurang)</b>
                        <span style={{ color: '#EE5D50', fontWeight: 800 }}>&lt; 65.0%</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8faff', borderRadius: '12px', padding: '14px', border: '1px solid #e0e5f2' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0857C3', marginBottom: '8px' }}>
                      <i className="fa-solid fa-ranking-star" style={{ marginRight: '6px' }}></i> Kategori Tier Hasil Akhir
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#e6fcf5', borderRadius: '6px' }}>
                        <b>Tier 1 (Peringkat Emas)</b>
                        <span style={{ color: '#05CD99', fontWeight: 800 }}>Score ≥ 3.00</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#e3f2fd', borderRadius: '6px' }}>
                        <b>Tier 2 (Peringkat Perak)</b>
                        <span style={{ color: '#307FE2', fontWeight: 800 }}>Score &gt; 2.50 - &lt; 3.00</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#fff3e0', borderRadius: '6px' }}>
                        <b>Tier 3 (Peringkat Perunggu)</b>
                        <span style={{ color: '#FF8F00', fontWeight: 800 }}>Score ≥ 2.00 - ≤ 2.50</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#feebee', borderRadius: '6px' }}>
                        <b>Tier 4 (Evaluasi Khusus)</b>
                        <span style={{ color: '#EE5D50', fontWeight: 800 }}>Score &lt; 2.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
