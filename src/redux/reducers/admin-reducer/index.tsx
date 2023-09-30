import {
  GET_ADMIN_DATA,
  GET_START_LOADING,
  GET_STOP_LOADING,
} from '../../types/admin-types';

const initialState = {
  data: [],
  loading: true,
};
const adminReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_ADMIN_DATA:
      return { ...state, data: action.payload };
    case GET_START_LOADING:
      return { ...state, loading: true };
    case GET_STOP_LOADING:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export { adminReducer };
