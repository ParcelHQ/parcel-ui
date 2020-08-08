import React, { useMemo, useState, useEffect, useContext } from 'react';
import parcel from 'parcel-sdk';
import DataTable from 'react-data-table-component';
import {
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Spinner,
} from 'reactstrap';
import { ArrowDown } from 'react-feather';
import BigNumber from 'big-number';
import styled from '@emotion/styled';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast, ToastContainer } from 'react-toastify';
import { useTokens } from '../../utility/tokens';

import Checkbox from '../../components/CheckBoxes';
import { EmployeeContext } from '../../state/employee/Context';
import '../../assets/scss/plugins/extensions/react-paginate.scss';
import '../../assets/scss/pages/data-list.scss';
import addresses, { RINKEBY_ID } from '../../utility/addresses';
import { useContract } from '../../hooks';
import ParcelWallet from '../../abis/ParcelWallet.json';
import { getSignature } from '../../utility';

const FlexWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const FlexButton = styled(Button)`
  margin: 0 5px;
`;

const Wrapper = styled.div`
  margin-top: 3rem;
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-evenly;
  margin: auto;
`;

export default function Table() {
  const { employees } = useContext(EmployeeContext);
  const [data, setData] = useState(employees);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [streamModal, setStreamModal] = useState(false);
  const [lengthOfStream, setLengthOfStream] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const tokens = useTokens();
  const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
  const DAI_ADDRESS = tokens[0][5].address;
  const USDC_ADDRESS = tokens[0][6].address;

  const parcelWalletContract = useContract(
    addresses[RINKEBY_ID].parcelWallet,
    ParcelWallet,
    true
  );

  useEffect(() => {
    setData(employees);

    return () => {};
  }, [employees]);

  useEffect(() => {
    (async () => {
      if (parcelWalletContract) {
        try {
          let people = await parcelWalletContract.files('2');

          if (people !== '') {
            let peopleFromIpfs = await parcel.ipfs.getData(people);

            let peopleDecrypted = parcel.cryptoUtils.decryptData(
              peopleFromIpfs,
              getSignature()
            );

            peopleDecrypted = JSON.parse(peopleDecrypted);
            setData(peopleDecrypted);
          } else {
            console.log(`Zero Employees registered yet!`);
          }
        } catch (error) {}
      }
    })();
  }, [parcelWalletContract]);

  const columns = useMemo(
    () => [
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        minWidth: '150px',
        cell: (row: any) => (
          <p title={row.name} className="text-truncate text-bold-500 mb-0">
            {row.name}
          </p>
        ),
      },
      {
        name: 'Address / ENS',
        selector: 'address',
        sortable: true,
      },
      {
        name: 'Currency',
        selector: 'salaryCurrency',
        sortable: true,
      },
      {
        name: 'Salary',
        selector: 'salary',
        sortable: true,
      },
    ],
    []
  );

  async function massPayout() {
    if (!selectedRow) {
      return;
    }
    if (parcelWalletContract) {
      //! CURRENCY TO SEND WITH

      //! TOKENS_REQUESTED
      let TOKENS_REQUESTED: any[] = [];
      selectedRow.forEach((employee: any) => {
        switch (employee.salaryCurrency) {
          case 'DAI':
            TOKENS_REQUESTED.push(DAI_ADDRESS);
            break;
          case 'ETH':
            TOKENS_REQUESTED.push(ETH_ADDRESS);
            break;
          case 'USDC':
            TOKENS_REQUESTED.push(USDC_ADDRESS);
            break;

          default:
            return;
        }
      });

      //! EMPLOYEE_ADDRESSES
      let EMPLOYEE_ADDRESSES: any[] = [];
      selectedRow.forEach((employee: any) => {
        EMPLOYEE_ADDRESSES.push(employee.address);
      });

      //! VALUES_TO_SEND
      let VALUES_TO_SEND: any[] = [];
      selectedRow.forEach((employee: any) => {
        const AMOUNT = employee.salary;
        switch (employee.salaryCurrency) {
          case 'DAI':
            VALUES_TO_SEND.push((AMOUNT * 1e18).toString());
            break;
          case 'USDC':
            VALUES_TO_SEND.push((AMOUNT * 1e6).toString());
            break;

          default:
            return;
        }
      });

      await parcelWalletContract.massPayout(
        DAI_ADDRESS,
        TOKENS_REQUESTED,
        EMPLOYEE_ADDRESSES,
        VALUES_TO_SEND
      );
      TOKENS_REQUESTED = [];
      EMPLOYEE_ADDRESSES = [];
    }
  }

  async function stream() {
    if (!selectedRow) {
      return;
    }

    if (parcelWalletContract && lengthOfStream) {
      try {
        setIsLoading(true);
        toast('Stream Initiated');

        // let STREAM_LENGTH_IN_SECONDS = lengthOfStream * 3600;
        let STREAM_LENGTH_IN_SECONDS = 60;

        let RECEIPIENTS: string[] = [];
        selectedRow.forEach((employee: any) => {
          RECEIPIENTS.push(employee.address);
        });
        let TOKENS_TO_STREAM: string[] = [];
        selectedRow.forEach((employee: any) => {
          switch (employee.salaryCurrency) {
            case 'DAI':
              TOKENS_TO_STREAM.push(DAI_ADDRESS);
              break;
            case 'USDC':
              TOKENS_TO_STREAM.push(USDC_ADDRESS);
              break;

            default:
              return;
          }
        });

        let VALUES: string[] = [];
        selectedRow.forEach((employee: any) => {
          const AMOUNT = employee.salary;
          switch (employee.salaryCurrency) {
            case 'DAI':
              const SALARY_DAI = AMOUNT * 1e18;
              const MOD_DAI = BigNumber(SALARY_DAI).mod(
                STREAM_LENGTH_IN_SECONDS
              );
              const VALUE_DAI = BigNumber(SALARY_DAI).minus(MOD_DAI);
              VALUES.push(VALUE_DAI.toString());
              break;

            case 'USDC':
              const SALARARY_USDC = AMOUNT * 1e6;
              const MOD_USDC = BigNumber(SALARARY_USDC).mod(
                STREAM_LENGTH_IN_SECONDS
              );
              const VALUE_USDC = BigNumber(SALARARY_USDC).minus(MOD_USDC);
              VALUES.push(VALUE_USDC.toString());

              break;

            default:
              return;
          }
        });

        let STOP_TIME: string[] = [];
        for (let i = 0; i < selectedRow.length; i++) {
          STOP_TIME.push(STREAM_LENGTH_IN_SECONDS.toString());
        }

        const res = await parcelWalletContract.streamMoney(
          RECEIPIENTS,
          VALUES,
          TOKENS_TO_STREAM,
          STOP_TIME
        );
        await res.wait();
        // window.location.href = '/home';
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={'data-list list-view'}>
        <DataTable
          //@ts-ignore
          columns={columns}
          data={data}
          noHeader
          responsive
          pointerOnHover
          fixedHeader
          sortIcon={<ArrowDown />}
          selectableRows
          selectableRowsHighlight
          onSelectedRowsChange={(data) => setSelectedRow(data.selectedRows)}
          selectableRowsComponent={Checkbox}
          customStyles={{
            headRow: {
              style: {
                border: 'none',
              },
            },
            headCells: {
              style: {
                color: '#202124',
                fontSize: '14px',
              },
            },
            rows: {
              highlightOnHoverStyle: {
                backgroundColor: 'rgb(230, 244, 244)',
                borderBottomColor: '#FFFFFF',
                borderRadius: '25px',
                outline: '1px solid #FFFFFF',
              },
            },

            pagination: {
              style: {
                border: 'none',
              },
            },
          }}
        />
      </div>
      <Col sm="12">
        <FlexWrap>
          <FlexButton
            color="primary"
            disabled={!selectedRow.length}
            onClick={() => setStreamModal(!streamModal)}
          >
            Stream
          </FlexButton>

          <FlexButton
            color="primary"
            disabled={!selectedRow.length}
            outline
            onClick={() => massPayout()}
          >
            Pay
          </FlexButton>
        </FlexWrap>
      </Col>

      <Modal
        isOpen={streamModal}
        toggle={() => setStreamModal(!streamModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setStreamModal(!streamModal)}>
          Begin Stream
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <Wrapper>
              <Spinner type="grow" color="primary" size="lg" />
            </Wrapper>
          ) : (
            <FormGroup>
              <Label for="stream">Hours to Stream</Label>
              <Input
                min={0}
                max={100}
                id="stream"
                placeholder={'5'}
                type="number"
                value={lengthOfStream}
                onChange={(e: any) => setLengthOfStream(e.target.value)}
              />
            </FormGroup>
          )}
        </ModalBody>
        {!isLoading && (
          <ModalFooter>
            <Button
              color="primary"
              outline
              onClick={() => setStreamModal(!streamModal)}
            >
              Canel
            </Button>
            <Button color="primary" onClick={() => stream()}>
              Stream
            </Button>
          </ModalFooter>
        )}
      </Modal>
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
    </>
  );
}
