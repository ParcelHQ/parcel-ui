import React, { useState } from 'react';
import { Card, CardBody, Form } from 'reactstrap';
import { keccak256 } from '@ethersproject/keccak256';
import { toUtf8Bytes } from '@ethersproject/strings';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import namehash from 'eth-ens-namehash';
import styled from '@emotion/styled';
import { AddressZero } from '@ethersproject/constants';
import {
  Button,
  FormGroup,
  Label,
  Spinner,
  InputGroupAddon,
  InputGroup,
  Input,
  InputGroupText,
  FormFeedback,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast, ToastContainer } from 'react-toastify';

import addresses, { RINKEBY_ID } from '../../utility/addresses';
import { useContract } from '../../hooks';
import ParcelFactoryContract from '../../abis/ParcelFactory.json';

const Box = styled.div`
  display: flex;
  direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 1rem 0;
  font-size: 56px;
`;

const Description = styled.h1`
  margin: 1rem auto;
  font-size: 28px;
  @media (max-width: 768px) {
    width: 350px;
  }
`;

const StyledFormGroup = styled(FormGroup)`
  max-width: 300px;
  margin: 0 auto 1rem;
`;

export default function Create() {
  const { library, account } = useWeb3React<Web3Provider>();
  const parcelFactoryContract = useContract(
    addresses[RINKEBY_ID].parcelFactory,
    ParcelFactoryContract,
    true
  );

  const [ensName, setEnsName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const PARCEL_ID_HASH = namehash.hash('parcelid.eth');
  const [invalidState, setInvalidState] = useState(false);
  const [isNowRegistered, setIsNowRegistered] = useState(false);
  const [error, setError] = useState('');
  const [accountAlreadyRegistered, setAccountAlreadyRegistered] = useState(
    false
  );
  const [idAlreadyTaken, setIdAlreadyTaken] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmitting(true);

    if (ensName.length < 5) {
      setInvalidState(true);
      setError('Name must be at least 5 characters');
      setIsSubmitting(false);
      return;
    } else if (ensName.length > 20) {
      setInvalidState(true);
      setError('Name must be less than 20 characters');
      setIsSubmitting(false);
      return;
    }

    const nameHash = keccak256(toUtf8Bytes(ensName));
    const ensFullDomainHash = namehash.hash(ensName + '.parcelid.eth');

    if (!!library && !!account && !!parcelFactoryContract) {
      const isRegistered = await parcelFactoryContract.registered(account);
      if (isRegistered !== AddressZero) {
        setAccountAlreadyRegistered(true);
        setIsSubmitting(false);
        setEnsName('');
        return;
      } else {
        try {
          await library
            .getSigner(account)
            .signMessage(`sign your ${account} to create encryption key`)
            .then((signature: any) =>
              localStorage.setItem('SIGNATURE', signature)
            );

          const tx = await parcelFactoryContract.register(
            PARCEL_ID_HASH,
            nameHash,
            ensFullDomainHash,
            ensName + '.parcelid.eth'
          );

          toast('ID Submitted');
          await tx.wait();

          let parcelOrgAddress = await parcelFactoryContract.registered(
            account
          );

          localStorage.setItem('PARCEL_WALLET_ADDRESS', parcelOrgAddress);
          addresses[RINKEBY_ID].parcelWallet = parcelOrgAddress;

          setIsNowRegistered(true);
        } catch (error) {
          toast.error('Transaction Failed');
        }
      }
      setIsSubmitting(false);
    }
  }

  return (
    <Box>
      {isNowRegistered && <Redirect to="/home" />}

      <Card className="auth-card bg-transparent shadow-none rounded-0 mb-0 w-100">
        <CardBody className="text-center">
          <Title>Register a Name</Title>
          <Description>Create a Parcel ID</Description>

          {isSubmitting ? (
            <Spinner type="grow" color="primary" size="lg" />
          ) : (
            <Form onSubmit={handleSubmit}>
              <StyledFormGroup>
                <Label aria-labelledby="ensName" />
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="ethglobal"
                    id="validState"
                    name="validState"
                    value={ensName}
                    onChange={(e: any) => setEnsName(e.target.value)}
                    invalid={invalidState}
                    required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>@parcelid.eth</InputGroupText>
                  </InputGroupAddon>
                  <FormFeedback
                    style={{ position: 'absolute', marginTop: '3rem' }}
                  >
                    {error}
                  </FormFeedback>
                </InputGroup>
              </StyledFormGroup>

              <Button
                className="my-1"
                type="submit"
                color="primary"
                disabled={isSubmitting}
                style={{
                  padding: '12px 16px',
                }}
              >
                Create
              </Button>
            </Form>
          )}
        </CardBody>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <SweetAlert
        title="Account already registered"
        show={accountAlreadyRegistered}
        onConfirm={() => setAccountAlreadyRegistered(false)}
      >
        <p className="sweet-alert-text">
          Account already has an associated Parcel ID
        </p>
      </SweetAlert>

      <SweetAlert
        title="Name already taken"
        show={idAlreadyTaken}
        onConfirm={() => setIdAlreadyTaken(false)}
      >
        <p className="sweet-alert-text">
          Please enter in a new name and try again
        </p>
      </SweetAlert>
    </Box>
  );
}
