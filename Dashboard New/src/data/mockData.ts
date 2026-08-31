import { UkerInfo, RMFTProfileData, UserAccount } from '../types';

export const REGION_MALANG_AREAS = [
  'Jember',
  'Probolinggo',
  'Mlg Soehat',
  'Tulungagung',
  'Kediri',
  'Madiun',
] as const;

export const REGION_MALANG_CABANG_MAP: Record<string, string[]> = {
  'Jember': ['Banyuwangi', 'Genteng', 'Bondowoso', 'Jember'],
  'Probolinggo': ['Situbondo', 'Lumajang', 'Probolinggo', 'Pasuruan'],
  'Mlg Soehat': ['Malang Kawi', 'Malang Martadinata', 'Malang Sutoyo', 'Malang Soekarno Hatta', 'Kepanjen', 'Batu'],
  'Tulungagung': ['Pacitan', 'Trenggalek', 'Tulungagung', 'Blitar'],
  'Kediri': ['Kediri', 'Pare', 'Nganjuk'],
  'Madiun': ['Madiun', 'Magetan', 'Ponorogo', 'Ngawi'],
};

// All 25 Main Branches in Region Malang with realistic base funding size calibrated to 34 T Total Tabungan (in Rupiah)
export const BRANCH_BASE_FUNDING: Record<string, { tab: number; giro: number; dep: number; rkaTab: number; rkaGiro: number; rkaDep: number; ukerCode: string }> = {
  'Banyuwangi': { tab: 2_334_976_510_505, giro: 162_217_230_680, dep: 446_685_738_039, rkaTab: 459_476_555_982, rkaGiro: 122_164_622_194, rkaDep: 90_526_662_212, ukerCode: '7' },
  'Genteng': { tab: 1_280_400_000_000, giro: 195_300_000_000, dep: 282_500_000_000, rkaTab: 1_350_000_000_000, rkaGiro: 210_000_000_000, rkaDep: 300_000_000_000, ukerCode: '577' },
  'Bondowoso': { tab: 980_200_000_000, giro: 160_100_000_000, dep: 220_400_000_000, rkaTab: 1_050_000_000_000, rkaGiro: 180_000_000_000, rkaDep: 240_000_000_000, ukerCode: '13' },
  'Jember': { tab: 1_850_800_000_000, giro: 390_400_000_000, dep: 480_600_000_000, rkaTab: 1_950_000_000_000, rkaGiro: 420_000_000_000, rkaDep: 510_000_000_000, ukerCode: '21' },
  'Situbondo': { tab: 1_040_300_000_000, giro: 170_500_000_000, dep: 230_200_000_000, rkaTab: 1_100_000_000_000, rkaGiro: 190_000_000_000, rkaDep: 250_000_000_000, ukerCode: '33' },
  'Lumajang': { tab: 1_220_600_000_000, giro: 210_200_000_000, dep: 270_500_000_000, rkaTab: 1_280_000_000_000, rkaGiro: 230_000_000_000, rkaDep: 290_000_000_000, ukerCode: '45' },
  'Probolinggo': { tab: 1_360_500_000_000, giro: 320_600_000_000, dep: 320_800_000_000, rkaTab: 1_440_000_000_000, rkaGiro: 350_000_000_000, rkaDep: 340_000_000_000, ukerCode: '49' },
  'Pasuruan': { tab: 1_450_700_000_000, giro: 410_300_000_000, dep: 370_900_000_000, rkaTab: 1_550_000_000_000, rkaGiro: 440_000_000_000, rkaDep: 400_000_000_000, ukerCode: '51' },
  'Malang Kawi': { tab: 2_350_900_000_000, giro: 820_500_000_000, dep: 750_400_000_000, rkaTab: 2_500_000_000_000, rkaGiro: 880_000_000_000, rkaDep: 800_000_000_000, ukerCode: '56' },
  'Malang Martadinata': { tab: 1_310_400_000_000, giro: 350_800_000_000, dep: 330_300_000_000, rkaTab: 1_400_000_000_000, rkaGiro: 380_000_000_000, rkaDep: 360_000_000_000, ukerCode: '57' },
  'Malang Sutoyo': { tab: 1_520_600_000_000, giro: 440_400_000_000, dep: 420_700_000_000, rkaTab: 1_620_000_000_000, rkaGiro: 470_000_000_000, rkaDep: 450_000_000_000, ukerCode: '65' },
  'Malang Soekarno Hatta': { tab: 2_050_800_000_000, giro: 640_700_000_000, dep: 590_500_000_000, rkaTab: 2_180_000_000_000, rkaGiro: 690_000_000_000, rkaDep: 640_000_000_000, ukerCode: '70' },
  'Kepanjen': { tab: 1_320_300_000_000, giro: 230_600_000_000, dep: 290_800_000_000, rkaTab: 1_400_000_000_000, rkaGiro: 250_000_000_000, rkaDep: 310_000_000_000, ukerCode: '73' },
  'Batu': { tab: 950_500_000_000, giro: 190_200_000_000, dep: 210_400_000_000, rkaTab: 1_020_000_000_000, rkaGiro: 210_000_000_000, rkaDep: 230_000_000_000, ukerCode: '90' },
  'Pacitan': { tab: 860_400_000_000, giro: 150_500_000_000, dep: 190_300_000_000, rkaTab: 920_000_000_000, rkaGiro: 165_000_000_000, rkaDep: 210_000_000_000, ukerCode: '177' },
  'Trenggalek': { tab: 980_700_000_000, giro: 160_800_000_000, dep: 210_500_000_000, rkaTab: 1_050_000_000_000, rkaGiro: 180_000_000_000, rkaDep: 230_000_000_000, ukerCode: '344' },
  'Tulungagung': { tab: 1_480_900_000_000, giro: 280_700_000_000, dep: 360_600_000_000, rkaTab: 1_580_000_000_000, rkaGiro: 310_000_000_000, rkaDep: 390_000_000_000, ukerCode: '429' },
  'Blitar': { tab: 1_440_500_000_000, giro: 260_400_000_000, dep: 350_700_000_000, rkaTab: 1_540_000_000_000, rkaGiro: 280_000_000_000, rkaDep: 380_000_000_000, ukerCode: '9' },
  'Kediri': { tab: 1_680_600_000_000, giro: 490_500_000_000, dep: 460_400_000_000, rkaTab: 1_780_000_000_000, rkaGiro: 530_000_000_000, rkaDep: 500_000_000_000, ukerCode: '508' },
  'Pare': { tab: 1_130_400_000_000, giro: 190_700_000_000, dep: 250_500_000_000, rkaTab: 1_200_000_000_000, rkaGiro: 210_000_000_000, rkaDep: 270_000_000_000, ukerCode: '518' },
  'Nganjuk': { tab: 1_200_800_000_000, giro: 220_400_000_000, dep: 270_600_000_000, rkaTab: 1_280_000_000_000, rkaGiro: 240_000_000_000, rkaDep: 290_000_000_000, ukerCode: '579' },
  'Madiun': { tab: 1_580_700_000_000, giro: 460_300_000_000, dep: 440_800_000_000, rkaTab: 1_680_000_000_000, rkaGiro: 500_000_000_000, rkaDep: 470_000_000_000, ukerCode: '681' },
  'Magetan': { tab: 1_020_500_000_000, giro: 170_600_000_000, dep: 230_400_000_000, rkaTab: 1_090_000_000_000, rkaGiro: 190_000_000_000, rkaDep: 250_000_000_000, ukerCode: '1174' },
  'Ponorogo': { tab: 1_250_600_000_000, giro: 210_500_000_000, dep: 270_700_000_000, rkaTab: 1_330_000_000_000, rkaGiro: 230_000_000_000, rkaDep: 290_000_000_000, ukerCode: '1247' },
  'Ngawi': { tab: 1_150_400_000_000, giro: 190_900_000_000, dep: 250_500_000_000, rkaTab: 1_230_000_000_000, rkaGiro: 210_000_000_000, rkaDep: 270_000_000_000, ukerCode: '2289' },
};

