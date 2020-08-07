import React, { createContext, ReactNode, useReducer } from 'react';
import LoggedInLayout from '../../layouts/LoggedInLayout';
import LoggedOutLayout from '../../layouts/LoggedOutLayout';
import { LayoutReducer } from './Reducers';

const initialLayoutState: any = { theme: 'light', sidebarCollapsed: true };

export const LayoutContext = createContext<any>({
  layout: '',
  dispatch: LayoutReducer,
});

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [layout, dispatch] = useReducer(LayoutReducer, initialLayoutState);

  return (
    <LayoutContext.Provider
      value={{
        layout,
        dispatch,
        state: {},
        fullLayout: LoggedOutLayout,
        LoggedInLayout: LoggedInLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
