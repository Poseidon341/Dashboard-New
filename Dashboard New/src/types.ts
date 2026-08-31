export interface UserAccount {
  pn: string;
  nama: string;
  role?: string;
  cabang?: string;
  area?: string;
}

export type User = UserAccount;

export interface UkerInfo {
  cabang: string;
  area: string;
}

export interface RawSegmenRow {
  posisi: string;
  'kode uker': string;
  produk: string;
  segmentasi: string;
  saldo: number | string;
  [key: string]: any;
}

export interface RkaTargetMap {
  [ukerCode: string]: {
    dpk?: number[];
    tabungan?: number[];
    giro?: number[];
    deposito?: number[];
  };
}

export interface SummaryStat {
  cur: number;
  dtd: number;
  mtd: number;
  ytd: number;
  target: number;
}

export interface AreaTotals {
  dpk: SummaryStat;
  tabungan: SummaryStat;
  giro: SummaryStat;
  deposito: SummaryStat;
}

export interface TopRankItem {
  cabang: string;
  saldo: number;
}

export interface RMFTProfileData {
  nama: string;
  pn: string;
  cabang: string;
  uker: string;
  status: string;
  tmt: string;
  jabatan: string;
  masakerja: string;
  jg: string;
  pg: string;
  score: number;
  tier: string;
  area: string;
  kpi: {
    dpk: { realisasi: number; target: number; pct: number; score: number };
    saltab: { realisasi: number; target: number; pct: number; score: number };
    avgcasa: { realisasi: number; target: number; pct: number; score: number };
    brimo: { realisasi: number; target: number; pct: number; score: number };
    avggiro: { realisasi: number; target: number; pct: number; score: number };
    svedc: { realisasi: number; target: number; pct: number; score: number };
    edcprod: { realisasi: number; target: number; pct: number; score: number };
    qlola: { realisasi: number; target: number; pct: number; score: number };
    avgtab: { realisasi: number; target: number; pct: number; score: number };
    svqris: { realisasi: number; target: number; pct: number; score: number };
    qrisprod: { realisasi: number; target: number; pct: number; score: number };
    holding: { realisasi: number; target: number; pct: number; score: number };
    payroll: { realisasi: number; target: number; pct: number; score: number };
  };
}

export type ActivePage = 
  | 'page-area'
  | 'page-kinerja-rm'
  | 'page-rmft'
  | 'page-appraisal'
  | 'page-ptp'
  | 'page-funding'
  | 'page-sbl';
