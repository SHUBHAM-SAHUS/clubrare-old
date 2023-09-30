import { queryType } from "../../../types/admin-sell-query-type";
import {
  createRedeemItemApi,
  getRedeemableListApi,
  getRedeemItemListApi,
  updateRedeemItemApi,
  getViewSellsListApi,
  getSellsReportListApi,
  getSellsReportListBySearchApi,
  getSellsStatsForAdminApi,
  getALLItemReportListApi,
  postALLItemReportListApi
} from "../../api";

import { SET_REDEEMABLE_LIST, SET_REDEEM_ITEM_LIST } from '../../types';
import { setLoaderAction } from '../loader-action';

interface datatype{
page_number:number,
page_size: number,
export: boolean,
fromDate:string,
toDate:string
 }

const getRedeemableListAction = (data: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      const result = await getRedeemableListApi(data);

      if (result.data) {
        dispatch({ type: SET_REDEEMABLE_LIST, payload: result.data.data });
        dispatch(setLoaderAction(false));

        return result.data;
      } else {
        dispatch(setLoaderAction(false));
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
};

const postRedeemItemCreateAction = (data: any) => {
  return async () => {
    try {
      const result = await createRedeemItemApi(data);
      if (result.data) {
        return result.data;
      }
    } catch (error) {
      return error;
    }
  };
};

const getRedeemListAction = (data: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      const result = await getRedeemItemListApi(data);
      if (result.data) {
        dispatch(setLoaderAction(false));
        dispatch({ type: SET_REDEEM_ITEM_LIST, payload: result.data.data });
        return result.data.data;
      } else {
        dispatch(setLoaderAction(false));
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
};

const getViewSellsListAction = (data: string) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      const result = await getViewSellsListApi(data);
      if (result.data) {
        dispatch(setLoaderAction(false));

        return result.data.data;
      } else {
        dispatch(setLoaderAction(false));
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
};

const postUpdateRedeemItemAction = (data: any) => {
  return async () => {
    try {
      const result = await updateRedeemItemApi(data);
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


const getSellReportListAction = (data: queryType) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      let result = await getSellsReportListApi(data);
      if (result.data) {
        dispatch(setLoaderAction(false));
      
        return result.data;
      } else {
        dispatch(setLoaderAction(false));
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
};




const getAllItemReportListAction = (data: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      let result = await getALLItemReportListApi(data);
      if (result.data) {
        dispatch(setLoaderAction(false));
      
        return result.data;
      } else {
        dispatch(setLoaderAction(false));
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
};



const postEDitItemReportListAction = (data: any) => {
  return async (dispatch: any) => {
    try {
      let result = await postALLItemReportListApi(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
}



const getSellsStatsForAdminAction = (data:datatype) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      let result = await getSellsStatsForAdminApi(data);
      if (result.data) {
        dispatch(setLoaderAction(false));
      
        return result.data.data;
      } else {
        dispatch(setLoaderAction(false));
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
};
const getSellReportListBySearchAction = (data:datatype) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      let result = await getSellsReportListBySearchApi(data);
      if (result.data) {
        dispatch(setLoaderAction(false));
      
        return result.data.data;
      } else {
        dispatch(setLoaderAction(false));
      }
    } catch (error) {
      dispatch(setLoaderAction(false));
    }
  };
};


export {
  getRedeemableListAction,
  postRedeemItemCreateAction,
  getRedeemListAction,
  postUpdateRedeemItemAction,
  getViewSellsListAction,
  getSellReportListAction,
  getSellReportListBySearchAction,
  getSellsStatsForAdminAction,
  getAllItemReportListAction,
  postEDitItemReportListAction,
};
