import React, { createContext, ReactNode, useReducer } from 'react';
import { Contract } from '@ethersproject/contracts';

import ParcelFactory from '../../abis/ParcelFactory.json';
import { ContractReducer } from './Reducers';

const PARCEL_FACTORY_ADDRESS = '0x1C48cA86248C6B60545BCBb412341D638F62AdE0';

const ParcelFactoryContract = new Contract(
  PARCEL_FACTORY_ADDRESS,
  ParcelFactory
);

const initialContractState: any = [];

initialContractState.push(ParcelFactoryContract);

export const ContractContext = createContext<{
  contracts: any;
  dispatch: any;
}>({ contracts: initialContractState, dispatch: ContractReducer });

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [contracts, dispatch] = useReducer(
    ContractReducer,
    initialContractState
  );

  return (
    <ContractContext.Provider value={{ contracts, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};
