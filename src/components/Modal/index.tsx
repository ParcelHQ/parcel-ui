import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import ModalForm from './ModalForm';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.min';

export default function Modals() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Row>
      <Col sm="12">
        <ModalForm />
      </Col>
    </Row>
  );
}
