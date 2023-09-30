import {
  getNonceApi,
  postUserCreate,
  verifySignatureApi,
} from '../../api';

const setUsersCreate = (data: any) => {
  return async () => {
    try {
      const result = await postUserCreate(data);
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

const getNonceAction = (data: any) => {
  return async () => {
    try {
      const result = await getNonceApi(data);
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

const verifySignatureAction = (data: any) => {
  return async () => {
    try {
      const result = await verifySignatureApi(data);
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

export {
  setUsersCreate,
  getNonceAction,
  verifySignatureAction,
};
