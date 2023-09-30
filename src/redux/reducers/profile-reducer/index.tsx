import { GET_PROFILE_DETAILS } from '../../types/profile-types';

const initialState = {
  profile_details: localStorage.getItem('profile')
    ? localStorage.getItem('profile')
    : null,
};
const profileReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_PROFILE_DETAILS:
      return { ...state, profile_details: action.payload };
    default:
      return state;
  }
};

export { profileReducers };
