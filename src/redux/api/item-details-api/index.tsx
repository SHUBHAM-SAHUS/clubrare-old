import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getItemDetailsApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/collectible/nft/single/page/get`,
    params: data,
  });
  return xhr;
};

const getHistoryApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/collectible/history/get`,
    params: data,
  });
  return xhr;
};

const createCollectibleViewApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/create-collectible-view`,
    data: data,
  });
  return xhr;
};

const getOfferApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-collectible-offers`,
    params: data,
  });
  return xhr;
};

export {
  getItemDetailsApi,
  createCollectibleViewApi,
  getHistoryApi,
  getOfferApi,
};
