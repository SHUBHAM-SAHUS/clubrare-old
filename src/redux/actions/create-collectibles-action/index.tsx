import { EnableEthereum, EnableKlyten } from '../../../service/web3-service';
import {  useCustomStableCoin } from '../../../hooks';
import {
  postCreateCollectibleApi,
  postCreateCollectionApi,
  postUpdateCollectibleApi,
  getListCollectionApi,
  getTopCollectionApi,
  eventsApi,
  getCollectibleByCollectionApi,
  getListPendingCollectiblesApi,
  postCreateCollectibleApiForUser,
  setApprovalStatusApi,
  setChageHideStatusApi,
  getCollectionByUserApi,
  addAuthenticationPurchaseApi,
  collectibleLocationUpdateApi,
} from '../../api';
import {
  SET_COLLECTION_ITEMS,
  SET_COLLECTION_ITEM_IS_NULL,
  UPDATE_COLLECTION_ITEMS,
} from '../../types';


const createCollectiblesAction = (data: any) => {
  return async () => {
    try {
      const result = await postCreateCollectibleApi(data);
      if (result.data && result.data.data) {
        return result.data.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};
const createCollectiblesActionForUser = (data: any) => {
  return async () => {
    try {
      const result = await postCreateCollectibleApiForUser(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const createCollectionAction = (data: any) => {
  return async () => {
    try {
      const result = await postCreateCollectionApi(data);
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

const getCollectionAction = (data: any) => {
  return async () => {
    try {
      const result = await getListCollectionApi(data);
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

const getPendingCollectiblesAction = (data: any) => {
  return async () => {
    try {
      const result = await getListPendingCollectiblesApi(data);
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

const getTopCollectionAction = (data: any) => {
  return async () => {
    try {
      const result = await getTopCollectionApi(data);
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

const updateCollectibleAction = (data: any) => {
  return async () => {
    try {
      const result = await postUpdateCollectibleApi(data);
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

const eventsAction = (data: any) => {
  return async () => {
    try {
      const result = await eventsApi(data);
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

const getCollectibleByCollectionAction = (data: any) => {
  return async (dispatch: any) => {
    try {
      const result = await getCollectibleByCollectionApi(data);
      if (result.data.status) {
        const items = result?.data.data;
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          if (element?.auction_detail?.auctionType == '2') {
            const res = await getWeiPrice(
              element?.auction_detail?.startingPrice,
              element?.auction_detail?.erc20Token,
            );
            items[index].eth_price = res;
          }
        }

        if (data.page_number == 1) {
          dispatch({ type: SET_COLLECTION_ITEMS, payload: items });
          dispatch({ type: SET_COLLECTION_ITEM_IS_NULL, payload: false });
        } else {
          dispatch({ type: UPDATE_COLLECTION_ITEMS, payload: items });
          dispatch({ type: SET_COLLECTION_ITEM_IS_NULL, payload: false });
        }
      } else {
        dispatch({ type: SET_COLLECTION_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const { customFromWei } = useCustomStableCoin();
const getWeiPrice = async (price: string, ercAddress: string) => {
  if (
    localStorage.getItem('networkId') ===
    process.env.REACT_APP_KLATYN_NETWORK_ID
  ) {
    const { caver }: any = await EnableKlyten(true);
    const pr = await customFromWei(price, caver, ercAddress);
    return pr;
  } else {
    const { web3 }: any = await EnableEthereum(true);
    const pr = await customFromWei(price, web3, ercAddress);
    return pr;
  }
};

const setApprovalStatusAction = (data: any) => {
  return async () => {
    try {
      const result = await setApprovalStatusApi(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const setChageHideStatusAction = (data: any) => {
  return async () => {
    try {
      const result = await setChageHideStatusApi(data);
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

const getCollectionByUserAction = (data: any) => {
  return async () => {
    try {
      const result = await getCollectionByUserApi(data);
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

const addAuthenticationPurchaseAction = (data: any) => {
  return async () => {
    try {
      const result = await addAuthenticationPurchaseApi(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const collectibleLocationUpdateAction = (data: any) => {
  return async () => {
    try {
      const result = await collectibleLocationUpdateApi(data);
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

export {
  createCollectiblesAction,
  createCollectiblesActionForUser,
  createCollectionAction,
  getCollectibleByCollectionAction,
  updateCollectibleAction,
  getCollectionAction,
  getTopCollectionAction,
  eventsAction,
  getPendingCollectiblesAction,
  setApprovalStatusAction,
  setChageHideStatusAction,
  getCollectionByUserAction,
  collectibleLocationUpdateAction,
  addAuthenticationPurchaseAction,
};
