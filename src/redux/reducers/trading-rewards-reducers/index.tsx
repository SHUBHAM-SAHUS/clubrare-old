import { TRADING_REWARDS_GET } from '../../types/rewards-getting';

const intialstate = {
  tradingrewards: [],
};

const tradingRewardsReducer = (state = intialstate, action: any) => {
  switch (action.type) {
    case TRADING_REWARDS_GET:
      return {
        ...state,
        tradingrewards: action.payload,
      };
    default:
      return state;
  }
};

export { tradingRewardsReducer };
