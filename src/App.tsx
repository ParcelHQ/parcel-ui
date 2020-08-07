import React from 'react';
import Router from './Router';

import { useWeb3React } from '@web3-react/core';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import AuthWrapper from './components/AuthWrapper';
import Error from './components/Error';

export default function App() {
  const { error } = useWeb3React();

  return (
    <AuthWrapper>{!!error ? <Error error={error} /> : <Router />}</AuthWrapper>
  );
}