export const INITIAL_UKER_MAP: Record<string, UkerInfo> = {
  // AREA HEAD: Jember
  '001': { cabang: 'Banyuwangi', area: 'Jember' },
  '7': { cabang: 'Banyuwangi', area: 'Jember' },
  '002': { cabang: 'Genteng', area: 'Jember' },
  '577': { cabang: 'Genteng', area: 'Jember' },
  '003': { cabang: 'Bondowoso', area: 'Jember' },
  '13': { cabang: 'Bondowoso', area: 'Jember' },
  '004': { cabang: 'Jember', area: 'Jember' },
  '21': { cabang: 'Jember', area: 'Jember' },

  // AREA HEAD: Probolinggo
  '005': { cabang: 'Situbondo', area: 'Probolinggo' },
  '33': { cabang: 'Situbondo', area: 'Probolinggo' },
  '006': { cabang: 'Lumajang', area: 'Probolinggo' },
  '45': { cabang: 'Lumajang', area: 'Probolinggo' },
  '007': { cabang: 'Probolinggo', area: 'Probolinggo' },
  '49': { cabang: 'Probolinggo', area: 'Probolinggo' },
  '008': { cabang: 'Pasuruan', area: 'Probolinggo' },
  '51': { cabang: 'Pasuruan', area: 'Probolinggo' },

  // AREA HEAD: Mlg Soehat
  '009': { cabang: 'Malang Kawi', area: 'Mlg Soehat' },
  '56': { cabang: 'Malang Kawi', area: 'Mlg Soehat' },
  '010': { cabang: 'Malang Martadinata', area: 'Mlg Soehat' },
  '57': { cabang: 'Malang Martadinata', area: 'Mlg Soehat' },
  '011': { cabang: 'Malang Sutoyo', area: 'Mlg Soehat' },
  '65': { cabang: 'Malang Sutoyo', area: 'Mlg Soehat' },
  '012': { cabang: 'Malang Soekarno Hatta', area: 'Mlg Soehat' },
  '70': { cabang: 'Malang Soekarno Hatta', area: 'Mlg Soehat' },
  '013': { cabang: 'Kepanjen', area: 'Mlg Soehat' },
  '73': { cabang: 'Kepanjen', area: 'Mlg Soehat' },
  '014': { cabang: 'Batu', area: 'Mlg Soehat' },
  '90': { cabang: 'Batu', area: 'Mlg Soehat' },

  // AREA HEAD: Tulungagung
  '015': { cabang: 'Pacitan', area: 'Tulungagung' },
  '177': { cabang: 'Pacitan', area: 'Tulungagung' },
  '016': { cabang: 'Trenggalek', area: 'Tulungagung' },
  '344': { cabang: 'Trenggalek', area: 'Tulungagung' },
  '017': { cabang: 'Tulungagung', area: 'Tulungagung' },
  '429': { cabang: 'Tulungagung', area: 'Tulungagung' },
  '018': { cabang: 'Blitar', area: 'Tulungagung' },
  '9': { cabang: 'Blitar', area: 'Tulungagung' },

  // AREA HEAD: Kediri
  '019': { cabang: 'Kediri', area: 'Kediri' },
  '508': { cabang: 'Kediri', area: 'Kediri' },
  '020': { cabang: 'Pare', area: 'Kediri' },
  '518': { cabang: 'Pare', area: 'Kediri' },
  '021': { cabang: 'Nganjuk', area: 'Kediri' },
  '579': { cabang: 'Nganjuk', area: 'Kediri' },

  // AREA HEAD: Madiun
  '022': { cabang: 'Madiun', area: 'Madiun' },
  '681': { cabang: 'Madiun', area: 'Madiun' },
  '023': { cabang: 'Magetan', area: 'Madiun' },
  '1174': { cabang: 'Magetan', area: 'Madiun' },
  '024': { cabang: 'Ponorogo', area: 'Madiun' },
  '1247': { cabang: 'Ponorogo', area: 'Madiun' },
  '025': { cabang: 'Ngawi', area: 'Madiun' },
  '2289': { cabang: 'Ngawi', area: 'Madiun' },
};

// Also add all 35 sub-units of KC Banyuwangi into INITIAL_UKER_MAP
[
  '6144', '6143', '6142', '6141', '6140', '6139', '6138', '6137', '6136', '6135',
  '6134', '6133', '6132', '6131', '6129', '6128', '6127', '6126', '6125', '6124',
  '6123', '6122', '6118', '6117', '6116', '6115', '6114', '6110', '6109', '6145',
  '1888', '1719', '680', '581', '7'
].forEach(code => {
  INITIAL_UKER_MAP[code] = { cabang: 'Banyuwangi', area: 'Jember' };
});

// Exact Segmen Data rows for KC Banyuwangi per 01/08/2026 directly from Google Sheet segmen_data
export const BANYUWANGI_TABUNGAN_ROWS = [
  { nama: 'UNIT SUMBERSEWU BANYUWANGI', uker: '6144', seg: 'MIKRO', saldo: 49_624_319_275 },
  { nama: 'UNIT KALIPURO BANYUWANGI', uker: '6143', seg: 'MIKRO', saldo: 25_092_533_591 },
  { nama: 'UNIT LICIN BANYUWANGI', uker: '6142', seg: 'MIKRO', saldo: 20_841_185_133 },
  { nama: 'UNIT TAWANG ALUN BANYUWANGI', uker: '6141', seg: 'MIKRO', saldo: 50_959_059_435 },
  { nama: 'UNIT SUMBER BERAS BANYUWANGI', uker: '6140', seg: 'MIKRO', saldo: 79_236_178_093 },
  { nama: 'UNIT ROGOJAMPI BANYUWANGI', uker: '6139', seg: 'MIKRO', saldo: 43_482_221_935 },
  { nama: 'UNIT PURWOHARJO BANYUWANGI', uker: '6138', seg: 'MIKRO', saldo: 82_973_020_040 },
  { nama: 'UNIT WONGSOREJO BANYUWANGI', uker: '6137', seg: 'MIKRO', saldo: 688_399 },
  { nama: 'UNIT TEMBOKREJO BANYUWANGI', uker: '6136', seg: 'MIKRO', saldo: 88_438_748_089 },
  { nama: 'UNIT TEGAL DLIMO BANYUWANGI', uker: '6135', seg: 'MIKRO', saldo: 77_761_474_069 },
  { nama: 'UNIT SUMBERSARI BANYUWANGI', uker: '6134', seg: 'MIKRO', saldo: 43_951_602_471 },
  { nama: 'UNIT SUKONATAR BANYUWANGI', uker: '6133', seg: 'MIKRO', saldo: 73_474_355_094 },
  { nama: 'UNIT SONGGON BANYUWANGI', uker: '6132', seg: 'MIKRO', saldo: 52_731_536_690 },
  { nama: 'UNIT SILIR AGUNG BANYUWANGI', uker: '6131', seg: 'MIKRO', saldo: 100_480_189_257 },
  { nama: 'UNIT SAMBIREJO BANYUWANGI', uker: '6129', seg: 'MIKRO', saldo: 102_200_690_405 },
  { nama: 'UNIT PESANGGARAN BANYUWANGI', uker: '6128', seg: 'MIKRO', saldo: 170_950_768_392 },
  { nama: 'UNIT PASAR KOTA BANYUWANGI', uker: '6127', seg: 'MIKRO', saldo: 34_652_848_987 },
  { nama: 'UNIT KEDUNGREJO BANYUWANGI', uker: '6126', seg: 'MIKRO', saldo: 141_650 },
  { nama: 'UNIT KETAPANG BANYUWANGI', uker: '6125', seg: 'MIKRO', saldo: 32_339_218_235 },
  { nama: 'UNIT KEDUNGGEBANG BANYUWANGI', uker: '6124', seg: 'MIKRO', saldo: 63_972_568_643 },
  { nama: 'UNIT KEDUNG WUNGGU BANYUWANGI', uker: '6123', seg: 'MIKRO', saldo: 89_470_422_202 },
  { nama: 'UNIT KEBONDALEM BANYUWANGI', uker: '6122', seg: 'MIKRO', saldo: 112_471_904_116 },
  { nama: 'UNIT KABAT BANYUWANGI', uker: '6118', seg: 'MIKRO', saldo: 32_219_860_839 },
  { nama: 'UNIT KARANGREJO BANYUWANGI', uker: '6117', seg: 'MIKRO', saldo: 94_000 },
  { nama: 'UNIT GLAGAH BANYUWANGI', uker: '6116', seg: 'MIKRO', saldo: 24_712_366_133 },
  { nama: 'UNIT GLAGAH AGUNG BANYUWANGI', uker: '6115', seg: 'MIKRO', saldo: 116_819_876_151 },
  { nama: 'UNIT GLADAG BANYUWANGI', uker: '6114', seg: 'MIKRO', saldo: 30_725_731_133 },
  { nama: 'UNIT BLIMBINGSARI BANYUWANGI', uker: '6110', seg: 'MIKRO', saldo: 25_275_808_573 },
  { nama: 'UNIT BAJULMATI BANYUWANGI', uker: '6109', seg: 'MIKRO', saldo: 77_765_660_684 },
  { nama: 'UNIT BLAMBANGAN BANYUWANGI', uker: '6145', seg: 'MIKRO', saldo: 50_164_473_122 },
  { nama: 'KK ASDP KETAPANG', uker: '1888', seg: 'RITEL', saldo: 147_911 },
  { nama: 'KK YAYASAN PUSPA DUNIA', uker: '1719', seg: 'RITEL', saldo: 26_768_590_500 },
  { nama: 'KCP MUNCAR BANYUWANGI', uker: '680', seg: 'RITEL', saldo: 81_261_867_400 },
  { nama: 'KCP ROGOJAMPI', uker: '581', seg: 'RITEL', saldo: 72_441_622_316 },
  { nama: 'KC Banyuwangi', uker: '7', seg: 'RITEL', saldo: 401_714_737_542 },
];

