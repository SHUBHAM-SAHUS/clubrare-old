import { FREQUENTLY_ASKED_QUSETION } from '../../types';

const intialstate = {
  frequentlyAskQuestion: [],
};

const iloReducer = (state = intialstate, action: any) => {
  switch (action.type) {
    case FREQUENTLY_ASKED_QUSETION:
      return {
        ...state,
        frequentlyAskQuestion: action.payload,
      };
    default:
      return state;
  }
};

export { iloReducer };
