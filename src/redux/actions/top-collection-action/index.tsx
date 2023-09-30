import { EnableEthereum, GetCaver } from '../../../service/web3-service';
import {
  getCollectionLListApi,
  topCollectionApi,
} from '../../api/top-collection-api';
import {
  SET_TOP_COLLECTION_IS_NULL,
  SET_TOP_COLLECTION_ITEMS,
  UPDATE_TOP_COLLECTION_ITEMS,
} from '../../types';
import { useCustomStableCoin } from '../../../hooks';
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

const getTopCollectionAction = (collection_address: string) => {
  return async () => {
    try {
      const result = await topCollectionApi(collection_address);
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

const CollectionAction = (
  pageNo: any,
  collection_address: string,
  sort: string,
  search_keyword: any,
) => {
  return async (dispatch: any) => {
    try {
      const result = await getCollectionLListApi(
        pageNo,
        collection_address,
        sort,
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
        dispatch({ type: SET_TOP_COLLECTION_IS_NULL, payload: false });
        if (pageNo == 1) {
          dispatch({
            type: SET_TOP_COLLECTION_ITEMS,
            payload: result.data.data,
          });
          return result.data.data;
        } else {
          dispatch({
            type: UPDATE_TOP_COLLECTION_ITEMS,
            payload: result.data.data,
          });
          return result.data.data;
        }
      } else {
        dispatch({ type: SET_TOP_COLLECTION_IS_NULL, payload: true });
        if (pageNo == 1) {
          dispatch({ type: SET_TOP_COLLECTION_ITEMS, payload: [] });
          return [];
        }
      }
    } catch (error) {
      dispatch({ type: SET_TOP_COLLECTION_ITEMS, payload: [] });
    }
  };
};

export { getTopCollectionAction, CollectionAction };
