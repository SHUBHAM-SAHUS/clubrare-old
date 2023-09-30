import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getSocialLinksData = () => {
  const xhr = axios.request<null, any>({
    method: 'get',    
    url: `${APP_URL}/v1/social-link`,
  });
  return xhr;
};

export { getSocialLinksData };
