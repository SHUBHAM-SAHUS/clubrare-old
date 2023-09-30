import { EnableEthereum, GetCaver } from '../../../service/web3-service';
import { useCustomStableCoin } from '../../../hooks';
import {
  getRecentAuctionCollectiblesApi,
  getLiveAuctionCollectiblesApi,
  getMostViewedAuctionCollectiblesApi,
  getHotBidsAuctionCollectiblesApi,
  getAuctionCollectiblesApi,
  getClubrareDropsApi,
  getExploreApi,
  getMostLikedItems,
  getAllCollectionsApi,
  getClubrareDropsRecentApi,
} from '../../api';
import {
  SET_AUCTION,
  SET_RECENT_AUCTION,
  SET_LIVE_AUCTION,
  SET_MOST_VIEWED_AUCTION,
  SET_HOT_BIDS_AUCTION,
  SET_AUCTION_IS_NULL,
  SET_EXPLORE_ITEMS,
  UPDATE_EXPLORE_PAGE,
  SET_EXPLORE_IS_NULL,
  UPDATE_EXPLORE_ITEMS,
  UPDATE_AUCTION_ITEMS,
  UPDATE_ACTION_PAGE,
  SET_CLUBRARE_DROP_IS_NULL,
  SET_CLUBRARE_DROP_ITEMS,
  UPDATE_CLUBRARE_DROP_ITEMS,
  MOST_LIKED_ITEMS,
  AUCTION_LOADING,
  UPDATE_LAZY_LEO_PAGE,
  SET_COLLECTION_ITEMS,
  SET_CLUBRARE_RECENT_DROP_ITEMS,
  UPDATE_CLUBRARE_RECENT__DROP_ITEMS,
  UPDATE_CLUBRARE_RECENT__DROP_PAGE,
  SET_CLUBRARE_RECENT__DROP_IS_NULL,
} from '../../types';
const { customFromWei } = useCustomStableCoin();

const getWeiPrice = async (price: string, erc20Token: any) => {
  if (
    localStorage.getItem('networkId') ===
    process.env.REACT_APP_KLATYN_NETWORK_ID
  ) {
    const { caver }: any = await GetCaver();
    const pr = await customFromWei(price, caver, erc20Token);
    return pr;
  } else {
    const { web3 }: any = await EnableEthereum(true);
    const pr = await customFromWei(price, web3, erc20Token);
    return pr;
  }
};

const ExploreAction = (
  pageNo: any,
  network_id: string,
  collection_address: string,
  category: string,
  sort: string,
  saletype: string,
  search_keyword: any,
) => {
  return async (dispatch: any) => {
    try {
      const result = await getExploreApi(
        pageNo,
        network_id,
        collection_address,
        category,
        sort,
        saletype,
        search_keyword,
      );
      if (result?.data?.status) {
        for (let index = 0; index < result.data.data.length; index++) {
          const element = result.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            result.data.data[index].eth_price = res;
          }
        }
        dispatch({ type: SET_EXPLORE_IS_NULL, payload: false });
        if (pageNo == 1) {
          dispatch({ type: SET_EXPLORE_ITEMS, payload: result.data.data });
        } else {
          dispatch({ type: UPDATE_EXPLORE_ITEMS, payload: result.data.data });
        }
        return result.data.data;
      } else {
        dispatch({ type: SET_EXPLORE_IS_NULL, payload: true });
        if (pageNo == 1) {
          dispatch({ type: SET_EXPLORE_ITEMS, payload: [] });
        }
      }
    } catch (error) {
      return error;
    }
  };
};

