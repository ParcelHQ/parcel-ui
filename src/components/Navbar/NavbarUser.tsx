import React from 'react';
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import * as Icon from 'react-feather';
import { history } from '../../history';
// import { LayoutContext } from '../../state/layout/Context';
// import { CHANGE_MODE } from '../../state/layout/Constants';
import Notification from './Notification';
import Avatar from '../Avatar';

export default function NavbarUser({ ENSName }: any) {
  // const { layout, dispatch } = useContext(LayoutContext);
  const { deactivate } = useWeb3React<Web3Provider>();

  function signOut() {
    deactivate();
    history.push('/');
  }

  return (
    <ul className="nav navbar-nav navbar-nav-user float-right">
      {/* <Button
        outline
        color="flat-primary"
        onClick={() => dispatch({ type: CHANGE_MODE, mode: 'light' })}
      >
        {layout.theme === 'dark' ? (
          <Icon.Sun size={21} />
        ) : (
          <Icon.Moon size={21} />
        )}
      </Button> */}
      <Notification />
      <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
        <DropdownToggle tag="a" className="nav-link dropdown-user-link">
          {/* <div className="user-nav d-sm-flex d-none">
            <span className="user-name text-bold-600">{userName}</span>
            <span className="user-status">Available</span>
          </div> */}
          <span data-tour="user">
            <Avatar
              color="primary"
              content={(ENSName && ENSName.charAt(0).toUpperCase()) || `-`}
              status="online"
            />
          </span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem tag="a" href="#">
            <Icon.User size={14} className="mr-50" />
            <span className="align-middle">Profile</span>
          </DropdownItem>

          <DropdownItem divider />
          <DropdownItem tag="a" href="#" onClick={() => signOut()}>
            <Icon.Power size={14} className="mr-50" />
            <span className="align-middle">Log Out</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </ul>
  );
}
