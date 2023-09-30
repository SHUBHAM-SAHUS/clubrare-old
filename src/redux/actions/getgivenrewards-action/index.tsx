import { getrewardsApi } from '../../api/givenrewrds-api';

const getgivenrewardsAction = () => {
  return async () => {
    try {
      const result = await getrewardsApi();
      if (result.data) {
        return result.data.data;
      } else {
        return result;
      }
    } catch (error) {
      return false;
    }
  };
};

export { getgivenrewardsAction };
