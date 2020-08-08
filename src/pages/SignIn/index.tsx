// import React from 'react';
// import { CardBody } from 'reactstrap';
// import * as Icons from 'react-feather';
// import { useWeb3React } from '@web3-react/core';
// import { Web3Provider } from '@ethersproject/providers';
// import styled from '@emotion/styled';
// import { useHistory } from 'react-router-dom';
// import { useContract } from '../../hooks';
// import addresses, { RINKEBY_ID } from '../../utility/addresses';
// import ParcelFactoryContract from '../../abis/ParcelFactory.json';
// import { AddressZero } from '@ethersproject/constants';
// import Logo from '../../assets/img/logo/logoPng.png';

// const Box = styled.div`
//   display: flex;
//   direction: column;
//   justify-content: center;
//   align-items: center;
// `;

// const ButtonWrapper = styled.div`
//   margin-top: 3rem;
//   display: flex;
//   justify-content: space-evenly;
//   flex-wrap: wrap;
//   max-width: 640px;
//   margin: auto;
//   width: 50%;
// `;

// const StyledButton = styled.button<{ disabled: boolean }>`
//   height: 96px;
//   width: auto;
//   background: white;
//   color: #484848;
//   border: 1px solid #d3d3d3;
//   border-radius: 6px;
//   text-align: center;
//   width: 16rem;
//   box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
//   transition: all 0.3s ease 0s;
//   cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
//   &:hover {
//     border: ${({ disabled }) => !disabled && '1px solid #6f6be9'};
//     box-shadow: ${({ disabled }) =>
//       !disabled && '0px 15px 20px rgba(0, 0, 0, 0.3);'};
//     transform: ${({ disabled }) => !disabled && 'translateY(-5px)'};
//   }
// `;

// export default function Landing() {
//   const { active, account } = useWeb3React<Web3Provider>();
//   let history = useHistory();

//   const parcelFactoryContract = useContract(
//     addresses[RINKEBY_ID].parcelFactory,
//     ParcelFactoryContract,
//     true
//   );

//   // async function checkStatus() {
//   //   if (parcelFactoryContract && account) {
//   //     let requester = await parcelFactoryContract.registered(account);
//   //     console.log('requester:', requester);
//   //     if (requester === !AddressZero) {
//   //       console.log('AddressZero:', AddressZero);
//   //       history.push('/dashboard');
//   //     }
//   //   } else {
//   //     return;
//   //   }
//   // }

//   return (
//     <Box>
//       <CardBody className="text-center">
//         <img
//           src={Logo}
//           alt="Parcel Logo"
//           className="img-fluid align-self-center"
//           style={{ height: '8rem' }}
//         />

//         <h1 className="font-large-3 my-1">
//           Welcome to <span style={{ color: '#6F6BE9' }}>Parcel</span>
//         </h1>
//         <h1 className="font-large-1 my-1">Manage Crypto Payroll Seamlessly</h1>
//         <ButtonWrapper>
//           <StyledButton
//             disabled={!active}
//             style={{ marginBottom: '1rem' }}
//             onClick={() => history.push('/employer')}
//           >
//             <Icons.UserPlus size={15} style={{ marginRight: '0.5rem' }} />
//             Sign in as Employer
//           </StyledButton>

//           <StyledButton
//             disabled={true}
//             onClick={() => history.push('/organizations')}
//           >
//             <Icons.Users size={15} style={{ marginRight: '0.5rem' }} />
//             Sign in as Employee
//           </StyledButton>
//         </ButtonWrapper>
//       </CardBody>
//     </Box>
//   );
// }

import React, { useState, useEffect } from 'react';
import { CardBody } from 'reactstrap';
import * as Icons from 'react-feather';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';
import { AddressZero } from '@ethersproject/constants';

import { useContract } from '../../hooks';
import addresses, { RINKEBY_ID } from '../../utility/addresses';
import ParcelFactoryContract from '../../abis/ParcelFactory.json';
import Logo from '../../assets/img/logo/logoPng.png';
import { Link } from 'react-router-dom';

const ParcelLogo = styled.img`
  height: 8rem;
`;

const Box = styled.div`
  display: flex;
  direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 1rem 0;
  font-size: 64px;
`;

const Description = styled.h1`
  margin: 1rem auto;
  font-size: 32px;
  @media (max-width: 768px) {
    width: 350px;
  }
`;

const ColoredSpan = styled.span`
  color: #6f6be9;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  max-width: 640px;
  margin: auto;
  width: 50%;
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
  height: 96px;
  width: auto;
  background: white;
  color: #484848;
  border: 1px solid #d3d3d3;
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

const ButtonContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

const ENSSpan = styled.span`
  font-weight: 600;
  margin-left: 0.3rem;
`;

export default function Landing() {
  const { account, library } = useWeb3React<Web3Provider>();
  let history = useHistory();
  const parcelFactoryContract = useContract(
    addresses[RINKEBY_ID].parcelFactory,
    ParcelFactoryContract,
    true
  );

  const [parcelOrgAddress, setParcelOrgAddress] = useState('');
  const [ENSName, setENSName] = useState('');

  useEffect(() => {
    (async () => {
      if (parcelFactoryContract && account && library) {
        let stale = false;

        const result = await parcelFactoryContract.registered(account);

        if (!stale && result !== AddressZero) {
          setParcelOrgAddress(result);
          let name = await library.lookupAddress(result);
          setENSName(name.slice(0, -13));
        }
        return (): void => {
          stale = true;
          setENSName('');
        };
      }
    })();

    return () => {};
  }, [parcelFactoryContract, account, library]);

  function login() {
    try {
      localStorage.setItem('PARCEL_WALLET_ADDRESS', parcelOrgAddress);
      history.push('/home');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box>
      <CardBody>
        <ParcelLogo src={Logo} alt="Parcel Logo" />

        <Title>
          Welcome to <ColoredSpan>Parcel</ColoredSpan>
        </Title>
        <Description>Manage Crypto Payroll Seamlessly</Description>
        <ButtonWrapper>
          <Link to="/create">
            <StyledButton style={{ marginBottom: '1rem' }}>
              <ButtonContent>
                <Icons.PlusCircle size={15} style={{ marginRight: '0.5rem' }} />
                Create an Organization
              </ButtonContent>
            </StyledButton>
          </Link>

          <StyledButton disabled={ENSName === ''} onClick={() => login()}>
            <ButtonContent>
              <Icons.Search size={15} style={{ marginRight: '0.5rem' }} />
              Login <ENSSpan>{`${ENSName}`}</ENSSpan>
            </ButtonContent>
          </StyledButton>
        </ButtonWrapper>
      </CardBody>
    </Box>
  );
}
