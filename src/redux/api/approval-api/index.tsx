import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getApprovalListApi = (data: any) => {
  // v1.5/collectible/non/approve/items
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.7/collectible/non/approve/items/get?page_number=${data.page_number}&page_size=${data.page_size}`,
  });
  return xhr;
};

const setApprovalStatusApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.6/collectible/approve`,
    data,
  });
  return xhr;
};

const setRejectStatusApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/collectible/reject`,
    data,
  });
  return xhr;
};

//  rate conversion api
const getrateConversionapi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/get-usd-rate`,
  });
  return xhr;
};

export {
  getApprovalListApi,
  setApprovalStatusApi,
  setRejectStatusApi,
  getrateConversionapi,
};
