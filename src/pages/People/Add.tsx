import React, { useState, Fragment } from 'react';
import {
  Label,
  Input,
  FormGroup,
  Button,
  Form,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import styled from '@emotion/styled';
import parcel from 'parcel-sdk';
import Flatpickr from 'react-flatpickr';
import { X } from 'react-feather';
import 'flatpickr/dist/themes/light.css';

import { getSignature } from '../../utility';
import addresses, { RINKEBY_ID } from '../../utility/addresses';
import { useContract } from '../../hooks';
import ParcelWallet from '../../abis/ParcelWallet.json';
import '../../assets/scss/plugins/forms/flatpickr/flatpickr.scss';

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  margin-top: 3rem;
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-evenly;
  margin: auto;
`;

export default function Add({ areThereEmployees }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parcelWalletContract: any = useContract(
    addresses[RINKEBY_ID].parcelWallet,
    ParcelWallet,
    true
  );

  const [inputFields, setInputFields] = useState([
    {
      name: 'John Doe',
      address: '0x079B8FEee69fC6828e41dC10165e155757b6E7Ce',
      department: 'Engineering',
      salary: '10',
      salaryCurrency: 'DAI',
      date: null,
    },
  ]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      if (!areThereEmployees) {
        const encryptedPersonData = parcel.cryptoUtils.encryptData(
          JSON.stringify(inputFields),
          getSignature()
        );

        let personHash = await parcel.ipfs.addData(encryptedPersonData);

        let result = await parcelWalletContract.addFile('2', personHash.string);

        await result.wait();
        // window.location.href = '';
      } else {
        let people = await parcelWalletContract.files('2');
        let peopleFromIpfs = await parcel.ipfs.getData(people);

        let peopleDecrypted = parcel.cryptoUtils.decryptData(
          peopleFromIpfs,
          getSignature()
        );
        peopleDecrypted = JSON.parse(peopleDecrypted);
        peopleDecrypted = peopleDecrypted.concat(inputFields);
        const newEncryptedPersonData = parcel.cryptoUtils.encryptData(
          JSON.stringify(peopleDecrypted),
          getSignature()
        );

        let newPersonHash = await parcel.ipfs.addData(newEncryptedPersonData);

        let result = await parcelWalletContract.addFile(
          '2',
          newPersonHash.string
        );
        await result.wait();
        // window.location.href = '';
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({
      name: '',
      address: '',
      department: '',
      salary: '',
      salaryCurrency: '',
      date: null,
    });
    setInputFields(values);
  };

  const handleRemoveFields = (index: any) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleInputChange = (index: any, event: any) => {
    const values = [...inputFields];

    if (event.target.name === 'name') {
      values[index].name = event.target.value;
    } else if (event.target.name === 'address') {
      values[index].address = event.target.value;
    } else if (event.target.name === 'salary') {
      values[index].salary = event.target.value;
    } else if (event.target.name === 'salaryCurrency') {
      values[index].salaryCurrency = event.target.value;
    } else if (event.target.name === 'department') {
      values[index].department = event.target.value;
    }

    setInputFields(values);
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Row
        style={{
          marginBottom: '2rem',
          width: '100%',
        }}
      >
        {isSubmitting ? (
          <Wrapper>
            <Spinner type="grow" color="primary" size="lg" />
          </Wrapper>
        ) : (
          <>
            {inputFields.map((inputField, index) => (
              <Fragment key={`${inputField}~${index}`}>
                <Col lg="4" md="6" sm="12">
                  <FormGroup>
                    <Label for="data-name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="data-name"
                      required
                      placeholder="John Smith"
                      value={inputField.name}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </FormGroup>
                </Col>
                <Col lg="4" md="6" sm="12">
                  <FormGroup>
                    <Label for="address">Address / ENS</Label>
                    <Input
                      type="text"
                      name="address"
                      id="address"
                      required
                      placeholder="0x1d9999be880e7e516dEefdA00a3919BdDE9C1707"
                      value={inputField.address}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </FormGroup>
                </Col>
                <Col lg="4" md="6" sm="12">
                  <FormGroup>
                    <Label for="department">Department</Label>
                    <Input
                      type="select"
                      id="department"
                      name="department"
                      required
                      value={inputField.department}
                      aria-label="Select a department"
                      onChange={(e) => handleInputChange(index, e)}
                    >
                      <option disabled value="">
                        -
                      </option>
                      <option value="Engineering">Engineering</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="HR">HR</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg="4" md="6" sm="12">
                  <FormGroup>
                    <Label for="salary">Salary</Label>
                    <Input
                      type="text"
                      id="salary"
                      name="salary"
                      required
                      placeholder="100"
                      value={inputField.salary}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </FormGroup>
                </Col>
                <Col lg="4" md="6" sm="12">
                  <FormGroup>
                    <Label for="salaryCurrency">Currency</Label>
                    <Input
                      type="select"
                      id="salaryCurrency"
                      name="salaryCurrency"
                      placeholder="ETH"
                      required
                      value={inputField.salaryCurrency}
                      onChange={(e) => handleInputChange(index, e)}
                    >
                      <option disabled value="">
                        -
                      </option>
                      <option value="ETH">ETH</option>
                      <option value="DAI">DAI</option>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg="4" md="6" sm="12">
                  <FlexWrapper>
                    <FormGroup style={{ width: '75%' }}>
                      <Label htmlFor="date">Date</Label>
                      <Flatpickr
                        //@ts-ignore
                        value={inputField.date}
                        className="form-control"
                        options={{
                          mode: 'range',
                          altFormat: 'F j, Y',
                          dateFormat: 'Y-m-d',
                        }}
                      />
                    </FormGroup>
                    <Button
                      style={{ padding: '0.5rem', margin: 'auto' }}
                      type="button"
                      disabled={inputFields.length === 1}
                      onClick={() => handleRemoveFields(index)}
                    >
                      <X />
                    </Button>
                  </FlexWrapper>
                </Col>
              </Fragment>
            ))}
          </>
        )}
      </Row>
      {!isSubmitting && (
        <Row>
          <Col sm="12">
            <FormGroup className="form-label-group">
              <Button
                color="primary"
                outline
                className="mr-1 mb-1"
                type="button"
                disabled={inputFields.length === 5}
                onClick={() => handleAddFields()}
              >
                Add Another
              </Button>
              <Button color="primary" type="submit" className="mb-1">
                Submit
              </Button>
            </FormGroup>
          </Col>
        </Row>
      )}
    </Form>
  );
}
