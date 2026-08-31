import React, { useState } from 'react';
import { ActivePage } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  onSelectPage?: (page: ActivePage) => void;
  onNavigate?: (page: ActivePage) => void;
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  onNavigate,
  isOpen = false,
  isCollapsed = false,
  onClose = () => {},
}) => {
  const handlePageSelect = onSelectPage || onNavigate || (() => {});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    appraisal: false,
    ptp: false,
    funding: false,
    sbl: false,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavClick = (page: ActivePage) => {
    handlePageSelect(page);
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && <div id="sidebar-overlay" onClick={onClose} />}

      <div className={`sidebar ${isOpen ? 'show' : ''} ${isCollapsed ? 'collapsed' : ''}`} id="mainSidebar">
        {/* GROUP 1: KINERJA AREA */}
        <div className="sidebar-group">
          <div className="sidebar-title">Kinerja Area</div>
          <div className="sidebar-menu">
            <ul className="sub-menu" style={{ display: 'block', paddingTop: 0 }}>
              <li>
                <a
                  href="#area"
                  className={activePage === 'page-area' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('page-area');
                  }}
                >
                  <i className="fa-solid fa-chart-line icon-sub" style={{ color: '#0857C3' }}></i>
                  <span>Kinerja Area</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* GROUP 2: KINERJA RM */}
        <div className="sidebar-group">
          <div className="sidebar-title">Kinerja RM</div>
          <div className="sidebar-menu">
            <ul className="sub-menu" style={{ display: 'block', paddingTop: 0 }}>
              <li>
                <a
                  href="#kinerja-rm"
                  className={activePage === 'page-kinerja-rm' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('page-kinerja-rm');
                  }}
                >
                  <i className="fa-solid fa-users-gear icon-sub" style={{ color: '#307FE2' }}></i>
                  <span>Dashboard Kinerja RM</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* GROUP 3: KINERJA RMFT PROFIL */}
        <div className="sidebar-group">
          <div className="sidebar-title">Kinerja RMFT</div>
          <div className="sidebar-menu">
            <ul className="sub-menu" style={{ display: 'block', paddingTop: 0 }}>
              <li>
                <a
                  href="#rmft"
                  className={activePage === 'page-rmft' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('page-rmft');
                  }}
                >
                  <i className="fa-solid fa-user-tie icon-sub" style={{ color: '#05CD99' }}></i>
                  <span>Profil Kinerja RMFT</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* GROUP 4: PERFORMANCE APPRAISAL */}
        <div className="sidebar-group">
          <div className="sidebar-title">Performance Appraisal</div>
          <div className="sidebar-menu">
            <div
              className={`parent-menu ${openGroups.appraisal ? 'open' : ''}`}
              onClick={() => toggleGroup('appraisal')}
            >
              <div className="menu-left">
                <i className="fa-solid fa-chart-pie icon-main" style={{ color: '#E11D48' }}></i>
                <span>Performance Appraisal</span>
              </div>
              <i className="fa-solid fa-chevron-right caret"></i>
            </div>
            {openGroups.appraisal && (
              <ul className="sub-menu" style={{ display: 'block' }}>
                <li>
                  <a
                    href="#appraisal"
                    className={activePage === 'page-appraisal' ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('page-appraisal');
                    }}
                  >
                    <i className="fa-solid fa-trophy icon-sub" style={{ color: '#FF8F00' }}></i>
                    <span>Ranking & Appraisal</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* GROUP 5: POINT TO POINT */}
        <div className="sidebar-group">
          <div className="sidebar-title">Point to Point</div>
          <div className="sidebar-menu">
            <div
              className={`parent-menu ${openGroups.ptp ? 'open' : ''}`}
              onClick={() => toggleGroup('ptp')}
            >
              <div className="menu-left">
                <i className="fa-solid fa-map-location-dot icon-main" style={{ color: '#607d8b' }}></i>
                <span>Point to Point</span>
              </div>
              <i className="fa-solid fa-chevron-right caret"></i>
            </div>
            {openGroups.ptp && (
              <ul className="sub-menu" style={{ display: 'block' }}>
                <li>
                  <a
                    href="#ptp"
                    className={activePage === 'page-ptp' ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('page-ptp');
                    }}
                  >
                    <i className="fa-solid fa-chart-area icon-sub" style={{ color: '#307FE2' }}></i>
                    <span>Dashboard P.t.P</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* GROUP 6: FUNDING & TRANSACTION */}
        <div className="sidebar-group">
          <div className="sidebar-title">Funding & Transaction</div>
          <div className="sidebar-menu">
            <div
              className={`parent-menu ${openGroups.funding ? 'open' : ''}`}
              onClick={() => toggleGroup('funding')}
            >
              <div className="menu-left">
                <i className="fa-solid fa-wallet icon-main" style={{ color: '#FF8F00' }}></i>
                <span>Funding & Transaction</span>
              </div>
              <i className="fa-solid fa-chevron-right caret"></i>
            </div>
            {openGroups.funding && (
              <ul className="sub-menu" style={{ display: 'block' }}>
                <li>
                  <a
                    href="#funding"
                    className={activePage === 'page-funding' ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('page-funding');
                    }}
                  >
                    <i className="fa-solid fa-droplet icon-sub" style={{ color: '#307FE2' }}></i>
                    <span>Monitoring FT & Merchant</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* GROUP 7: SALARY BASED LOAN */}
        <div className="sidebar-group">
          <div className="sidebar-title">Salary Based Loan</div>
          <div className="sidebar-menu">
            <div
              className={`parent-menu ${openGroups.sbl ? 'open' : ''}`}
              onClick={() => toggleGroup('sbl')}
            >
              <div className="menu-left">
                <i className="fa-solid fa-money-bill-wave icon-main" style={{ color: '#4caf50' }}></i>
                <span>Salary Based Loan</span>
              </div>
              <i className="fa-solid fa-chevron-right caret"></i>
            </div>
            {openGroups.sbl && (
              <ul className="sub-menu" style={{ display: 'block' }}>
                <li>
                  <a
                    href="#sbl"
                    className={activePage === 'page-sbl' ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('page-sbl');
                    }}
                  >
                    <i className="fa-solid fa-hand-holding-dollar icon-sub" style={{ color: '#05CD99' }}></i>
                    <span>SBL Briguna Monitoring</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
