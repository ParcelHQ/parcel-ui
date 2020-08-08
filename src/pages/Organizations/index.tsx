import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Row, Label, Col, FormGroup } from 'reactstrap';
import Select from 'react-select';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import addresses, { RINKEBY_ID } from '../../utility/addresses';
import { useContract } from '../../hooks';
import ParcelFactoryContract from '../../abis/ParcelFactory.json';

export default function Organizations() {
  const { account } = useWeb3React<Web3Provider>();
  const parcelFactoryContract = useContract(
    addresses[RINKEBY_ID].parcelFactory,
    ParcelFactoryContract,
    true
  );
  const [selectedOption, setSelectedOption] = useState([]);
  const [organizationOptions, setOrganizationOptions] = useState<any>([]);

  useEffect(() => {
    (async () => {
      if (parcelFactoryContract && account) {
        let address = await parcelFactoryContract.registered(account);

        let options = [
          { value: 'ocean', label: 'Ocean' },
          { value: 'blue', label: 'Blue' },
        ];

        setOrganizationOptions(options);
      }
    })();

    return () => {};
  }, [parcelFactoryContract, account]);

  function selected() {
    try {
      // history.push('/home');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Row className="m-0">
      <Col sm="12">
        <Card className="auth-card bg-transparent shadow-none rounded-0 mb-0 w-100">
          <CardBody className="text-center">
            <h1 className="font-large-3 my-1">Your Organizations</h1>
            <h1 className="font-large-1 my-1">
              Search through your currently existing orgs
            </h1>
            <FormGroup style={{ width: '50%', margin: 'auto' }}>
              <Label for="organizations" aria-labelledby="organizations" />

              <Select
                id="organizations"
                className="React"
                classNamePrefix="select"
                defaultValue={organizationOptions[0]}
                name="organizations"
                options={organizationOptions}
                isClearable={true}
                onChange={(selectedOptions: any) =>
                  setSelectedOption(selectedOptions)
                }
              />
            </FormGroup>
            <Button
              className="my-1"
              type="submit"
              color="primary"
              onClick={() => selected()}
            >
              Go
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
