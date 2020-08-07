import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { ContractProvider } from './state/contracts/Context';
import { LayoutProvider } from './state/layout/Context';
import { EmployeeProvider } from './state/employee/Context';
import { OrganizationProvider } from './state/organization/Context';
import Spinner from './components/Spinner/Fallback-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import { Global } from '@emotion/core';
import { GlobalStyle } from './utility/theme';

const LazyApp = lazy(() => import('./App'));

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

ReactDOM.render(
  <Suspense fallback={<Spinner />}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContractProvider>
        <LayoutProvider>
          <OrganizationProvider>
            <EmployeeProvider>
              <Global styles={GlobalStyle} />
              <LazyApp />
            </EmployeeProvider>
          </OrganizationProvider>
        </LayoutProvider>
      </ContractProvider>
    </Web3ReactProvider>
  </Suspense>,
  document.getElementById('root')
);
