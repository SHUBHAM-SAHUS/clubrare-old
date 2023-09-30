import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const getMerkleProofMpwrApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/metaverse/get-proof`,
  });
  return xhr;
};