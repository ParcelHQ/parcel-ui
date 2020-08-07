import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Home } from 'react-feather';
import { NavLink } from 'react-router-dom';

export default function BreadCrumb({
  breadCrumbTitle,
  // breadCrumbParent,
  breadCrumbParent2,
  breadCrumbParent3,
  breadCrumbActive,
}: any) {
  return (
    <div className="content-header row">
      <div className="content-header-left col-md-9 col-12 mb-2">
        <div className="row breadcrumbs-top">
          <div className="col-12">
            {breadCrumbTitle ? (
              <h2 className="content-header-title float-left mb-0">
                {breadCrumbTitle}
              </h2>
            ) : (
              ''
            )}
            <div className="breadcrumb-wrapper vx-breadcrumbs d-sm-block d-none col-12">
              <Breadcrumb tag="ol">
                <BreadcrumbItem tag="li">
                  <NavLink to="/">
                    <Home className="align-top" size={15} />
                  </NavLink>
                </BreadcrumbItem>
                {/* <BreadcrumbItem tag="li" className="text-primary">
                  {breadCrumbParent}
                </BreadcrumbItem> */}
                {breadCrumbParent2 ? (
                  <BreadcrumbItem tag="li" className="text-primary">
                    {breadCrumbParent2}
                  </BreadcrumbItem>
                ) : (
                  ''
                )}
                {breadCrumbParent3 ? (
                  <BreadcrumbItem tag="li" className="text-primary">
                    {breadCrumbParent3}
                  </BreadcrumbItem>
                ) : (
                  ''
                )}
                <BreadcrumbItem tag="li" active>
                  {breadCrumbActive}
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
