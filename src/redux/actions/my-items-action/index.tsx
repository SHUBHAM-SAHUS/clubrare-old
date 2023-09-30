import {
  getCreatedItemsApi,
  getCollectibleApi,
  getOnSaleApi,
  getOtherCollectibleApi,
  getOtherOnSaleApi,
  setDeleteData,
  setUpdateData,
  changehidestatusagetapi,
} from '../../api';
import {
  SET_CREATED_ITEMS,
  SET_PENDING_COLLECTIBLES_ITEMS,
  SET_COLLECTIBLE_ITEMS,
  GET_ON_SALE,
  UPDATE_CREATED_ITEMS,
  UPDATE_COLLECTIBLE_ITEMS,
  UPDATE_ON_SALE,
  SET_CREATED_ITEM_IS_NULL,
  UPDATE_CREATED_PAGE,
  UPDATE_COLLECTED_PAGE,
  UPDATE_ON_SALE_PAGE,
  SET_ON_SALE_ITEM_IS_NULL,
  SET_COLLECTED_ITEM_IS_NULL,
  UPDATE_COLLECTIBLE_PAGE,
  UPDATE_PENDING_COLLECTIBLE_PAGE,
  UPDATE_PENDING_COLLECTIBLES_ITEMS,
  SET_PENDING_COLLECTED_ITEM_IS_NULL,
  UPDATE_HIDDEN_ITEMS,
  SET_HIDDEN_ITEM_IS_NULL,
  SET_HIDDEN_ITEMS,
  UPDATE_HIDDEN_PAGE,
} from '../../types';
import { EnableEthereum, EnableKlyten } from '../../../service/web3-service';
import { useCustomStableCoin } from '../../../hooks';
const { customFromWei } = useCustomStableCoin();
const getWeiPrice = async (price: string, erc20Token: any) => {
  if (
    localStorage.getItem('networkId') ===
    process.env.REACT_APP_KLATYN_NETWORK_ID
  ) {
    const { caver }: any = await EnableKlyten(true);
    const pr = await customFromWei(price, caver, erc20Token);
    return pr;
  } else {
    const { web3 }: any = await EnableEthereum(true);
    const pr = await customFromWei(price, web3, erc20Token);
    return pr;
  }
};

