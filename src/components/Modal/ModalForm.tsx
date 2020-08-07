import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from 'classnames';
import { Eye, Code } from 'react-feather';
import { modalForm } from './ModalSourceCode';

export default function ModalForm() {
  const [activeTab, setActiveTab] = useState('1');
  const [modal, setModal] = useState(false);

  const toggleTab = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <div className="views">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === '1',
                  })}
                  onClick={() => toggleTab('1')}
                >
                  <Eye size={15} />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === '2',
                  })}
                  onClick={() => toggleTab('2')}
                >
                  <Code size={15} />
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </CardHeader>
        <CardBody>
          <h5>Login Form</h5>
          <p>Created Simple Login Form.</p>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Button color="success" outline onClick={() => setModal(!modal)}>
                Launch Modal
              </Button>
              <Modal
                isOpen={modal}
                toggle={() => setModal(!modal)}
                className="modal-dialog-centered"
              >
                <ModalHeader toggle={() => setModal(!modal)}>
                  Login Form
                </ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label for="email">Email:</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email Address"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password:</Label>
                    <Input
                      type="password"
                      id="password"
                      placeholder="Password"
                    />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={() => setModal(!modal)}>
                    Login
                  </Button>{' '}
                </ModalFooter>
              </Modal>
            </TabPane>
            <TabPane className="component-code" tabId="2">
              {modalForm}
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </>
  );
}
