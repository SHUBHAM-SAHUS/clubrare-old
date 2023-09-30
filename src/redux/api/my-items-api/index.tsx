import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getCreatedItemsApi = (address: string, page: number, limit: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/users/my/items/creator/list/get?wallet_address=${address}&page_number=${page}&page_size=${limit}`,
  });
  return xhr;
};

const getCollectibleApi = (address: string, page: number, limit: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/users/get/my/collectibles?wallet_address=${address}&page_number=${page}&page_size=${limit}`,
  });
  return xhr;
};

const getOtherCollectibleApi = (
  address: string,
  page: number,
  limit: number,
) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/users/get/collectibles?wallet_address=${address}&page_number=${page}&page_size=${limit}`,
  });
  return xhr;
};

const getOnSaleApi = (address: string, page: number, limit: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/users/get/my/collectibles/on/sale?wallet_address=${address}&page_number=${page}&page_size=${limit}`,
  });
  return xhr;
};

const getOtherOnSaleApi = (address: string, page: number, limit: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/users/get/collectibles/on/sale?wallet_address=${address}&page_number=${page}&page_size=${limit}`,
    // params: {
    //     network_id: localStorage.getItem("networkId") === klatynNetworkId ? 2 : 1
    // }
  });
  return xhr;
};

const setDeleteData = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/collectibles/delete-collectible`,
    data,
  });
  return xhr;
};

const setUpdateData = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.7/user/edit-collectible`,
    data,
  });
  return xhr;
};

const changehidestatusagetapi = (
  address: string,
  page: number,
  limit: number,
) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/collectible/hided-collectibles`,
    params: {
      page_number: page,
      page_size: limit,
    },
  });
  return xhr;
};

export {
  getCreatedItemsApi,
  getCollectibleApi,
  getOnSaleApi,
  getOtherCollectibleApi,
  getOtherOnSaleApi,
  setDeleteData,
  setUpdateData,
  changehidestatusagetapi,
};
