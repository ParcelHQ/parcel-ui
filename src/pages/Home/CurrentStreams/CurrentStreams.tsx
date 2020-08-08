import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Progress,
  Row,
  Col,
} from 'reactstrap';
import parcel from 'parcel-sdk';
import BigNumber from 'big-number';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { useTokens } from '../../../utility/tokens';
import EmployeeList from './EmployeeList';
import { getSignature } from '../../../utility';
import { shortenAddress } from '../../../utility';
import addresses, { RINKEBY_ID } from '../../../utility/addresses';
import { useContract } from '../../../hooks';
import Sablier from '../../../abis/Sablier.json';
import ParcelWallet from '../../../abis/ParcelWallet.json';
import RadialChart from './RadialChart';

export default function ProductOrders() {
  const SablierContract = useContract(
    addresses[RINKEBY_ID].sablier,
    Sablier,
    true
  );
  const parcelWalletContract = useContract(
    addresses[RINKEBY_ID].parcelWallet,
    ParcelWallet
  );
  const [employeeStreams, setEmployeeStreams] = useState<any>();
  const [streamIds, setStreamIds] = useState<any>();
  const [totalCumulativeStream, setTotalCumulativeStream] = useState(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [series, setSeries] = useState([50, 1]); //actual data points used in graph
  const tokens = useTokens();
  const DAI_ADDRESS = tokens[0][5].address;
  const USDC_ADDRESS = tokens[0][6].address;

  useEffect(() => {
    (async () => {
      if (parcelWalletContract) {
        try {
          const streamIds = await parcelWalletContract.getStreamIds();

          setStreamIds(streamIds);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [parcelWalletContract]);

  function getStreamingObject(result: any) {
    let StreamObject = {
      address: '',
      percentage: 0,
      salary: 0,
      currencySalary: '',
      rate: 0,
    };
    StreamObject.address = result.employee;
    StreamObject.currencySalary = result.tokenAddress;
    let divisor: number;
    if (result.tokenAddress === DAI_ADDRESS) divisor = 1e18;
    else if (result.tokenAddress === USDC_ADDRESS) divisor = 1e6;
    const rate = BigNumber(Number(result.rate));
    StreamObject.rate = Number(rate) / divisor!;
    const salary = Number(result.salary);
    StreamObject.salary = Math.ceil(salary / divisor!);

    const MATH_CEIL = BigNumber(Math.ceil(Date.now() / 1000));

    const newStartTime = Number(result.startTime);

    const RES = MATH_CEIL - newStartTime;

    let MULT_RESULT = BigNumber(RES).mult(rate);
    // console.log('MULT_RESULT:', MULT_RESULT.toString()); //divisor

    let percentage = Number(MULT_RESULT.toString()) / salary;

    let percentageString = percentage.toFixed(2);
    percentage = Number(percentageString) * 100;
    percentage = parseInt(percentage.toString());
    StreamObject.percentage = percentage;
    if (percentage > 100 ) {
        StreamObject.percentage = 100;
    }
    return StreamObject;
  }

  useEffect(() => {
    (async () => {
      if (SablierContract && streamIds) {
        let TEMP_ARRAY: any[] = [];
        let totalPendingStreams = 0;
        let totalStreamed = 0;

        for await (const streamId of streamIds) {
          const result = await SablierContract.getSalary(streamId);
          const StreamObject = getStreamingObject(result);
          totalPendingStreams =
            totalPendingStreams +
            (StreamObject.percentage * StreamObject.salary) / 100;
          totalStreamed += StreamObject.salary;
          TEMP_ARRAY.push(StreamObject);
        }

        // console.log('totalPendingStreams ', totalPendingStreams);
        // console.log('totalPendingStreams ', Math.ceil(totalPendingStreams));
        // console.log('totalStreamed ', totalStreamed);
        let streamedPercentage = (totalPendingStreams / totalStreamed) * 100;
        let finalStreamedPercentage = streamedPercentage.toFixed(2);
        // console.log('finalStreamedPercentage:', finalStreamedPercentage);
        setSeries([Number(finalStreamedPercentage), 50]);
        setTotalCumulativeStream(totalStreamed);
        setEmployeeStreams(TEMP_ARRAY.reverse());
      }
    })();
  }, [streamIds, SablierContract]);

  useEffect(() => {
    (async () => {
      if (SablierContract) {
        const STREAMING = 50;
        const WITHDRAWN = 0;
        setSeries([STREAMING, WITHDRAWN]);
      }
    })();
  }, [SablierContract]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Streams</CardTitle>
        {/* <UncontrolledDropdown>
          <DropdownToggle tag="small" className="text-bold-500 cursor-pointer">
            All <ChevronDown size={10} />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>All</DropdownItem>
            <DropdownItem>Finance</DropdownItem>
            <DropdownItem>Engineering</DropdownItem>
            <DropdownItem>Marketing</DropdownItem>
            <DropdownItem>HR</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown> */}
      </CardHeader>
      <CardBody>
        <Row className="pb-50">
          <Col
            lg="6"
            xs="12"
            className="d-flex justify-content-between flex-column mt-lg-0 mt-2"
          >
            <RadialChart
              series={series}
              totalStreamValue={totalCumulativeStream}
            />
          </Col>
          <Col
            lg="6"
            xs="12"
            className="d-flex justify-content-between flex-column text-right"
          >
            <EmployeeList employeeStreams={employeeStreams} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
