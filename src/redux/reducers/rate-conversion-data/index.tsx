import { RATE_CHANGE_ITEM } from '../../types/rate-change_type';

const intialstate = {
  ratechange: [],
};

const ratechangeReducer = (state = intialstate, action: any) => {
  switch (action.type) {
    case RATE_CHANGE_ITEM:
      return {
        ...state,
        ratechange: action.payload,
      };
    default:
      return state;
  }
};

export { ratechangeReducer };
