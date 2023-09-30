import { getSocialLinksData } from '../../api';
import { GET_SOCIAL_LINKS } from '../../types';

const getSocialLinksAction = () => {
  return async (dispatch: any) => {
    try {
      const result = await getSocialLinksData();
      if (result) {
        // eslint-disable-next-line no-console
        await dispatch({ type: GET_SOCIAL_LINKS, payload: result.data.data });
      } else {
        await dispatch({ type: GET_SOCIAL_LINKS, payload: {} });
      }
    } catch (error) {
      dispatch({ type: GET_SOCIAL_LINKS, payload: false });
      return error;
    }
  };
};
export { getSocialLinksAction };
