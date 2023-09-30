import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const generateMerkleRootHashApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/create-whitelist-users`,
    data,
  });
  return xhr;
};

export const getWhitelistDataApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/get-whitelist-users`,
  });
  return xhr;
};

export const getParticipantInfoApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/get-all-participated-users`,
    params: data,
  });
  return xhr;
};
