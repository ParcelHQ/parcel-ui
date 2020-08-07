import React from 'react';
import classnames from 'classnames';
import Logo from '../assets/img/logo/logoPng.png';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';

const StyledLogo = styled.img`
  height: 6rem;
  margin-top: 1rem;
  position: fixed;
  left: 20px;
`;

export default function LoggedOutLayout({ children }: any) {
  const location = useLocation();

  return (
    <div className={classnames('full-layout wrapper blank-page dark-layout')}>
      <div className="app-content">
        <div className="content-wrapper">
          <div className="content-body">
            {location.pathname === '/create' && (
              <StyledLogo src={Logo} alt="Parcel Logo" />
            )}
            {location.pathname === '/organizations' && (
              <StyledLogo src={Logo} alt="Parcel Logo" />
            )}

            <div className="flexbox-container">
              <main className="main w-100">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
