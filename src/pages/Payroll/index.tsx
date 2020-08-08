import React, { useEffect, useState } from 'react';
import { Row, Col, CustomInput } from 'reactstrap';
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
import Table from './Table';

const DepartmentOptions = styled(FormGroup)`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

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
      if (parcelWalletContract) {
        try {
          let files = await parcelWalletContract.files('1');

          let filesFromIpfs = await parcel.ipfs.getData(files);
          let filesDecrypted = parcel.cryptoUtils.decryptData(
            filesFromIpfs,
            getSignature()
          );

          if (filesDecrypted) {
            filesDecrypted = JSON.parse(filesDecrypted);

            let newOutcomes = [];
            for (let i = 0; i < filesDecrypted.length; i++) {
              newOutcomes.push(filesDecrypted[i]);
            }
            setOptions(newOutcomes);
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [parcelWalletContract]);

  async function createDepartments() {
    setLoading(true);
    if (parcelWalletContract) {
      toast('Department(s) Submitted');
      try {
        let getDepartments = await parcelWalletContract!.files('1');

        if (getDepartments !== '') {
          let departmentsFromIpfs = await parcel.ipfs.getData(getDepartments);

          let departmentsDecrypted = parcel.cryptoUtils.decryptData(
            departmentsFromIpfs,
            getSignature()
          );
          departmentsDecrypted = JSON.parse(departmentsDecrypted);

          let newDepartments: any[] = [];
          departments.forEach((department: any) => {
            newDepartments.push(department.title);
          });

          departmentsDecrypted = departmentsDecrypted.concat(newDepartments);

          let encryptedDepartmentData = parcel.cryptoUtils.encryptData(
            JSON.stringify(departmentsDecrypted),

            getSignature()
          );

          let departmentHash = await parcel.ipfs.addData(
            encryptedDepartmentData
          );

          let result = await parcelWalletContract!.addFile(
            '1',
            departmentHash.string
          );

          await result.wait();
          // window.location.href = '';
        } else {
          let newDepartments = [];

          for (let i = 0; i < departments.length; i++) {
            newDepartments.push(departments[i].title);
          }

          let encryptedDepartmentData = parcel.cryptoUtils.encryptData(
            JSON.stringify(newDepartments),
            getSignature()
          );

          let departmentHash = await parcel.ipfs.addData(
            encryptedDepartmentData
          );

          let result = await parcelWalletContract!.addFile(
            '1',
            departmentHash.string
          );

          await result.wait();
          // window.location.href = '';
        }
        setDepartments([{ title: '' }]);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
    setAddDepartmentModal(false);
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
