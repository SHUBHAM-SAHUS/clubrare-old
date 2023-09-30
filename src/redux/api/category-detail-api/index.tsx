import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const getCategoryApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-allCategory?page_number=${data.page_number}&page_size=${data.page_size}`,
  });
  return xhr;
};

export const addCategoryApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/add-category`,
    data,
  });
  return xhr;
};

export const updateCategoryApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/update-category`,
    data,
  });
  return xhr;
};

export const deleteCategoryApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/delete-category`,
    data,
  });
  return xhr;
};

export const getImageRulesApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-ImageRuleId?_id=${data._id}`,
  });
  return xhr;
};

export const deleteImageRuleApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/delete-ImageRuleId`,
    data,
  });
  return xhr;
};

export const addImageRuleApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/add-ImageRuleId`,
    data,
  });
  return xhr;
};
