import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

const lazylistingputonsaleApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.2/put-on-sale-item`,
    data,
  });
  return xhr;
};

const lazylistigMakeOfferApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/place-offer`,
    data,
  });
  return xhr;
};

export { lazylistingputonsaleApi, lazylistigMakeOfferApi };