const ExploreAllCollections = () => {
  return async (dispatch: any) => {
    try {
      const result = await getAllCollectionsApi();
      if (result.data) {
        dispatch({ type: SET_COLLECTION_ITEMS, payload: result.data.data });
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const MostLikedAction = () => {
  return async (dispatch: any) => {
    try {
      const result = await getMostLikedItems();
      if (result?.data?.status) {
        for (let index = 0; index < result.data.data.length; index++) {
          const element = result.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            result.data.data[index].eth_price = res;
          }
        }
        dispatch({ type: MOST_LIKED_ITEMS, payload: result.data.data });
        return result?.data?.data;
      } else {
        return result?.data?.data;
      }
    } catch (error) {
      return error;
    }
  };
};

const ClubrareDropsAction = (pageNo: number, filter: string) => {
  return async (dispatch: any) => {
    try {
      const result = await getClubrareDropsApi(pageNo, filter);
      if (result.data.status) {
        for (let index = 0; index < result.data.data.length; index++) {
          const element = result.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            result.data.data[index].eth_price = res;
          }
        }

        dispatch({ type: SET_CLUBRARE_DROP_IS_NULL, payload: false });
        if (pageNo == 1) {
          dispatch({
            type: SET_CLUBRARE_DROP_ITEMS,
            payload: result.data.data,
          });
        } else {
          dispatch({
            type: UPDATE_CLUBRARE_DROP_ITEMS,
            payload: result.data.data,
          });
        }
      } else {
        dispatch({ type: SET_CLUBRARE_DROP_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const ClubrareDropsRecentAction = (
  pageNo: number,
  network_id: string,
  category: string,
  sort: string,
) => {
  return async (dispatch: any) => {
    try {
      const result = await getClubrareDropsRecentApi(
        pageNo,
        network_id,
        category,
        sort,
      );
      if (result?.data?.status) {
        for (let index = 0; index < result.data.data.length; index++) {
          const element = result.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            result.data.data[index].eth_price = res;
          }
        }
        dispatch({ type: SET_CLUBRARE_RECENT__DROP_IS_NULL, payload: false });
        if (pageNo == 1) {
          dispatch({
            type: SET_CLUBRARE_RECENT_DROP_ITEMS,
            payload: result.data.data,
          });
        } else {
          dispatch({
            type: UPDATE_CLUBRARE_RECENT__DROP_ITEMS,
            payload: result.data.data,
          });
        }
      } else {
        dispatch({ type: SET_CLUBRARE_RECENT__DROP_IS_NULL, payload: true });
        dispatch({
          type: SET_CLUBRARE_RECENT_DROP_ITEMS,
          payload: [],
        });
      }
    } catch (error) {
      return error;
    }
  };
};

const fetchRecentAuctionCollectiblesAction = (pageNo: number) => {
  return async (dispatch: any) => {
    if (pageNo == 1) {
      dispatch({ type: AUCTION_LOADING, payload: true });
    }
    const res = await getRecentAuctionCollectiblesApi(pageNo);
    dispatch({ type: AUCTION_LOADING, payload: false });
    if (res?.data) {
      const { data } = res?.data;
      if (res?.data?.status) {
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const result = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            res.data.data[index].eth_price = result;
          }
        }
        if (pageNo >= 1) {
          dispatch({ type: SET_RECENT_AUCTION, payload: res.data.data });
        } else {
          dispatch({ type: UPDATE_AUCTION_ITEMS, payload: res.data.data });
        }
      } else {
        if (pageNo == 1) {
          dispatch({ type: SET_RECENT_AUCTION, payload: [] });
        }
        dispatch({ type: SET_AUCTION_IS_NULL, payload: true });
      }
      return data;
    } else {
      return false;
    }
  };
};

const fetchLiveAuctionCollectiblesAction = (pageNo: number) => {
  return async (dispatch: any) => {
    if (pageNo == 1) {
      dispatch({ type: AUCTION_LOADING, payload: true });
    }
    const res = await getLiveAuctionCollectiblesApi(pageNo);
    dispatch({ type: AUCTION_LOADING, payload: false });
    if (res?.data) {
      const { data } = res?.data;
      if (res?.data?.status) {
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const result = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            res.data.data[index].eth_price = result;
          }
        }
        if (pageNo >= 1) {
          dispatch({ type: SET_LIVE_AUCTION, payload: res.data.data });
        } else {
          dispatch({ type: UPDATE_AUCTION_ITEMS, payload: res.data.data });
        }
      } else {
        if (pageNo == 1) {
          dispatch({ type: SET_LIVE_AUCTION, payload: [] });
        }
        dispatch({ type: SET_AUCTION_IS_NULL, payload: true });
      }
      return data;
    } else {
      return false;
    }
  };
};

const fetchMostViewedAuctionCollectiblesAction = (
  pageNo: number,
  days = 'all',
) => {
  return async (dispatch: any) => {
    if (pageNo == 1) {
      dispatch({ type: AUCTION_LOADING, payload: true });
    }
    const res = await getMostViewedAuctionCollectiblesApi(pageNo, days);
    dispatch({ type: AUCTION_LOADING, payload: false });
    if (res?.data) {
      const { data } = res?.data;
      if (res?.data?.status) {
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const result = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            res.data.data[index].eth_price = result;
          }
        }
        if (pageNo >= 1) {
          dispatch({ type: SET_MOST_VIEWED_AUCTION, payload: res.data.data });
        } else {
          dispatch({ type: UPDATE_AUCTION_ITEMS, payload: res.data.data });
        }
      } else {
        if (pageNo == 1) {
          dispatch({ type: SET_MOST_VIEWED_AUCTION, payload: [] });
        }
        dispatch({ type: SET_AUCTION_IS_NULL, payload: true });
      }
      return data;
    } else {
      return false;
    }
  };
};

const fetchHotBidsAuctionCollectiblesAction = (pageNo: number) => {
  return async (dispatch: any) => {
    if (pageNo == 1) {
      dispatch({ type: AUCTION_LOADING, payload: true });
    }
    const res = await getHotBidsAuctionCollectiblesApi(pageNo);
    dispatch({ type: AUCTION_LOADING, payload: false });
    if (res?.data) {
      const { data } = res?.data;
      if (res?.data?.status) {
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const result = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            res.data.data[index].eth_price = result;
          }
        }
        if (pageNo >= 1) {
          dispatch({ type: SET_HOT_BIDS_AUCTION, payload: res.data.data });
        } else {
          dispatch({ type: UPDATE_AUCTION_ITEMS, payload: res.data.data });
        }
      } else {
        if (pageNo == 1) {
          dispatch({ type: SET_HOT_BIDS_AUCTION, payload: [] });
        }
        dispatch({ type: SET_AUCTION_IS_NULL, payload: true });
      }
      return data;
    } else {
      return false;
    }
  };
};

