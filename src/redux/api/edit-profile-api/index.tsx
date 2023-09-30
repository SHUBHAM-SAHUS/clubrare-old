import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const postEditProfileApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/users/update`,
    data,
  });
  return xhr;
};



const checkEditProfileUrlApi = (data: any) => {

  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/users/is-custom-url-valid`,
    params: data,
  });
  return xhr;
};





const postUploadCoverPhotoApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/users/update/cover/image`,
    data,
  });
  return xhr;
};

const getUploadCoverPhotoApi = (data: any) => {
  data['network_id'] =
    localStorage.getItem('networkId') ===
    process.env.REACT_APP_KLATYN_NETWORK_ID
      ? 2
      : 1;
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/users/cover/image/get`,
    params: data,
  });
  return xhr;
};

const getEditProfileApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/users/single/profile/get`,
    params: data,
  });
  return xhr;
};

export { postEditProfileApi, postUploadCoverPhotoApi, getEditProfileApi, getUploadCoverPhotoApi,checkEditProfileUrlApi };
