import { ADD_FILE } from './Constants';

const INIT_STATE = {
  files: [],
};

export const FilesReducer = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case ADD_FILE:
      return { ...state, files: action.mode };

    default:
      return state;
  }
};
