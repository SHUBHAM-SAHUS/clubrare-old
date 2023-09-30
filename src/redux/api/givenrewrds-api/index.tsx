import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getrewardsApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/get-total-rewards-given`,
  });
  return xhr;
};

export { getrewardsApi };
