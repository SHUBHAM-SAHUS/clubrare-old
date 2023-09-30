import axios from 'axios';
import { AuthenticationListsRequest } from '../../../types/authentication-lists-type';

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getUserListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/users/get-all`,
    params: data,
  });
  return xhr;
};
const changeRoleApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.4/users/update/role`,
    data,
  });
  return xhr;
};
const authenticationPurchaseListApi = (data: AuthenticationListsRequest) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1/authentication/lists`,
    params: data,
  });
  return xhr;
};

export {
  getUserListApi,
  changeRoleApi,
  authenticationPurchaseListApi
};
