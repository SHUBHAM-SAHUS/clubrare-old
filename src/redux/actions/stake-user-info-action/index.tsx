import { getStakeUserInfoApi,getTotalLpLockedActionApi } from '../../api/stake-user-info-api';

export const getStakeUserInfoAction = (data: any) => {
  return async () => {
    try {
      const result = await getStakeUserInfoApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return false;
    }
  };
};

export const getTotalLpLockedAction = (data: number) => {
  return async () => {
    try {
      const result = await getTotalLpLockedActionApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return false;
    }
  };
};