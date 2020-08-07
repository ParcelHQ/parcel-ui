import React from 'react';
import * as Icon from 'react-feather';
const navigationConfig = [
  {
    id: 'home',
    title: 'Home',
    type: 'item',
    icon: <Icon.Home size={20} />,
    permissions: ['admin', 'editor'],
    navLink: '/home',
  },
  {
    id: 'accounting',
    title: 'Accounting',
    type: 'item',
    icon: <Icon.Edit size={20} />,
    permissions: ['admin', 'editor'],
    navLink: '/accounting',
  },
  {
    id: 'payroll',
    title: 'Payroll',
    type: 'item',
    icon: <Icon.DollarSign size={20} />,
    permissions: ['admin', 'editor'],
    navLink: '/payroll',
  },

  {
    id: 'people',
    title: 'People',
    type: 'item',
    icon: <Icon.Users size={20} />,
    permissions: ['admin', 'editor'],
    navLink: '/people',
  },
  {
    id: 'documents',
    title: 'Documents',
    type: 'item',
    icon: <Icon.File size={20} />,
    permissions: ['admin', 'editor'],
    navLink: '/documents',
  },

  // {
  //   id: 'companyDetails',
  //   title: 'Company Details',
  //   type: 'item',
  //   icon: <Icon.Folder size={20} />,
  //   permissions: ['admin', 'editor'],
  //   navLink: '/companyDetails',
  // },
  {
    id: 'settings',
    title: 'Settings',
    type: 'item',
    icon: <Icon.Settings size={20} />,
    permissions: ['admin', 'editor'],
    navLink: '/settings',
  },
  {
    id: 'about',
    title: 'About',
    type: 'item',
    icon: <Icon.Heart size={20} />,
    permissions: ['admin', 'editor'],
    navLink: '/about',
  },
];

export default navigationConfig;
