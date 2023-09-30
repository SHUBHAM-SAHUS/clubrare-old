import { SET_IS_CONNECTED } from '../../types';

const setIsConnectAction = (isConnected: any) => {
  return (dispatch: any) => {
    dispatch({ type: SET_IS_CONNECTED, payload: isConnected });
  };
};

export { setIsConnectAction };
