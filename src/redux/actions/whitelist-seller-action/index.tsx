import {
  deleteWhitelistSellerApi,
  generateWhitelistSellerApi,
  getWhitelistSellerApi,
} from '../../api/whitelist-seller-api';

export const generateWhitelistSellerAction = (data: any) => {
  return async () => {
    try {
      const result = await generateWhitelistSellerApi(data);
      if (result) {
        const { data } = result;
        return data;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
};

export const getWhitelistSellerAction = (data: any) => {
  return async () => {
    try {
      const result = await getWhitelistSellerApi(data);
      if (result.data) {
        return result.data.data;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
};


export const deleteWhitelistSellerAction = (data: any) => {
  return async () => {
    try {
      const result = await deleteWhitelistSellerApi(data);
      if (result.data) {
        return result.data.data;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
};