export const BANYUWANGI_GIRO_ROWS = [
  { nama: 'UNIT KALIPURO BANYUWANGI', uker: '6143', seg: 'MIKRO', saldo: 26_903 },
  { nama: 'UNIT LICIN BANYUWANGI', uker: '6142', seg: 'MIKRO', saldo: 3_925 },
  { nama: 'UNIT TAWANG ALUN BANYUWANGI', uker: '6141', seg: 'MIKRO', saldo: 559 },
  { nama: 'UNIT SUMBER BERAS BANYUWANGI', uker: '6140', seg: 'MIKRO', saldo: 2_676_919 },
  { nama: 'UNIT ROGOJAMPI BANYUWANGI', uker: '6139', seg: 'MIKRO', saldo: 0 },
  { nama: 'UNIT PURWOHARJO BANYUWANGI', uker: '6138', seg: 'MIKRO', saldo: 346_997 },
  { nama: 'UNIT TEMBOKREJO BANYUWANGI', uker: '6136', seg: 'MIKRO', saldo: 389_892 },
  { nama: 'UNIT TEGAL DLIMO BANYUWANGI', uker: '6135', seg: 'MIKRO', saldo: 208_950 },
  { nama: 'UNIT SUMBERSARI BANYUWANGI', uker: '6134', seg: 'MIKRO', saldo: 564_948 },
  { nama: 'UNIT SUKONATAR BANYUWANGI', uker: '6133', seg: 'MIKRO', saldo: 32_690 },
  { nama: 'UNIT SONGGON BANYUWANGI', uker: '6132', seg: 'MIKRO', saldo: 305_746 },
  { nama: 'UNIT SILIR AGUNG BANYUWANGI', uker: '6131', seg: 'MIKRO', saldo: 65_835 },
  { nama: 'UNIT PESANGGARAN BANYUWANGI', uker: '6128', seg: 'MIKRO', saldo: 68_923 },
  { nama: 'UNIT PASAR KOTA BANYUWANGI', uker: '6127', seg: 'MIKRO', saldo: 1_463_406_839 },
  { nama: 'UNIT KETAPANG BANYUWANGI', uker: '6125', seg: 'MIKRO', saldo: 1_500_000 },
  { nama: 'UNIT KEDUNGGEBANG BANYUWANGI', uker: '6124', seg: 'MIKRO', saldo: 676_039_851 },
  { nama: 'UNIT KEDUNG WUNGGU BANYUWANGI', uker: '6123', seg: 'MIKRO', saldo: 206_509 },
  { nama: 'UNIT KEBONDALEM BANYUWANGI', uker: '6122', seg: 'MIKRO', saldo: 663_220 },
  { nama: 'UNIT KABAT BANYUWANGI', uker: '6118', seg: 'MIKRO', saldo: 116_140 },
  { nama: 'UNIT GLAGAH BANYUWANGI', uker: '6116', seg: 'MIKRO', saldo: 27_564 },
  { nama: 'UNIT GLAGAH AGUNG BANYUWANGI', uker: '6115', seg: 'MIKRO', saldo: 148_605 },
  { nama: 'UNIT BLIMBINGSARI BANYUWANGI', uker: '6110', seg: 'MIKRO', saldo: 161_167 },
  { nama: 'UNIT BAJULMATI BANYUWANGI', uker: '6109', seg: 'MIKRO', saldo: 437_355 },
  { nama: 'UNIT BLAMBANGAN BANYUWANGI', uker: '6145', seg: 'MIKRO', saldo: 36_037 },
  { nama: 'KK YAYASAN PUSPA DUNIA', uker: '1719', seg: 'RITEL', saldo: 253_619_362 },
  { nama: 'KCP MUNCAR BANYUWANGI', uker: '680', seg: 'RITEL', saldo: 12_067_651_668 },
  { nama: 'KCP ROGOJAMPI', uker: '581', seg: 'RITEL', saldo: 7_033_781_844 },
  { nama: 'KC Banyuwangi', uker: '7', seg: 'RITEL', saldo: 94_984_465_750 },
  { nama: 'UNIT PURWOHARJO BANYUWANGI', uker: '6138', seg: 'KORPORASI', saldo: 1_269_397 },
  { nama: 'UNIT SILIR AGUNG BANYUWANGI', uker: '6131', seg: 'KORPORASI', saldo: 2_590_528 },
  { nama: 'UNIT BAJULMATI BANYUWANGI', uker: '6109', seg: 'KORPORASI', saldo: 1_925_612 },
  { nama: 'KCP ROGOJAMPI', uker: '581', seg: 'KORPORASI', saldo: 164_597_941 },
  { nama: 'KC Banyuwangi', uker: '7', seg: 'KORPORASI', saldo: 45_559_893_004 },
];

