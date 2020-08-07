import React from 'react';
import { Card, CardHeader, CardTitle, CardBody, Col } from 'reactstrap';
import { Plus, AlertCircle } from 'react-feather';

export default function UpcomingPayroll() {
  return (
    <Col lg="6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payroll</CardTitle>
        </CardHeader>
        <CardBody>
          <ul className="activity-timeline timeline-left list-unstyled">
            <li>
              <div className="timeline-icon bg-primary">
                <Plus size={16} />
              </div>
              <div className="timeline-info">
                <p className="font-weight-bold mb-0">Payment Requested</p>
                <span className="font-small-3">Lorem Ipsum</span>
              </div>
              <small className="text-muted">In 3 Hours</small>
            </li>
            <li>
              <div className="timeline-icon bg-primary">
                <AlertCircle size={16} />
              </div>
              <div className="timeline-info">
                <p className="font-weight-bold mb-0">Payment Requested</p>
                <span className="font-small-3">Lorem Ipsum</span>
              </div>
              <small className="text-muted">In 15 days</small>
            </li>
          </ul>
        </CardBody>
      </Card>
    </Col>
  );
}
