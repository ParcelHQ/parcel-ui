import { CHANGE_MODE, COLLAPSE_SIDEBAR } from './Constants';

const INIT_STATE = {
  theme: 'light',
  sidebarCollapsed: true,
};

export const LayoutReducer = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case CHANGE_MODE:
      return { ...state, theme: action.mode };
    case COLLAPSE_SIDEBAR:
      return { ...state, sidebarCollapsed: action.value };

    default:
      return state;
  }
};
