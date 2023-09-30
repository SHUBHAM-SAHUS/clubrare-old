import { SELECTED_NETWORK, SET_IS_CONNECTED } from '../../types';

const initialState = {
  isConnected: localStorage.getItem('Wallet Address')
    ? localStorage.getItem('Wallet Address')
    : false,
  selectedNet:
    localStorage.getItem('networkId') == process.env.REACT_APP_KLATYN_NETWORK_ID
      ? '2'
      : '1',
};
const headerReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload };
    case SELECTED_NETWORK:
      return { ...state, selectedNet: action.payload };
    default:
      return state;
  }
};

export { headerReducer };
