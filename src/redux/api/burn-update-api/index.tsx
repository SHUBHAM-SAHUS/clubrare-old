import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const postBurnUpdateApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/redeem/order/burn/update`,
    data,
  });
  return xhr;
};

export { postBurnUpdateApi };
