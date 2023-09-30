import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const query: any = {
  network_id: 1,
};

const getAdminLastData = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/static/data/get`,
    params: query,
  });
  return xhr;
};
const updateAdminLastData = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/static/data/update`,
    params: query,
    data,
  });
  return xhr;
};
const setAdminLastData = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/static/data/create`,
    params: query,
    data,
  });
  return xhr;
};

export { getAdminLastData, setAdminLastData, updateAdminLastData };
