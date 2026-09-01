import React, { useMemo, useState } from 'react';
import { UkerInfo, RawSegmenRow } from '../types';
import { cleanNum, safeStr, formatSheetDate, formatDateSafely } from '../services/sheetsService';
import { normalizeCabangName, getAreaForCabang } from '../data/mockData';
import { FilterBar } from './FilterBar';
import { formatUangShort, renderDelta } from '../utils/dailySeriesSynthesis';

interface DetailUnitKerjaViewProps {
  ukerMap: Record<string, UkerInfo>;
  rawSegmenData: RawSegmenRow[];
  selectedArea: string;
  onAreaChange: (area: string) => void;
  selectedCabang: string;
  onCabangChange: (cabang: string) => void;
  selectedSegmen: string;
  onSegmenChange: (segmen: string) => void;
  selectedProduk: string;
  onProdukChange: (produk: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  statusText: string;
  isOnline: boolean;
  onDownloadPDF: () => void;
}

interface UnitRow {
  namaUker: string;
  cabang: string;
  area: string;
  dpk: number;
  tabungan: number;
  giro: number;
  deposito: number;
  dtdDelta: number;
  mtdDelta: number;
  ytdDelta: number;
}

export const DetailUnitKerjaView: React.FC<DetailUnitKerjaViewProps> = ({
  ukerMap,
  rawSegmenData,
  selectedArea,
  onAreaChange,
  selectedCabang,
  onCabangChange,
  selectedSegmen,
  onSegmenChange,
  selectedProduk,
  onProdukChange,
  selectedDate,
  onDateChange,
  onSync,
  isSyncing,
  statusText,
  isOnline,
  onDownloadPDF,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const units = useMemo(() => {
    if (!selectedDate || rawSegmenData.length === 0) return [] as UnitRow[];

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

    type Bucket = {
      namaUker: string;
      cabang: string;
      area: string;
      tabungan: number;
      giro: number;
      deposito: number;
      dtd: number;
      mtd: number;
      ytd: number;
    };
    const buckets: Record<string, Bucket> = {};

    rawSegmenData.forEach((row) => {
      const rowDateStr = formatSheetDate(row.posisi || row['posisi']);
      if (!rowDateStr) return;
      // Only rows relevant to the current position/DTD/MTD/YTD comparison dates are needed here
      if (![t_str, dtd_str, mtd_str, ytd_str].includes(rowDateStr)) return;

      const kodeUker = safeStr(row['kode uker'] || row.kode || row.uker);
      const ukerObj = ukerMap[kodeUker];
      const rawCabang = safeStr(row['nama cabang'] || row['nama_cabang'] || row['cabang'] || ukerObj?.cabang || '');
      const cleanCabang = normalizeCabangName(rawCabang);
      const branchArea = safeStr(row['area']) || ukerObj?.area?.trim() || getAreaForCabang(cleanCabang);
      const namaUker = safeStr(row['nama uker'] || row['nama_uker']) || cleanCabang;

      if (selectedArea !== 'ALL' && branchArea !== selectedArea) return;
      if (selectedCabang !== 'ALL' && cleanCabang !== selectedCabang) return;

      const rawSeg = safeStr(row['segmentasi bpi'] || row['segmentasi_bpi'] || row['segmentasi bpr'] || row['segmentasi_bpr'] || row.segmentasi || row['segmentasi'] || row['segmen']).toUpperCase();
      if (selectedSegmen !== 'ALL' && !rawSeg.includes(selectedSegmen.toUpperCase())) return;
      if (selectedProduk !== 'ALL' && !rawSeg.includes(selectedProduk.toUpperCase())) return;

      const rawProd = safeStr(row.produk || row['produk']).toLowerCase();
      let prodKey: 'tabungan' | 'giro' | 'deposito' = 'tabungan';
      if (rawProd.includes('giro')) prodKey = 'giro';
      else if (rawProd.includes('dep') || rawProd.includes('time')) prodKey = 'deposito';
      else prodKey = 'tabungan';

      const saldo = cleanNum(row.saldo || row['saldo']);
      const key = `${namaUker}||${cleanCabang}`;
      if (!buckets[key]) {
        buckets[key] = {
          namaUker,
          cabang: cleanCabang,
          area: branchArea,
          tabungan: 0,
          giro: 0,
          deposito: 0,
          dtd: 0,
          mtd: 0,
          ytd: 0,
        };
      }
      const bucket = buckets[key];

      if (rowDateStr === t_str) bucket[prodKey] += saldo;
      if (rowDateStr === dtd_str) bucket.dtd += saldo;
      if (rowDateStr === mtd_str) bucket.mtd += saldo;
      if (rowDateStr === ytd_str) bucket.ytd += saldo;
    });

    return Object.values(buckets)
      .map((b): UnitRow => {
        const dpk = b.tabungan + b.giro + b.deposito;
        return {
          namaUker: b.namaUker,
          cabang: b.cabang,
          area: b.area,
          dpk,
          tabungan: b.tabungan,
          giro: b.giro,
          deposito: b.deposito,
          dtdDelta: dpk - b.dtd,
          mtdDelta: dpk - b.mtd,
          ytdDelta: dpk - b.ytd,
        };
      })
      .sort((a, b) => b.dpk - a.dpk);
  }, [rawSegmenData, ukerMap, selectedArea, selectedCabang, selectedSegmen, selectedProduk, selectedDate]);

  const filteredUnits = useMemo(() => {
    if (!searchTerm.trim()) return units;
    const q = searchTerm.toLowerCase().trim();
    return units.filter(
      (u) => u.namaUker.toLowerCase().includes(q) || u.cabang.toLowerCase().includes(q)
    );
  }, [units, searchTerm]);

  return (
    <div id="page-detail-uker" className="page-section active-page">
      <div className="header-content">
        <div className="header-top">
          <h2>Detail Unit Kerja</h2>
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
          selectedProduk={selectedProduk}
          onProdukChange={onProdukChange}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          onSync={onSync}
          isSyncing={isSyncing}
          statusText={statusText}
          isOnline={isOnline}
          onDownloadPDF={onDownloadPDF}
        />

        <div style={{ marginTop: '12px', maxWidth: '320px' }}>
          <input
            type="text"
            placeholder="Cari Unit Kerja atau Cabang..."
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
        {filteredUnits.length === 0 ? (
          <div className="empty-state">
            <i className="fa-solid fa-building-circle-xmark"></i>
            <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2b3674' }}>
              Tidak ada data unit kerja untuk filter yang dipilih
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8faff', borderBottom: '2px solid #e0e5f2', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800 }}>UNIT KERJA</th>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800 }}>CABANG</th>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800, textAlign: 'right' }}>DPK</th>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800, textAlign: 'right' }}>Tabungan</th>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800, textAlign: 'right' }}>Giro</th>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800, textAlign: 'right' }}>Deposito</th>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800, textAlign: 'center' }}>DTD</th>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800, textAlign: 'center' }}>MTD</th>
                  <th style={{ padding: '12px 14px', color: '#8f9bba', fontWeight: 800, textAlign: 'center' }}>YTD</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((u) => (
                  <tr key={`${u.namaUker}-${u.cabang}`} style={{ borderBottom: '1px solid #f0f4f8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#2b3674' }}>{u.namaUker}</td>
                    <td style={{ padding: '12px 14px', color: '#4b5563' }}>{u.cabang}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0857C3' }}>
                      Rp {formatUangShort(u.dpk)}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#4b5563' }}>
                      Rp {formatUangShort(u.tabungan)}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#4b5563' }}>
                      Rp {formatUangShort(u.giro)}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#4b5563' }}>
                      Rp {formatUangShort(u.deposito)}
                    </td>
                    <td style={{ padding: '8px 14px', textAlign: 'center' }}>{renderDelta(u.dtdDelta)}</td>
                    <td style={{ padding: '8px 14px', textAlign: 'center' }}>{renderDelta(u.mtdDelta)}</td>
                    <td style={{ padding: '8px 14px', textAlign: 'center' }}>{renderDelta(u.ytdDelta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
