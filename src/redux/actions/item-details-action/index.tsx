import { EnableEthereum, EnableKlyten } from '../../../service/web3-service';
import {
  createCollectibleViewApi,
  getHistoryApi,
  getItemDetailsApi,
  getOfferApi,
} from '../../api';
import { SET_ITEM_DETAILS } from '../../types';
// import { useCustomStableCoin } from '../../../hooks';

// const { customFromWei } = useCustomStableCoin();
// const getWeiPrice = async (price: any,erc20Token:any) => {
//   if (
//     localStorage.getItem('networkId') ===
//     process.env.REACT_APP_KLATYN_NETWORK_ID
//   ) {
//     const { caver }: any = await EnableKlyten(true);
//     const pr = await customFromWei(price, caver, erc20Token);
//     return pr;
//   } else {
//     const { web3 }: any = await EnableEthereum(true);
//     const pr = await customFromWei(price, web3, erc20Token);
//     return pr;
//   }
// };
const ItemDetailsAction = (data: any) => {
  return async (dispatch: any) => {
    try {
      const result = await getItemDetailsApi(data);
      if (result.data) {
        const { data } = result.data;
        // const bids: Array<any> = data?.auctionDetails?.bids;
        // if (bids && bids.length > 0) {
        //   for (let index = 0; index < bids.length; index++) {
        //     const element = bids[index];
        //     let pr = await getWeiPrice('' + element.returnValues.amouont,);
        //     pr = parseFloat('' + pr).toFixed(4);
        //     bids[index].returnValues.amouont = pr;
        //   }
        // }
        dispatch({ type: SET_ITEM_DETAILS, payload: data });
        if (
          data &&
          data?._id &&
          localStorage.getItem('Wallet Address') &&
          localStorage.getItem('token') &&
          localStorage.getItem('isConnected') &&
          localStorage.getItem('isConnected') == 'true'
        )
          await createCollectibleViewApi({ _id: data._id });
        return result.data;
      } else {
        return result;
      }
    } catch (error) {
      return false;
    }
  };
};

const historyapiAction = (data: any) => {
  return async () => {
    try {
      const result = await getHistoryApi(data);
      if (result.data) {
        return result.data.data;
      }
    } catch (error) {
      return error;
    }
  };
};
const offerApiAction = (data: any) => {
  return async () => {
    try {
      const result = await getOfferApi(data);
      if (result.data) {
        return result.data.data;
      }
    } catch (error) {
      return;
    }
  };
};

export { ItemDetailsAction, historyapiAction, offerApiAction };
