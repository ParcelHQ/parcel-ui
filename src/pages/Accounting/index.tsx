import React from 'react';
import 'react-table/react-table.css';

import Breadcrumbs from '../../components/BreadCrumbs';
import Export from './Export';
import '../../assets/scss/plugins/extensions/react-tables.scss';

export default function Accounting() {
  return (
    <>
      <Breadcrumbs breadCrumbTitle="Accounting" breadCrumbActive="Accounting" />

      <Export />
    </>
  );
}