export const BANYUWANGI_DEPOSITO_ROWS = [
  { nama: 'UNIT SUMBERSEWU BANYUWANGI', uker: '6144', seg: 'MIKRO', saldo: 3_876_068_533 },
  { nama: 'UNIT KALIPURO BANYUWANGI', uker: '6143', seg: 'MIKRO', saldo: 3_974_431_731 },
  { nama: 'UNIT LICIN BANYUWANGI', uker: '6142', seg: 'MIKRO', saldo: 2_150_767_070 },
  { nama: 'UNIT TAWANG ALUN BANYUWANGI', uker: '6141', seg: 'MIKRO', saldo: 11_885_494_431 },
  { nama: 'UNIT SUMBER BERAS BANYUWANGI', uker: '6140', seg: 'MIKRO', saldo: 9_873_587_479 },
  { nama: 'UNIT ROGOJAMPI BANYUWANGI', uker: '6139', seg: 'MIKRO', saldo: 5_725_994_181 },
  { nama: 'UNIT PURWOHARJO BANYUWANGI', uker: '6138', seg: 'MIKRO', saldo: 17_521_221_964 },
  { nama: 'UNIT TEMBOKREJO BANYUWANGI', uker: '6136', seg: 'MIKRO', saldo: 10_343_602_384 },
  { nama: 'UNIT TEGAL DLIMO BANYUWANGI', uker: '6135', seg: 'MIKRO', saldo: 10_157_244_163 },
  { nama: 'UNIT SUMBERSARI BANYUWANGI', uker: '6134', seg: 'MIKRO', saldo: 4_773_503_578 },
  { nama: 'UNIT SUKONATAR BANYUWANGI', uker: '6133', seg: 'MIKRO', saldo: 13_053_075_470 },
  { nama: 'UNIT SONGGON BANYUWANGI', uker: '6132', seg: 'MIKRO', saldo: 3_879_584_250 },
  { nama: 'UNIT SILIR AGUNG BANYUWANGI', uker: '6131', seg: 'MIKRO', saldo: 13_769_073_709 },
  { nama: 'UNIT SAMBIREJO BANYUWANGI', uker: '6129', seg: 'MIKRO', saldo: 14_723_200_774 },
  { nama: 'UNIT PESANGGARAN BANYUWANGI', uker: '6128', seg: 'MIKRO', saldo: 27_953_186_465 },
  { nama: 'UNIT PASAR KOTA BANYUWANGI', uker: '6127', seg: 'MIKRO', saldo: 6_583_478_333 },
  { nama: 'UNIT KETAPANG BANYUWANGI', uker: '6125', seg: 'MIKRO', saldo: 7_576_700_129 },
  { nama: 'UNIT KEDUNGGEBANG BANYUWANGI', uker: '6124', seg: 'MIKRO', saldo: 9_737_998_854 },
  { nama: 'UNIT KEDUNG WUNGGU BANYUWANGI', uker: '6123', seg: 'MIKRO', saldo: 12_248_595_545 },
  { nama: 'UNIT KEBONDALEM BANYUWANGI', uker: '6122', seg: 'MIKRO', saldo: 26_141_132_738 },
  { nama: 'UNIT KABAT BANYUWANGI', uker: '6118', seg: 'MIKRO', saldo: 2_573_000_000 },
  { nama: 'UNIT GLAGAH BANYUWANGI', uker: '6116', seg: 'MIKRO', saldo: 1_553_000_258 },
  { nama: 'UNIT GLAGAH AGUNG BANYUWANGI', uker: '6115', seg: 'MIKRO', saldo: 11_327_930_843 },
  { nama: 'UNIT GLADAG BANYUWANGI', uker: '6114', seg: 'MIKRO', saldo: 1_751_900_000 },
  { nama: 'UNIT BLIMBINGSARI BANYUWANGI', uker: '6110', seg: 'MIKRO', saldo: 1_324_904_920 },
  { nama: 'UNIT BAJULMATI BANYUWANGI', uker: '6109', seg: 'MIKRO', saldo: 9_785_516_766 },
  { nama: 'UNIT BLAMBANGAN BANYUWANGI', uker: '6145', seg: 'MIKRO', saldo: 8_326_354_273 },
  { nama: 'KK YAYASAN PUSPA DUNIA', uker: '1719', seg: 'RITEL', saldo: 2_220_208_620 },
  { nama: 'KCP MUNCAR BANYUWANGI', uker: '680', seg: 'RITEL', saldo: 12_218_752_636 },
  { nama: 'KCP ROGOJAMPI', uker: '581', seg: 'RITEL', saldo: 20_444_485_318 },
  { nama: 'KC Banyuwangi', uker: '7', seg: 'RITEL', saldo: 159_211_742_624 },
];

export const BANYUWANGI_UNITS_DATA = BANYUWANGI_TABUNGAN_ROWS;

/**
 * Standardize Cabang Name to clean, non-duplicated canonical name without 'KC' prefix
 */
export function normalizeCabangName(name: string): string {
  if (!name) return '';
  let clean = name.trim();
  // Strip KC / KCP / KANCA / Kantor Cabang prefixes
  clean = clean.replace(/^(KC|KCP|KANCA|KANTOR CABANG|KANTOR)\s+/i, '').trim();

  // Normalize specific names
  const canonicalMap: Record<string, string> = {
    'banyuwangi': 'Banyuwangi',
    'genteng': 'Genteng',
    'bondowoso': 'Bondowoso',
    'jember': 'Jember',
    'situbondo': 'Situbondo',
    'lumajang': 'Lumajang',
    'probolinggo': 'Probolinggo',
    'pasuruan': 'Pasuruan',
    'malang kawi': 'Malang Kawi',
    'kawi': 'Malang Kawi',
    'malang martadinata': 'Malang Martadinata',
    'martadinata': 'Malang Martadinata',
    'malang sutoyo': 'Malang Sutoyo',
    'sutoyo': 'Malang Sutoyo',
    'malang soekarno hatta': 'Malang Soekarno Hatta',
    'soekarno hatta': 'Malang Soekarno Hatta',
    'malang soehat': 'Malang Soekarno Hatta',
    'soehat': 'Malang Soekarno Hatta',
    'kepanjen': 'Kepanjen',
    'batu': 'Batu',
    'pacitan': 'Pacitan',
    'trenggalek': 'Trenggalek',
    'tulungagung': 'Tulungagung',
    'blitar': 'Blitar',
    'kediri': 'Kediri',
    'pare': 'Pare',
    'nganjuk': 'Nganjuk',
    'madiun': 'Madiun',
    'magetan': 'Magetan',
    'ponorogo': 'Ponorogo',
    'ngawi': 'Ngawi',
  };

  const lower = clean.toLowerCase();
  for (const [key, canonical] of Object.entries(canonicalMap)) {
    if (lower === key || lower.includes(key)) {
      return canonical;
    }
  }

  return clean;
}

export function getAreaForCabang(cabangName: string): string {
  const norm = normalizeCabangName(cabangName);
  for (const [area, branches] of Object.entries(REGION_MALANG_CABANG_MAP)) {
    if (branches.some(b => b.toLowerCase() === norm.toLowerCase())) {
      return area;
    }
  }
  return '';
}

export const DEFAULT_USERS: UserAccount[] = [
  // Database Spreadsheet rmft_list (All PNs)
  { pn: '23973', nama: 'Harsono', role: 'RMFT Individu Unit', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '57928', nama: 'Fitriya Noer Hidhayati', role: 'RMFT Individu Branch', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '57979', nama: 'Dwi Yuliati', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '75008', nama: 'Eko Indra Hidayat', role: 'RMFT Individu Unit', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '79607', nama: 'Fitriana Yulianti', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '117645', nama: 'Sarwoto', role: 'RMFT Individu Branch', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '124407', nama: "Ali Mas'ud", role: 'RMFT Individu Unit', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '124416', nama: 'Ismail Hendrawan', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '125834', nama: 'Deny Setiawan', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '135565', nama: 'Rike Paramita Devi', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '164868', nama: 'Yossy Kristiono', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '182166', nama: 'Indry Lianti Hawalina', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '182175', nama: 'Mahardina Agustin', role: 'RMFT Individu Branch', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '184381', nama: 'Harrisma Listya Kartika Wardani', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '185792', nama: 'Diana Indriastuti', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '185808', nama: 'Gurit Budi Raharjo', role: 'RMFT Individu Branch', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '185809', nama: 'Yessica Dyas Pradnya Parami', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '185810', nama: 'Wirawan Offiliyanto', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '187979', nama: 'Ratih Diah Ratna Paramita', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '188183', nama: 'Dwi Ayu Rhonita Ningrum', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '189582', nama: 'Obet Setyagung', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '200788', nama: 'Eny Lidyawati', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '202946', nama: 'Mukhlis Shofiyati Fitria', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '206661', nama: 'Lisa Swandayani Putri', role: 'RMFT Individu Branch', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '206663', nama: 'Wachyu Ramadhiyanti Sahrul', role: 'RMFT Individu Branch', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '206669', nama: 'Adin Zhiva', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '208094', nama: 'Dewi Masruroh', role: 'RMFT Individu Unit', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '217950', nama: 'Haris Farid Rahmadi', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '222069', nama: 'Yoga Additama', role: 'RMFT Individu Unit', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '223964', nama: 'Indah Artika Jaya Negara', role: 'RMFT Business', cabang: 'Banyuwangi', area: 'Jember' },
  // Regional Leadership & Admins
  { pn: '00123456', nama: 'Budi Santoso', role: 'Area Head (Mlg Soehat)', cabang: 'Malang Soekarno Hatta', area: 'Mlg Soehat' },
  { pn: '00234567', nama: 'Siti Rahmawati', role: 'RM Funding & Transaction (Branch)', cabang: 'Malang Kawi', area: 'Mlg Soehat' },
  { pn: '00345678', nama: 'Ahmad Fauzi', role: 'Area Head (Jember)', cabang: 'Jember', area: 'Jember' },
  { pn: '00456789', nama: 'Dewi Lestari', role: 'RM Funding & Transaction (Branch)', cabang: 'Banyuwangi', area: 'Jember' },
  { pn: '00567890', nama: 'Hendra Gunawan', role: 'RM Funding & Transaction (Unit)', cabang: 'Probolinggo', area: 'Probolinggo' },
  { pn: '00678901', nama: 'Rina Anggraini', role: 'RM Funding & Transaction (Branch)', cabang: 'Pasuruan', area: 'Probolinggo' },
  { pn: '00789012', nama: 'Rian Wijaya', role: 'Relationship Manager', cabang: 'Tulungagung', area: 'Tulungagung' },
  { pn: '00890123', nama: 'Maya Kusuma', role: 'RM Funding & Transaction (Business)', cabang: 'Kediri', area: 'Kediri' },
  { pn: '00901234', nama: 'Dedi Kurniawan', role: 'RM Funding & Transaction (Branch)', cabang: 'Madiun', area: 'Madiun' },
  { pn: '01012345', nama: 'Eka Prasetya', role: 'RM Funding & Transaction (Unit)', cabang: 'Batu', area: 'Mlg Soehat' },
  { pn: '01123456', nama: 'Bambang Wahyudi', role: 'RM Funding & Transaction (Business)', cabang: 'Blitar', area: 'Tulungagung' },
  { pn: '01234567', nama: 'Tri Wahyuni', role: 'RM Funding & Transaction (Unit)', cabang: 'Pare', area: 'Kediri' },
  { pn: '01345678', nama: 'Agus Setiawan', role: 'RM Funding & Transaction (Unit)', cabang: 'Ponorogo', area: 'Madiun' },
];

