import axios from 'axios';

const APP_URL = process.env.REACT_APP_API_BASE_URL;
const walletAddress: any = localStorage.getItem('Wallet Address');

const getExploreApi = (
  pageNo: any,
  network_id: string,
  collection_address: string,
  category: string,
  sort: string,
  saletype: string,
  search: any,
) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/explore/list/get`,
    params: {
      page_size: 20,
      page_number: pageNo,
      network_id: network_id,
      collection_address: collection_address,
      category: category,
      sort: sort,
      sale_type: saletype,
      wallet_address: walletAddress ? walletAddress : '',
      search: search,
    },
  });
  return xhr;
};

const getMostLikedItems = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.4/like/most`,
    params: {
      wallet_address: walletAddress ? walletAddress : '',
    },
  });
  return xhr;
};

const getClubrareDropsApi = (pageNo: number, filter: string) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/upcoming-clubrare-drop-list`,
    params: {
      page_number: pageNo,
      page_size: 20,

      wallet_address: walletAddress ? walletAddress : '',
    },
  });
  return xhr;
};

const getClubrareDropsRecentApi = (
  pageNo: number,
  network_id: string,
  category: string,
  sort: string,
) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/recent-clubrare-drop-list`,
    params: {
      page_number: pageNo,
      category: category,
      page_size: 20,
      network_id: network_id,
      sort: sort,
      wallet_address: walletAddress ? walletAddress : '',
    },
  });
  return xhr;
};

const getAuctionCollectiblesApi = async (pageNo: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/live-auctions?page_number=${pageNo}&page_size=20`,
    params: { wallet_address: walletAddress ? walletAddress : '' },
  });
  return xhr;
};

const getRecentAuctionCollectiblesApi = async (pageNo: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/recent-auctions?page_number=${pageNo}&page_size=20`,
    params: { wallet_address: walletAddress ? walletAddress : '' },
  });
  return xhr;
};

const getLiveAuctionCollectiblesApi = async (pageNo: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/live-auctions?page_number=${pageNo}&page_size=20`,
    params: { wallet_address: walletAddress ? walletAddress : '' },
  });
  return xhr;
};

const getMostViewedAuctionCollectiblesApi = async (
  pageNo: number,
  days = 'all',
) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/most-viewed-collectibles?page_number=${pageNo}&page_size=20&days=${days}`,
    params: { wallet_address: walletAddress ? walletAddress : '' },
  });
  return xhr;
};

const getHotBidsAuctionCollectiblesApi = async (pageNo: number) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/hot-bid-collectibles?page_number=${pageNo}&page_size=20`,
    params: { wallet_address: walletAddress ? walletAddress : '' },
  });
  return xhr;
};

const getAllCollectionsApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.5/collections-list`,
  });
  return xhr;
};

export {
  getAuctionCollectiblesApi,
  getRecentAuctionCollectiblesApi,
  getLiveAuctionCollectiblesApi,
  getMostViewedAuctionCollectiblesApi,
  getHotBidsAuctionCollectiblesApi,
  getExploreApi,
  getClubrareDropsApi,
  getMostLikedItems,
  getAllCollectionsApi,
  getClubrareDropsRecentApi,
};
