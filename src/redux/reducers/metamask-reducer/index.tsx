import {
  SET_WALLET_AMOUNT,
  UPDATE_WALLET_AMOUNT,
  SET_LIVE_PRICE,
} from '../../types/connect-wallet-types';

const initialState = {
  wallet_amount: localStorage.getItem('wallet_amount')
    ? localStorage.getItem('wallet_amount')
    : '',
  update_wallet_amount: false,
  live_price: 0,
  networkId: null,
};
const metamaskReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_WALLET_AMOUNT:
      return { ...state, wallet_amount: action.payload };
    case SET_LIVE_PRICE:
      return { ...state, live_price: action.payload };
    case UPDATE_WALLET_AMOUNT:
      return { ...state, update_wallet_amount: action.payload };
    default:
      return state;
  }
};

export { metamaskReducer };
