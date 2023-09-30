import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getAllUnreadNotificationsApi = (address: string) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/notifications/get?wallet_address=${address}`,
  });
  return xhr;
};

const getAllNotification = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/notifications/get?page_number=${data.page_number}&page_size=${data.page_size}`,
  });
  return xhr;
};

const notificationsingalread = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/notifications/mark-as-read`,
    data,
  });
  return xhr;
};

const allReadnotification = () => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/notifications/mark-all-as-read`,
  });
  return xhr;
};

export {
  getAllUnreadNotificationsApi,
  getAllNotification,
  notificationsingalread,
  allReadnotification,
};
