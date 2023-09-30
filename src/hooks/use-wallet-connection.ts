import { isMobile } from 'react-device-detect';
import { getWeb3 } from '../service/web3-service';
import { useToasts } from 'react-toast-notifications';
import Caver from 'caver-js';
import {
  disconnectWalletAction,
  getNonceAction,
  setIsConnectAction,
  verifySignatureAction,
} from '../redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  SET_WALLET_AMOUNT,
  UPDATE_WALLET_AMOUNT,
} from '../redux/types/connect-wallet-types';
import { SET_IS_CONNECTED } from '../redux/types';
import {
  getItemLocalStorage,
  setItemLocalStorage,
  removeItemLocalStorage,
  clearLocalStorage,
} from '../utils/browser-storage';
import { GET_PROFILE_DETAILS } from '../redux/types/profile-types';

declare const window: any;

export const useCommonWalletConnection = (
  getItemDetails: () => void,
  getEditProfileAction: any,
) => {

  const klaytnNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const ethNetworkId = process.env.REACT_APP_NFT_NETWORK_ID;
  const hexaCheck = process.env.REACT_APP_NFT_NETWORK_ID_HEXA;

  const dispatch = useDispatch();
  const { addToast } = useToasts();
  //disconnect wallet
  const resetLoacalStrorage = async () => {
    const req = {
      deviceToken: '',
    };

    try {
      const res: any = await dispatch(disconnectWalletAction(req));
      if (res) {
        dispatch({ type: SET_WALLET_AMOUNT, payload: '' });
        dispatch({ type: SET_IS_CONNECTED, payload: false });
        dispatch({ type: GET_PROFILE_DETAILS, payload: [] });
        removeItemLocalStorage('wallet_amount');
        removeItemLocalStorage('Wallet Address');
        removeItemLocalStorage('isConnected');
        removeItemLocalStorage('token');
        removeItemLocalStorage('Role');
        removeItemLocalStorage('isSuperAdmin');
        removeItemLocalStorage('signature');
        removeItemLocalStorage('Custom Url');
      }
    } catch {
      getItemDetails();
    }
  };
  // for login
  const loginUser = async (obj: any) => {
    const walletAddress = await getItemLocalStorage('Wallet Address');

    const getProfileQuery = {
      user_address: walletAddress,
    };
    const req = {
      nonce: obj.nonce,
      signature: obj.signature,
      network_id: String(obj.network_id),
      deviceToken: '',
    };
    try {
      const res: any = await dispatch(verifySignatureAction(req));
      if (res.status) {
        dispatch(setIsConnectAction(res.data?.token));
        setItemLocalStorage('Role', res.data?.user?.role);
        setItemLocalStorage(
          'isSuperAdmin',
          res.data?.user?.isSuperAdmin ? 'true' : 'false',
        );
        setItemLocalStorage('isConnected', 'true');
        setItemLocalStorage('token', res.data?.token);
        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });

        setItemLocalStorage('Custom Url', res?.data?.user?.custom_url);
        dispatch({ type: SET_IS_CONNECTED, payload: true });
        await dispatch(getEditProfileAction(getProfileQuery));
        await getItemDetails();
      } else {
        await clearLocalStorage();
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (err) {
      await clearLocalStorage();

      addToast('There is some issue, Please try again later', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const afterSignInRequest = async (obj: any) => {
    obj.sign
      .then((response: any) => {
        obj['signature'] = response;
        setItemLocalStorage('signature', response);

        loginUser(obj);
      })
      .catch(async (err: any) => {
        await clearLocalStorage();
      });
  };

  // handle metamsk for mobile
  const handleMetamaskForMobile = () => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      handleMetamaskForWeb();
    } else {
      window.location.href =
        process.env.REACT_APP_METAMASK_DEEP_LINK_FOR_MOBILE;
    }
  };

  const handleMetamaskForWeb = async () => {
    const { web3 }: any = await getWeb3();
    try {
      if (window.ethereum) {
        const checkwalletnetwork = await window.ethereum.networkVersion;
        if (ethNetworkId !== checkwalletnetwork) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexaCheck }],
          });
        }
      }
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      if (networkId == ethNetworkId) {
        web3.eth.getBalance(accounts[0], function (err: any, result: any) {
          if (err) {
            dispatch({ type: UPDATE_WALLET_AMOUNT, payload: false });
          } else {
            const amount = web3.utils.fromWei(result, 'ether');
            localStorage.setItem('wallet_amount', amount);
            dispatch({ type: SET_WALLET_AMOUNT, payload: amount });
            dispatch({ type: UPDATE_WALLET_AMOUNT, payload: false });
          }
        });

        setItemLocalStorage('networkId', networkId);
        if (accounts[0] && networkId) {
          dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
          const walletaddress: any = accounts[0];
          try {
            const reqObj = {
              wallet_address: walletaddress,
              network_id: ethNetworkId,
            };
            if (!localStorage.getItem('Wallet Address')) {
              const res: any = await dispatch(getNonceAction(reqObj));
              const nonce = res?.data;
              if (nonce) {
                setItemLocalStorage('Wallet Address', walletaddress);
                const sign = web3.eth.personal.sign(
                  `${nonce}`,
                  walletaddress,
                  '',
                );
                const obj = {
                  sign: sign,
                  nonce: nonce,
                  wallet_address: walletaddress,
                  network_id: 1,
                };
                afterSignInRequest(obj);
              }
            }
          } catch (err) {
            await clearLocalStorage();
          }
        } else {
          setItemLocalStorage('networkId', 'notallowed');
        }
      }
    } catch (err: any) {
      addToast('There is some issue. Please try again later.', {
        appearance: 'error',
        autoDismiss: true,
      });

      return false;
    }
  };
  // metamask handler
  const metamaskClickHandler = async () => {
    if (isMobile) {
      handleMetamaskForMobile();
    } else {
      handleMetamaskForWeb();
    }
  };

  // kaikass handler

  const kaikasClickHandler = async () => {
    try {
      const klaytn = window.klaytn;
      if (klaytn.networkVersion.toString() === klaytnNetworkId) {
        setItemLocalStorage('networkId', klaytn.networkVersion);
        setItemLocalStorage('KlaytnNetworkId', klaytn.networkVersion);
        const accounts = await klaytn.enable();
        if (accounts[0]) {
          const walletaddress: any = accounts[0];
          try {
            const reqObj = {
              wallet_address: walletaddress,
              network_id: klaytnNetworkId,
            };
            if (!localStorage.getItem('Wallet Address')) {
              const res: any = await dispatch(getNonceAction(reqObj));
              const nonce = res.data;
              setItemLocalStorage('Wallet Address', walletaddress);
              setItemLocalStorage('KlaytnWalletAddress', walletaddress);
              const caver = new Caver(window.klaytn);
              const sign = caver.klay.sign(`${nonce}`, walletaddress);
              const obj = {
                sign: sign,
                nonce: nonce,
                wallet_address: walletaddress,
                network_id: 2,
              };

              afterSignInRequest(obj);
            }
          } catch (err) {
            await clearLocalStorage();
          }
        }
      } else {
        setItemLocalStorage('networkId', 'notallowed');
        addToast('Please check network type!', {
          appearance: 'error',
          autoDismiss: true,
        });

        return;
      }
    } catch (error) {
      return false;
    }
  };

  //check valid user
  const checkValidUser = async (networkId: string) => {
    const walletAddress = await getItemLocalStorage('Wallet Address');
    if (networkId === '1') {
      const { web3 }: any = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      if (walletAddress === accounts[0]) {
        return true;
      } else {
        await resetLoacalStrorage();
        await metamaskClickHandler();
      }
    } else if (networkId === '2') {
      const klaytn = window.klaytn;
      const klayAccounts = await klaytn.enable();
      if (walletAddress === klayAccounts[0]) {
        return true;
      } else {
        await resetLoacalStrorage();
        await kaikasClickHandler();
      }
    }
  };

  return {
    metamaskClickHandler,
    kaikasClickHandler,
    checkValidUser,
  };
};

export default useCommonWalletConnection;
