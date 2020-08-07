import React, { createContext, ReactNode, useReducer, useEffect } from 'react';
import { CREATE_EMPLOYEE, DELETE_EMPLOYEE, UPDATE_EMPLOYEE } from './Constants';
import EmployeeReducer from './Reducers';
import addresses, { RINKEBY_ID } from '../../utility/addresses';
import { useContract } from '../../hooks';
import ParcelWallet from '../../abis/ParcelWallet.json';
import parcel from 'parcel-sdk';
import { getSignature } from '../../utility';

export const EmployeeContext = createContext<any>({ employees: [] });

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const parcelWalletContract = useContract(
    addresses[RINKEBY_ID].parcelWallet,
    ParcelWallet,
    true
  );

  let initState = [];

  useEffect(() => {
    (async () => {
      if (parcelWalletContract) {
        try {
          let people = await parcelWalletContract.files('2');

          let peopleFromIpfs = await parcel.ipfs.getData(people);

          let peopleDecrypted = parcel.cryptoUtils.decryptData(
            peopleFromIpfs,
            getSignature()
          );

          peopleDecrypted = JSON.parse(peopleDecrypted);
          initState.push(peopleDecrypted);
        } catch (error) {}
      }
    })();
  }, [parcelWalletContract]);

  const [employees, dispatch] = useReducer(EmployeeReducer, []);

  const createEmployee = (employees: any) => {
    dispatch({
      type: CREATE_EMPLOYEE,
      payload: employees,
    });
  };

  const deleteEmployee = (id: any) => {
    dispatch({
      type: DELETE_EMPLOYEE,
      payload: id,
    });
  };

  const updateEmployee = (employees: any) => {
    dispatch({
      type: UPDATE_EMPLOYEE,
      payload: employees,
    });
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, createEmployee, deleteEmployee, updateEmployee }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
