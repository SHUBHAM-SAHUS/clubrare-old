import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;
const walletAddress: any = localStorage.getItem('Wallet Address');

export const topCollectionApi = (collection_address: string) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/collection-details`,
    params: {
      collection_address: collection_address,
    },
  });
  return xhr;
};
export const getCollectionLListApi = (
  pageNo: any,
  collection_address: string,
  sort: string,
  search: any,
) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/collectibles/by-collection`,
    params: {
      page_size: 20,
      page_number: pageNo,
      collection_address: collection_address,
      sort: sort,
      wallet_address: walletAddress ? walletAddress : '',
      search: search,
    },
  });
  return xhr;
};
