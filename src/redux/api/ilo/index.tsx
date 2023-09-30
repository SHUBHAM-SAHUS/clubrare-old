import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const getWhitelistUserDataApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/check-user-whitelisted`,
  });
  return xhr;
};

export const postHarvestInfoApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/create-participated-user`,
    data,
  });
  return xhr;
};
