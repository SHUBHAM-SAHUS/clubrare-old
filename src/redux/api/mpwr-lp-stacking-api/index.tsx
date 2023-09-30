import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getUserIsWhiteListedforMpwr = (data: string) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/mpwr-stacking/is-user-whitelisted`,
    params: data,
  });
  return xhr;
};

const getMpwrAmountApi = (data: string) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/mpwr-stacking/get-mpwr-amount`,
    data,
  });
  return xhr;
};

const generateMpwrDepositeSignatureApi = (data: string) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/mpwr-stacking/generate-deposit-signaure`,
    data,
  });
  return xhr;
};

const getTransactionInfoApi = (data: string) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/mpwr-stacking/get-history`,
    params: data,
  });
  return xhr;
};

const getIsUserStakedApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/mpwr-stacking/is-user-staked`,
  });
  return xhr;
};

export {
  getUserIsWhiteListedforMpwr,
  getMpwrAmountApi,
  generateMpwrDepositeSignatureApi,
  getTransactionInfoApi,
  getIsUserStakedApi,
};
