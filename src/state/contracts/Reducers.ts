import { CREATE_ORGANIZATION } from './Constants';

export const ContractReducer = (state: any, action: any) => {
  switch (action.type) {
    case CREATE_ORGANIZATION:
      return [
        ...state,
        // {
        //     ...
        // },
      ];

    default:
      return state;
  }
};
