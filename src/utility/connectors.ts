import { InjectedConnector } from '@web3-react/injected-connector';
import { PortisConnector } from '@web3-react/portis-connector';

export const injected = new InjectedConnector({ supportedChainIds: [4] });

const PORTIS_ID = process.env.REACT_APP_PORTIS_DAPP_ID;
// console.log('PORTIS_ID:', PORTIS_ID);

export const portis = new PortisConnector({
  dAppId: process.env.PORTIS_DAPP_ID as string,
  networks: [1, 100],
});