export const SAMPLE_RMFT_PROFILES: RMFTProfileData[] = [
  {
    nama: 'Budi Santoso',
    pn: '00123456',
    cabang: 'Malang Soekarno Hatta',
    uker: '012 - Malang Soekarno Hatta',
    status: 'Tetap',
    tmt: '15/03/2021',
    jabatan: 'RM FUNDING & TRANSACTION (BUSINESS)',
    masakerja: '42',
    jg: 'JG 10',
    pg: 'PG 03',
    score: 3.65,
    tier: 'Tier 1',
    area: 'Mlg Soehat',
    kpi: {
      dpk: { realisasi: 142500000000, target: 120000000000, pct: 118.75, score: 4.0 },
      saltab: { realisasi: 68400000000, target: 60000000000, pct: 114.0, score: 4.0 },
      avgcasa: { realisasi: 42300000000, target: 40000000000, pct: 105.75, score: 4.0 },
      brimo: { realisasi: 850, target: 750, pct: 113.33, score: 4.0 },
      avggiro: { realisasi: 52100000000, target: 50000000000, pct: 104.2, score: 4.0 },
      svedc: { realisasi: 18500000000, target: 16000000000, pct: 115.63, score: 4.0 },
      edcprod: { realisasi: 48, target: 40, pct: 120.0, score: 4.0 },
      qlola: { realisasi: 125, target: 110, pct: 113.64, score: 4.0 },
      avgtab: { realisasi: 65200000000, target: 62000000000, pct: 105.16, score: 4.0 },
      svqris: { realisasi: 9400000000, target: 8000000000, pct: 117.5, score: 4.0 },
      qrisprod: { realisasi: 92, target: 80, pct: 115.0, score: 4.0 },
      holding: { realisasi: 3.8, target: 3.5, pct: 108.57, score: 4.0 },
      payroll: { realisasi: 38, target: 30, pct: 126.67, score: 4.0 },
    }
  },
  {
    nama: 'Siti Rahmawati',
    pn: '00234567',
    cabang: 'Malang Kawi',
    uker: '009 - Malang Kawi',
    status: 'Tetap',
    tmt: '01/08/2020',
    jabatan: 'RM FUNDING & TRANSACTION (BRANCH)',
    masakerja: '49',
    jg: 'JG 09',
    pg: 'PG 02',
    score: 3.25,
    tier: 'Tier 1',
    area: 'Mlg Soehat',
    kpi: {
      dpk: { realisasi: 98000000000, target: 95000000000, pct: 103.16, score: 4.0 },
      saltab: { realisasi: 52000000000, target: 50000000000, pct: 104.0, score: 4.0 },
      avgcasa: { realisasi: 34000000000, target: 35000000000, pct: 97.14, score: 3.0 },
      brimo: { realisasi: 620, target: 600, pct: 103.33, score: 4.0 },
      avggiro: { realisasi: 38000000000, target: 40000000000, pct: 95.0, score: 3.0 },
      svedc: { realisasi: 14200000000, target: 13000000000, pct: 109.23, score: 4.0 },
      edcprod: { realisasi: 36, target: 35, pct: 102.86, score: 4.0 },
      qlola: { realisasi: 88, target: 90, pct: 97.78, score: 3.0 },
      avgtab: { realisasi: 49000000000, target: 48000000000, pct: 102.08, score: 4.0 },
      svqris: { realisasi: 7100000000, target: 7000000000, pct: 101.43, score: 4.0 },
      qrisprod: { realisasi: 74, target: 70, pct: 105.71, score: 4.0 },
      holding: { realisasi: 3.4, target: 3.5, pct: 97.14, score: 3.0 },
      payroll: { realisasi: 28, target: 25, pct: 112.0, score: 4.0 },
    }
  },
  {
    nama: 'Ahmad Fauzi',
    pn: '00345678',
    cabang: 'Jember',
    uker: '004 - Jember',
    status: 'Tetap',
    tmt: '11/04/2019',
    jabatan: 'RM FUNDING & TRANSACTION (BUSINESS)',
    masakerja: '64',
    jg: 'JG 10',
    pg: 'PG 03',
    score: 3.75,
    tier: 'Tier 1',
    area: 'Jember',
    kpi: {
      dpk: { realisasi: 135000000000, target: 115000000000, pct: 117.39, score: 4.0 },
      saltab: { realisasi: 65000000000, target: 58000000000, pct: 112.07, score: 4.0 },
      avgcasa: { realisasi: 39000000000, target: 37000000000, pct: 105.41, score: 4.0 },
      brimo: { realisasi: 780, target: 700, pct: 111.43, score: 4.0 },
      avggiro: { realisasi: 48000000000, target: 45000000000, pct: 106.67, score: 4.0 },
      svedc: { realisasi: 17000000000, target: 15000000000, pct: 113.33, score: 4.0 },
      edcprod: { realisasi: 44, target: 38, pct: 115.79, score: 4.0 },
      qlola: { realisasi: 115, target: 100, pct: 115.0, score: 4.0 },
      avgtab: { realisasi: 61000000000, target: 57000000000, pct: 107.02, score: 4.0 },
      svqris: { realisasi: 8800000000, target: 7500000000, pct: 117.33, score: 4.0 },
      qrisprod: { realisasi: 85, target: 75, pct: 113.33, score: 4.0 },
      holding: { realisasi: 3.7, target: 3.5, pct: 105.71, score: 4.0 },
      payroll: { realisasi: 34, target: 28, pct: 121.43, score: 4.0 },
    }
  },
  {
    nama: 'Dewi Lestari',
    pn: '00456789',
    cabang: 'Banyuwangi',
    uker: '001 - Banyuwangi',
    status: 'Tetap',
    tmt: '10/01/2022',
    jabatan: 'RM FUNDING & TRANSACTION (BRANCH)',
    masakerja: '32',
    jg: 'JG 09',
    pg: 'PG 01',
    score: 2.85,
    tier: 'Tier 2',
    area: 'Jember',
    kpi: {
      dpk: { realisasi: 82000000000, target: 85000000000, pct: 96.47, score: 3.0 },
      saltab: { realisasi: 41000000000, target: 45000000000, pct: 91.11, score: 3.0 },
      avgcasa: { realisasi: 26000000000, target: 30000000000, pct: 86.67, score: 3.0 },
      brimo: { realisasi: 480, target: 550, pct: 87.27, score: 3.0 },
      avggiro: { realisasi: 31000000000, target: 33000000000, pct: 93.94, score: 3.0 },
      svedc: { realisasi: 11000000000, target: 12000000000, pct: 91.67, score: 3.0 },
      edcprod: { realisasi: 28, target: 32, pct: 87.5, score: 3.0 },
      qlola: { realisasi: 65, target: 75, pct: 86.67, score: 3.0 },
      avgtab: { realisasi: 39000000000, target: 43000000000, pct: 90.7, score: 3.0 },
      svqris: { realisasi: 5200000000, target: 6000000000, pct: 86.67, score: 3.0 },
      qrisprod: { realisasi: 58, target: 65, pct: 89.23, score: 3.0 },
      holding: { realisasi: 3.1, target: 3.5, pct: 88.57, score: 3.0 },
      payroll: { realisasi: 18, target: 22, pct: 81.82, score: 2.0 },
    }
  },
  {
    nama: 'Hendra Gunawan',
    pn: '00567890',
    cabang: 'Probolinggo',
    uker: '007 - Probolinggo',
    status: 'Tetap',
    tmt: '01/06/2023',
    jabatan: 'RM FUNDING & TRANSACTION (UNIT)',
    masakerja: '15',
    jg: 'JG 08',
    pg: 'PG 01',
    score: 2.35,
    tier: 'Tier 3',
    area: 'Probolinggo',
    kpi: {
      dpk: { realisasi: 51000000000, target: 65000000000, pct: 78.46, score: 2.0 },
      saltab: { realisasi: 28000000000, target: 35000000000, pct: 80.0, score: 2.0 },
      avgcasa: { realisasi: 17000000000, target: 22000000000, pct: 77.27, score: 2.0 },
      brimo: { realisasi: 310, target: 400, pct: 77.5, score: 2.0 },
      avggiro: { realisasi: 18000000000, target: 24000000000, pct: 75.0, score: 2.0 },
      svedc: { realisasi: 6500000000, target: 9000000000, pct: 72.22, score: 2.0 },
      edcprod: { realisasi: 18, target: 25, pct: 72.0, score: 2.0 },
      qlola: { realisasi: 38, target: 50, pct: 76.0, score: 2.0 },
      avgtab: { realisasi: 26000000000, target: 33000000000, pct: 78.79, score: 2.0 },
      svqris: { realisasi: 3200000000, target: 4500000000, pct: 71.11, score: 2.0 },
      qrisprod: { realisasi: 34, target: 45, pct: 75.56, score: 2.0 },
      holding: { realisasi: 2.6, target: 3.5, pct: 74.29, score: 2.0 },
      payroll: { realisasi: 11, target: 16, pct: 68.75, score: 2.0 },
    }
  },
  {
    nama: 'Rina Anggraini',
    pn: '00678901',
    cabang: 'Pasuruan',
    uker: '008 - Pasuruan',
    status: 'Tetap',
    tmt: '14/02/2022',
    jabatan: 'RM FUNDING & TRANSACTION (BRANCH)',
    masakerja: '30',
    jg: 'JG 09',
    pg: 'PG 02',
    score: 2.95,
    tier: 'Tier 2',
    area: 'Probolinggo',
    kpi: {
      dpk: { realisasi: 89000000000, target: 90000000000, pct: 98.89, score: 3.0 },
      saltab: { realisasi: 46000000000, target: 48000000000, pct: 95.83, score: 3.0 },
      avgcasa: { realisasi: 29000000000, target: 31000000000, pct: 93.55, score: 3.0 },
      brimo: { realisasi: 530, target: 550, pct: 96.36, score: 3.0 },
      avggiro: { realisasi: 34000000000, target: 36000000000, pct: 94.44, score: 3.0 },
      svedc: { realisasi: 12800000000, target: 13000000000, pct: 98.46, score: 3.0 },
      edcprod: { realisasi: 31, target: 33, pct: 93.94, score: 3.0 },
      qlola: { realisasi: 72, target: 75, pct: 96.0, score: 3.0 },
      avgtab: { realisasi: 43000000000, target: 45000000000, pct: 95.56, score: 3.0 },
      svqris: { realisasi: 6100000000, target: 6300000000, pct: 96.83, score: 3.0 },
      qrisprod: { realisasi: 64, target: 68, pct: 94.12, score: 3.0 },
      holding: { realisasi: 3.3, target: 3.5, pct: 94.29, score: 3.0 },
      payroll: { realisasi: 22, target: 24, pct: 91.67, score: 3.0 },
    }
  },
  {
    nama: 'Maya Kusuma',
    pn: '00890123',
    cabang: 'Kediri',
    uker: '019 - Kediri',
    status: 'Tetap',
    tmt: '12/11/2019',
    jabatan: 'RM FUNDING & TRANSACTION (BUSINESS)',
    masakerja: '57',
    jg: 'JG 10',
    pg: 'PG 04',
    score: 3.80,
    tier: 'Tier 1',
    area: 'Kediri',
    kpi: {
      dpk: { realisasi: 165000000000, target: 140000000000, pct: 117.86, score: 4.0 },
      saltab: { realisasi: 82000000000, target: 70000000000, pct: 117.14, score: 4.0 },
      avgcasa: { realisasi: 51000000000, target: 45000000000, pct: 113.33, score: 4.0 },
      brimo: { realisasi: 920, target: 800, pct: 115.0, score: 4.0 },
      avggiro: { realisasi: 61000000000, target: 55000000000, pct: 110.91, score: 4.0 },
      svedc: { realisasi: 21000000000, target: 18000000000, pct: 116.67, score: 4.0 },
      edcprod: { realisasi: 55, target: 45, pct: 122.22, score: 4.0 },
      qlola: { realisasi: 140, target: 120, pct: 116.67, score: 4.0 },
      avgtab: { realisasi: 78000000000, target: 68000000000, pct: 114.71, score: 4.0 },
      svqris: { realisasi: 11200000000, target: 9500000000, pct: 117.89, score: 4.0 },
      qrisprod: { realisasi: 105, target: 90, pct: 116.67, score: 4.0 },
      holding: { realisasi: 3.9, target: 3.5, pct: 111.43, score: 4.0 },
      payroll: { realisasi: 45, target: 35, pct: 128.57, score: 4.0 },
    }
  },
  {
    nama: 'Rian Wijaya',
    pn: '00789012',
    cabang: 'Tulungagung',
    uker: '017 - Tulungagung',
    status: 'Tetap',
    tmt: '05/04/2022',
    jabatan: 'RM FUNDING & TRANSACTION (BRANCH)',
    masakerja: '29',
    jg: 'JG 09',
    pg: 'PG 01',
    score: 1.85,
    tier: 'Tier 4',
    area: 'Tulungagung',
    kpi: {
      dpk: { realisasi: 42000000000, target: 70000000000, pct: 60.0, score: 1.0 },
      saltab: { realisasi: 19000000000, target: 35000000000, pct: 54.29, score: 1.0 },
      avgcasa: { realisasi: 12000000000, target: 22000000000, pct: 54.55, score: 1.0 },
      brimo: { realisasi: 240, target: 450, pct: 53.33, score: 1.0 },
      avggiro: { realisasi: 14000000000, target: 26000000000, pct: 53.85, score: 1.0 },
      svedc: { realisasi: 4500000000, target: 8500000000, pct: 52.94, score: 1.0 },
      edcprod: { realisasi: 12, target: 24, pct: 50.0, score: 1.0 },
      qlola: { realisasi: 28, target: 55, pct: 50.91, score: 1.0 },
      avgtab: { realisasi: 18000000000, target: 33000000000, pct: 54.55, score: 1.0 },
      svqris: { realisasi: 2100000000, target: 4200000000, pct: 50.0, score: 1.0 },
      qrisprod: { realisasi: 22, target: 45, pct: 48.89, score: 1.0 },
      holding: { realisasi: 2.1, target: 3.5, pct: 60.0, score: 1.0 },
      payroll: { realisasi: 8, target: 18, pct: 44.44, score: 1.0 },
    }
  },
  {
    nama: 'Dedi Kurniawan',
    pn: '00901234',
    cabang: 'Madiun',
    uker: '022 - Madiun',
    status: 'Tetap',
    tmt: '02/03/2021',
    jabatan: 'RM FUNDING & TRANSACTION (BRANCH)',
    masakerja: '41',
    jg: 'JG 09',
    pg: 'PG 02',
    score: 2.90,
    tier: 'Tier 2',
    area: 'Madiun',
    kpi: {
      dpk: { realisasi: 86000000000, target: 88000000000, pct: 97.73, score: 3.0 },
      saltab: { realisasi: 44000000000, target: 46000000000, pct: 95.65, score: 3.0 },
      avgcasa: { realisasi: 28000000000, target: 30000000000, pct: 93.33, score: 3.0 },
      brimo: { realisasi: 510, target: 530, pct: 96.23, score: 3.0 },
      avggiro: { realisasi: 33000000000, target: 35000000000, pct: 94.29, score: 3.0 },
      svedc: { realisasi: 12000000000, target: 12500000000, pct: 96.0, score: 3.0 },
      edcprod: { realisasi: 30, target: 32, pct: 93.75, score: 3.0 },
      qlola: { realisasi: 70, target: 72, pct: 97.22, score: 3.0 },
      avgtab: { realisasi: 42000000000, target: 44000000000, pct: 95.45, score: 3.0 },
      svqris: { realisasi: 5800000000, target: 6000000000, pct: 96.67, score: 3.0 },
      qrisprod: { realisasi: 62, target: 65, pct: 95.38, score: 3.0 },
      holding: { realisasi: 3.2, target: 3.5, pct: 91.43, score: 3.0 },
      payroll: { realisasi: 20, target: 22, pct: 90.91, score: 3.0 },
    }
  },
  {
    nama: 'Bambang Wahyudi',
    pn: '01123456',
    cabang: 'Blitar',
    uker: '018 - Blitar',
    status: 'Tetap',
    tmt: '18/07/2020',
    jabatan: 'RM FUNDING & TRANSACTION (BUSINESS)',
    masakerja: '50',
    jg: 'JG 10',
    pg: 'PG 03',
    score: 3.55,
    tier: 'Tier 1',
    area: 'Tulungagung',
    kpi: {
      dpk: { realisasi: 138000000000, target: 122000000000, pct: 113.11, score: 4.0 },
      saltab: { realisasi: 66000000000, target: 59000000000, pct: 111.86, score: 4.0 },
      avgcasa: { realisasi: 41000000000, target: 39000000000, pct: 105.13, score: 4.0 },
      brimo: { realisasi: 810, target: 730, pct: 110.96, score: 4.0 },
      avggiro: { realisasi: 49000000000, target: 46000000000, pct: 106.52, score: 4.0 },
      svedc: { realisasi: 17500000000, target: 15500000000, pct: 112.9, score: 4.0 },
      edcprod: { realisasi: 46, target: 40, pct: 115.0, score: 4.0 },
      qlola: { realisasi: 118, target: 105, pct: 112.38, score: 4.0 },
      avgtab: { realisasi: 63000000000, target: 58000000000, pct: 108.62, score: 4.0 },
      svqris: { realisasi: 9000000000, target: 7800000000, pct: 115.38, score: 4.0 },
      qrisprod: { realisasi: 88, target: 78, pct: 112.82, score: 4.0 },
      holding: { realisasi: 3.6, target: 3.5, pct: 102.86, score: 4.0 },
      payroll: { realisasi: 35, target: 29, pct: 120.69, score: 4.0 },
    }
  },
  {
    nama: 'Eka Prasetya',
    pn: '01012345',
    cabang: 'Batu',
    uker: '014 - Batu',
    status: 'Tetap',
    tmt: '09/09/2022',
    jabatan: 'RM FUNDING & TRANSACTION (UNIT)',
    masakerja: '24',
    jg: 'JG 08',
    pg: 'PG 02',
    score: 2.75,
    tier: 'Tier 2',
    area: 'Mlg Soehat',
    kpi: {
      dpk: { realisasi: 62000000000, target: 68000000000, pct: 91.18, score: 3.0 },
      saltab: { realisasi: 33000000000, target: 36000000000, pct: 91.67, score: 3.0 },
      avgcasa: { realisasi: 21000000000, target: 23000000000, pct: 91.3, score: 3.0 },
      brimo: { realisasi: 390, target: 420, pct: 92.86, score: 3.0 },
      avggiro: { realisasi: 22000000000, target: 25000000000, pct: 88.0, score: 3.0 },
      svedc: { realisasi: 8200000000, target: 9000000000, pct: 91.11, score: 3.0 },
      edcprod: { realisasi: 22, target: 24, pct: 91.67, score: 3.0 },
      qlola: { realisasi: 46, target: 50, pct: 92.0, score: 3.0 },
      avgtab: { realisasi: 31000000000, target: 34000000000, pct: 91.18, score: 3.0 },
      svqris: { realisasi: 4100000000, target: 4500000000, pct: 91.11, score: 3.0 },
      qrisprod: { realisasi: 42, target: 46, pct: 91.3, score: 3.0 },
      holding: { realisasi: 3.1, target: 3.5, pct: 88.57, score: 3.0 },
      payroll: { realisasi: 15, target: 18, pct: 83.33, score: 2.0 },
    }
  },
  {
    nama: 'Tri Wahyuni',
    pn: '01234567',
    cabang: 'Pare',
    uker: '020 - Pare',
    status: 'Tetap',
    tmt: '12/05/2023',
    jabatan: 'RM FUNDING & TRANSACTION (UNIT)',
    masakerja: '16',
    jg: 'JG 08',
    pg: 'PG 01',
    score: 2.45,
    tier: 'Tier 3',
    area: 'Kediri',
    kpi: {
      dpk: { realisasi: 53000000000, target: 66000000000, pct: 80.3, score: 2.0 },
      saltab: { realisasi: 29000000000, target: 36000000000, pct: 80.56, score: 2.0 },
      avgcasa: { realisasi: 18000000000, target: 23000000000, pct: 78.26, score: 2.0 },
      brimo: { realisasi: 330, target: 410, pct: 80.49, score: 2.0 },
      avggiro: { realisasi: 19000000000, target: 25000000000, pct: 76.0, score: 2.0 },
      svedc: { realisasi: 7000000000, target: 9200000000, pct: 76.09, score: 2.0 },
      edcprod: { realisasi: 19, target: 25, pct: 76.0, score: 2.0 },
      qlola: { realisasi: 40, target: 52, pct: 76.92, score: 2.0 },
      avgtab: { realisasi: 27000000000, target: 34000000000, pct: 79.41, score: 2.0 },
      svqris: { realisasi: 3400000000, target: 4600000000, pct: 73.91, score: 2.0 },
      qrisprod: { realisasi: 36, target: 46, pct: 78.26, score: 2.0 },
      holding: { realisasi: 2.7, target: 3.5, pct: 77.14, score: 2.0 },
      payroll: { realisasi: 12, target: 17, pct: 70.59, score: 2.0 },
    }
  },
  {
    nama: 'Agus Setiawan',
    pn: '01345678',
    cabang: 'Ponorogo',
    uker: '024 - Ponorogo',
    status: 'Tetap',
    tmt: '03/01/2022',
    jabatan: 'RM FUNDING & TRANSACTION (UNIT)',
    masakerja: '32',
    jg: 'JG 08',
    pg: 'PG 02',
    score: 2.80,
    tier: 'Tier 2',
    area: 'Madiun',
    kpi: {
      dpk: { realisasi: 64000000000, target: 69000000000, pct: 92.75, score: 3.0 },
      saltab: { realisasi: 34000000000, target: 37000000000, pct: 91.89, score: 3.0 },
      avgcasa: { realisasi: 22000000000, target: 24000000000, pct: 91.67, score: 3.0 },
      brimo: { realisasi: 400, target: 430, pct: 93.02, score: 3.0 },
      avggiro: { realisasi: 23000000000, target: 25000000000, pct: 92.0, score: 3.0 },
      svedc: { realisasi: 8500000000, target: 9200000000, pct: 92.39, score: 3.0 },
      edcprod: { realisasi: 23, target: 25, pct: 92.0, score: 3.0 },
      qlola: { realisasi: 48, target: 52, pct: 92.31, score: 3.0 },
      avgtab: { realisasi: 32000000000, target: 35000000000, pct: 91.43, score: 3.0 },
      svqris: { realisasi: 4300000000, target: 4600000000, pct: 93.48, score: 3.0 },
      qrisprod: { realisasi: 44, target: 48, pct: 91.67, score: 3.0 },
      holding: { realisasi: 3.15, target: 3.5, pct: 90.0, score: 3.0 },
      payroll: { realisasi: 16, target: 19, pct: 84.21, score: 2.0 },
    }
  }
];

