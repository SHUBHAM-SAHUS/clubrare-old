import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const generateWhitelistSellerApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/create-whitelist-sellers`,
    data,
  });
  return xhr;
};

export const getWhitelistSellerApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-all-whitelist-sellers?page_number=${data.page_number}&page_size=${data.page_size}&export=${data.export}`,
  });
  return xhr;
};


export const deleteWhitelistSellerApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/delete-whitelist-seller`,
    data,
  });
  return xhr;
};
