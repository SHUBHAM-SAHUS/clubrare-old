import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const postUserCreate = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/users/create`,
    data,
  });
  return xhr;
};

const getNonceApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/users/get-address-nonce`,
    data,
  });
  return xhr;
};

const verifySignatureApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/users/verify-signature`,
    data,
  });
  return xhr;
};

export {
  postUserCreate,
  getNonceApi,
  verifySignatureApi,
};
