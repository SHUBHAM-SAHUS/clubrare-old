import {
  GET_BUYERS_LIST,
  GET_SELLERS_LIST,
} from '../../types/top-members-types';

const initialState = {
  buyersList: [],
  sellersList: [],
};
const topMembersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_BUYERS_LIST:
      return { ...state, buyersList: action.payload };
    case GET_SELLERS_LIST:
      return { ...state, sellersList: action.payload };
    default:
      return state;
  }
};

export { topMembersReducer };
