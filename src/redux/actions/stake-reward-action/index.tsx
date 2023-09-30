import {
  getAllDepositsApi,
  liquidityUsdApi,
  lpstakingSignatureApi,
  lpstakingWithDrawSignatureApi,
} from '../../api';

export const liquidityUsdAction = () => {
  return async () => {
    try {
      const result = await liquidityUsdApi();
      if (result) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const lpstakingSignatureAction = (nftId: number,poolPeriodValue:number) => {
  return async () => {
    try {
      const result = await lpstakingSignatureApi(nftId,poolPeriodValue);
      if (result) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};



export const lpstakingWithDrawSignatureAction = (nftId: number,poolPeriodValue:number,did:number) => {
  return async () => {
    try {
      const result = await lpstakingWithDrawSignatureApi(nftId,poolPeriodValue,did);
      if (result) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getAllDepositsAction = () => {
  return async () => {
    try {
      const result = await getAllDepositsApi();
      if (result) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};