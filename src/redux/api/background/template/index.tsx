import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;
export const getTemplateApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1/space-component-list`,
  });
  return xhr;
};

export const addTemplateApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/space-component-add`,
    data,
  });
  return xhr;
};

export const deleteTemplateApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.2/space-component-remove`,
    data,
  });
  return xhr;
};

