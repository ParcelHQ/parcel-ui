import { ADD_FILE } from './Constants';

export const addFile = (mode: any) => {
  return (dispatch: any) => dispatch({ type: ADD_FILE, mode });
};
