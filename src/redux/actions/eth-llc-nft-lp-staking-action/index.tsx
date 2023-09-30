import { getTransactionInfoApi, getLlcNftDataApi } from "../../api/eth-llc-nft-lp-staking-api";

const getTransactionInfoAction = () => {
  return async () => {
    try {
      let result = await getTransactionInfoApi();
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

const getLlcNftDataAction = (data: any) => {
  return async () => {
    try {
      let result = await getLlcNftDataApi(data);
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

export { getTransactionInfoAction, getLlcNftDataAction };
