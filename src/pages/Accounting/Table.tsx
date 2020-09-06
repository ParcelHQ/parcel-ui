import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import ReactTable from 'react-table';

let data = [
  {
    date: "20 Aug, 2020",
    receiver : "0x886d8Ea2....1ad3075c1a",
    remarks : "Salary Paid",
    amount : "300 DAI"
  }
];

export default function Table() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardBody>
        {/* @ts-ignore */}
        <Table
          responsive
          className="dashboard-table table-hover-animation mb-0 mt-1"
        >
          <thead>
            <tr>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>RECEIVER</th>
              <th>REMARKS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>28/07/2018</td>
              <td>$2500</td>
              <td>Brennan.eth</td>
              <td>Paid Contractor Brennan Fife $545</td>
            </tr>
            <tr>
              <td>28/07/2018</td>
              <td>$2500</td>
              <td>BrennanFife.eth</td>
              <td>Brennan Fife is requesting $324</td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
