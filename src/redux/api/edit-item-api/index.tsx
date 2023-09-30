import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const editItemApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.2/user/edit-collectible-description`,
    data,
  });
  return xhr;
};
