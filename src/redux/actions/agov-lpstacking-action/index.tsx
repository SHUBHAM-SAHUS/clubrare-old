import {
  getUserIsWhiteListedforAgov,
  getAgovAmountApi,
  generateAgovDepositeSignatureApi,
  getTransactionInfoApi,
  getIsUserStakedApi,
} from '../../api/agov-lp-stacking-api';

const getWhiteListedStatusforAgovAction = (data: any) => {
  return async () => {
    try {
      const result = await getUserIsWhiteListedforAgov(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const getAgovAmountAction = (data: any) => {
  return async () => {
    try {
      const result = await getAgovAmountApi(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const generateAgovDepositeSignatureAction = (data: any) => {
  return async () => {
    try {
      const result = await generateAgovDepositeSignatureApi(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const getTransactionInfoAction = (data: any) => {
  return async () => {
    try {
      const result = await getTransactionInfoApi(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const getIsUserStakedAction = () => {
  return async () => {
    try {
      const result = await getIsUserStakedApi();
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export {
  getWhiteListedStatusforAgovAction,
  getAgovAmountAction,
  generateAgovDepositeSignatureAction,
  getTransactionInfoAction,
  getIsUserStakedAction,
};
