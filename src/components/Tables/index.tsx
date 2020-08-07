import React from 'react';
import { Row, Col } from 'reactstrap';
import SimpleTable from './SimpleTable';
import 'react-table/react-table.css';
import '../../assets/scss/plugins/extensions/react-tables.scss';

export default function ReactTables({ data, title }: any) {
  return (
    <>
      <Row>
        <Col sm="12">
          <SimpleTable data={data} title={title} />
        </Col>
      </Row>
    </>
  );
}
