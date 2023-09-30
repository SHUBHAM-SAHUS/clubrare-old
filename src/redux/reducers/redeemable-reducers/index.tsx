import { SET_REDEEMABLE_LIST, SET_REDEEM_ITEM_LIST } from '../../types';

const initialState = {
  redeemableList: [],
  redeemItemList: [],
};
const redeemableReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_REDEEMABLE_LIST:
      return { ...state, redeemableList: action.payload };
    case SET_REDEEM_ITEM_LIST:
      return { ...state, redeemItemList: action.payload };
    default:
      return state;
  }
};

export { redeemableReducer };
