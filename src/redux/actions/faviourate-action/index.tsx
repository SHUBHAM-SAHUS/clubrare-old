import { EnableKlyten, EnableEthereum } from '../../../service/web3-service';
import { getFaviourateApi, reactOnPostApi } from '../../api';
import { useCustomStableCoin } from '../../../hooks';
import {
  FAVIOURATE_ITEM_IS_NULL,
  GET_ON_FAVIOURATE,
  UPDATE_ON_FAVIOURATE,
  UPDATE_ON_FAVIOURATE_PAGE,
} from '../../types/faviourate-types';
const { customFromWei } = useCustomStableCoin();
const getWeiPrice = async (price: string,erc20Token:any) => {
  if (
    localStorage.getItem('networkId') ===
    process.env.REACT_APP_KLATYN_NETWORK_ID
  ) {
    const { caver }: any = await EnableKlyten();
    const pr = await customFromWei(price, caver, erc20Token);
    return pr;
  } else {
    const { web3 }: any = await EnableEthereum();
    const pr = await customFromWei(price, web3, erc20Token);
    return pr;
  }
};
const getOnFaviourateAction = (
  address: string,
  page: number,
  limit: number,
) => {
  return async (dispatch: any) => {
    try {
      const result = await getFaviourateApi(address.toLowerCase(), page, limit);
      if (result.data.status) {
        const finalData = result && result.data && result.data.data;
        const items = [...finalData];
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
        if (page == 1) {
          dispatch({ type: GET_ON_FAVIOURATE, payload: items });
        } else {
          dispatch({ type: UPDATE_ON_FAVIOURATE, payload: items });
        }
        return result.data;
      } else {
        dispatch({ type: FAVIOURATE_ITEM_IS_NULL, payload: true });
      }
    } catch (error) {
      return error;
    }
  };
};

const reactOnPost = (data: any) => {
  return async () => {
    try {
      const result = await reactOnPostApi(data);
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
const UpdatedOnFaviouratePage = (pageNo: number) => {
  return (dispatch: any) => {
    dispatch({ type: UPDATE_ON_FAVIOURATE_PAGE, payload: pageNo });
  };
};
export { getOnFaviourateAction, UpdatedOnFaviouratePage, reactOnPost };
