import axios from 'axios';
import { spaceListsRequest, spaceHomePageRequest } from '../../../types/space-types';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getSpaceListApi = (data: spaceListsRequest) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1/space/lists`,
    params: data,
  });
  return xhr;
};

const addHomeSpaceApi = (data: spaceHomePageRequest) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/homepage/add-space`,
    data,
  });
  return xhr;
};

const removeHomeSpaceApi = (data: spaceHomePageRequest) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/homepage/remove-space`,
    data,
  });
  return xhr;
};

const deleteSpaceApi = (data: spaceHomePageRequest) => {
  const xhr = axios.request<null, any>({
    method: 'delete',
    url: `${APP_URL}/v2/space/delete`,
    data,
  });
  return xhr;
};

export {
  getSpaceListApi,  
  addHomeSpaceApi,
  removeHomeSpaceApi,
  deleteSpaceApi
};
