import {
  GET_SOCIAL_LINKS
} from '../../types/social-links-types';

const initialState = {
  data: {}
};
const socialLinkReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_SOCIAL_LINKS:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export { socialLinkReducer };
