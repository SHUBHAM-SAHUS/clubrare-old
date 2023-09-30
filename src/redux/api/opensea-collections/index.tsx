import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getOpenseaCollectionApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/get-opensea-data`,
  });
  return xhr;
};

const getAirdropStatshApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/get-clubrare-opensea-data`,
  });
  return xhr;
};

export { getOpenseaCollectionApi, getAirdropStatshApi };
