import React, {
  createContext,
  useState,
  ReactNode,
  useReducer,
  useEffect,
} from 'react';
import { CREATE_PARCEL_WALLET } from './Constants';
import OrganizationReducer from './Reducers';
import addresses, { RINKEBY_ID } from '../../utility/addresses';
import { useContract } from '../../hooks';
import ParcelWallet from '../../abis/ParcelWallet.json';
import ParcelFactory from '../../abis/ParcelFactory.json';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

export const OrganizationContext = createContext<any>({ Organization: [] });

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  // const [parcelWalletAddress, dispatch] = useReducer(OrganizationReducer, []);

  const { account } = useWeb3React<Web3Provider>();
  const [parcelWalletAddress, setParcelWalletAddress] = useState('');

  // const createParcelWallet = (organization: any) => {
  //   dispatch({
  //     type: CREATE_PARCEL_WALLET,
  //     payload: organization,
  //   });
  // };

  const parcelFactoryContract = useContract(
    addresses[RINKEBY_ID].parcelFactory,
    ParcelFactory,
    true
  );

  let parcelOrgAddress;

  useEffect(() => {
    (async () => {
      if (parcelFactoryContract) {
        let parcelOrgAddress = await parcelFactoryContract.registered(account);
        setParcelWalletAddress(parcelOrgAddress);
      }
    })();
  }, [parcelFactoryContract, account]);

  return (
    <OrganizationContext.Provider value={{ parcelWalletAddress }}>
      {children}
    </OrganizationContext.Provider>
  );
};
