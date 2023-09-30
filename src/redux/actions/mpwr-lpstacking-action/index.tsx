import {
  getUserIsWhiteListedforMpwr,
  getMpwrAmountApi,
  generateMpwrDepositeSignatureApi,
  getTransactionInfoApi,
  getIsUserStakedApi,
} from '../../api/mpwr-lp-stacking-api';

const getWhiteListedStatusforMpwrAction = (data: any) => {
  return async () => {
    try {
      const result = await getUserIsWhiteListedforMpwr(data);
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

const getMpwrAmountAction = (data: any) => {
  return async () => {
    try {
      const result = await getMpwrAmountApi(data);
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

const generateMpwrDepositeSignatureAction = (data: any) => {
  return async () => {
    try {
      const result = await generateMpwrDepositeSignatureApi(data);
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
  getWhiteListedStatusforMpwrAction,
  getMpwrAmountAction,
  generateMpwrDepositeSignatureAction,
  getTransactionInfoAction,
  getIsUserStakedAction,
};