// Generate dynamic daily timeseries for simulation and fallback in Region Malang
export function generateSampleDailySegmenRows(targetDate: string = '2026-08-01'): any[] {
  const rows: any[] = [];
  const segments = ['KORPORASI', 'RITEL', 'MIKRO'];

  // All relevant comparison periods as requested
  const allMonths = [
    { year: 2025, month: 12, prefix: '2025-12', growth: 0.94 }, // Dec-25
    { year: 2026, month: 6, prefix: '2026-06', growth: 0.98 },   // Jun-26
    { year: 2026, month: 7, prefix: '2026-07', growth: 1.00 },   // Jul-26
    { year: 2026, month: 8, prefix: '2026-08', growth: 1.02 },   // Aug-26
  ];

  // Helper for banking daily seasonal curve
  const getDailyFactor = (day: number, branchSeed: number): number => {
    // Typical banking daily progression:
    // Days 1-5: slight initial dip from payroll disbursements (-0.5% to 0%)
    // Days 6-24: steady retail accumulation (+0.5% to +1.8%)
    // Days 25-28: corporate payroll inflow (+2.0% to +3.5%)
    // Days 29-31: month-end closing push (+3.0% to +4.2%)
    const wave = Math.sin((day / 31) * Math.PI * 1.5 + branchSeed * 0.2) * 0.015;
    const progress = (day / 31) * 0.025;
    return 1.0 + wave + progress;
  };

  // 1. Generate full detailed unit rows for KC Banyuwangi exactly matching Google Sheet segmen_data
  allMonths.forEach(m => {
    for (let d = 1; d <= 31; d++) {
      const dateStr = `${m.prefix}-${String(d).padStart(2, '0')}`;
      const factor = m.growth * getDailyFactor(d, 7);

      // Tabungan (35 rows, sum = 2.334.976.510.505)
      BANYUWANGI_TABUNGAN_ROWS.forEach(u => {
        const val = (m.prefix === '2026-08' && d === 1) ? u.saldo : Math.round(u.saldo * factor);
        rows.push({
          posisi: dateStr,
          'kode uker': u.uker,
          'nama uker': u.nama,
          'nama cabang': 'KC Banyuwangi',
          'segmentasi bpr': u.seg,
          produk: 'TABUNGAN',
          saldo: val,
        });
      });

      // Giro (33 rows, sum = 162.217.230.680)
      BANYUWANGI_GIRO_ROWS.forEach(u => {
        const val = (m.prefix === '2026-08' && d === 1) ? u.saldo : Math.round(u.saldo * factor);
        rows.push({
          posisi: dateStr,
          'kode uker': u.uker,
          'nama uker': u.nama,
          'nama cabang': 'KC Banyuwangi',
          'segmentasi bpr': u.seg,
          produk: 'GIRO',
          saldo: val,
        });
      });

      // Deposito (31 rows, sum = 446.685.738.039)
      BANYUWANGI_DEPOSITO_ROWS.forEach(u => {
        const val = (m.prefix === '2026-08' && d === 1) ? u.saldo : Math.round(u.saldo * factor);
        rows.push({
          posisi: dateStr,
          'kode uker': u.uker,
          'nama uker': u.nama,
          'nama cabang': 'KC Banyuwangi',
          'segmentasi bpr': u.seg,
          produk: 'DEPOSITO',
          saldo: val,
        });
      });
    }
  });

  // 2. Generate other 24 branches in Region Malang based on authentic branch fundings
  const otherBranches = Object.entries(BRANCH_BASE_FUNDING).filter(([bName]) => bName !== 'Banyuwangi');

  otherBranches.forEach(([bName, cfg], bIdx) => {
    allMonths.forEach(m => {
      for (let d = 1; d <= 31; d++) {
        const dateStr = `${m.prefix}-${String(d).padStart(2, '0')}`;
        const factor = (m.prefix === '2026-08' && d === 1) ? 1.0 : (m.growth * getDailyFactor(d, bIdx + 1));

        // Mikro segment (~60%)
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `UNIT PUSAT ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'MIKRO',
          produk: 'TABUNGAN',
          saldo: Math.round(cfg.tab * 0.60 * factor),
        });
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `UNIT PUSAT ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'MIKRO',
          produk: 'DEPOSITO',
          saldo: Math.round(cfg.dep * 0.40 * factor),
        });
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `UNIT PUSAT ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'MIKRO',
          produk: 'GIRO',
          saldo: Math.round(cfg.giro * 0.15 * factor),
        });

        // Ritel segment (~30%)
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `KCP ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'RITEL',
          produk: 'TABUNGAN',
          saldo: Math.round(cfg.tab * 0.30 * factor),
        });
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `KCP ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'RITEL',
          produk: 'DEPOSITO',
          saldo: Math.round(cfg.dep * 0.45 * factor),
        });
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `KCP ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'RITEL',
          produk: 'GIRO',
          saldo: Math.round(cfg.giro * 0.55 * factor),
        });

        // Korporasi segment (~10%)
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `KC ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'KORPORASI',
          produk: 'TABUNGAN',
          saldo: Math.round(cfg.tab * 0.10 * factor),
        });
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `KC ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'KORPORASI',
          produk: 'DEPOSITO',
          saldo: Math.round(cfg.dep * 0.15 * factor),
        });
        rows.push({
          posisi: dateStr,
          'kode uker': cfg.ukerCode,
          'nama uker': `KC ${bName.toUpperCase()}`,
          'nama cabang': `KC ${bName}`,
          'segmentasi bpr': 'KORPORASI',
          produk: 'GIRO',
          saldo: Math.round(cfg.giro * 0.30 * factor),
        });
      }
    });
  });

  return rows;
}

