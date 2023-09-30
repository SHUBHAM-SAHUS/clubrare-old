import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const postCreateCollectibleApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v2.0/admin/create-collectible`,
    data,
  });
  return xhr;
};
const postCreateCollectibleApiForUser = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.9/user/create-collectible-updates`,
    data,
  });
  return xhr;
};

const getCollectibleByCollectionApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/collectibles/list/get/by-collection`,
    params: data,
  });
  return xhr;
};

const postCreateCollectionApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/collection/create`,
    data,
  });
  return xhr;
};

const getListCollectionApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/get-all-collections`,
    params: data,
  });
  return xhr;
};

const getListPendingCollectiblesApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/users/get/my/pending-collectibles`,
    params: data,
  });
  return xhr;
};

const getTopCollectionApi = (dayNo: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/top-collections-list`,
    params: {
      days: dayNo,
    },
  });
  return xhr;
};

const postUpdateCollectibleApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/collectible/update`,
    data,
  });
  return xhr;
};

const eventsApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/collectible/save-event-by-transaction`,
    data,
  });
  return xhr;
};

const setChageHideStatusApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/collectible/change-hide-status`,
    data: { _id: data },
  });
  return xhr;
};

export const getCollectionByUserApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/get-all-collections-for-create`,
    params: data,
  });
  return xhr;
};

const addAuthenticationPurchaseApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/authentication/add-purchase`,
    data,
  });
  return xhr;
};

const collectibleLocationUpdateApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/collectible/location/update`,
    data,
  });
  return xhr;
};

export {
  postCreateCollectibleApi,
  postCreateCollectionApi,
  getCollectibleByCollectionApi,
  postUpdateCollectibleApi,
  getListCollectionApi,
  getTopCollectionApi,
  eventsApi,
  getListPendingCollectiblesApi,
  postCreateCollectibleApiForUser,
  setChageHideStatusApi,
  addAuthenticationPurchaseApi,
  collectibleLocationUpdateApi,
};
