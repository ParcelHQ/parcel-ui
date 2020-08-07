import React from 'react';
import { Card, CardHeader, CardTitle, Table, Col } from 'reactstrap';

export default function RecentActivity() {
  return (
    <Col lg="6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
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
      </Card>
    </Col>
  );
}
