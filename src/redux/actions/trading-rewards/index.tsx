import {
  getTradingrewardsdsApi,
  getListingrewardsdsApi,
} from '../../api/rewards-api';

const getTradingRewardsAction = async () => {
  try {
    const result = await getTradingrewardsdsApi();
    if (result.data) {
      return result.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};

const getListingRewardsAction = async () => {
  try {
    const result = await getListingrewardsdsApi();
    if (result.data) {
      return result.data.data;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
};

export { getTradingRewardsAction, getListingRewardsAction };
