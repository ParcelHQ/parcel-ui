import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import IERC20 from '@uniswap/v2-core/build/IERC20.json';

import useContract from '../../hooks/useContract';
import { getParcelWalletAddress } from '../../utility/addresses';
import { useTokens } from '../../utility/tokens';
import StatisticsCard from '../../components/StatisticsCard';
import { ReactComponent as ETHLogo } from '../../assets/currency/eth.svg';
import { ReactComponent as DAILogo } from '../../assets/currency/dai.svg';
import { ReactComponent as USDCLogo } from '../../assets/currency/usdc.svg';
import { ReactComponent as USDTLogo } from '../../assets/currency/usdt.svg';

export default function StatisticsCards() {
  const tokens = useTokens();
  const daiContract = useContract(tokens[0][5].address, IERC20.abi);
  const usdcContract = useContract(tokens[0][6].address, IERC20.abi);

  const parcelWalletAddress = getParcelWalletAddress();

  const { account, library } = useWeb3React<Web3Provider>();
  const [ethBalance, setEthBalance] = useState<any>(0);
  const [daiBalance, setDaiBalance] = useState<any>(0);
  const [usdcBalance, setUsdcBalance] = useState<any>(0);
  // const [usdtBalance, setUsdtBalance] = useState<any>(0);

  useEffect(() => {
    let isStale = false;
    (async () => {
      if (account && !isStale) {
        if (library) {
          const balance = formatEther(
            await library.getBalance(parcelWalletAddress!)
          );
          setEthBalance(parseFloat(balance).toFixed(2));
        }

        if (daiContract) {
          const balance = formatEther(
            await daiContract.balanceOf(parcelWalletAddress)
          );
          setDaiBalance(parseFloat(balance).toFixed(2));
        }

        if (usdcContract) {
          let balance = await usdcContract.balanceOf(parcelWalletAddress);
          balance = balance / 1e6;
          balance = balance.toString();
          setUsdcBalance(parseFloat(balance).toFixed(2));
        }
      }
    })();

    return () => {
      isStale = true;
    };
  }, [account, library, parcelWalletAddress, daiContract, usdcContract]);

  return (
    <Row>
      <Col lg="3" xs="6">
        <StatisticsCard
          hideChart
          iconRight
          iconBg="primary"
          icon={<ETHLogo />}
          stat={ethBalance}
          statTitle="ETH"
        />
      </Col>
      <Col lg="3" xs="6">
        <StatisticsCard
          hideChart
          iconRight
          iconBg="primary"
          icon={<DAILogo style={{ height: '2.5rem', width: '2.5rem' }} />}
          stat={daiBalance}
          statTitle="DAI"
        />
      </Col>
      <Col lg="3" xs="6">
        <StatisticsCard
          hideChart
          iconRight
          iconBg="primary"
          icon={<USDCLogo />}
          stat={usdcBalance}
          statTitle="USDC"
        />
      </Col>
      <Col lg="3" xs="6">
        <StatisticsCard
          hideChart
          iconRight
          iconBg="primary"
          icon={<USDTLogo />}
          stat="0.00"
          statTitle="USDT"
        />
      </Col>
    </Row>
  );
}
