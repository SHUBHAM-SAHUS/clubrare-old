import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const getColorApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1/space-background-color`,
  });
  return xhr;
};

export const addColorApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/space-background-color`,
    data,
  });
  return xhr;
};

export const updateColorApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/space-color-update`,
    data,
  });
  return xhr;
};

export const deleteColorApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/space-color-remove`,
    data,
  });
  return xhr;
};
