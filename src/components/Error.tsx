import React from 'react';
import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from '@web3-react/injected-connector';
import { Alert } from 'reactstrap';

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError)
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  else if (error instanceof UnsupportedChainIdError)
    return "Please connect to rinkeby testnet";
  else if (error instanceof UserRejectedRequestError)
    return 'Please authorize this website to access your Ethereum account.';
  else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}

export default function AlertMessage({ error }: { error: Error }) {
  return (
    <Alert color="danger">
      <div className="alert-heading">
        Please resolve the issue before continuing.
      </div>
      {getErrorMessage(error)}
    </Alert>
  );
}
