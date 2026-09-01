import React from 'react';
import { UkerInfo } from '../types';
import { normalizeCabangName, getAreaForCabang, REGION_MALANG_CABANG_MAP } from '../data/mockData';

interface FilterBarProps {
  ukerMap: Record<string, UkerInfo>;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  selectedCabang: string;
  onCabangChange: (cabang: string) => void;
  selectedSegmen: string;
  onSegmenChange: (segmen: string) => void;
  selectedProduk?: string;
  onProdukChange?: (produk: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  statusText: string;
  isOnline: boolean;
  showRMSelect?: boolean;
  rmSearchVal?: string;
  onRMSearchChange?: (val: string) => void;
  rmDatalistOptions?: string[];
  onDownloadPDF?: () => void;
  onExportCSV?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  ukerMap,
  selectedArea,
  onAreaChange,
  selectedCabang,
  onCabangChange,
  selectedSegmen,
  onSegmenChange,
  selectedProduk = 'ALL',
  onProdukChange,
  selectedDate,
  onDateChange,
  onSync,
  isSyncing,
  statusText,
  isOnline,
  showRMSelect = false,
  rmSearchVal = '',
  onRMSearchChange,
  rmDatalistOptions = [],
  onDownloadPDF,
  onExportCSV,
}) => {
  // Extract unique areas and canonical branch mapping strictly based on Region Malang
  const areaSet = new Set<string>(Object.keys(REGION_MALANG_CABANG_MAP));
  const cabangByArea: Record<string, Set<string>> = {};

  // Initialize with official Region Malang mapping
  Object.entries(REGION_MALANG_CABANG_MAP).forEach(([area, branches]) => {
    cabangByArea[area] = new Set(branches);
  });

  // Supplement dynamically if new branches appear from ukerMap
  (Object.values(ukerMap) as UkerInfo[]).forEach((info) => {
    const cleanCabang = normalizeCabangName(info?.cabang || '');
    const cleanArea = info?.area?.trim() || getAreaForCabang(cleanCabang);
    if (cleanArea && cleanCabang) {
      areaSet.add(cleanArea);
      if (!cabangByArea[cleanArea]) cabangByArea[cleanArea] = new Set();
      cabangByArea[cleanArea].add(cleanCabang);
    }
  });

  const areas = Array.from(areaSet).sort();

  return (
    <div className="filters">
      <div className="filter-actions">
        <span className={`status-badge ${isSyncing ? 'loading' : isOnline ? 'ready' : 'ready'}`}>
          <i className={`fa-solid ${isOnline ? 'fa-circle-check' : 'fa-database'}`}></i>
          <span>{statusText}</span>
        </span>
      </div>

      {/* Area Selector */}
      <div className="filter-item">
        <label className="text-label">AREA</label>
        <select
          value={selectedArea}
          onChange={(e) => onAreaChange(e.target.value)}
          aria-label="Filter Area"
        >
          <option value="ALL">🌟 Seluruh Area</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* Cabang Selector */}
      <div className="filter-item">
        <label className="text-label">CABANG</label>
        <select
          value={selectedCabang}
          onChange={(e) => onCabangChange(e.target.value)}
          aria-label="Filter Cabang"
        >
          <option value="ALL">-- Semua Cabang --</option>
          {selectedArea === 'ALL' ? (
            Object.keys(cabangByArea)
              .sort()
              .map((area) => (
                <optgroup key={area} label={area}>
                  {Array.from(cabangByArea[area])
                    .sort()
                    .map((cab) => (
                      <option key={cab} value={cab}>
                        {cab}
                      </option>
                    ))}
                </optgroup>
              ))
          ) : (
            cabangByArea[selectedArea] &&
            Array.from(cabangByArea[selectedArea])
              .sort()
              .map((cab) => (
                <option key={cab} value={cab}>
                  {cab}
                </option>
              ))
          )}
        </select>
      </div>

      {/* RM Search Filter (For RMFT Profile) */}
      {showRMSelect && (
        <div className="filter-item">
          <label className="text-label">NAMA RMFT / PN</label>
          <input
            type="text"
            id="rmSelectInput"
            list="rmDataList"
            value={rmSearchVal}
            onChange={(e) => onRMSearchChange?.(e.target.value)}
            placeholder="Ketik PN atau Nama..."
            autoComplete="off"
          />
          <datalist id="rmDataList">
            {rmDatalistOptions.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </div>
      )}

      {/* Segmen Selector (For Area & RM Dashboards) */}
      {!showRMSelect && (
        <div className="filter-item">
          <label className="text-label">SEGMEN</label>
          <select
            value={selectedSegmen}
            onChange={(e) => onSegmenChange(e.target.value)}
            aria-label="Filter Segmen"
          >
            <option value="ALL">Total Konsolidasi</option>
            <option value="KORPORASI">Korporasi</option>
            <option value="RITEL">Ritel</option>
            <option value="MIKRO">Mikro</option>
          </select>
        </div>
      )}

      {/* Produk Selector (independent filter alongside Segmen) */}
      {!showRMSelect && onProdukChange && (
        <div className="filter-item">
          <label className="text-label">PRODUK</label>
          <select
            value={selectedProduk}
            onChange={(e) => onProdukChange(e.target.value)}
            aria-label="Filter Produk"
          >
            <option value="ALL">Semua Produk</option>
            <option value="RITEL">Retail</option>
            <option value="MIKRO">Mikro</option>
          </select>
        </div>
      )}

      {/* Periode Selector */}
      {!showRMSelect && (
        <div className="filter-item">
          <label className="text-label">PERIODE</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label="Filter Periode"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        {onExportCSV && (
          <button
            className="btn-action"
            style={{ background: '#307FE2', boxShadow: '0 4px 10px rgba(48, 127, 226, 0.2)' }}
            onClick={onExportCSV}
            title="Export data ke CSV / Excel"
          >
            <i className="fa-solid fa-file-csv"></i>
            <span>Export CSV</span>
          </button>
        )}

        {onDownloadPDF && (
          <button className="btn-action btn-download" onClick={onDownloadPDF} title="Cetak / Download PDF">
            <i className="fa-solid fa-file-pdf"></i>
            <span>Unduh PDF</span>
          </button>
        )}
      </div>
    </div>
  );
};
