import { SET_LOADER_STATE } from '../../types';

const initialState = {
  isLoader: false,
};
const loaderReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_LOADER_STATE:
      return { ...state, isLoader: action.payload };
    default:
      return state;
  }
};

export { loaderReducer };
