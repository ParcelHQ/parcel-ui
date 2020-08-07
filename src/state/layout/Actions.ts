import { CHANGE_MODE, COLLAPSE_SIDEBAR } from './Constants';

export const changeMode = (mode: any) => {
  return (dispatch: any) => dispatch({ type: CHANGE_MODE, mode });
};

export const collapseSidebar = (value: any) => {
  return (dispatch: any) => dispatch({ type: COLLAPSE_SIDEBAR, value });
};
