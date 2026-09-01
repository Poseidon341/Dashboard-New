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
    area: true,
    appraisal: false,
    summary: false,
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
            <div
              className={`parent-menu ${openGroups.area ? 'open' : ''}`}
              onClick={() => toggleGroup('area')}
            >
              <div className="menu-left">
                <i className="fa-solid fa-chart-line icon-main" style={{ color: '#0857C3' }}></i>
                <span>Kinerja Area</span>
              </div>
              <i className="fa-solid fa-chevron-right caret"></i>
            </div>
            {openGroups.area && (
              <ul className="sub-menu" style={{ display: 'block' }}>
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
                <li>
                  <a
                    href="#detail-uker"
                    className={activePage === 'page-detail-uker' ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('page-detail-uker');
                    }}
                  >
                    <i className="fa-solid fa-building icon-sub" style={{ color: '#307FE2' }}></i>
                    <span>Detail Unit Kerja</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* GROUP 2: PERFORMANCE APPRAISAL */}
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

        {/* GROUP 3: SUMMARY */}
        <div className="sidebar-group">
          <div className="sidebar-title">Summary</div>
          <div className="sidebar-menu">
            <div
              className={`parent-menu ${openGroups.summary ? 'open' : ''}`}
              onClick={() => toggleGroup('summary')}
            >
              <div className="menu-left">
                <i className="fa-solid fa-wallet icon-main" style={{ color: '#FF8F00' }}></i>
                <span>Summary</span>
              </div>
              <i className="fa-solid fa-chevron-right caret"></i>
            </div>
            {openGroups.summary && (
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
                    <span>Monitoring FT</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* GROUP 4: SALARY BASED LOAN */}
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
