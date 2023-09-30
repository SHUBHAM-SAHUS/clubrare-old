import { getTopBuyersApi, getTopSellersApi } from '../../api/top-members-api';
import { GET_BUYERS_LIST } from '../../types/top-members-types';
import { GET_SELLERS_LIST } from '../../types/top-members-types';

const getTopBuyersAction = (dayNo: number) => {
  return async (dispatch: any) => {
    try {
      const result = await getTopBuyersApi(dayNo);
      if (result.data) {
        dispatch({ type: GET_BUYERS_LIST, payload: result.data.data });
        return result.data.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const getTopSellersAction = (dayNo: number) => {
  return async (dispatch: any) => {
    try {
      const result = await getTopSellersApi(dayNo);
      if (result.data) {
        dispatch({ type: GET_SELLERS_LIST, payload: result.data.data });
        return result.data.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};
export { getTopBuyersAction, getTopSellersAction };
