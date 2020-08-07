import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import classnames from 'classnames';
import { ChevronRight } from 'react-feather';

export default function SideMenuGroup({
  toggleMenu,
  deviceWidth,
  activePath,
  group,
  handleGroupClick,
  handleSidebarMouseEnter,
  handleActiveItem,
  currentActiveGroup,
  activeGroup,
  collapsedMenuPaths,
  hoverIndex,
  currentUser,
  activeItemState,
  parentArr,
}: any) {
  const [parentArray, setParentArray] = useState([]);
  const [childObj, setChildObj] = useState<any>({});
  // const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState();

  // function handleActiveItem(url) {
  //   setActiveItem(url);
  // }

  useEffect(() => {
    if (childObj.navLink && childObj.collapsed) {
      collapsedMenuPaths(childObj.navLink);
    }
    if (
      activePath === childObj.navLink &&
      !parentArr.includes(parentArray[0])
    ) {
      parentArr.splice(0, parentArr.length);
      parentArr.push(parentArray);
    } else if (parentArr.includes(parentArray)) {
      parentArr.splice(0, parentArr.length);
    }

    return () => {};
    //eslint-disable-next-line
  }, []);

  function renderChild(
    item: any,
    activeGroup: any,
    handleGroupClick: any,
    handleActiveItem: any
  ) {
    return (
      <ul className="menu-content">
        {item.children
          ? item.children.map((child: any) => {
              const CustomAnchorTag =
                child.type === 'external-link' ? `a` : Link;
              //@ts-ignore
              if (!parentArray.includes(item.id))
                //@ts-ignore
                setParentArray([...parentArray, item.id]);

              if (child.navlink && child.collapsed)
                collapsedMenuPaths(child.navLink);

              if (activeItemState === child.navLink) {
                setChildObj(child);
                parentArr.push(parentArray);
              }
              if (
                (child.permissions &&
                  child.permissions.includes(currentUser)) ||
                child.permissions === undefined
              ) {
                return (
                  <li
                    key={child.id}
                    className={classnames({
                      hover: hoverIndex === child.id,
                      'has-sub': child.type === 'collapse',
                      open:
                        child.type === 'collapse' &&
                        activeGroup.includes(child.id),
                      'sidebar-group-active': currentActiveGroup.includes(
                        child.id
                      ),
                      active:
                        (activeItemState === child.navLink &&
                          child.type === 'item') ||
                        (item.parentOf &&
                          item.parentOf.includes(activeItemState)),
                      disabled: child.disabled,
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupClick(child.id, item.id, child.type);
                      if (child.navLink && child.navLink !== undefined) {
                        handleActiveItem(child.navLink);
                      }
                      if (deviceWidth <= 1200 && child.type === 'item') {
                        toggleMenu();
                      }
                    }}
                  >
                    <CustomAnchorTag
                      className={classnames({
                        'd-flex justify-content-between':
                          child.type === 'collapse',
                      })}
                      to={
                        child.navLink && child.type === 'item'
                          ? child.navLink
                          : ''
                      }
                      href={child.type === 'external-link' ? child.navLink : ''}
                      onMouseEnter={() => {
                        handleSidebarMouseEnter(child.id);
                      }}
                      onMouseLeave={() => {
                        handleSidebarMouseEnter(child.id);
                      }}
                      key={child.id}
                      onClick={(e) => {
                        return child.type === 'collapse'
                          ? e.preventDefault()
                          : '';
                      }}
                      target={child.newTab ? '_blank' : undefined}
                    >
                      <div className="menu-text">
                        {child.icon}
                        <span className="menu-item menu-title">
                          {child.title}
                        </span>
                      </div>
                      {child.badge ? (
                        <Badge
                          color={child.badge}
                          className="float-right mr-2"
                          pill
                        >
                          {child.badgeText}
                        </Badge>
                      ) : (
                        ''
                      )}
                      {child.type === 'collapse' ? (
                        <ChevronRight className="menu-toggle-icon" size={13} />
                      ) : (
                        ''
                      )}
                    </CustomAnchorTag>

                    {child.children
                      ? renderChild(
                          child,
                          activeGroup,
                          handleGroupClick,
                          handleActiveItem,
                          //@ts-ignore
                          item.id
                        )
                      : ''}
                  </li>
                );
              } else if (
                child.navLink === activePath &&
                !child.permissions.includes(currentUser)
              ) {
                console.log('return this.props.redirectUnauthorized()');
              } else {
                return null;
              }
            })
          : null}
      </ul>
    );
  }

  return (
    <>{renderChild(group, activeGroup, handleGroupClick, handleActiveItem)}</>
  );
}
