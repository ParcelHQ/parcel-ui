import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import navigationConfig from './navigationConfig';
import SideMenuGroup from './SideMenuGroup';
import { Badge } from 'reactstrap';
import { ChevronRight } from 'react-feather';

export default function SideMenuContent(props: any) {
  const [parentArr, setParentArr] = useState<any>([]);
  const [collapsedPath, setCollapsedPath] = useState<any>(null);
  const [activeGroups, setActiveGroups] = useState<any>([]);
  const [currentActiveGroup, setCurrentActiveGroup] = useState<any>([]);
  const [tempArr, setTempArr] = useState<any>([]);

  const handleGroupClick = (id: any, parent = null, type = '') => {
    let open_group = activeGroups;
    let active_group = currentActiveGroup;
    let temp_arr = tempArr;
    // Active Group to apply sidebar-group-active class
    if (type === 'item' && parent === null) {
      active_group = [];
      temp_arr = [];
    } else if (type === 'item' && parent !== null) {
      active_group = [];
      if (temp_arr.includes(parent)) {
        temp_arr.splice(temp_arr.indexOf(parent) + 1, temp_arr.length);
      } else {
        temp_arr = [];
        temp_arr.push(parent);
      }
      active_group = temp_arr.slice(0);
    } else if (type === 'collapse' && parent === null) {
      temp_arr = [];
      temp_arr.push(id);
    } else if (type === 'collapse' && parent !== null) {
      if (active_group.includes(parent)) {
        temp_arr = active_group.slice(0);
      }
      if (temp_arr.includes(id)) {
        // temp_arr.splice(temp_arr.indexOf(id), 1)
        temp_arr.splice(temp_arr.indexOf(id), temp_arr.length);
      } else {
        temp_arr.push(id);
      }
    } else {
      temp_arr = [];
    }

    if (type === 'collapse') {
      // If open group does not include clicked group item
      if (!open_group.includes(id)) {
        // Get unmatched items that are not in the active group
        let temp = open_group.filter(function (obj: any) {
          return active_group.indexOf(obj) === -1;
        });
        // Remove those unmatched items from open group
        if (temp.length > 0 && !open_group.includes(parent)) {
          open_group = open_group.filter(function (obj: any) {
            return !temp.includes(obj);
          });
        }
        if (open_group.includes(parent) && active_group.includes(parent)) {
          open_group = active_group.slice(0);
        }
        // Add group item clicked in open group
        if (!open_group.includes(id)) {
          open_group.push(id);
        }
      } else {
        // If open group includes click group item, remove it from open group
        open_group.splice(open_group.indexOf(id), 1);
      }
    }
    if (type === 'item') {
      open_group = active_group.slice(0);
    }
    setActiveGroups(open_group);
    setTempArr(temp_arr);
    setCurrentActiveGroup(active_group);
  };

  const initRender = (parentArr: any) => {
    setActiveGroups(parentArr.slice(0));
    setCurrentActiveGroup(parentArr.slice(0));
  };

  useEffect(() => {
    initRender(parentArr[0] ? parentArr[0] : []);

    initRender(parentArr[0] ? parentArr[parentArr.length - 1] : []);

    return () => {};
  }, [props.activePath, parentArr]);

  const menuItems = navigationConfig.map((item: any) => {
    const CustomAnchorTag = item.type === 'external-link' ? `a` : Link;
    // checks if item has groupheader
    if (item.type === 'groupHeader') {
      return (
        <li
          className="navigation-header"
          key={`group-header-${item.groupTitle}`}
        >
          <span>{item.groupTitle}</span>
        </li>
      );
    }

    let renderItem = (
      <li
        className={classnames('nav-item', {
          'has-sub': item.type === 'collapse',
          open: activeGroups.includes(item.id),
          'sidebar-group-active': currentActiveGroup.includes(item.id),
          hover: props.hoverIndex === item.id,
          active:
            (props.activeItemState === item.navLink && item.type === 'item') ||
            (item.parentOf && item.parentOf.includes(props.activeItemState)),
          disabled: item.disabled,
        })}
        key={item.id}
        onClick={(e) => {
          e.stopPropagation();
          if (item.type === 'item') {
            props.handleActiveItem(item.navLink);
            handleGroupClick(item.id, null, item.type);
            if (props.deviceWidth <= 1200 && item.type === 'item') {
              props.toggleMenu();
            }
          } else handleGroupClick(item.id, null, item.type);
        }}
      >
        <CustomAnchorTag
          to={
            item.filterBase
              ? item.filterBase
              : item.navLink && item.type === 'item'
              ? item.navLink
              : ''
          }
          href={item.type === 'external-link' ? item.navLink : ''}
          className={`d-flex ${
            item.badgeText ? 'justify-content-between' : 'justify-content-start'
          }`}
          onMouseEnter={() => {
            props.handleSidebarMouseEnter(item.id);
          }}
          onMouseLeave={() => {
            props.handleSidebarMouseEnter(item.id);
          }}
          key={item.id}
          onClick={(e) => {
            return item.type === 'collapse' ? e.preventDefault() : '';
          }}
          target={item.newTab ? '_blank' : undefined}
        >
          <div className="menu-text">
            {item.icon}
            <span className="menu-item menu-title">{item.title}</span>
          </div>

          {item.badge ? (
            <div className="menu-badge">
              <Badge color={item.badge} className="mr-1" pill>
                {item.badgeText}
              </Badge>
            </div>
          ) : (
            ''
          )}
          {item.type === 'collapse' ? (
            <ChevronRight className="menu-toggle-icon" size={13} />
          ) : (
            ''
          )}
        </CustomAnchorTag>
        {item.type === 'collapse' ? (
          <SideMenuGroup
            group={item}
            handleGroupClick={handleGroupClick}
            activeGroup={activeGroups}
            handleActiveItem={props.handleActiveItem}
            activeItemState={props.activeItemState}
            handleSidebarMouseEnter={props.handleSidebarMouseEnter}
            activePath={props.activePath}
            hoverIndex={props.hoverIndex}
            initRender={initRender}
            parentArr={parentArr}
            triggerActive={undefined}
            currentActiveGroup={currentActiveGroup}
            permission={props.permission}
            currentUser={props.currentUser}
            collapsedMenuPaths={props.collapsedMenuPaths}
            toggleMenu={props.toggleMenu}
            deviceWidth={props.deviceWidth}
          />
        ) : (
          ''
        )}
      </li>
    );

    if (
      item.navLink &&
      item.collapsed !== undefined &&
      item.collapsed === true
    ) {
      //@ts-ignore
      collapsedPath = item.navLink;
      props.collapsedMenuPaths(item.navLink);
    }

    if (
      item.type === 'collapse' ||
      item.type === 'external-link' ||
      item.type === 'item' ||
      item.permissions === undefined
    ) {
      return renderItem;
    }
  });
  return <>{menuItems}</>;
}
