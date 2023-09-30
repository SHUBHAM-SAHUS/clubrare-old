import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getTradingrewardsdsApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/pending-rewards/trading`,
  });
  return xhr;
};

const getListingrewardsdsApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/pending-rewards/listing`,
  });
  return xhr;
};

export { getTradingrewardsdsApi, getListingrewardsdsApi };
