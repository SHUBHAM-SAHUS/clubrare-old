import { useState, useEffect } from 'react';
import Layout from '../../layouts/main-layout/main-layout';
import './agov-dao-lp-staking.scss';
import mpwr_icon from '../../assets/images/mpwr_icon.svg';
import rewards_trophy from '../../assets/images/rewards_trophy.svg';
import CaretDoubleRight from '../../assets/images/CaretDoubleRight.svg';
import thumbs_up_img from '../../assets/images/ThumbsUpWhite.svg';
import { isMobile } from 'react-device-detect';
import { useToasts } from 'react-toast-notifications';
import { useCommonWalletConnection, useCustomStableCoin } from '../../hooks';
import { AgovConnectWallet } from '../../components/agov-dao-lp-staking-modal/connect-wallet';
import { StakeAgovEth } from '../../components/agov-dao-lp-staking-modal/stake-agov-eth';
import { LockUpPeriod } from '../../components/agov-dao-lp-staking-modal/lock-up-period';
import { Transactions } from '../../components/agov-dao-lp-staking-modal/transactions';
import { useDispatch, useSelector } from 'react-redux';
import { GetCaver, getWeb3 } from '../../service/web3-service';
import {
  SET_WALLET_AMOUNT,
  UPDATE_WALLET_AMOUNT,
} from '../../redux/types/connect-wallet-types';
import {
  disconnectWalletAction,
  getNonceAction,
  setIsConnectAction,
  verifySignatureAction,
} from '../../redux';
import {
  getIsUserStakedAction,
  getTransactionInfoAction,
  getWhiteListedStatusforAgovAction,
} from '../../redux/actions/agov-lpstacking-action';
import { SET_IS_CONNECTED } from '../../redux/types';
import { GET_PROFILE_DETAILS } from '../../redux/types/profile-types';
import AgovDaoAlert from '../../components/agov-dao-lp-staking-modal/agov-dao-alert';

const klatn_icon =
  'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/clubethimg.svg';
const klytnNetwork = process.env.REACT_APP_KLATYN_NETWORK_ID;
const nftNetworkId = process.env.REACT_APP_NFT_NETWORK_ID;
const hexacheck: any = process.env.REACT_APP_NFT_NETWORK_ID_HEXA;
declare const window: any;

