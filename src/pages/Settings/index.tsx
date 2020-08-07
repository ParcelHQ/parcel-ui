import React from 'react';
import Breadcrumbs from '../../components/BreadCrumbs';

export default function Settings() {
  return (
    <>
      <Breadcrumbs
        breadCrumbTitle="Settings"
        breadCrumbParent="Card"
        breadCrumbActive="Settings"
      />
    </>
  );
}
