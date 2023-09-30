import {
  getApprovalListApi,
  setApprovalStatusApi,
  setRejectStatusApi,
  getrateConversionapi,
} from '../../api';
import { RATE_CHANGE_ITEM } from '../../types/rate-change_type';

const setApprovalStatusAction = (data: any) => {
  return async () => {
    try {
      const result = await setApprovalStatusApi(data);
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

const setRejectStatusAction = (data: any) => {
  return async () => {
    try {
      const result = await setRejectStatusApi(data);
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

const getApprovalListAction = (data: any) => {
  return async () => {
    try {
      const result = await getApprovalListApi(data);
      if (result.data) {
        return result.data.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const getconversionrateapiAction = () => {
  return async (dispatch: any) => {
    try {
      const result = await getrateConversionapi();
      if (result.data) {
        dispatch({
          type: RATE_CHANGE_ITEM,
          payload: result.data.data,
        });
      }
    } catch (error) {
      return error;
    }
  };
};

export {
  getApprovalListAction,
  setApprovalStatusAction,
  setRejectStatusAction,
  getconversionrateapiAction,
};
