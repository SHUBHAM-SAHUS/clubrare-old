import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const categoryAllApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/get-all-categories`,
  });
  return xhr;
};

export { categoryAllApi };
