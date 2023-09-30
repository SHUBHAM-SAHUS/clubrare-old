import { queryType } from '../../../types/admin-sell-query-type';
import { EscrowStatusPayload } from '../../../types/escrow-params.types';
import { getEscrowReportListApi, postEscrowApi } from '../../api';

import { setLoaderAction } from '../loader-action';

const EscrowReportListAction = (data: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      let result = await getEscrowReportListApi(data);
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

const EscrowStatusUpdateAction = (data: EscrowStatusPayload) => {
  return async (dispatch: any) => {
    try {
      let result = await postEscrowApi(data);
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

export { EscrowReportListAction, EscrowStatusUpdateAction };
