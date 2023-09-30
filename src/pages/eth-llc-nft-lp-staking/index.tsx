import { useState, useEffect } from "react";
import Layout from "../../layouts/main-layout/main-layout";
import "./eth-llc-nft-lp-staking.scss";
import eth_llc_icon from "../../assets/images/eth-llc-head-logo.svg";
import rewards_trophy from "../../assets/images/rewards_trophy.svg";
import CaretDoubleRightGreen from "../../assets/images/CaretDoubleRightGreen.svg";
import thumbs_up_img from "../../assets/images/ThumbsUpWhite.svg";
import { isMobile } from "react-device-detect";
import { useToasts } from "react-toast-notifications";
import { Transactions } from "../../components/eth-llc-nft-lp-staking-modal/transactions";
import { useDispatch, useSelector } from "react-redux";
import { getWeb3 } from "../../service/web3-service";
import { useCommonWalletConnection, useCustomStableCoin } from '../../hooks';
import {
  SET_WALLET_AMOUNT,
  UPDATE_WALLET_AMOUNT,
} from "../../redux/types/connect-wallet-types";
import {
  disconnectWalletAction,
  getNonceAction,
  setIsConnectAction,
  verifySignatureAction
} from "../../redux";
import { getTransactionInfoAction } from "../../redux/actions/eth-llc-nft-lp-staking-action";
import { SET_IS_CONNECTED } from "../../redux/types";
import { GET_PROFILE_DETAILS } from "../../redux/types/profile-types";
import EthLlcAlert from "../../components/eth-llc-nft-lp-staking-modal/eth-llc-lp-alert";
import { EthLlcConnectWallet } from "../../components/eth-llc-nft-lp-staking-modal/connect-wallet";
import { SelectLlcNft } from "../../components/eth-llc-nft-lp-staking-modal/select-llc-nft";
import { StakeEth } from "../../components/eth-llc-nft-lp-staking-modal/stake-eth";

const klatn_icon = "https://d1gqvtt7oelrdv.cloudfront.net/assets/images/clubethimg.svg";
const nftNetworkId = process.env.REACT_APP_NFT_NETWORK_ID;
const hexacheck: any = process.env.REACT_APP_NFT_NETWORK_ID_HEXA;
declare const window: any;

