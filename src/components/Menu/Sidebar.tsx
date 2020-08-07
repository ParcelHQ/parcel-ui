import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import SidebarHeader from './SidebarHeader';
import Hammer from 'react-hammerjs';
import SideMenuContent from './sidemenu/SideMenuContent';

export default function Sidebar({
  activePath,
  collapsed,
  deviceWidth,
  sidebarVisibility,
  sidebarHover,
  sidebarState,
  toggle,
  visibilityState,
}: any) {
  const [width, setWidth] = useState(window.innerWidth);
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const [activeItem, setActiveItem] = useState(activePath);

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
      checkDevice();
    };

    let mounted = true;
    if (mounted) {
      window.addEventListener('resize', updateWidth, false);
      checkDevice();
    }

    return () => {
      mounted = false;
    };
  }, []);

  const checkDevice = () => {
    let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    let mq = function (query: any) {
      return window.matchMedia(query).matches;
    };

    let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
      ''
    );
    return mq(query);
  };

  const changeActiveIndex = (id: any) => {
    if (id !== activeIndex) setActiveIndex(id);
    else setActiveIndex(null);
  };

  const handleSidebarMouseEnter = (id: any) => {
    if (id !== hoveredMenuItem) setHoveredMenuItem(id);
    else setHoveredMenuItem(null);
  };

  return (
    <>
      <Hammer onSwipe={() => sidebarVisibility()} direction={'DIRECTION_RIGHT'}>
        <div className="menu-swipe-area d-xl-none d-block vh-100"></div>
      </Hammer>

      <div
        className={classnames(
          `main-menu menu-fixed menu-light menu-accordion menu-shadow theme-primary`,
          {
            collapsed: sidebarState === true,
            'hide-sidebar': width < 1200 && visibilityState === false,
          }
        )}
        onMouseEnter={() => sidebarHover(false)}
        onMouseLeave={() => sidebarHover(true)}
      >
        <SidebarHeader
          toggle={toggle}
          sidebarVisibility={sidebarVisibility}
          collapsed={collapsed}
          activePath={activePath}
          sidebarState={sidebarState}
        />

        <Hammer
          onSwipe={() => sidebarVisibility()}
          direction={'DIRECTION_LEFT'}
        >
          <ul className="navigation navigation-main">
            <SideMenuContent
              setActiveIndex={changeActiveIndex}
              activeIndex={activeIndex}
              hoverIndex={hoveredMenuItem}
              handleSidebarMouseEnter={handleSidebarMouseEnter}
              activeItemState={activeItem}
              handleActiveItem={(url: any) => setActiveItem(url)}
              activePath={activePath}
              toggleMenu={sidebarVisibility}
              deviceWidth={deviceWidth}
            />
          </ul>
        </Hammer>
      </div>
    </>
  );
}