export const AgovDaoLpStaking = () => {
  const { customFromWei } = useCustomStableCoin();
  const [isMetamaskConnected, setMetamaskConnected] = useState<boolean>(false);
  const [isKaikasConnected, setKaikasConnected] = useState<boolean>(false);
  const [disableCheck, setDisableCheck] = useState<boolean>(false);
  const [metamaskloading, setMetamaskLoading] = useState<boolean>(false);
  const [kaikasLoading, setKaikasLoading] = useState<boolean>(false);
  const [isWhitelisted, setWhiteListed] = useState<boolean>(false);
  const [firstbtnstate, setFirstBtnState] = useState<boolean>(false);
  const [useragobstep, setUserAgovStep] = useState<number>(1);
  const [whiteListedAlertPopup, setWhiteListedAlertPopup] =
    useState<boolean>(false);
  const [agovAmnt, setAgovAmnt] = useState<string>('');
  const [ethAmnt, setEthAmnt] = useState<string>('');
  const [userStakedStatus, setUserStakedStatus] = useState<boolean>(false);
  const [checkAgovHash, setCheckAgovHash] = useState<boolean>(false);
  const [isTransactionHistory, setIsTransactionHistory] =
    useState<boolean>(false);
  const [existingLockPeriod, setExistingLockPeriod] = useState<string>('');
  const ethNetworkId = '1';
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const networkId = localStorage.getItem('networkId');

  const popupClose = (): void => {
    setWhiteListedAlertPopup(false);
  };

  // kaikas wallet connection check handler
  const checkKaiKasConnected = async () => {
    try {
      const localStroageNetworkId = localStorage.getItem('KlaytnNetworkId');
      const klaytnWallectAddress = localStorage.getItem('KlaytnWalletAddress');
      if (
        localStroageNetworkId?.toString() === klytnNetwork?.toString() &&
        klaytnWallectAddress
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  // checkConnectedNetwork is check user connect which network
  const checkConnectedNetwork = async () => {
    const localStroageNetworkId = localStorage.getItem('networkId');
    const wallectAddress = localStorage.getItem('Wallet Address');
    if (nftNetworkId === localStroageNetworkId && wallectAddress) {
      setMetamaskConnected(true);
    } else {
      setMetamaskConnected(false);
    }
    try {
      const kaiCheckRes = await checkKaiKasConnected();
      if (kaiCheckRes) {
        setKaikasConnected(true);
      } else {
        setKaikasConnected(false);
      }
    } catch (err) {
      setKaikasConnected(false);
    }
    if (isMetamaskConnected && isKaikasConnected) {
      CheckBothNewtworkConnect();
    }
  };

  useEffect(() => {
    checkConnectedNetwork();
  }, [isMetamaskConnected, isKaikasConnected]);

  // disconnetWallet function  is used  for user disconnect from Application
  const disconnetWallet = async (isMetamask: boolean) => {
    let req = {
      deviceToken: '',
    };
    try {
      if (isMetamask) {
        setMetamaskLoading(true);
        await dispatch(disconnectWalletAction(req));
        dispatch({ type: SET_WALLET_AMOUNT, payload: '' });
        dispatch({ type: SET_IS_CONNECTED, payload: false });
        dispatch({ type: GET_PROFILE_DETAILS, payload: [] });
        localStorage.removeItem('wallet_amount');
        localStorage.removeItem('Wallet Address');
        localStorage.removeItem('profile');
        localStorage.removeItem('connected_with');
        localStorage.removeItem('isConnected');
        localStorage.removeItem('token');
        localStorage.removeItem('Role');
        localStorage.removeItem('isSuperAdmin');
        localStorage.removeItem('signature');
        setMetamaskConnected(false);
        setMetamaskLoading(false);
      } else {
        setKaikasConnected(false);
        setKaikasLoading(false);
        localStorage.removeItem('KlaytnNetworkId');
        localStorage.removeItem('KlaytnWalletAddress');
      }
    } catch (error) {
      setKaikasConnected(false);
      setKaikasLoading(false);
      localStorage.removeItem('KlaytnNetworkId');
      localStorage.removeItem('KlaytnWalletAddress');
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
        setMetamaskLoading(false);
      });
  };

  // loginUser function is used for verifySignature
  const loginUser = async (obj: any) => {
    const req = {
      nonce: obj.nonce,
      signature: obj.signature,
      network_id: String(obj.network_id),
      deviceToken: '',
    };
    setDisableCheck(true);
    try {
      const res: any = await dispatch(verifySignatureAction(req));
      if (res.status === true) {
        setMetamaskConnected(true);
        setMetamaskLoading(false);
        setDisableCheck(false);
        CheckBothNewtworkConnect();
        dispatch(setIsConnectAction(res.data?.token));
        localStorage.setItem('Role', res.data?.user?.role);
        localStorage.setItem(
          'isSuperAdmin',
          res.data?.user?.isSuperAdmin ? 'true' : 'false',
        );
        localStorage.setItem('isConnected', 'true');
        localStorage.setItem('token', res.data?.token);
        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
      } else {
        resetLoacalStrorage();
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
        setDisableCheck(false);
        setMetamaskConnected(false);
        setMetamaskLoading(false);
      }
    } catch (err) {
      resetLoacalStrorage();
      addToast('There is some issue, Please try again later', {
        appearance: 'error',
        autoDismiss: true,
      });
      setDisableCheck(false);
      setMetamaskConnected(false);
      setMetamaskLoading(false);
    }
  };

  // metamask wallet login check condition
  const metaMaskLoginCheck = (): void => {
    if (isMetamaskConnected) {
      disconnetWallet(true);
    } else {
      metamaskClickHandler();
    }
  };

  const resetLoacalStrorage = () => {
    localStorage.removeItem('Wallet Address');
    localStorage.removeItem('isConnected');
    localStorage.removeItem('token');
    localStorage.removeItem('Role');
    localStorage.removeItem('isSuperAdmin');
    dispatch(setIsConnectAction(false));
    localStorage.removeItem('signature');
  };

  // metamask connection handler
  const loginWithMetmask = async () => {
    setMetamaskLoading(true);
    setDisableCheck(true);
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
      web3.eth.getBalance(accounts[0], function (err: any, result: any) {
        if (err) {
          dispatch({ type: UPDATE_WALLET_AMOUNT, payload: false });
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
          const res: any = await dispatch(getNonceAction(reqObj));
          const nonce = res?.data;
          if (nonce) {
            localStorage.setItem('Wallet Address', walletaddress);
            const sign = web3.eth.personal.sign(`${nonce}`, walletaddress, '');
            const obj = {
              sign: sign,
              nonce: nonce,
              wallet_address: walletaddress,
              network_id: 1,
            };
            afterSignInRequest(obj);
          }
        } catch (err) {
          resetLoacalStrorage();
          setMetamaskLoading(false);
          setDisableCheck(false);
        }
      } else {
        setMetamaskLoading(false);
        setDisableCheck(false);
      }
    } catch (err: any) {
      addToast('There is some issue. Please try again later.', {
        appearance: 'error',
        autoDismiss: true,
      });
      setMetamaskLoading(false);
      setDisableCheck(false);
      return false;
    }
  };

  // handleMetamaskForMobile used for metamaks mobile login
  const handleMetamaskForMobile = () => {
    const { ethereum }: any = window;
    if (ethereum && ethereum.isMetaMask) {
      loginWithMetmask();
    } else {
      window.location.href =
        process.env.REACT_APP_METAMASK_DEEP_LINK_FOR_MOBILE;
      setDisableCheck(false);
    }
  };

  // metamask click handler
  const metamaskClickHandler = async () => {
    try {
      if (isMobile) {
        handleMetamaskForMobile();
      } else {
        loginWithMetmask();
      }
    } catch (error) {
      return false;
    }
  };

  // check both network connection
  const CheckBothNewtworkConnect = async () => {
    const klaytn_address = localStorage.getItem('KlaytnWalletAddress');
    const metamask_address = localStorage.getItem('Wallet Address');
    if (
      isMetamaskConnected &&
      isKaikasConnected &&
      klaytn_address &&
      metamask_address
    ) {
      const query: { klaytn_address: string } = {
        klaytn_address: klaytn_address,
      };
      const transactionHistoryRes: any = await dispatch(
        getTransactionInfoAction(query),
      );
      if (transactionHistoryRes.status) {
        setIsTransactionHistory(transactionHistoryRes.status);
      }
      const isWhitelisted: any = await dispatch(
        getWhiteListedStatusforAgovAction(query),
      );
      if (isWhitelisted.status) {
        setWhiteListedAlertPopup(false);
        setWhiteListed(true);
        if (isWhitelisted?.data?.agov_deposit_hash) {
          setCheckAgovHash(true);
        }
        if (isWhitelisted?.data?.locking_period) {
          const finalLockPer =
            isWhitelisted?.data?.locking_period / (3600 * 24);
          setExistingLockPeriod(finalLockPer.toString());
        }
        await getAgovEthValueHandler(isWhitelisted?.data);
      } else {
        setWhiteListedAlertPopup(true);
        setWhiteListed(false);
      }
    }
  };

  // kaikas wallet connect handler
  const kaikasClickHandler = async () => {
    setKaikasLoading(true);
    try {
      const klaytnObj = window.klaytn;
      if (klaytnObj.networkVersion.toString() === klytnNetwork?.toString()) {
        localStorage.setItem('KlaytnNetworkId', klaytnObj.networkVersion);
        const accounts = await klaytnObj.enable();
        localStorage.setItem('KlaytnWalletAddress', accounts[0]);
        setKaikasLoading(false);
        setKaikasConnected(true);
        CheckBothNewtworkConnect();
      } else {
        addToast('Please check network type!', {
          appearance: 'error',
          autoDismiss: true,
        });
        setKaikasLoading(false);
        setKaikasConnected(false);
        setDisableCheck(false);
        return;
      }
    } catch (error) {
      addToast('Please check kaikas wallet', {
        appearance: 'error',
        autoDismiss: true,
      });
      setKaikasLoading(false);
      setKaikasConnected(false);
      setDisableCheck(false);
      return false;
    }
  };

  const kaikasLoginChecked = (): void => {
    if (isKaikasConnected) {
      disconnetWallet(false);
    } else {
      kaikasClickHandler();
    }
  };

  const ChekUserStep = (step: number): void => {
    setUserAgovStep(step);
  };

  const btnCurrentState = (): void => {
    if (isMetamaskConnected && isKaikasConnected) {
      if (isWhitelisted || isTransactionHistory) {
        setFirstBtnState(true);
      }
    } else {
      setFirstBtnState(false);
    }
  };

  useEffect(() => {
    btnCurrentState();
  }, [
    isMetamaskConnected,
    isKaikasConnected,
    isWhitelisted,
    isTransactionHistory,
  ]);

  // cursor disable handler
  const hideCursorHandler = (value: boolean): void => {
    setDisableCheck(value);
  };

  // get Agov/Eth value handler
  const getAgovEthValueHandler = async (data: any) => {
    const { caver }: any = await GetCaver();
    const { web3 }: any = await getWeb3();
    if (data && data.agov_amount && data.eth_amount) {
      const agovAmVal = await customFromWei(data?.agov_amount, caver, '');
      setAgovAmnt(agovAmVal);
      const ethAmVal = await customFromWei(data?.eth_amount, web3, '');
      setEthAmnt(ethAmVal);
    }
  };

  // check user staked status api call
  useEffect(() => {
    async function fetchData() {
      const res: any = await dispatch(getIsUserStakedAction());
      if (res) {
        setUserStakedStatus(res.status);
      }
    }
    fetchData();
  }, []);

  // Update wallet amount function
  useEffect(() => {
    const add = localStorage.getItem('Wallet Address');
    const updatePrice = async () => {
      if (networkId == process.env.REACT_APP_NFT_NETWORK_ID) {
        const { web3 }: any = await getWeb3();
        web3.eth.getBalance(add, async function (err: any, result: any) {
          if (err) {
            dispatch({ type: UPDATE_WALLET_AMOUNT, payload: false });
          } else {
            const amount = await customFromWei(result, web3, '');
            localStorage.setItem('wallet_amount', amount);
            dispatch({ type: SET_WALLET_AMOUNT, payload: amount });
            dispatch({ type: UPDATE_WALLET_AMOUNT, payload: false });
          }
        });
      }
    };
    if (add) {
      updatePrice();
    }
  }, [isMetamaskConnected]);

  return (
    <div
      className="agov_dao_lpStaking_wrp"
      style={{ pointerEvents: disableCheck ? 'none' : 'auto' }}
    >
      <Layout mainClassName="agov_dao_lpStaking" hideCursor={disableCheck}>
        {whiteListedAlertPopup ? null : null}

        {whiteListedAlertPopup && useragobstep === 4 ? (
          <AgovDaoAlert
            CloseAlertpopup={popupClose}
            dataText="You have staked AGOV/ETH. Claim your rewards after lock-up date has ended"
            toastIcon={thumbs_up_img}
          />
        ) : null}

        <div className="agov_dao_wrp">
          <div className="container-fluid">
            <div className="row agov_dao_inner">
              <div className="col-9 agov_dao_inner_lft_wrp ">
                <div className="agov_eth_img_wrp">
                  <img src={mpwr_icon} alt="agov" />
                  <img className="klatn_icon" src={klatn_icon} alt="klatn" />
                  <p>AGOV/ETH</p>
                </div>
                <h1>agov-eth lp lock-up stake</h1>
                <p>
                  Earn rewards by locking-up your AGOV-ETH tokens for 90 or 180
                  days. Available for selected whitelisted wallet
                  <br /> addresses only.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="agov_dao_lpStaking_modal_wrp">
          <div className="container-fluid">
            {useragobstep === 1 ? (
              <AgovConnectWallet
                isMetamaskConnected={isMetamaskConnected}
                isKaikasConnected={isKaikasConnected}
                metaMaskHandler={metaMaskLoginCheck}
                metamaskloading={metamaskloading}
                kaikasLoading={kaikasLoading}
                kaikasHandler={kaikasLoginChecked}
                firstbtnstate={firstbtnstate}
                ChekUserStep={ChekUserStep}
                userStakedStatus={userStakedStatus}
                isTransactHis={isTransactionHistory}
                checkAgovHash={checkAgovHash}
              />
            ) : useragobstep === 2 ? (
              <StakeAgovEth
                ChekUserStep={ChekUserStep}
                disableCheckHandler={hideCursorHandler}
                disableState={disableCheck}
                agovEthValueHandler={getAgovEthValueHandler}
              />
            ) : useragobstep === 3 ? (
              <LockUpPeriod
                ChekUserStep={ChekUserStep}
                disableCheckHandler={hideCursorHandler}
                disableState={disableCheck}
                ethAmnt={ethAmnt}
                agovAmnt={agovAmnt}
                existingLockPeriod={existingLockPeriod}
                checkAgovHash={checkAgovHash}
              />
            ) : useragobstep === 4 ? (
              <Transactions
                disableCheckHandler={hideCursorHandler}
                disableState={disableCheck}
                userStakedStatus={userStakedStatus}
                ChekUserStep={ChekUserStep}
                setUserStakedStatus={setUserStakedStatus}
                isWhitelistCheck={isWhitelisted}
                alertPopupShow={(): void => setWhiteListedAlertPopup(true)}
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="agov_dao_lpStaking_footer">
          <div className="lpStaking_footer_wrp">
            <div className="container-fluid">
              <img
                className="rewards"
                src={rewards_trophy}
                alt="rewards_trophy"
              />
              <h1>rewards</h1>
              <div className=" row lpStaking_footer">
                <div className="col-6 lpStaking_footer_lft_wrp">
                  <h1>90 day lock-up</h1>
                  <p>
                    <img src={CaretDoubleRight} alt="" />
                    <span>1 LLC for every 1 ETH</span>
                  </p>
                  <p>
                    <img src={CaretDoubleRight} alt="" />
                    <span>Round 1: MPWR rewards of 30% APR</span>
                  </p>
                  <p>
                    <img src={CaretDoubleRight} alt="" />
                    <span>Round 2: MPWR rewards of 20% APR</span>
                  </p>
                  <p>
                    <img src={CaretDoubleRight} alt="" />
                    <span>Round 3: MPWR rewards of 10% APR</span>
                  </p>
                </div>
                <div className="col-6 lpStaking_footer_right_wrp">
                  <h1>180 day lock-up</h1>
                  <p>
                    <img src={CaretDoubleRight} alt="" />
                    <span>2 LLC for every 1 ETH</span>
                  </p>
                  <p>
                    <img src={CaretDoubleRight} alt="" />
                    <span>Round 1: MPWR rewards of 30% APR</span>
                  </p>
                  <p>
                    <img src={CaretDoubleRight} alt="" />
                    <span>Round 2: MPWR rewards of 20% APR</span>
                  </p>
                  <p>
                    <img src={CaretDoubleRight} alt="" />
                    <span>Round 3: MPWR rewards of 10% APR</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};
