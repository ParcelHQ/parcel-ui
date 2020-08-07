import React, { useState, useEffect, useContext } from 'react';
import classnames from 'classnames';
import Sidebar from '../components/Menu/Sidebar';
import Navbar from '../components/Navbar';
import { LayoutContext } from '../state/layout/Context';
import { Redirect } from 'react-router-dom';

export default function LoggedInLayout({ children, match }: any) {
  const { layout } = useContext(LayoutContext);

  const [width, setWidth] = useState(window.innerWidth);
  const [sidebarState, setSidebarState] = useState(true);
  const [collapsedContent, setCollapsedContent] = useState(true);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [appOverlay, setAppOverlay] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      window.addEventListener(
        'resize',
        () => setWidth(window.innerWidth),
        false
      );

      if (layout.theme === 'dark') document.body.classList.add('dark-layout');
    }

    return () => {
      mounted = false;
      window.removeEventListener(
        'resize',
        () => setWidth(window.innerWidth),
        false
      );
    };
  }, [layout.theme]);

  function toggleSidebarMenu() {
    setSidebarState(!sidebarState);
    setCollapsedContent(!collapsedContent);
  }

  function handleSidebarVisibility() {
    if (window !== undefined) {
      window.addEventListener('resize', () => {
        if (sidebarHidden) setSidebarHidden(!sidebarHidden);
      });
    }
    setSidebarHidden(!sidebarHidden);
  }

  function handleAppOverlay(value: any) {
    if (value.length > 0) setAppOverlay(true);
    else if (value.length < 0 || value === '') setAppOverlay(false);
  }

  return (
    <>
      {!localStorage.getItem('PARCEL_WALLET_ADDRESS') && (
        <Redirect to={{ pathname: '/' }} />
      )}

      <div
        className={classnames(
          'wrapper vertical-layout theme-primary navbar-floating',
          {
            'menu-collapsed': collapsedContent === true && width >= 1200,
          }
        )}
      >
        <Sidebar
          activePath={match.path}
          collapsed={collapsedContent}
          deviceWidth={width}
          sidebarState={sidebarState}
          sidebarHover={(val: any) => setSidebarState(val)}
          sidebarVisibility={handleSidebarVisibility}
          toggle={toggleSidebarMenu}
          visibilityState={sidebarHidden}
        />

        <div
          className={classnames('app-content content', {
            'show-overlay': appOverlay === true,
          })}
          onClick={() => setAppOverlay(false)}
        >
          <Navbar
            toggleSidebarMenu={toggleSidebarMenu}
            sidebarState={sidebarState}
            sidebarVisibility={handleSidebarVisibility}
            handleAppOverlay={handleAppOverlay}
            appOverlayState={appOverlay}
          />

          <div className="content-wrapper">{children}</div>
        </div>

        <div
          className="sidenav-overlay"
          onClick={() => handleSidebarVisibility()}
        />
      </div>
    </>
  );
}
