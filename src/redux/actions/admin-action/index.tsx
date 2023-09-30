import {
  getAdminLastData,
  setAdminLastData,
  updateAdminLastData,
} from '../../api';
import {
  GET_ADMIN_DATA,
  GET_STOP_LOADING,
  GET_START_LOADING,
} from '../../types';

const GetAdminData = () => {
  return async (dispatch: any) => {
    try {
      dispatch({ type: GET_START_LOADING, payload: true });
      const result: any = await getAdminLastData();
      if (result.data) {
        if (result.data != null) {
          await dispatch({
            type: GET_ADMIN_DATA,
            payload: result.data.data[0],
          });
          await dispatch({ type: GET_STOP_LOADING, payload: false });
        } else {
          await dispatch({ type: GET_ADMIN_DATA, payload: {} });
          await dispatch({ type: GET_STOP_LOADING, payload: false });
        }
      } else {
        dispatch({ type: GET_STOP_LOADING, payload: false });
      }
    } catch (error) {
      dispatch({ type: GET_STOP_LOADING, payload: false });
      return error;
    }
  };
};

const UpdateAdminData = (data: any) => {
  try {
    const result: any = updateAdminLastData(data);
    if (result) {
      return result;
    }
  } catch (error) {
    return error;
  }
};
const SetAdminData = (data: any) => {
  try {
    const result: any = setAdminLastData(data);
    if (result) {
      return result;
    }
  } catch (error) {
    return error;
  }
};

export { GetAdminData, SetAdminData, UpdateAdminData };