const getCreatedItemsAction = (
  address: string,
  page: number,
  limit: number,
) => {
  return async (dispatch: any) => {
    try {
      const result = await getCreatedItemsApi(address, page, limit);
      if (result.data.status) {
        const items = result?.data?.data;
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }
        if (page == 1) {
          dispatch({ type: SET_CREATED_ITEMS, payload: items });
        } else {
          dispatch({ type: UPDATE_CREATED_ITEMS, payload: items });
        }
      } else {
        dispatch({ type: SET_CREATED_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const getHiddenItemsAction = (address: string, page: number, limit: number) => {
  return async (dispatch: any) => {
    try {
      const result = await changehidestatusagetapi(address, page, limit);
      if (result.data.status) {
        const finalData = result && result.data && result.data.data;

        const items = [...finalData];
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }
        if (page == 1) {
          dispatch({ type: SET_HIDDEN_ITEMS, payload: items });
        } else {
          dispatch({ type: UPDATE_HIDDEN_ITEMS, payload: items });
        }
        return result.data;
      } else {
        dispatch({ type: SET_HIDDEN_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const getCollectibleAction = (address: string, page: number, limit: number) => {
  return async (dispatch: any) => {
    try {
      const result = await getCollectibleApi(address, page, limit);
      if (result.data.status) {
        const items = result && result.data && result.data.data;
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }
        if (page == 1) {
          dispatch({ type: SET_COLLECTIBLE_ITEMS, payload: items });
        } else {
          dispatch({ type: UPDATE_COLLECTIBLE_ITEMS, payload: items });
        }
      } else {
        dispatch({ type: SET_COLLECTED_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const getPendingCollectibleAction = (
  address: string,
  page: number,
  limit: number,
) => {
  return async (dispatch: any) => {
    try {
      const result = await getOnSaleApi(address, page, limit);
      if (result.data.status) {
        const finalData = result && result.data && result.data.data;
        const items = [...finalData];
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }
        if (page == 1) {
          dispatch({ type: SET_PENDING_COLLECTIBLES_ITEMS, payload: items });
        } else {
          dispatch({ type: UPDATE_PENDING_COLLECTIBLES_ITEMS, payload: items });
        }
      } else {
        dispatch({ type: SET_PENDING_COLLECTED_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const getOtherCollectibleAction = (
  address: string,
  page: number,
  limit: number,
) => {
  return async (dispatch: any) => {
    try {
      const result = await getOtherCollectibleApi(address, page, limit);
      if (result.data.status) {
        const items = result?.data?.data;
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }
        if (page == 1) {
          dispatch({ type: SET_COLLECTIBLE_ITEMS, payload: items });
        } else {
          dispatch({ type: UPDATE_COLLECTIBLE_ITEMS, payload: items });
        }
      } else {
        dispatch({ type: SET_COLLECTED_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const getOtherPendingCollectibleAction = (
  address: string,
  page: number,
  limit: number,
) => {
  return async (dispatch: any) => {
    try {
      const result = await getOtherOnSaleApi(address, page, limit);
      if (result.data.status) {
        const finalData = result && result.data && result.data.data;
        const items = [...finalData];
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }
        if (page == 1) {
          dispatch({ type: SET_PENDING_COLLECTIBLES_ITEMS, payload: items });
        } else {
          dispatch({ type: UPDATE_PENDING_COLLECTIBLES_ITEMS, payload: items });
        }
      } else {
        dispatch({ type: SET_PENDING_COLLECTED_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const getOnSaleAction = (address: string, page: number, limit: number) => {
  return async (dispatch: any) => {
    try {
      const result = await getOnSaleApi(address, page, limit);
      if (result.data.status) {
        const finalData = result && result.data && result.data.data;
        const items = [...finalData];
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }
        if (page == 1) {
          dispatch({ type: GET_ON_SALE, payload: items });
        } else {
          dispatch({ type: UPDATE_ON_SALE, payload: items });
        }
        return result.data;
      } else {
        dispatch({ type: SET_ON_SALE_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const getOtherOnSaleAction = (address: string, page: number, limit: number) => {
  return async (dispatch: any) => {
    try {
      const result = await getOtherOnSaleApi(address, page, limit);
      if (result.data.status) {
        const finalData = result && result.data && result.data.data;
        const items = [...finalData];
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auctionDetails?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auctionDetails?.startingPrice,
              element?.auctionDetails?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }
        if (page == 1) {
          dispatch({ type: GET_ON_SALE, payload: items });
        } else {
          dispatch({ type: UPDATE_ON_SALE, payload: items });
        }
        return result.data;
      } else {
        dispatch({ type: SET_ON_SALE_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const deleteData = (data: any) => {
  return async () => {
    try {
      const result = await setDeleteData(data);
      if (result) {
        return result;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const updateData = (data: any) => {
  return async () => {
    try {
      const result = await setUpdateData(data);
      if (result) {
        return result;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const UpdatedCreatedPage = (pageNo: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_CREATED_PAGE, payload: pageNo });
  };
};

const UpdatedHiddenPage = (pageNo: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_HIDDEN_PAGE, payload: pageNo });
  };
};

const UpdatedCollectablePage = (pageNo: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_COLLECTED_PAGE, payload: pageNo });
  };
};

const UpdatedOnSalePage = (pageNo: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_ON_SALE_PAGE, payload: pageNo });
  };
};

const UpdateCollectiblePage = (pageNo: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_COLLECTIBLE_PAGE, payload: pageNo });
  };
};

const UpdatePendingCollectiblePage = (pageNo: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_PENDING_COLLECTIBLE_PAGE, payload: pageNo });
  };
};

export {
  getCreatedItemsAction,
  getOtherPendingCollectibleAction,
  getPendingCollectibleAction,
  UpdatePendingCollectiblePage,
  getCollectibleAction,
  getOnSaleAction,
  deleteData,
  updateData,
  UpdatedCreatedPage,
  UpdatedCollectablePage,
  UpdatedOnSalePage,
  UpdateCollectiblePage,
  getOtherCollectibleAction,
  getOtherOnSaleAction,
  getHiddenItemsAction,
  UpdatedHiddenPage,
};