export const EthLlcNftLpStaking = () => {
  const { customFromWei } = useCustomStableCoin();

  const [isMetamaskConnected, setMetamaskConnected] = useState<boolean>(false);
  const [disableCheck, setDisableCheck] = useState<boolean>(false);
  const [metamaskloading, setMetamaskLoading] = useState<boolean>(false);
  const [firstbtnstate, setFirstBtnState] = useState<boolean>(false);
  const [userEthLlcStep, setUserEthLlcStep] = useState<number>(1);
  const [whiteListedAlertPopup, setWhiteListedAlertPopup] = useState<boolean>(false);
  const [isTransactionHistory, setIsTransactionHistory] = useState<boolean>(false);
  const [existingNftId, setExistingNftId] = useState<string>("");
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const ethNetworkId = "1";
  const { addToast } = useToasts();
  const dispatch = useDispatch();


  const networkId = localStorage.getItem("networkId");

  const popupClose = () => {
    setWhiteListedAlertPopup(false);
  }

  // checkConnectedNetwork is check user connect which network
  const checkConnectedNetwork = async () => {
    const localStroageNetworkId = localStorage.getItem("networkId");
    const wallectAddress = localStorage.getItem("Wallet Address");
    if (nftNetworkId === localStroageNetworkId && wallectAddress) {
      setMetamaskConnected(true);
    } else {
      setMetamaskConnected(false);
    }
    if (isMetamaskConnected) {
      CheckMetamaskNewtworkConnect();
    }
  };

  useEffect(() => {
    checkConnectedNetwork();
  }, [isMetamaskConnected]);

  // disconnetWallet function  is used  for user disconnect from Application
  const disconnetWallet = async (isMetamask: boolean) => {
    let req = {
      deviceToken: "",
    };
    try {
      setMetamaskLoading(true);
      await dispatch(disconnectWalletAction(req));
      dispatch({ type: SET_WALLET_AMOUNT, payload: "" });
      dispatch({ type: SET_IS_CONNECTED, payload: false });
      dispatch({ type: GET_PROFILE_DETAILS, payload: [] });
      localStorage.removeItem("wallet_amount");
      localStorage.removeItem("Wallet Address");
      localStorage.removeItem("profile");
      localStorage.removeItem("connected_with");
      localStorage.removeItem("isConnected");
      localStorage.removeItem("token");
      localStorage.removeItem("Role");
      localStorage.removeItem("isSuperAdmin");
      localStorage.removeItem("signature");
      setMetamaskConnected(false);
      setMetamaskLoading(false);
    } catch (error) {}
  };

  const afterSignInRequest = (obj: any) => {
    obj.sign
      .then((response: any) => {
        obj["signature"] = response;
        localStorage.setItem("signature", response);
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
      let res: any = await dispatch(verifySignatureAction(req));
      if (res.status === true) {
        setMetamaskConnected(true);
        setMetamaskLoading(false);
        setDisableCheck(false);
        CheckMetamaskNewtworkConnect();
        dispatch(setIsConnectAction(res.data?.token));
        localStorage.setItem("Role", res.data?.user?.role);
        localStorage.setItem(
          "isSuperAdmin",
          res.data?.user?.isSuperAdmin ? "true" : "false"
        );
        localStorage.setItem("isConnected", "true");
        localStorage.setItem("token", res.data?.token);
        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
      } else {
        resetLoacalStrorage();
        addToast("There is some issue, Please try again later", {
          appearance: "error",
          autoDismiss: true,
        });
        setDisableCheck(false);
        setMetamaskConnected(false);
        setMetamaskLoading(false);
      }
    } catch (err) {
      resetLoacalStrorage();
      addToast("There is some issue, Please try again later", {
        appearance: "error",
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
    localStorage.removeItem("Wallet Address");
    localStorage.removeItem("isConnected");
    localStorage.removeItem("token");
    localStorage.removeItem("Role");
    localStorage.removeItem("isSuperAdmin");
    dispatch(setIsConnectAction(false));
    localStorage.removeItem("signature");
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
            method: "wallet_switchEthereumChain",
            params: [{ chainId: hexacheck }],
          });
        }
      }
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      web3.eth.getBalance(accounts[0], function (err: any, result: any) {
        if (err) {
        } else {
          dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        }
      });
      localStorage.setItem("networkId", networkId);
      if (accounts[0] && networkId) {
        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        const walletaddress: any = accounts[0];
        try {
          const reqObj = {
            wallet_address: walletaddress,
            network_id: ethNetworkId,
          };
          let res: any = await dispatch(getNonceAction(reqObj));
          let nonce = res?.data;
          if (nonce) {
            localStorage.setItem("Wallet Address", walletaddress);
            let sign = web3.eth.personal.sign(`${nonce}`, walletaddress, "");
            let obj = {
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
      addToast("There is some issue. Please try again later.", {
        appearance: "error",
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
    if (!termsChecked) {
      addToast("Please click the check box.", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
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
  const CheckMetamaskNewtworkConnect = async () => {
    const metamask_address = localStorage.getItem("Wallet Address");
    if (
      isMetamaskConnected &&
      metamask_address
    ) {
      const transactionHistoryRes: any = await dispatch(getTransactionInfoAction());
      if (transactionHistoryRes.status) {
        setIsTransactionHistory(transactionHistoryRes.status);
      }
    }
  };

  const ChekUserStep = (step: number): void => {
    setUserEthLlcStep(step);
  };

  const btnCurrentState = (): void => {
    if (isMetamaskConnected) {
      setFirstBtnState(true);
    } else {
      setFirstBtnState(false);
    }
  };

  useEffect(() => {
    btnCurrentState();
  }, [isMetamaskConnected]);

  // cursor disable handler
  const hideCursorHandler = (value: boolean) => {
    setDisableCheck(value);
  }

  // set existingNftId state
  const handleExistingNftId = (NftId: string) => {
    setExistingNftId(NftId);
  }

  // Update wallet amount function 
  useEffect(() => {
    const add = localStorage.getItem("Wallet Address");
    const updatePrice = async () => {
      if (networkId == process.env.REACT_APP_NFT_NETWORK_ID) {
        const { web3 }: any = await getWeb3();
        web3.eth.getBalance(add, async function (err: any, result: any) {
          if (err) {
            dispatch({ type: UPDATE_WALLET_AMOUNT, payload: false });
          } else {
            const amount = await customFromWei(result, web3, '');
            localStorage.setItem("wallet_amount", amount);
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

  const handleTermsChecked = (termVal: boolean) => {
    setTermsChecked(termVal);
  }

  return (
    <div className="agov_dao_lpStaking_wrp eth_llc_nft_lpstaking" style={{ pointerEvents: disableCheck ? "none" : "auto" }}>
      <Layout mainClassName="agov_dao_lpStaking" hideCursor={disableCheck}>

        {whiteListedAlertPopup &&
          userEthLlcStep === 4 ? (
          <EthLlcAlert CloseAlertpopup={popupClose} dataText="You have staked ETH/LLC. Claim your rewards after lock-up date has ended" toastIcon={thumbs_up_img} />
        ) : null
        }

        <div className="agov_dao_wrp">
          <div className="container-fluid">
            <div className="row agov_dao_inner">
              <div className="col-9 agov_dao_inner_lft_wrp ">
                <div className="agov_eth_img_wrp">
                  <img src={eth_llc_icon} alt="agov" />
                  <img className="klatn_icon" src={klatn_icon} alt="klatn" />
                  <p>ETH/LLC NFT</p>
                </div>
                <h1>eth-LLC NFT lp lock-up stake</h1>
                <p>Earn rewards by locking-up your ETH-LLC NFT tokens for 180 days.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="agov_dao_lpStaking_modal_wrp">
          <div className="container-fluid">
            {userEthLlcStep === 1 ? (
              <EthLlcConnectWallet
                isMetamaskConnected={isMetamaskConnected}
                metaMaskHandler={metaMaskLoginCheck}
                metamaskloading={metamaskloading}
                firstbtnstate={firstbtnstate}
                ChekUserStep={ChekUserStep}
                isTransactHis={isTransactionHistory}
                handleTermsChecked={handleTermsChecked}
                currTermCheck={termsChecked}
              />
            ) : userEthLlcStep === 2 ? (
              <SelectLlcNft
                ChekUserStep={ChekUserStep}
                handleExistingNft={handleExistingNftId}
                currExistingNftId={existingNftId}
              />
            ) : userEthLlcStep === 3 ? (
              <StakeEth
                ChekUserStep={ChekUserStep}
                disableCheckHandler={hideCursorHandler}
                disableState={disableCheck}
                currExistingNftId={existingNftId}
              />
            ) : userEthLlcStep === 4 ? (
              <Transactions
                disableCheckHandler={hideCursorHandler}
                disableState={disableCheck}
                ChekUserStep={ChekUserStep}
                alertPopupShow={() => setWhiteListedAlertPopup(true)} />
            ) : ""
            }
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
              <div className="row lpStaking_footer">
                <div className="col-12 lpStaking_footer_lft_wrp" style={{ textAlign: "center" }}>
                  <h1 style={{ textAlign: "center" }}>180 day lock-up</h1>
                  <p>
                    <img src={CaretDoubleRightGreen} alt="" />
                    <span>15% APR ETH</span>
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
