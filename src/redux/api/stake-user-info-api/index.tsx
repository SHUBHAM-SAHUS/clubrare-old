import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const getStakeUserInfoApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/get-all-staked-user`,
    params: data,
  });
  return xhr;
};

export const getTotalLpLockedActionApi = (id: number) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/lp-staking/get-total-lp-locked`,
    data: {pool_id:id.toString()},
  });
  return xhr;
};