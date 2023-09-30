import { postEditProfileApi, postUploadCoverPhotoApi, getUploadCoverPhotoApi, getEditProfileApi,checkEditProfileUrlApi } from '../../api';
import { GET_PROFILE_DETAILS } from '../../types/profile-types';

const EditProfileAction = (data: any) => {
  return async () => {
    try {
      const result = await postEditProfileApi(data);
      if (result.data) {
        return result.data;
      } else {
        return result.data;
      }
    } catch (error) {
      return error;
    }
  };
};


const checkCustomUrlActon = (data:any) => {
  return async () => {
    try {
      let result = await checkEditProfileUrlApi(data);
      if (result.data) {
        return result.data;
      } else {
        return result.data;
      }
    } catch (error) {
      return error;
    }
  };
};




const uploadCoverPhotoAction = (data: any) => {
  return async () => {
    try {
      const result = await postUploadCoverPhotoApi(data);
      if (result.data.status) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const getEditProfileAction = (data: any) => {
  return async (dispatch: any) => {
    try {
      const result = await getEditProfileApi(data);
      if (result.data) {
        dispatch({ type: GET_PROFILE_DETAILS, payload: result.data.data });
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const getUploadCoverPhotoAction = (data: any) => {
  return async () => {
    try {
      const result = await getUploadCoverPhotoApi(data);
      if (result.data) {
        const { data } = result.data;
        return data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export { EditProfileAction, uploadCoverPhotoAction, getUploadCoverPhotoAction, getEditProfileAction,checkCustomUrlActon };
