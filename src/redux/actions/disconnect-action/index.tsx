import { disconnectWalletApi } from '../../api/disconnect-wallet-api';
import { SET_ITEM_DETAILS } from '../../types';

const DisconnectData = () => {
  return async (dispatch: any) => {
    try {
      dispatch({ type: SET_ITEM_DETAILS, payload: {} });
      localStorage.clear();
    } catch (error) {
      return error;
    }
  };
};

const disconnectWalletAction = (data: any) => {
  return async () => {
    try {
      const result = await disconnectWalletApi(data);
      if (result) {
        const { data } = result;
        return data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export { DisconnectData, disconnectWalletAction };
