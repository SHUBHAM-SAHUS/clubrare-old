import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;


const getTopSellersApi = (dayNo: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/users/top/sellers/get`,
    params: {
      days: dayNo,
    },
  });
  return xhr;
};

const getTopBuyersApi = (dayNo: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/users/top/buyers/get`,
    params: {
      days: dayNo,
    },
  });
  return xhr;
};

export {getTopSellersApi, getTopBuyersApi };
