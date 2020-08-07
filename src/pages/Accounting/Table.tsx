import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import ReactTable from 'react-table';

export default function Table({ data }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardBody>
        {/* @ts-ignore */}
        <ReactTable
          data={data}
          columns={[
            {
              Header: 'Date',
              accessor: 'date',
            },
            {
              Header: 'Receiver',
              accessor: 'receiver',
            },
            {
              Header: 'Remarks',
              id: 'remarks',
            },
            {
              Header: 'Amount',
              id: 'amount',
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </CardBody>
    </Card>
  );
}
