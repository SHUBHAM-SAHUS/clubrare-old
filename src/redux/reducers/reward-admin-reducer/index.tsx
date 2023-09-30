import {
  GET_WHITELIST_SUCCESS,
  GET_WHITELIST_FAIL,
  GET_WHITELIST_LOADING,
} from '../../types/reward-admin-types';

const initialState = {
  data: [],
  loading: true,
};

export const getWhitelistDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_WHITELIST_SUCCESS:
      return { ...state, data: action.payload };
    case GET_WHITELIST_LOADING:
      return { ...state, loading: true };
    case GET_WHITELIST_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};
