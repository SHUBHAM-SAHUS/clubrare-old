import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getFaviourateApi = (address: string, page: number, limit: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/like/based/on/user/get?wallet_address=${address}&page_number=${page}&page_size=${limit}`,
  });
  return xhr;
};
const reactOnPostApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/like/create`,
    data,
  });
  return xhr;
};

export { getFaviourateApi, reactOnPostApi };
