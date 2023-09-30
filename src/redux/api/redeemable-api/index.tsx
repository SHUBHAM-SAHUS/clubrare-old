import axios from 'axios';
import { queryType } from '../../../types/admin-sell-query-type';
import { EscrowStatusPayload } from '../../../types/escrow-params.types';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getRedeemableListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/redeem/list/get`,
    params: data,
  });
  return xhr;
};

const createRedeemItemApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.6/redeem/order/create`,
    data: data,
  });
  return xhr;
};

const getRedeemItemListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/redeem/order/get`,
    params: data,
  });
  return xhr;
};

const getViewSellsListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-all-sales-list`,
    params: data,
  });
  return xhr;
};

const updateRedeemItemApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.6/redeem/order/status/update`,
    data: data,
  });
  return xhr;
};

// fetch admin sells report List
const getSellsReportListApi = (data: queryType) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-collectible-sold-history`,
    params: data,
  });
  return xhr;
};

// get all item data for admin
const getALLItemReportListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.2/get-all-collectibles`,
    params: data,
  });
  return xhr;
};

//  escrow list

const getEscrowReportListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1/escrow-lists`,
    params: data,
  });
  return xhr;
};

// Escrow Status

//  Vault Item Report list

const getVaultItemReportListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1/vaults/lists`,
    params: data,
  });
  return xhr;
};

//valut  list

const postEscrowApi = (data: EscrowStatusPayload) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/escrow-update-status`,
    data,
  });
  return xhr;
};

//   data update for add item


//  vault order status

 
const postVaultApi = (data: EscrowStatusPayload) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1/escrow-update-status`,
    data,
  });
  return xhr;
};




const postALLItemReportListApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.2/edit-collectible-by-admin`,
    data,
  });
  return xhr;
};

// get list by searching
const getSellsReportListBySearchApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-all-sales-list`,
    params: data,
  });
  return xhr;
};

const getSellsStatsForAdminApi = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/get-stake-reward-history`,
    params: data,
  });
  return xhr;
};

export {
  getRedeemableListApi,
  createRedeemItemApi,
  getRedeemItemListApi,
  updateRedeemItemApi,
  getViewSellsListApi,
  getSellsReportListApi,
  getSellsReportListBySearchApi,
  getSellsStatsForAdminApi,
  getALLItemReportListApi,
  postALLItemReportListApi,
  getEscrowReportListApi,
  postEscrowApi,
  getVaultItemReportListApi,
  postVaultApi,
};
