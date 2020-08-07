import React from 'react';
import { Row } from 'reactstrap';
import 'react-table/react-table.css';

import StatisticsCard from './StatisticsCard';
import CurrentStreams from './CurrentStreams';
import RecentActivity from './RecentActivity';
import UpcomingPayroll from './UpcomingPayroll';
import '../../assets/scss/plugins/extensions/react-tables.scss';

export default function Home() {
  return (
    <>
      <StatisticsCard />
      <CurrentStreams />
      <Row>
        <RecentActivity />
        <UpcomingPayroll />
      </Row>
    </>
  );
}
