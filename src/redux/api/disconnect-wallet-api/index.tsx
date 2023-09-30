import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const disconnectWalletApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/users/disconnect-wallet`,
    data,
  });
  return xhr;
};

export { disconnectWalletApi };
