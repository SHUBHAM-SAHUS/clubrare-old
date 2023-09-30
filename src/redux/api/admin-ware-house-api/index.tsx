import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const getAdminWareHouseListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-adminWareHouse?page_number=${data.page_number}&page_size=${data.page_size}`,
  });
  return xhr;
};
