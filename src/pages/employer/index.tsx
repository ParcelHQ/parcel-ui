import React, { useState, useEffect } from 'react';
import { CardBody } from 'reactstrap';
import * as Icons from 'react-feather';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useHistory } from 'react-router-dom';
import { AddressZero } from '@ethersproject/constants';
import SweetAlert from 'react-bootstrap-sweetalert';
import styled from '@emotion/styled';

import addresses, { RINKEBY_ID } from '../../utility/addresses';
import { useContract } from '../../hooks';
import ParcelFactoryContract from '../../abis/ParcelFactory.json';
import Logo from '../../assets/img/logo/logoPng.png';

const Box = styled.div`
  display: flex;
  direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  max-width: 640px;
  margin: auto;
  width: 50%;
`;

const StyledButton = styled.button`
  height: 96px;
  width: auto;
  background: white;
  color: #484848;
  border: 2px solid #d3d3d3;
  border-radius: 6px;
  text-align: center;
  width: 16rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  &:hover {
    border: ${({ disabled }) => !disabled && '1px solid #6f6be9'};
    box-shadow: ${({ disabled }) =>
      !disabled && '0px 15px 20px rgba(0, 0, 0, 0.3);'};
    transform: ${({ disabled }) => !disabled && 'translateY(-5px)'};
  }
`;

export default function Employer(): JSX.Element {
  const { active, account } = useWeb3React<Web3Provider>();

  let history = useHistory();
  const parcelFactoryContract = useContract(
    addresses[RINKEBY_ID].parcelFactory,
    ParcelFactoryContract,
    true
  );

  const [accountAvailable, setAccountAvailable] = useState(false);
  const [parcelOrgAddress, setParcelOrgAddress] = useState('');
  const [noAccountAlert, setNoAccountAlert] = useState(false);

  useEffect(() => {
    (async () => {
      if (parcelFactoryContract && account) {
        let result = await parcelFactoryContract.registered(account);

        if (result !== AddressZero) {
          setAccountAvailable(true);
          setParcelOrgAddress(result);
        } else setAccountAvailable(false);
      }
    })();

    return () => {};
  }, [parcelFactoryContract, account]);

  function login() {
    try {
      if (!accountAvailable) setNoAccountAlert(true);
      else {
        localStorage.setItem('PARCEL_WALLET_ADDRESS', parcelOrgAddress);
        history.push('/home');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box>
      <CardBody className="text-center">
        <img
          src={Logo}
          alt="Parcel Logo"
          className="img-fluid align-self-center"
          style={{ height: '8rem' }}
        />

        <h1 className="font-large-3 my-1">
          Welcome to <span style={{ color: '#6F6BE9' }}>Parcel</span>
        </h1>
        <h1 className="font-large-1 my-1">Manage Crypto Payroll Seamlessly</h1>
        <ButtonWrapper>
          <Link to="/create">
            <StyledButton disabled={!active} style={{ marginBottom: '1rem' }}>
              <Icons.PlusCircle size={15} style={{ marginRight: '0.5rem' }} />
              Create an Organization
            </StyledButton>
          </Link>

          <StyledButton onClick={() => login()}>
            <Icons.Search size={15} style={{ marginRight: '0.5rem' }} />
            Open an Organization
          </StyledButton>
        </ButtonWrapper>
        <SweetAlert
          title="No Available Account"
          show={noAccountAlert}
          onConfirm={() => setNoAccountAlert(false)}
        >
          <p className="sweet-alert-text">Have you registered a Parcel ID?</p>
        </SweetAlert>
      </CardBody>
    </Box>
  );
}
