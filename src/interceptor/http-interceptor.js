import axios from 'axios';
import { store } from '../redux';
import { SET_WALLET_AMOUNT } from '../redux/types/connect-wallet-types';
import { SET_IS_CONNECTED } from '../redux/types';
import { routeMap } from '../router-map';
const { dispatch } = store;

//Add a request interceptor for user
axios.interceptors.request.use(
  (config) => {
    if (!config.url.includes('api.pinata.cloud')) {
      let userAuthData = localStorage.getItem('token');
      if (userAuthData) {
        config.headers.common['Authorization'] = `${userAuthData}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//Add a reponse interceptor for user
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      const pathName = window.location.pathname;
      let privatePath = [
        routeMap.create,
        routeMap.profile.edit,
        routeMap.userList,
        routeMap.productVerification,
        routeMap.redeemList,
        routeMap.reportsList,
        routeMap.approveList,
        routeMap.listNFT,
        routeMap.ilo,
        routeMap.presale,
        routeMap.stake,
        routeMap.ViewSells,
        routeMap.category,
        routeMap.adminWarehouse,
        routeMap.statsReports,
        routeMap.adminSellReport,
        routeMap.adminallItemReport,
        routeMap.escrowlistReport,
        // routeMap.vaultItemListReport,
      ];
      dispatch({ type: SET_WALLET_AMOUNT, payload: '' });
      dispatch({ type: SET_IS_CONNECTED, payload: false });
      localStorage.removeItem('wallet_amount');
      localStorage.removeItem('Wallet Address');
      localStorage.removeItem('profile');
      localStorage.removeItem('connected_with');
      localStorage.removeItem('isConnected');
      localStorage.removeItem('token');
      localStorage.removeItem('Role');
      localStorage.removeItem('isSuperAdmin');
      localStorage.removeItem('signature');
      if (privatePath.includes(pathName)) {
        window.location.replace('/connect-wallet');
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
