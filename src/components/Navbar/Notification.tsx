import React from 'react';
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Media,
  Badge,
} from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import * as Icon from 'react-feather';

const Notification = () => {
  return (
    <UncontrolledDropdown tag="li" className="dropdown-notification nav-item">
      <DropdownToggle
        tag="a"
        className="nav-link nav-link-label"
        disabled={true}
      >
        <Icon.Bell size={21} />
        <Badge pill color="primary" className="badge-up">
          1
        </Badge>
      </DropdownToggle>
      <DropdownMenu tag="ul" right className="dropdown-menu-media">
        <li className="dropdown-menu-header">
          <div className="dropdown-header mt-0">
            <h3 className="text-white">2 New</h3>
            <span className="notification-title">App Notifications</span>
          </div>
        </li>
        <PerfectScrollbar
          className="media-list overflow-hidden position-relative"
          options={{
            wheelPropagation: false,
          }}
        >
          <div className="d-flex justify-content-between">
            <Media className="d-flex align-items-start">
              <Media left href="#">
                <Icon.PlusSquare className="font-medium-5 primary" size={21} />
              </Media>
              <Media body>
                <Media heading className="media-heading" tag="h6">
                  You have new order!
                </Media>
                <p className="notification-text">
                  Are your going to meet me tonight?
                </p>
              </Media>
              <small>
                <time
                  className="media-meta"
                  dateTime="2015-06-11T18:29:20+08:00"
                >
                  9 hours ago
                </time>
              </small>
            </Media>
          </div>
          <div className="d-flex justify-content-between">
            <Media className="d-flex align-items-start">
              <Media left href="#">
                <Icon.DownloadCloud
                  className="font-medium-5 primary"
                  size={21}
                />
              </Media>
              <Media body>
                <Media heading className="media-heading" tag="h6">
                  99% Server load
                </Media>
                <p className="notification-text">You got new order of goods?</p>
              </Media>
              <small>
                <time
                  className="media-meta"
                  dateTime="2015-06-11T18:29:20+08:00"
                >
                  5 hours ago
                </time>
              </small>
            </Media>
          </div>
        </PerfectScrollbar>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Notification;
