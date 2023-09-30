import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/main-layout/main-layout';
import { getWeb3 } from '../../service/web3-service';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsConnectAction,
  getNonceAction,
  verifySignatureAction,
} from '../../redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { UPDATE_WALLET_AMOUNT } from '../../redux/types/connect-wallet-types';
import { routeMap } from '../../router-map';
import './connect-wallet.css';
import Caver from 'caver-js';
import { isMobile } from 'react-device-detect';
import { imgConstants } from '../../assets/locales/constants';
declare const window: any;

function ConnectWallet() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const nftNetworkId: any = process.env.REACT_APP_NFT_NETWORK_ID;
  const hexacheck: any = process.env.REACT_APP_NFT_NETWORK_ID_HEXA;
  const [termsChecked, setTermsChecked] = useState(false);
  const [disableCheck, setDisableCheck] = useState<boolean>(false);
  const { addToast } = useToasts();

  const data: any = useSelector((state) => state);
  const ethNetworkId = '1';
  const klyNetworkId = '2';


  window.onbeforeunload = (e: any) => {
    if (
      localStorage.getItem('Wallet Address') &&
      !localStorage.getItem('signature')
    ) {
      resetLoacalStrorage();
    }
  };

  const metamaskClickHandler = async () => {
    if (!termsChecked) {
      addToast('Please check terms of use', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
    try {
      setDisableCheck(true);
      if (isMobile) {
        handleMetamaskForMobile();
      } else {
        loginWithMetmask();
      }
    } catch (error) {
      return false;
    }
  };

  const handleMetamaskForMobile = () => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      loginWithMetmask();
    } else {
      window.location.href =
        process.env.REACT_APP_METAMASK_DEEP_LINK_FOR_MOBILE;
      setDisableCheck(false);
    }
  };

  const loginWithMetmask = async () => {
    try {
      const { web3 }: any = await getWeb3();
      if (window.ethereum) {
        const checkwalletnetwork = await window.ethereum.networkVersion;
        if (nftNetworkId !== checkwalletnetwork) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexacheck }],
          });
        }
      }
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      if (networkId == nftNetworkId) {
        web3.eth.getBalance(accounts[0], function (err: any, result: any) {
          if (err) {
          } else {
            dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
          }
        });
        localStorage.setItem('networkId', networkId);
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
                localStorage.setItem('Wallet Address', walletaddress);
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
            resetLoacalStrorage();
            setDisableCheck(false);
          }
        } else {
          localStorage.setItem('networkId', 'notallowed');
          setDisableCheck(false);
        }
      }
    } catch (err: any) {
      addToast('There is some issue. Please try again later.', {
        appearance: 'error',
        autoDismiss: true,
      });
      setDisableCheck(false);
      return false;
    }
  };

  const afterSignInRequest = (obj: any) => {
    obj.sign
      .then((response: any) => {
        obj['signature'] = response;
        localStorage.setItem('signature', response);

        loginUser(obj);
      })
      .catch((err: any) => {
        resetLoacalStrorage();
        setDisableCheck(false);
      });
  };

  const loginUser = async (obj: any) => {
    const req = {
      nonce: obj.nonce,
      signature: obj.signature,
      network_id: String(obj.network_id),
      deviceToken: '',
    };
    try {
      const res: any = await dispatch(verifySignatureAction(req));
      if (res.status === true) {
        dispatch(setIsConnectAction(res.data?.token));
        localStorage.setItem('Role', res.data?.user?.role);
        localStorage.setItem(
          'isSuperAdmin',
          res.data?.user?.isSuperAdmin ? 'true' : 'false',
        );
        localStorage.setItem('isConnected', 'true');
        localStorage.setItem('token', res.data?.token);
        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        history.push(routeMap.home);
        localStorage.setItem("Custom Url", res?.data?.user?.custom_url);
        setDisableCheck(false);
      } else {
        resetLoacalStrorage();
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
        setDisableCheck(false);
      }
    } catch (err) {
      resetLoacalStrorage();
      addToast('There is some issue, Please try again later', {
        appearance: 'error',
        autoDismiss: true,
      });
      setDisableCheck(false);
    }
  };

  const resetLoacalStrorage = () => {
    localStorage.removeItem('Wallet Address');
    localStorage.removeItem('isConnected');
    localStorage.removeItem('token');
    localStorage.removeItem('Role');
    localStorage.removeItem('isSuperAdmin');
    dispatch(setIsConnectAction(false));
    localStorage.removeItem("signature");
    localStorage.removeItem("Custom Url");
  };

  const kaikasClickHandler = async () => {
    if (!termsChecked) {
      addToast('Please check terms of use', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }

    try {
      setDisableCheck(true);
      const klaytn = window.klaytn;
      if (klaytn.networkVersion.toString() === klatynNetworkId) {
        localStorage.setItem('networkId', klaytn.networkVersion);
        localStorage.setItem('KlaytnNetworkId', klaytn.networkVersion);
        const accounts = await klaytn.enable();
        if (accounts[0]) {
          const walletaddress: any = accounts[0];
          try {
            const reqObj = {
              wallet_address: walletaddress,
              network_id: klyNetworkId,
            };
            if (!localStorage.getItem('Wallet Address')) {
              const res: any = await dispatch(getNonceAction(reqObj));
              const nonce = res.data;
              localStorage.setItem('Wallet Address', walletaddress);
              localStorage.setItem('KlaytnWalletAddress', walletaddress);
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
            resetLoacalStrorage();
            setDisableCheck(false);
          }
        }
      } else {
        localStorage.setItem('networkId', 'notallowed');
        addToast('Please check network type!', {
          appearance: 'error',
          autoDismiss: true,
        });
        setDisableCheck(false);
        return;
      }
    } catch (error) {
      return false;
    }
  };

  const onChecked = (e: any) => {
    setTermsChecked(e.target.checked);
  };

  return (
    <MainLayout
      displaySidebar={false}
      mainClassName="connectwallet_page_wrp"
      loading={false}
    >
      <div className="container-fluid">
        <div className="flex flex-col justify-center items-center connectwall_inner">
          <div className="text-18 md:text-24 text-blue font-semibold mt-10 connectwatllhead">
            {t('connectWallet.title')}
          </div>
          <a
            href="https://docs.clubrare.xyz/terms-and-conditions"
            target="_blank"
            className="termsof_use"
            rel="noreferrer"
          >
            Term Of Use
          </a>

          <label className="inline-flex items-center">
            <div className="ml-2 text-center connect_wallet_wrp">
              <label>
                <input
                  checked={termsChecked}
                  type="checkbox"
                  onChange={onChecked}
                  className="form-checkbox text-pink-50"
                  disabled={disableCheck}
                />
                <span className="text-left ... pl-3">
                  I accept the Terms Of Use.
                </span>
              </label>
              <p>In order to continue, you must click the above checkbox.</p>
            </div>
          </label>
          <div className="flex wallet-card">
            <button
              className="flex justify-center space-x-4 items-center border border-solid 
             mt-6.5  bg-opacity-20 network-continer"
              onClick={metamaskClickHandler}
            >
              <div className="justify-center space-x-4 wallet-option items-center">
                <figure>
                  <img
                    className="wallet-img"
                    src={imgConstants.metamaskIcon}
                    alt="metamask-logo"
                  />
                </figure>
                <div className="text-22 font-semibold">MetaMask</div>
                <p className="text-14">
                  One of the most secure wallets
                  <br /> with great flexibility
                </p>
              </div>
            </button>
            <button
              className="flex justify-center space-x-4 items-center border border-solid
             mt-6.5 bg-opacity-20 network-continer"
              onClick={kaikasClickHandler}
            >
              <div className="wallet-option">
                <figure>
                  <img
                    className="desktop_kaikas"
                    src={imgConstants.KaikasSvg}
                    alt="kaikas-logo"
                  />
                  <img
                    className="responsive_kaikas"
                    src={imgConstants.kaikas}
                    alt="kaikas"
                  />
                </figure>
                <div className="text-22 responsive_kaikas_heading font-semibold">
                  Kaikas
                </div>
                <p className="text-14">
                  One of the most secure wallets <br />
                  with great flexibility
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ConnectWallet;
