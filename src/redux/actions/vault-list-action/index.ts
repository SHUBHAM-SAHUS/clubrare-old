import { queryType } from '../../../types/admin-sell-query-type';
import { EscrowStatusPayload } from '../../../types/escrow-params.types';
import {
  getVaultItemReportListApi,
  postEscrowApi,
  postVaultApi,
} from '../../api';

import { setLoaderAction } from '../loader-action';

const VaultItemReportListAction = (data: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoaderAction(true));
      let result = await getVaultItemReportListApi(data);
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

const VaultItemOrderStatusUpdateAcion = (data: any) => {
  return async (dispatch: any)=> {
    try {
      let result = await postVaultApi(data);
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

export { VaultItemReportListAction, VaultItemOrderStatusUpdateAcion };