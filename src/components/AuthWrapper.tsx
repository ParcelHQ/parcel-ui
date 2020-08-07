import React, { ReactNode } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Button } from 'reactstrap';

import { injected, portis } from '../utility/connectors';
import { useEagerConnect, useInactiveListener } from '../hooks';
import styled from '@emotion/styled';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  position: fixed;
  right: 20px;
`;

export default function AuthWrapper({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const { account, active, error, activate } = useWeb3React<Web3Provider>();

  return (
    <>
      {active && !error && !!account ? null : (
        <StyledButton
          onClick={() => activate(injected)}
          disabled={!triedEager || !!error}
        >
          Connect
        </StyledButton>
      )}

      {children}
    </>
  );
}
