import React, { useState, useEffect, useCallback } from 'react';
import { User, UkerInfo, RawSegmenRow, RMFTProfileData, ActivePage } from './types';
import { fetchAllDashboardData, formatSheetDate } from './services/sheetsService';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { KinerjaAreaView } from './components/KinerjaAreaView';
import { KinerjaRMView } from './components/KinerjaRMView';
import { ProfilRMFTView } from './components/ProfilRMFTView';
import { PerformanceAppraisalView } from './components/PerformanceAppraisalView';
import { PointToPointView } from './components/PointToPointView';
import { FundingTransactionView } from './components/FundingTransactionView';
import { SalaryBasedLoanView } from './components/SalaryBasedLoanView';

export function App() {
  // Auth state with session persistence (default to null if no saved session so Login screen appears)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bri_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<ActivePage>('page-area');

  // Shared Filters
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedCabang, setSelectedCabang] = useState<string>('ALL');
  const [selectedSegmen, setSelectedSegmen] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-01');

  // Data states
  const [ukerMap, setUkerMap] = useState<Record<string, UkerInfo>>({});
  const [rkaMap, setRkaMap] = useState<Record<string, any>>({});
  const [rawSegmenData, setRawSegmenData] = useState<RawSegmenRow[]>([]);
  const [rmftProfiles, setRmftProfiles] = useState<RMFTProfileData[]>([]);
  const [userList, setUserList] = useState<User[]>([]);

  // Sync / loading status
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [statusText, setStatusText] = useState<string>('Ready');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');

  // Fetch data
  const loadData = useCallback(async () => {
    setIsSyncing(true);
    setStatusText('Menyinkronkan data...');
    try {
      const data = await fetchAllDashboardData();
      setUkerMap(data.ukerMap);
      setRkaMap(data.rkaMap);
      setRawSegmenData(data.rawSegmenData);
      setRmftProfiles(data.rmftProfiles);
      if (data.users && data.users.length > 0) {
        setUserList(data.users);
      }
      setIsOnline(data.isOnline);
      setStatusText(data.isOnline ? 'Online (Terhubung)' : 'Cache Aktif (Offline)');

      if (data.rawSegmenData && data.rawSegmenData.length > 0) {
        const availableDates = Array.from(
          new Set(
            data.rawSegmenData
              .map((r) => formatSheetDate(r.posisi || r['posisi']))
              .filter((d): d is string => Boolean(d))
          )
        ).sort();

        if (availableDates.length > 0) {
          setSelectedDate((prevDate) => {
            if (availableDates.includes(prevDate)) return prevDate;
            return availableDates[availableDates.length - 1];
          });
        }
      }

      const now = new Date();
      setLastSyncTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setStatusText('Gagal sync data');
      setIsOnline(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Area Change to reset cabang
  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    setSelectedCabang('ALL');
  };

  // Handle PDF Print
  const handleDownloadPDF = () => {
    window.print();
  };

  // Login handler
  const handleLogin = (user: User) => {
    localStorage.setItem('bri_auth_user', JSON.stringify(user));
    setCurrentUser(user);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('bri_auth_user');
    setCurrentUser(null);
  };

  // If not logged in, show Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onLoginSuccess={handleLogin} userList={userList} />;
  }

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onToggleSidebar={() => {
          if (window.innerWidth <= 1024) {
            setIsSidebarOpen(!isSidebarOpen);
          } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }
        }}
        onLogout={handleLogout}
        isSyncing={isSyncing}
        isOnline={isOnline}
        onSync={loadData}
        lastSyncTime={lastSyncTime}
      />

      {/* Navigation Sidebar */}
      <Sidebar
        activePage={activePage}
        onSelectPage={(pageId) => setActivePage(pageId)}
        onNavigate={(pageId) => setActivePage(pageId)}
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Dynamic Main Content Container */}
      <main className="main-content">
        {activePage === 'page-area' && (
          <KinerjaAreaView
            ukerMap={ukerMap}
            rkaMap={rkaMap}
            rawSegmenData={rawSegmenData}
            selectedArea={selectedArea}
            onAreaChange={handleAreaChange}
            selectedCabang={selectedCabang}
            onCabangChange={setSelectedCabang}
            selectedSegmen={selectedSegmen}
            onSegmenChange={setSelectedSegmen}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onSync={loadData}
            isSyncing={isSyncing}
            statusText={statusText}
            isOnline={isOnline}
            onDownloadPDF={handleDownloadPDF}
          />
        )}

        {activePage === 'page-kinerja-rm' && (
          <KinerjaRMView
            ukerMap={ukerMap}
            rkaMap={rkaMap}
            rawSegmenData={rawSegmenData}
            rmftProfiles={rmftProfiles}
            selectedArea={selectedArea}
            onAreaChange={handleAreaChange}
            selectedCabang={selectedCabang}
            onCabangChange={setSelectedCabang}
            selectedSegmen={selectedSegmen}
            onSegmenChange={setSelectedSegmen}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onSync={loadData}
            isSyncing={isSyncing}
            statusText={statusText}
            isOnline={isOnline}
            onDownloadPDF={handleDownloadPDF}
          />
        )}

        {activePage === 'page-rmft' && (
          <ProfilRMFTView
            ukerMap={ukerMap}
            rmftProfiles={rmftProfiles}
            selectedArea={selectedArea}
            onAreaChange={handleAreaChange}
            selectedCabang={selectedCabang}
            onCabangChange={setSelectedCabang}
            onSync={loadData}
            isSyncing={isSyncing}
            statusText={statusText}
            isOnline={isOnline}
            onDownloadPDF={handleDownloadPDF}
          />
        )}

        {activePage === 'page-ptp' && (
          <PointToPointView ukerMap={ukerMap} onDownloadPDF={handleDownloadPDF} />
        )}

        {(activePage === 'page-funding' || (activePage as string) === 'page-ft') && (
          <FundingTransactionView onDownloadPDF={handleDownloadPDF} />
        )}

        {activePage === 'page-sbl' && (
          <SalaryBasedLoanView onDownloadPDF={handleDownloadPDF} />
        )}

        {activePage === 'page-appraisal' && (
          <PerformanceAppraisalView
            rmftProfiles={rmftProfiles}
            onDownloadPDF={handleDownloadPDF}
          />
        )}
      </main>
    </div>
  );
}

export default App;