const UpdateExplorePageNo = (page: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_EXPLORE_PAGE, payload: page });
  };
};
const UpdateClubrareDropPageNo = (page: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_CLUBRARE_RECENT__DROP_PAGE, payload: page });
  };
};

const UpdateLazyLeoPageNo = (page: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_LAZY_LEO_PAGE, payload: page });
  };
};

const updateAuctionPage = () => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_ACTION_PAGE });
  };
};

const fetchAuctionCollectiblesAction = (pageNo: number) => {
  return async (dispatch: any) => {
    dispatch({ type: AUCTION_LOADING, payload: true });
    const res = await getAuctionCollectiblesApi(pageNo);
    dispatch({ type: AUCTION_LOADING, payload: false });
    if (res?.data) {
      const { data } = res?.data;
      if (res?.data?.status) {
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const result = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            res.data.data[index].eth_price = result;
          }
        }
        if (pageNo == 1) {
          dispatch({ type: SET_AUCTION, payload: res.data.data });
        } else {
          dispatch({ type: UPDATE_AUCTION_ITEMS, payload: res.data.data });
        }
      } else {
        if (pageNo == 1) {
          dispatch({ type: SET_AUCTION, payload: [] });
        }
        dispatch({ type: SET_AUCTION_IS_NULL, payload: true });
      }
      return data;
    } else {
      return false;
    }
  };
};

export {
  ExploreAction,
  fetchAuctionCollectiblesAction,
  fetchRecentAuctionCollectiblesAction,
  fetchLiveAuctionCollectiblesAction,
  fetchMostViewedAuctionCollectiblesAction,
  fetchHotBidsAuctionCollectiblesAction,
  MostLikedAction,
  UpdateLazyLeoPageNo,
  UpdateExplorePageNo,
  ClubrareDropsAction,
  updateAuctionPage,
  UpdateClubrareDropPageNo,
  ExploreAllCollections,
  ClubrareDropsRecentAction,
};
