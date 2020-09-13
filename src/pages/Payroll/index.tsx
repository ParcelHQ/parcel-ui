// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Row, Col, CustomInput } from 'reactstrap';
import Web3 from "web3";
import Biconomy from "@biconomy/mexa";
import parcel from 'parcel-sdk';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Spinner,
} from 'reactstrap';
import { Plus, X } from 'react-feather';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from '@emotion/styled';

import { getSignature } from '../../utility';
import Breadcrumbs from '../../components/BreadCrumbs';
import addresses, { RINKEBY_ID } from '../../utility/addresses';
import { useContract } from '../../hooks';
import ParcelWallet from '../../abis/ParcelWallet.json';
import MaticContract from '../../abis/MaticWallet.json';
import Table from './Table';

const DepartmentOptions = styled(FormGroup)`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const maticProvider = 'https://rpc-mainnet.matic.network'
const biconomy = new Biconomy( new Web3.providers.HttpProvider(maticProvider), {apiKey: "66bnKyNof.e2988528-bd71-4547-87f8-afc769431f1e" , debug : true});


let web3;
let getWeb3 : any;
let contract : any;
let domainData = {
  name: "parcel",
  version: "1",
  chainId: "4",  // Rinkeby
  verifyingContract: addresses[RINKEBY_ID].maticWallet
};
const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" }
];

const metaTransactionType = [
  { name: "holder", type: "address" },
  { name: "nonce", type: "uint256" }
];

export default function Payroll() {
  const parcelWalletContract = useContract(
    addresses[RINKEBY_ID].parcelWallet,
    ParcelWallet,
    true
  );
  const [options, setOptions] = useState<any>(['']);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [addDepartmentModal, setAddDepartmentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([{ title: '' }]);

  useEffect(() => {
    (async () => {
      if (MaticContract) {
        try {

          const provider = window["ethereum"];
          await provider.enable();
           web3 = new Web3(provider);
          getWeb3 = new Web3(biconomy);
          biconomy.onEvent(biconomy.READY, async () => {

            // Initialize your dapp here like getting user accounts etc
            console.log("inside biconomy object")
            contract = new getWeb3.eth.Contract(MaticContract, addresses[RINKEBY_ID].maticWallet);

            let files = await contract.methods.files(window.ethereum.selectedAddress,'1').call();
            console.log("files ", files)

            let filesFromIpfs = await parcel.ipfs.getData(files);
            let filesDecrypted = parcel.cryptoUtils.decryptData(
              filesFromIpfs,
              getSignature()
            );

            console.log("filesDecrypted ", filesDecrypted)

            if (filesDecrypted) {
              filesDecrypted = JSON.parse(filesDecrypted);

              let newOutcomes = [];
              for (let i = 0; i < filesDecrypted.length; i++) {
                newOutcomes.push(filesDecrypted[i]);
              }
              setOptions(newOutcomes);
            }



          }).onEvent(biconomy.ERROR, (error : any, message : any) => {
            // Handle error while initializing mexa
            console.log(error,message)
          });

        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [MaticContract]);

  async function createDepartments() {
    setLoading(true);
    if (parcelWalletContract) {
      toast('Department(s) Submitted');
      try {
        console.log(contract)

        let nonce = await contract.methods.nonces(window.ethereum.selectedAddress).call();

    let message = {

      holder : window.ethereum.selectedAddress,
      nonce : parseInt(nonce)
    };

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message
    });


    window.web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",

        params: [window.ethereum.selectedAddress, dataToSign]
      },
      async function (err : any, result: any) {
        if (err) {
          return console.error(err);
        }
        const signature = result.result.substring(2);
        const r = "0x" + signature.substring(0, 64);
        const s = "0x" + signature.substring(64, 128);
        const v = parseInt(signature.substring(128, 130), 16);
        console.log(r, "r")
        console.log(s, "s")
        console.log(v, "v")

        console.log(window.ethereum.selectedAddress, "userAddress")
        console.log(nonce)


        const sig = {
          r:r,
          s:s,
          v:v
        }

      console.log(JSON.stringify(sig))
      console.log("departments", departments)
      let newDepartments : any = [];


      for (let i = 0; i < departments.length; i++) {
        newDepartments.push(departments[i].title);
      }


      let encryptedDepartmentData = parcel.cryptoUtils.encryptData(
        JSON.stringify(newDepartments),
        getSignature()
      );

      console.log(`encryptedDepartmentData ${encryptedDepartmentData}`)


      let departmentHash = await parcel.ipfs.addData(
        encryptedDepartmentData
      );

      console.log(`Departments IPFS hash: ${departmentHash.string}`);

      let promiEvent = contract.methods

          .addFile(window.ethereum.selectedAddress, sig ,"1", departmentHash.string)
          .send({

            from: window.ethereum.selectedAddress
          });
        promiEvent.on("transactionHash", (hash : any) => {
          toast.info("Transaction sent successfully. Check Console for Transaction hash");
          // showInfoMessage("Transaction sent successfully. Check Console for Transaction hash")
          console.log("Transaction Hash is ", hash )
        }).once("confirmation", (confirmationNumber : any, receipt: any) => {
          if (receipt.status) {
            toast.success("Transaction confirmed successfully");
          } else {
          }
          console.log(receipt)
        })
      }
    );
      //   let getDepartments = await parcelWalletContract!.files('1');
      //
      //   if (getDepartments !== '') {
      //     let departmentsFromIpfs = await parcel.ipfs.getData(getDepartments);
      //
      //     let departmentsDecrypted = parcel.cryptoUtils.decryptData(
      //       departmentsFromIpfs,
      //       getSignature()
      //     );
      //     departmentsDecrypted = JSON.parse(departmentsDecrypted);
      //
      //     let newDepartments: any[] = [];
      //     departments.forEach((department: any) => {
      //       newDepartments.push(department.title);
      //     });
      //
      //     departmentsDecrypted = departmentsDecrypted.concat(newDepartments);
      //
      //     let encryptedDepartmentData = parcel.cryptoUtils.encryptData(
      //       JSON.stringify(departmentsDecrypted),
      //
      //       getSignature()
      //     );
      //
      //     let departmentHash = await parcel.ipfs.addData(
      //       encryptedDepartmentData
      //     );
      //
      //     let result = await parcelWalletContract!.addFile(
      //       '1',
      //       departmentHash.string
      //     );
      //
      //     await result.wait();
      //     window.location.href = '';
      //   } else {
      //     let newDepartments = [];
      //
      //     for (let i = 0; i < departments.length; i++) {
      //       newDepartments.push(departments[i].title);
      //     }
      //
      //     let encryptedDepartmentData = parcel.cryptoUtils.encryptData(
      //       JSON.stringify(newDepartments),
      //       getSignature()
      //     );
      //
      //     let departmentHash = await parcel.ipfs.addData(
      //       encryptedDepartmentData
      //     );
      //
      //     let result = await parcelWalletContract!.addFile(
      //       '1',
      //       departmentHash.string
      //     );
      //
      //     await result.wait();
      //     window.location.href = '';
      //   }
      //   setDepartments([{ title: '' }]);
      // } catch (error) {
      //   console.error(error);
      // }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    setAddDepartmentModal(false);
  }
 }

  const handleAddFields = () => {
    const values = [...departments];
    values.push({ title: '' });
    setDepartments(values);
  };

  const handleRemoveFields = (index: any) => {
    const values = [...departments];
    values.splice(index, 1);
    setDepartments(values);
  };

  const handleInputChange = (index: any, event: any) => {
    const values = [...departments];
    values[index].title = event.target.value;
    setDepartments(values);
  };

  return (
    <>
      <Breadcrumbs breadCrumbTitle="Payroll" breadCrumbActive="Payroll" />
      <Row>
        <Col sm="12">
          <Button
            className="add-new-btn mr-1"
            color="primary"
            onClick={() => setAddDepartmentModal(true)}
          >
            <Plus size={15} />{' '}
            <span className="align-middle">Add Department</span>
          </Button>
          <CustomInput
            type="select"
            name="select"
            id="selectDepartment"
            value={selectedDepartment}
            aria-label="Select a department"
            onChange={(e: any) => setSelectedDepartment(e.target.value)}
            style={{ width: '200px' }}
          >
            {options.map((option: any) => (
              <option key={uuidv4()} value={option} aria-label={option}>
                {option}
              </option>
            ))}
          </CustomInput>
        </Col>

        <Col sm="12">{options ? <Table /> : <h1>No departments</h1>}</Col>
      </Row>
      <Modal
        isOpen={addDepartmentModal}
        toggle={() => setAddDepartmentModal(!addDepartmentModal)}
        centered
      >
        <ModalHeader toggle={() => setAddDepartmentModal(!addDepartmentModal)}>
          Add Department
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Spinner type="grow" size="lg" color="primary" />
            </div>
          ) : (
            <>
              {departments.map((department, index) => (
                <DepartmentOptions key={`${department}~${index}`}>
                  <Label for="department">Department</Label>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Input
                      type="text"
                      id="department"
                      name="department"
                      required
                      placeholder={'i.e. Marketing'}
                      value={department.title}
                      onChange={(event) => handleInputChange(index, event)}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        type="button"
                        onClick={() => handleRemoveFields(index)}
                        disabled={departments.length === 1}
                        style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
                      >
                        <X size={15} />
                      </Button>

                      {departments.length < 4 && (
                        <Button
                          type="button"
                          onClick={() => handleAddFields()}
                          style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
                        >
                          <Plus size={15} />
                        </Button>
                      )}
                    </div>
                  </div>
                </DepartmentOptions>
              ))}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setAddDepartmentModal(!addDepartmentModal)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            color="primary"
            onClick={() => createDepartments()}
          >
            Create
          </Button>
        </ModalFooter>
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