export function generateSampleRkaMap(): Record<string, any> {
  const rka: Record<string, any> = {};

  Object.entries(BRANCH_BASE_FUNDING).forEach(([bName, cfg]) => {
    const uker = cfg.ukerCode;
    const tabTarget = cfg.rkaTab;
    const giroTarget = cfg.rkaGiro;
    const depTarget = cfg.rkaDep;
    const dpkTarget = tabTarget + giroTarget + depTarget;

    rka[uker] = {
      tabungan: Array.from({ length: 12 }, (_, m) => Math.round(tabTarget * (0.92 + m * 0.015))),
      giro: Array.from({ length: 12 }, (_, m) => Math.round(giroTarget * (0.90 + m * 0.018))),
      deposito: Array.from({ length: 12 }, (_, m) => Math.round(depTarget * (0.94 + m * 0.012))),
      dpk: Array.from({ length: 12 }, (_, m) => Math.round(dpkTarget * (0.92 + m * 0.015))),
    };

    // Set exact August targets for Banyuwangi (Kode Uker 7) matching tabel_rka
    if (bName === 'Banyuwangi') {
      rka['7'].tabungan[7] = 459_476_555_982;
      rka['7'].giro[7] = 122_164_622_194;
      rka['7'].deposito[7] = 90_526_662_212;
      rka['7'].dpk[7] = 672_167_840_388;
    }
  });

  return rka;
}
