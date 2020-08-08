import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowUp, ArrowDown } from 'react-feather';
import { Progress } from 'reactstrap';
import styled from '@emotion/styled';
import { v4 as uuid } from 'uuid';
import Skeleton from 'react-loading-skeleton';

import { useTokens } from '../../../utility/tokens';
import { shortenAddress } from '../../../utility';
import { ReactComponent as DAILogo } from '../../../assets/currency/dai.svg';
import { ReactComponent as USDCLogo } from '../../../assets/currency/usdc.svg';

const List = styled.ul`
  padding: 0;
  list-style-type: none;
  margin-bottom: 0rem;
`;

const ListElement = styled.li``;

const NumericData = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const LeftDiv = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Address = styled.p`
  margin-bottom: 0.5rem;
`;

const Percentage = styled.h4``;

const RightDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const AmountAndCurrency = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Amount = styled.span`
  vertical-align: top;
  margin-right: 1rem;
`;

const Rate = styled.span`
  color: lightgray;
`;

const PageNumbers = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
`;

const PageNumber = styled.li<{ active: boolean }>`
  margin-right: 0.3rem;
  user-select: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  &:hover {
    font-weight: bolder;
  }
`;

const EmployeeList = ({ employeeStreams }: any) => {
  const STREAMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStreams, setCurrentStreams] = useState<any>();
  const [pageNumbers, setPageNumbers] = useState<any>();

  const tokens = useTokens();
  const DAI_ADDRESS = tokens[0][5].address;
  const USDC_ADDRESS = tokens[0][6].address;

  useEffect(() => {
    if (employeeStreams) {
      const indexOfLastStream = currentPage * STREAMS_PER_PAGE;
      const indexOfFirstStream = indexOfLastStream - STREAMS_PER_PAGE;
      const currentStreams = employeeStreams.slice(
        indexOfFirstStream,
        indexOfLastStream
      );

      setCurrentStreams(currentStreams);
    }
  }, [employeeStreams, currentPage]);

  useEffect(() => {
    if (employeeStreams) {
      const pageNumbers = [];
      for (
        let i = 1;
        i <= Math.ceil(employeeStreams.length / STREAMS_PER_PAGE);
        i++
      ) {
        pageNumbers.push(i);
      }
      setPageNumbers(pageNumbers);
    }
  }, [employeeStreams, currentStreams]);

  const handleClick = (event: any) => {
    event.preventDefault();
    setCurrentPage(Number(event.target.id));
  };

  return (
    <>
      <List>
        {currentStreams && currentStreams.length !== 0 ? (
          currentStreams.map((employee: any) => {
            const totalAmountToStream = employee.salary;
            const currency = employee.currencySalary;
            const address = employee.address;
            const streamRate = employee.rate;
            let percentage = employee.percentage;
            if (percentage >= 100) {
              percentage = 100;
            }

            return (
              <ListElement key={uuid()}>
                <NumericData>
                  <LeftDiv>
                    <Address>{address ? shortenAddress(address) : '-'}</Address>
                    <Percentage>
                      {percentage ? `${percentage} %` : '-'}
                    </Percentage>
                  </LeftDiv>
                  <RightDiv>
                    <AmountAndCurrency>
                      <Amount>
                        {totalAmountToStream ? totalAmountToStream : '-'}
                      </Amount>
                      {currency && currency === DAI_ADDRESS ? (
                        <DAILogo
                          style={{
                            height: '1.5rem',
                            marginBottom: '0.1rem',
                          }}
                        />
                      ) : currency && currency === USDC_ADDRESS ? (
                        <USDCLogo
                          style={{ height: '1.5rem', marginBottom: '0.1rem' }}
                        />
                      ) : (
                        '-'
                      )}
                    </AmountAndCurrency>
                    <Rate>
                      {streamRate ? `${streamRate.toFixed(5)} / SEC` : '-'}
                    </Rate>
                  </RightDiv>
                </NumericData>
                <Progress className="mb-2" value={percentage} />
              </ListElement>
            );
          })
        ) : (
          <>
            <ListElement key={uuid()}>
              <NumericData>
                <LeftDiv>
                  <Address>0x0</Address>
                  <Percentage>100</Percentage>
                </LeftDiv>
                <RightDiv>
                  <AmountAndCurrency>
                    <Amount>1</Amount>$
                  </AmountAndCurrency>
                  <Rate>1.00 / SEC</Rate>
                </RightDiv>
              </NumericData>
              <Progress className="mb-2" value={100} />
            </ListElement>
            <ListElement key={uuid()}>
              <NumericData>
                <LeftDiv>
                  <Address>0x0</Address>
                  <Percentage>100</Percentage>
                </LeftDiv>
                <RightDiv>
                  <AmountAndCurrency>
                    <Amount>1</Amount>$
                  </AmountAndCurrency>
                  <Rate>1.00 / SEC</Rate>
                </RightDiv>
              </NumericData>
              <Progress className="mb-2" value={100} />
            </ListElement>
            <ListElement key={uuid()}>
              <NumericData>
                <LeftDiv>
                  <Address>0x0</Address>
                  <Percentage>100</Percentage>
                </LeftDiv>
                <RightDiv>
                  <AmountAndCurrency>
                    <Amount>1</Amount> $
                  </AmountAndCurrency>
                  <Rate>1.00 / SEC</Rate>
                </RightDiv>
              </NumericData>
              <Progress className="mb-2" value={100} />
            </ListElement>
            <ListElement key={uuid()}>
              <NumericData>
                <LeftDiv>
                  <Address>0x0</Address>
                  <Percentage>100</Percentage>
                </LeftDiv>
                <RightDiv>
                  <AmountAndCurrency>
                    <Amount>1</Amount> $
                  </AmountAndCurrency>
                  <Rate>1.00 / SEC</Rate>
                </RightDiv>
              </NumericData>
              <Progress className="mb-2" value={100} />
            </ListElement>
          </>
        )}
        {/* <div style={{ height: '5rem' }}>
          <Skeleton count={3} />
        </div> */}
      </List>
      <PageNumbers>
        {pageNumbers &&
          pageNumbers.map((number: any) => {
            return (
              <PageNumber
                key={number}
                //@ts-ignore
                id={number}
                onClick={(e: any) => handleClick(e)}
                active={number === currentPage}
              >
                {number}
              </PageNumber>
            );
          })}
      </PageNumbers>
    </>
  );
};

export default EmployeeList;
