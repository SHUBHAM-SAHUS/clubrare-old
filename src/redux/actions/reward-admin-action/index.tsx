import {
  generateMerkleRootHashApi,
  getWhitelistDataApi,
  getParticipantInfoApi,
} from '../../api/reward-admin-api';
import {
  GET_WHITELIST_SUCCESS,
  GET_WHITELIST_FAIL,
  GET_WHITELIST_LOADING,
} from '../../types/reward-admin-types';

export const generateMerkleRootHashAction = (data: any) => {
  return async () => {
    try {
      const result = await generateMerkleRootHashApi(data);
      if (result) {
        const { data } = result;
        return data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getWhitelistDataAction = () => {
  return async (dispatch: any) => {
    try {
      dispatch({ type: GET_WHITELIST_LOADING, payload: true });
      const result = await getWhitelistDataApi();
      if (result.data) {
        if (result.data != null) {
          await dispatch({
            type: GET_WHITELIST_SUCCESS,
            payload: result.data.data,
          });
          await dispatch({ type: GET_WHITELIST_FAIL, payload: false });
        } else {
          await dispatch({ type: GET_WHITELIST_SUCCESS, payload: {} });
          await dispatch({ type: GET_WHITELIST_FAIL, payload: false });
        }
      } else {
        dispatch({ type: GET_WHITELIST_FAIL, payload: false });
      }
    } catch (error) {
      return error;
    }
  };
};

export const getParticipantInfoAction = (data: any) => {
  return async () => {
    try {
      const result = await getParticipantInfoApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return error;
    }
  };
};
