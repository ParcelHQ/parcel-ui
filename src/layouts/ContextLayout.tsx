import React, { createContext } from 'react';
import LoggedInLayout from './LoggedInLayout';
import LoggedOutLayout from './LoggedOutLayout';

export const ContextLayout = createContext({});

export function Layout({ children }: any) {
  const activeLayout = 'vertical';
  const width = 'window.innerWidth';

  return (
    <ContextLayout.Provider
      value={{
        state: { activeLayout, width },
        fullLayout: LoggedOutLayout,
        VerticalLayout: LoggedInLayout,
      }}
    >
      {children}
    </ContextLayout.Provider>
  );
}
