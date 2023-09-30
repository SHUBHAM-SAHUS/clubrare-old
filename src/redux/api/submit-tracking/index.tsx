import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

const submitTrackingApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.2/submit-tracking-number`,
    data,
  });
  return xhr;
};

export { submitTrackingApi };
