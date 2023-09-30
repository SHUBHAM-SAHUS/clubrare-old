import { postPinataApiForIpfs, postPinataApiForData } from '../../api';
// import { SET_UNREAD_NOTIFICATION } from '../../types';

const getPinataForIpfsApi = (data: any) => {
  return async () => {
    try {
      const result = await postPinataApiForIpfs(data);
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

const getPinataForDataApi = (data: any) => {
  return async () => {
    try {
      const result = await postPinataApiForData(data);
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

export { getPinataForIpfsApi, getPinataForDataApi };
