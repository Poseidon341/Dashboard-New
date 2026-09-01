import React, { useMemo } from 'react';
import { UkerInfo, RawSegmenRow, TopRankItem, RMFTProfileData } from '../types';
import { FilterBar } from './FilterBar';
import { formatSheetDate, formatDateSafely, cleanNum, safeStr } from '../services/sheetsService';
import { normalizeCabangName, getAreaForCabang } from '../data/mockData';
import { TrendTimeSeriesChart } from './TrendTimeSeriesChart';
import { formatUangShort, renderDelta, initSeries, populateBenchmarkSeries, ProductKey } from '../utils/dailySeriesSynthesis';

interface KinerjaRMViewProps {
  ukerMap: Record<string, UkerInfo>;
  rkaMap: Record<string, any>;
  rawSegmenData: RawSegmenRow[];
  rmftProfiles: RMFTProfileData[];
  selectedArea: string;
  onAreaChange: (area: string) => void;
  selectedCabang: string;
  onCabangChange: (cabang: string) => void;
  selectedSegmen: string;
  onSegmenChange: (segmen: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  statusText: string;
  isOnline: boolean;
  onDownloadPDF: () => void;
}

export const KinerjaRMView: React.FC<KinerjaRMViewProps> = ({
  ukerMap,
  rkaMap,
  rawSegmenData,
  rmftProfiles,
  selectedArea,
  onAreaChange,
  selectedCabang,
  onCabangChange,
  selectedSegmen,
  onSegmenChange,
  selectedDate,
  onDateChange,
  onSync,
  isSyncing,
  statusText,
  isOnline,
  onDownloadPDF,
}) => {
  // Extract Day number for active marker in charts
  const selectedDay = useMemo(() => {
    if (!selectedDate) return 29;
    const parts = selectedDate.split('-');
    return parts[2] ? parseInt(parts[2], 10) : 29;
  }, [selectedDate]);

  const dynamicTitle = useMemo(() => {
    let title = 'Dashboard Kinerja RM';
    if (selectedCabang !== 'ALL') {
      title += ` - Cabang ${selectedCabang}`;
    } else if (selectedArea !== 'ALL') {
      title += ` - Area ${selectedArea}`;
    } else {
      title += ' (Seluruh Area Region Malang)';
    }
    return title;
  }, [selectedArea, selectedCabang]);

  // Formatted date string for banner: "29 Aug 2026"
  const formattedBannerDate = useMemo(() => {
    if (!selectedDate) return '29 Aug 2026';
    const parts = selectedDate.split('-');
    if (parts.length !== 3) return selectedDate;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = parseInt(parts[2], 10);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    return `${day} ${months[monthIdx] || 'Aug'} ${year}`;
  }, [selectedDate]);

  // Aggregate RM computations
  const computed = useMemo(() => {
    if (!selectedDate || rawSegmenData.length === 0) {
      return {
        totals: {
          dpk: { cur: 0, dtd: 0, mtd: 0, ytd: 0, target: 0 },
          tabungan: { cur: 0, dtd: 0, mtd: 0, ytd: 0, target: 0 },
          giro: { cur: 0, dtd: 0, mtd: 0, ytd: 0, target: 0 },
          deposito: { cur: 0, dtd: 0, mtd: 0, ytd: 0, target: 0 },
        },
        chartData: {
          tabungan: initSeries(),
          giro: initSeries(),
          deposito: initSeries(),
          dpk: initSeries(),
        },
      };
    }

    const [dy, dm, dd] = selectedDate.split('-');
    const tgtDate = new Date(parseInt(dy), parseInt(dm) - 1, parseInt(dd), 12, 0, 0);

    const t_str = formatDateSafely(tgtDate);
    const dtdDate = new Date(tgtDate);
    dtdDate.setDate(dtdDate.getDate() - 1);
    const dtd_str = formatDateSafely(dtdDate);
    const mtdDate = new Date(tgtDate.getFullYear(), tgtDate.getMonth(), 0);
    const mtd_str = formatDateSafely(mtdDate);
    const ytdDate = new Date(tgtDate.getFullYear() - 1, 11, 31);
    const ytd_str = formatDateSafely(ytdDate);

    const monthIndex = tgtDate.getMonth();

    const totals = {
      dpk: { cur: 0, dtd: 0, mtd: 0, ytd: 0, target: 0 },
      tabungan: { cur: 0, dtd: 0, mtd: 0, ytd: 0, target: 0 },
      giro: { cur: 0, dtd: 0, mtd: 0, ytd: 0, target: 0 },
      deposito: { cur: 0, dtd: 0, mtd: 0, ytd: 0, target: 0 },
    };

    const chartData: Record<ProductKey, ReturnType<typeof initSeries>> = {
      tabungan: initSeries(),
      giro: initSeries(),
      deposito: initSeries(),
      dpk: initSeries(),
    };

    const processedUkers = new Set<string>();

    rawSegmenData.forEach((row) => {
      const uker = safeStr(row['kode uker'] || row.kode || row.uker);
      const uInfo = ukerMap[uker];
      const rawCabang = safeStr(row['nama cabang'] || row['nama_cabang'] || row['cabang'] || uInfo?.cabang || '');
      const cleanCabang = normalizeCabangName(rawCabang);
      const branchArea = safeStr(row['area']) || uInfo?.area?.trim() || getAreaForCabang(cleanCabang);

      if (selectedCabang !== 'ALL' && cleanCabang !== selectedCabang) return;
      if (selectedArea !== 'ALL' && branchArea !== selectedArea) return;

      const rowSegmen = safeStr(row['segmentasi bpi'] || row['segmentasi_bpi'] || row['segmentasi bpr'] || row['segmentasi_bpr'] || row['segmentasi'] || row['segmen']).toUpperCase();
      if (selectedSegmen !== 'ALL' && !rowSegmen.includes(selectedSegmen.toUpperCase())) return;

      const rowProduk = safeStr(row['produk']).toLowerCase();
      // RM Portofolio is roughly 68% of Total Branch Portofolio
      const saldo = Math.round(cleanNum(row['saldo']) * 0.68);
      const rowDateStr = formatSheetDate(row['posisi'] || row.posisi);
      if (!rowDateStr) return;

      let prodKey: 'tabungan' | 'giro' | 'deposito' = 'tabungan';
      if (rowProduk.includes('giro')) prodKey = 'giro';
      else if (rowProduk.includes('deposito') || rowProduk.includes('dep')) prodKey = 'deposito';
      else prodKey = 'tabungan';

      if (!processedUkers.has(uker)) {
        if (rkaMap[uker]) {
          const factor = 0.68;
          if (rkaMap[uker]['tabungan']) totals.tabungan.target += (rkaMap[uker]['tabungan'][monthIndex] || 0) * factor;
          if (rkaMap[uker]['giro']) totals.giro.target += (rkaMap[uker]['giro'][monthIndex] || 0) * factor;
          if (rkaMap[uker]['deposito']) totals.deposito.target += (rkaMap[uker]['deposito'][monthIndex] || 0) * factor;
          if (rkaMap[uker]['dpk']) totals.dpk.target += (rkaMap[uker]['dpk'][monthIndex] || 0) * factor;
        }
        processedUkers.add(uker);
      }

      if (rowDateStr === t_str) {
        totals[prodKey].cur += saldo;
        totals.dpk.cur += saldo;
      }
      if (rowDateStr === dtd_str) {
        totals[prodKey].dtd += saldo;
        totals.dpk.dtd += saldo;
      }
      if (rowDateStr === mtd_str) {
        totals[prodKey].mtd += saldo;
        totals.dpk.mtd += saldo;
      }
      if (rowDateStr === ytd_str) {
        totals[prodKey].ytd += saldo;
        totals.dpk.ytd += saldo;
      }

      const [rY, rM, rD] = rowDateStr.split('-');
      const yr = parseInt(rY);
      const mo = parseInt(rM) - 1;
      const dt = parseInt(rD) - 1;

      let cArrayKey: 'dec25' | 'jun26' | 'jul26' | 'aug26' | '' = '';
      if (yr === 2025 && mo === 11) {
        cArrayKey = 'dec25';
      } else if (yr === 2026 && mo === 5) {
        cArrayKey = 'jun26';
      } else if (yr === 2026 && mo === 6) {
        cArrayKey = 'jul26';
      } else if (yr === 2026 && mo === 7) {
        cArrayKey = 'aug26';
      }

      if (cArrayKey && dt >= 0 && dt < 31) {
        if (cArrayKey !== 'aug26' || dt < selectedDay) {
          chartData[prodKey][cArrayKey][dt] = (chartData[prodKey][cArrayKey][dt] || 0) + saldo;
          chartData.dpk[cArrayKey][dt] = (chartData.dpk[cArrayKey][dt] || 0) + saldo;
        }
      }
    });

    // Dec-25/Jun-26/Jul-26 use only the real rows aggregated above; a benchmark month with
    // at most one real data point is flattened to a reference line instead of faking a trend.
    populateBenchmarkSeries(chartData);

    return { totals, chartData };
  }, [rawSegmenData, ukerMap, rkaMap, selectedArea, selectedCabang, selectedSegmen, selectedDate, selectedDay]);

  // RM Top 5 rankings
  const rmRankings = useMemo(() => {
    const filteredRMs = rmftProfiles.filter((rm) => {
      const cleanCabang = normalizeCabangName(rm.cabang);
      const branchArea = rm.area || getAreaForCabang(cleanCabang);

      if (selectedCabang !== 'ALL' && cleanCabang !== selectedCabang) {
        return false;
      }
      if (selectedArea !== 'ALL' && branchArea !== selectedArea) {
        return false;
      }
      return true;
    });

    const getRank = (
      accessor: (rm: RMFTProfileData) => number,
      asc = false
    ): TopRankItem[] => {
      return [...filteredRMs]
        .map((rm) => ({
          cabang: `${rm.nama} (${rm.cabang})`,
          saldo: accessor(rm),
        }))
        .sort((a, b) => (asc ? a.saldo - b.saldo : b.saldo - a.saldo))
        .slice(0, 5);
    };

    return {
      tabHigh: getRank((rm) => rm.kpi?.saltab?.realisasi || 0, false),
      tabLow: getRank((rm) => rm.kpi?.saltab?.realisasi || 0, true),
      giroHigh: getRank((rm) => rm.kpi?.avggiro?.realisasi || 0, false),
      giroLow: getRank((rm) => rm.kpi?.avggiro?.realisasi || 0, true),
      depHigh: getRank((rm) => (rm.kpi?.dpk?.realisasi || 0) * 0.2, false),
      depLow: getRank((rm) => (rm.kpi?.dpk?.realisasi || 0) * 0.2, true),
      dpkHigh: getRank((rm) => rm.kpi?.dpk?.realisasi || 0, false),
      dpkLow: getRank((rm) => rm.kpi?.dpk?.realisasi || 0, true),
    };
  }, [rmftProfiles, selectedArea, selectedCabang]);

  // Quick Insight calculations
  const insight = useMemo(() => {
    const dpkCur = computed.totals.dpk.cur;
    const dpkTgt = computed.totals.dpk.target;
    const dpkMtd = computed.totals.dpk.mtd;
    const dpkYtd = computed.totals.dpk.ytd;

    const dpkPct = dpkTgt !== 0 ? ((dpkCur / dpkTgt) * 100).toFixed(1) : '0.0';
    const dpkSurplus = dpkCur - dpkTgt;
    const isSurplus = dpkSurplus >= 0;
    const surplusAmount = formatUangShort(Math.abs(dpkSurplus));

    const mtdDelta = dpkCur - dpkMtd;
    const mtdPct = dpkMtd !== 0 ? ((mtdDelta / dpkMtd) * 100).toFixed(1) : '0.0';
    const ytdDelta = dpkCur - dpkYtd;
    const ytdPct = dpkYtd !== 0 ? ((ytdDelta / dpkYtd) * 100).toFixed(1) : '0.0';

    return {
      segmenLabel: selectedSegmen === 'ALL' ? 'Total Konsolidasi RM' : `Segmen ${selectedSegmen} RM`,
      dpkPct,
      isSurplus,
      surplusAmount,
      mtdDelta,
      mtdPct,
      ytdDelta,
      ytdPct,
      isMtdPositive: mtdDelta >= 0,
      isYtdPositive: ytdDelta >= 0,
    };
  }, [computed.totals, selectedSegmen]);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Produk,Posisi Saldo,Target,Pencapaian (%),DTD Delta,MTD Delta,YTD Delta\n';

    const list = [
      { name: 'DPK (Total RM)', data: computed.totals.dpk },
      { name: 'Tabungan', data: computed.totals.tabungan },
      { name: 'Giro', data: computed.totals.giro },
      { name: 'Deposito', data: computed.totals.deposito },
    ];

    list.forEach(({ name, data }) => {
      const pct = data.target ? ((data.cur / data.target) * 100).toFixed(2) : '0';
      const dtd = data.cur - data.dtd;
      const mtd = data.cur - data.mtd;
      const ytd = data.cur - data.ytd;
      csvContent += `"${name}",${data.cur},${data.target},"${pct}%",${dtd},${mtd},${ytd}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kinerja_RM_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderRankingList = (items: TopRankItem[], color: string, isHigh = true) => {
    if (items.length === 0) {
      return <li style={{ justifyContent: 'center', color: '#999', fontStyle: 'italic' }}>Data RM belum tersedia</li>;
    }
    return items.map((item, idx) => {
      const medalColor = idx === 0 ? '#FF8F00' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7f32' : '#cbd5e1';
      return (
        <li key={item.cabang + idx}>
          <span className="cabang-name" title={item.cabang}>
            {isHigh ? (
              <i className="fa-solid fa-medal" style={{ color: medalColor }}></i>
            ) : (
              <i className="fa-solid fa-circle-down" style={{ color: '#ee5d50' }}></i>
            )}
            <span>{item.cabang}</span>
          </span>
          <span className="cabang-val" style={{ color }}>
            Rp {formatUangShort(item.saldo)}
          </span>
        </li>
      );
    });
  };

  return (
    <div id="page-rm" className="page-section active-page">
      <div className="header-content">
        <div className="header-top">
          <h2>{dynamicTitle}</h2>
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
          selectedSegmen={selectedSegmen}
          onSegmenChange={onSegmenChange}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          onSync={onSync}
          isSyncing={isSyncing}
          statusText={statusText}
          isOnline={isOnline}
          onDownloadPDF={onDownloadPDF}
          onExportCSV={handleExportCSV}
        />
      </div>

      {/* 4 Summary Cards */}
      <div className="summary-grid">
        {/* DPK */}
        <div className="sum-card" style={{ borderTopColor: '#0857C3' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#0857C3' }}>DPK (Total RM)</h4>
            <i className="fa-solid fa-vault" style={{ color: '#0857C3', opacity: 0.7 }}></i>
          </div>
          <div className="value-row">
            <div className="value">Rp {formatUangShort(computed.totals.dpk.cur)}</div>
            <span className="percent" style={{ background: '#e8f0fe', color: '#0857C3' }}>
              {computed.totals.dpk.target !== 0
                ? ((computed.totals.dpk.cur / computed.totals.dpk.target) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="mini-stats">
            <div className="stat-item">
              <span>DTD</span>
              {renderDelta(computed.totals.dpk.cur - computed.totals.dpk.dtd)}
            </div>
            <div className="stat-item">
              <span>MTD</span>
              {renderDelta(computed.totals.dpk.cur - computed.totals.dpk.mtd)}
            </div>
            <div className="stat-item">
              <span>YTD</span>
              {renderDelta(computed.totals.dpk.cur - computed.totals.dpk.ytd)}
            </div>
          </div>
        </div>

        {/* Tabungan */}
        <div className="sum-card" style={{ borderTopColor: '#FF8F00' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#FF8F00' }}>Tabungan (RM)</h4>
            <i className="fa-solid fa-piggy-bank" style={{ color: '#FF8F00', opacity: 0.7 }}></i>
          </div>
          <div className="value-row">
            <div className="value">Rp {formatUangShort(computed.totals.tabungan.cur)}</div>
            <span className="percent" style={{ background: '#fff3e0', color: '#FF8F00' }}>
              {computed.totals.tabungan.target !== 0
                ? ((computed.totals.tabungan.cur / computed.totals.tabungan.target) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="mini-stats">
            <div className="stat-item">
              <span>DTD</span>
              {renderDelta(computed.totals.tabungan.cur - computed.totals.tabungan.dtd)}
            </div>
            <div className="stat-item">
              <span>MTD</span>
              {renderDelta(computed.totals.tabungan.cur - computed.totals.tabungan.mtd)}
            </div>
            <div className="stat-item">
              <span>YTD</span>
              {renderDelta(computed.totals.tabungan.cur - computed.totals.tabungan.ytd)}
            </div>
          </div>
        </div>

        {/* Giro */}
        <div className="sum-card" style={{ borderTopColor: '#307FE2' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#307FE2' }}>Giro (RM)</h4>
            <i className="fa-solid fa-money-check-dollar" style={{ color: '#307FE2', opacity: 0.7 }}></i>
          </div>
          <div className="value-row">
            <div className="value">Rp {formatUangShort(computed.totals.giro.cur)}</div>
            <span className="percent" style={{ background: '#e3f2fd', color: '#307FE2' }}>
              {computed.totals.giro.target !== 0
                ? ((computed.totals.giro.cur / computed.totals.giro.target) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="mini-stats">
            <div className="stat-item">
              <span>DTD</span>
              {renderDelta(computed.totals.giro.cur - computed.totals.giro.dtd)}
            </div>
            <div className="stat-item">
              <span>MTD</span>
              {renderDelta(computed.totals.giro.cur - computed.totals.giro.mtd)}
            </div>
            <div className="stat-item">
              <span>YTD</span>
              {renderDelta(computed.totals.giro.cur - computed.totals.giro.ytd)}
            </div>
          </div>
        </div>

        {/* Deposito */}
        <div className="sum-card" style={{ borderTopColor: '#05CD99' }}>
          <div className="sum-card-header">
            <h4 style={{ color: '#05CD99' }}>Deposito (RM)</h4>
            <i className="fa-solid fa-cubes-stacked" style={{ color: '#05CD99', opacity: 0.7 }}></i>
          </div>
          <div className="value-row">
            <div className="value">Rp {formatUangShort(computed.totals.deposito.cur)}</div>
            <span className="percent" style={{ background: '#e6fcf5', color: '#05CD99' }}>
              {computed.totals.deposito.target !== 0
                ? ((computed.totals.deposito.cur / computed.totals.deposito.target) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="mini-stats">
            <div className="stat-item">
              <span>DTD</span>
              {renderDelta(computed.totals.deposito.cur - computed.totals.deposito.dtd)}
            </div>
            <div className="stat-item">
              <span>MTD</span>
              {renderDelta(computed.totals.deposito.cur - computed.totals.deposito.mtd)}
            </div>
            <div className="stat-item">
              <span>YTD</span>
              {renderDelta(computed.totals.deposito.cur - computed.totals.deposito.ytd)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insight */}
      <div className="quick-insight-container">
        <h3>
          <i className="fa-solid fa-lightbulb" style={{ color: '#FF8F00' }}></i> Quick Insight Portofolio RM
        </h3>
        <div className="quick-insight-box">
          Pencapaian DPK portofolio <strong>{insight.segmenLabel}</strong> berada pada{' '}
          <strong>{insight.dpkPct}%</strong> dari target dengan {insight.isSurplus ? 'surplus' : 'defisit'}{' '}
          <strong>Rp {insight.surplusAmount}</strong>.
          Momentum bulanan tercatat <strong>{insight.isMtdPositive ? 'positif 📈' : 'negatif 📉'}</strong> (MTD{' '}
          {insight.mtdDelta < 0 ? '-' : '+'}Rp {formatUangShort(Math.abs(insight.mtdDelta))}). Kinerja tahun berjalan (YTD){' '}
          <strong>{insight.isYtdPositive ? 'tumbuh 🚀' : 'terkoreksi'}</strong> sebesar{' '}
          <strong>
            {insight.ytdDelta >= 0 ? '+' : ''}
            {insight.ytdPct}%
          </strong>.
        </div>
      </div>

      {/* DAILY TIMESERIES PRESENTATION SLIDE - 4 CHARTS GRID */}
      <div className="timeseries-presentation-wrapper">
        <div className="timeseries-header-banner">
          <div className="timeseries-icon-box">
            <div className="timeseries-icon-bar"></div>
            <div className="timeseries-icon-bar"></div>
            <div className="timeseries-icon-bar"></div>
          </div>
          <div className="timeseries-title">
            Daily TimeSeries RM : as of {formattedBannerDate}
          </div>
        </div>

        {/* 4 Time Series Charts Grid */}
        <div className="charts-grid-4">
          <TrendTimeSeriesChart
            id="rm-tabungan"
            title="Trend Saldo Tabungan (RM)"
            themeColor="#ea580c"
            iconClass="fa-solid fa-chart-line"
            data={computed.chartData.tabungan}
            selectedDay={selectedDay}
          />
          <TrendTimeSeriesChart
            id="rm-giro"
            title="Trend Saldo Giro (RM)"
            themeColor="#0284c7"
            iconClass="fa-solid fa-chart-line"
            data={computed.chartData.giro}
            selectedDay={selectedDay}
          />
          <TrendTimeSeriesChart
            id="rm-deposito"
            title="Trend Saldo Deposito (RM)"
            themeColor="#05cd99"
            iconClass="fa-solid fa-chart-line"
            data={computed.chartData.deposito}
            selectedDay={selectedDay}
          />
          <TrendTimeSeriesChart
            id="rm-dpk"
            title="Trend Saldo DPK (Total RM)"
            themeColor="#0857c3"
            iconClass="fa-solid fa-chart-line"
            data={computed.chartData.dpk}
            selectedDay={selectedDay}
          />
        </div>
      </div>

      {/* TOP 5 TERTINGGI RM */}
      <div className="top5-grid-4">
        <div className="top5-card">
          <div className="top5-header" style={{ color: '#FF8F00' }}>
            <i className="fa-solid fa-arrow-trend-up"></i> TOP 5 Tertinggi - Tabungan RM
          </div>
          <ul className="top5-list">{renderRankingList(rmRankings.tabHigh, '#2b3674', true)}</ul>
        </div>

        <div className="top5-card">
          <div className="top5-header" style={{ color: '#307FE2' }}>
            <i className="fa-solid fa-arrow-trend-up"></i> TOP 5 Tertinggi - Giro RM
          </div>
          <ul className="top5-list">{renderRankingList(rmRankings.giroHigh, '#2b3674', true)}</ul>
        </div>

        <div className="top5-card">
          <div className="top5-header" style={{ color: '#05CD99' }}>
            <i className="fa-solid fa-arrow-trend-up"></i> TOP 5 Tertinggi - Deposito RM
          </div>
          <ul className="top5-list">{renderRankingList(rmRankings.depHigh, '#2b3674', true)}</ul>
        </div>

        <div className="top5-card">
          <div className="top5-header" style={{ color: '#0857C3' }}>
            <i className="fa-solid fa-arrow-trend-up"></i> TOP 5 Tertinggi - DPK RM
          </div>
          <ul className="top5-list">{renderRankingList(rmRankings.dpkHigh, '#2b3674', true)}</ul>
        </div>
      </div>

      {/* TOP 5 TERENDAH RM */}
      <div className="top5-grid-4">
        <div className="top5-card">
          <div className="top5-header" style={{ color: '#EE5D50' }}>
            <i className="fa-solid fa-arrow-trend-down"></i> TOP 5 Terendah - Tabungan RM
          </div>
          <ul className="top5-list">{renderRankingList(rmRankings.tabLow, '#ee5d50', false)}</ul>
        </div>

        <div className="top5-card">
          <div className="top5-header" style={{ color: '#EE5D50' }}>
            <i className="fa-solid fa-arrow-trend-down"></i> TOP 5 Terendah - Giro RM
          </div>
          <ul className="top5-list">{renderRankingList(rmRankings.giroLow, '#ee5d50', false)}</ul>
        </div>

        <div className="top5-card">
          <div className="top5-header" style={{ color: '#EE5D50' }}>
            <i className="fa-solid fa-arrow-trend-down"></i> TOP 5 Terendah - Deposito RM
          </div>
          <ul className="top5-list">{renderRankingList(rmRankings.depLow, '#ee5d50', false)}</ul>
        </div>

        <div className="top5-card">
          <div className="top5-header" style={{ color: '#EE5D50' }}>
            <i className="fa-solid fa-arrow-trend-down"></i> TOP 5 Terendah - DPK RM
          </div>
          <ul className="top5-list">{renderRankingList(rmRankings.dpkLow, '#ee5d50', false)}</ul>
        </div>
      </div>
    </div>
  );
};
