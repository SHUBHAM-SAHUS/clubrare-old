import { SET_ITEM_DETAILS } from '../../types';

const initialState = {
  details: {},
};
const itemDetailsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_ITEM_DETAILS:
      return { ...state, details: action.payload };
    default:
      return state;
  }
};

export { itemDetailsReducer };
