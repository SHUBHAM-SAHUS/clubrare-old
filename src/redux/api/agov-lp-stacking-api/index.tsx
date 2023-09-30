import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getUserIsWhiteListedforAgov = (data: string) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/agov-stacking/is-user-whitelisted`,
    params: data,
  });
  return xhr;
};

const getAgovAmountApi = (data: string) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/agov-stacking/get-agov-amount`,
    data,
  });
  return xhr;
};

const generateAgovDepositeSignatureApi = (data: string) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/agov-stacking/generate-deposit-signaure`,
    data,
  });
  return xhr;
};

const getTransactionInfoApi = (data: string) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/agov-stacking/get-history`,
    params: data,
  });
  return xhr;
};

const getIsUserStakedApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/agov-stacking/is-user-staked`,
  });
  return xhr;
};

export {
  getUserIsWhiteListedforAgov,
  getAgovAmountApi,
  generateAgovDepositeSignatureApi,
  getTransactionInfoApi,
  getIsUserStakedApi,
};
