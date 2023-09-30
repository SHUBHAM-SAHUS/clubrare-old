import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-simple-tooltip';
import Layout from '../../../layouts/main-layout/main-layout';
import History from './history';
import { BiTime } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiTrendingUp } from 'react-icons/fi';
import parse from 'html-react-parser';
import OfferDetail from '../../../components/offer';
import Helmentcomponent from '../../../components/helment';
import varified_seller from '../../../assets/images/varified_seller.svg';
import seller_varified from '../../../assets/images/varified_seller_1.svg';
import {
  eventsAction,
  ItemDetailsAction,
  reactOnPost,
  showHideModalAction,
  updateTransactionHashAction,
  historyapiAction,
  submitTrackingAPiAction,
  offerApiAction,
  LazylistingMakeOfferAPiAction,
  getEditProfileAction,
} from '../../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { setChageHideStatusAction } from '../../../redux/actions/create-collectibles-action';
import {
  EnableEthereum,
  makeBrokerContractForEth,
  CheckCurrency,
  CheckCurrencyMetaMask,
  GetCaver,
  getWeb3,
  makeWethContractforEth,
  makeMpwrContractforEth,
  makeAgovContractforEth,
  makeBrokerContractForKlytn,
  CbrNftforEthContract,
  CbrNftforKlyContract,
  EnableKlyten,
  makeUsdtContractforEth,
} from '../../../service/web3-service';
import { useCommonWalletConnection, useCustomStableCoin } from '../../../hooks';

import './live-auction.css';
import transfernft from '../../../smart-contract/collection.json';
import { UPDATE_WALLET_AMOUNT } from '../../../redux/types/connect-wallet-types';
import erc20Artifacts from '../../../smart-contract/erc-token.json';
import {
  AGOVICON,
  CryptoIcon,
  CryptoIcon3,
  Loading,
  Spinner,
  WethIcon,
  UsdtIcon,
} from '../../../components';

import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import CreatedBy from './created-by';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import ShareModal from './share-modal';
import '../../create/create.css';
import '../../../components/explore/explore.scss';
import BuyNow from './buy-now';
import ReportModal from '../../profile/view-profile/report-modal';
import EditItemModal from '../../../components/edit-item';
import { imgConstants } from '../../../assets/locales/constants';
import { klaytnWallConnCheck } from '../../../utils/klaytn-wallet-connection-check';
import {
  BidTimeObjProps,
  BidTimeObjClsProps,
  TokenPricePropsTypes,
  loadingPropsTypes,
} from '../../../types/live-action-types';
import initialdata from './initial-data.json';

const BidModal = React.lazy(() => import('./bid-modal'));
const Poster = React.lazy(() => import('./poster'));
const PutOnSale = React.lazy(() => import('./put-on-sale'));
const RedeemNowModal = React.lazy(() => import('./redeem-now-modal'));
const PlaceBid = React.lazy(() => import('./place-bid'));
const NftTransferModel = React.lazy(() => import('./nft-transfer-model'));
const TransitionHashModel = React.lazy(() => import('./transition-hash-model'));
const SubmitTrackingModel = React.lazy(() => import('./submit-tracking'));
const ViewTracking = React.lazy(() => import('./view-tracking'));
const MakeofferModel = React.lazy(() => import('./makeoffer-model'));

function LiveAuction(props: any) {
  const allowanceAmount =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';
  const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const nftNetworkId = process.env.REACT_APP_NFT_NETWORK_ID;
  const weth_contract = process.env.REACT_APP_WETH_TOKEN_ADD?.toLowerCase();
  const agov_contract = process.env.REACT_APP_AGOV_TOKEN_ADD?.toLowerCase();
  const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
  const klaytn_broker_address = process.env.REACT_APP_KLYTN_BROKER_ACCOUNT;
  const broker_address = process.env.REACT_APP_BROKER_ADDRESS;
  const broker_address_v3 = process.env.REACT_APP_BROKER_ADDRESS_V3;
  const usdt_eth_token_address = process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();
  const usdt_klaytn_token_address = process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase();
  const wallet_address: any = localStorage
    .getItem('Wallet Address')
    ?.toLowerCase();
  const networkId = localStorage.getItem('networkId');

  const menuRef: any = React.useRef(null);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const itemDetails = useSelector(
    (state: any) => state.itemDetailsReducer.details,
  );
  const currencyDetails = useSelector(
    (state: any) => state.ratechangeReducer.ratechange,
  );
  const profileDetails = useSelector(
    (state: any) => state.profileReducers.profile_details,
  );
  const walletAmount = useSelector(
    (state: any) => state.metamaskReducer.wallet_amount,
  );
  const userConnected = useSelector(
    (state: any) => state.headerReducer.isConnected,
  );
  const [usdtKlaytnBal, setUsdtKlaytnBal] = useState<string>('');
  const [agovBal, setAgovBal] = useState<any>('');
  const [wethBal, setWethBal] = useState<any>('');
  const [mpwrBal, setMpwrBal] = useState<any>('');
  const [agovEthBal, setAgovEthBal] = useState<any>('');
  const [usdtEthBal, setUsdtEthBal] = useState<string>('');
  const token_id = itemDetails?.token_id || null;
  const mustLoginToBid =
    !wallet_address && itemDetails?.auctionDetails?.auctionType == 2;
  const mustLoginToBuy =
    !wallet_address && itemDetails?.auctionDetails?.auctionType == 1;

  const [allTokenPrice, setAllTokenPrice] = useState<TokenPricePropsTypes>({
    agovBal: '',
    wethBal: '',
    mpwrBal: '',
    agovEthBal: '',
  });
  const [bidTimeObj, setBidTimeObj] = useState<BidTimeObjProps>({
    hoursLeft: 0,
    minutesLeft: 0,
    secondsLeft: 0,
    daysLeft: 0,
  });
  const [bidTimeCloseObj, setBidTimeCloseObj] = useState<BidTimeObjClsProps>({
    hoursLeft1: 0,
    minutesLeft1: 0,
    secondsLeft1: 0,
    daysLeft1: 0,
  });

  const [historySwitch, setHistorySwitch] = useState('description');
  const [displayValues, setDiaplayValues] = useState({ value: '', unit: '' });

  const [usdAmount, setUsdAmount] = useState(0);
  const [networkIdInUrl, setNetworkdIdUrl]: any = useState();
  const [isConnected, setisConnected] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any>([]);
  const [offerData, setOfferData] = useState<any>([]);
  const [transferValue, setTransferValue] = useState<any>('');
  const [trackingvalue, setTrackingvalue] = useState<any>();
  const [transferError, setTransferError] = useState<any>({ transferVal: '' });
  const [trackingError, setTrackingError] = useState<any>({ trackingVal: '' });
  const [trackingdrop, Settrackingdrop] = useState<any>('UPS');
  const [error, setError] = useState({ bidValueError: '' });
  const [bidValue, setBidValue]: any = useState('');
  const [bidTransactionHash, setBidTransactionHash] = useState('');
  const [approvetransactionHash, setApproveTransactionHash] = useState('');
  const [royaltiesusd, Setroyalityusd] = useState(0);
  const [platformusd, Setplatformusd] = useState(0);
  const [hashkey, sethashkey] = useState('');

  const [approved, setApproved] = useState<boolean>(false);

  const [buynowModel, setBuynowModel] = useState<boolean>(false);

  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [delistloading, Setdelistingloading] = useState<boolean>(false);
  const [historyLoad, setHistoryLoad] = useState<boolean>(false);
  const [offerLoad, setOfferLoad] = useState<boolean>(false);
  const [bidOpen, setBidOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnApprove, setBtnApprove] = useState<boolean>(true);
  const [isLike, setLike] = useState<boolean>(false);

  const [allLoadingState, setAllLoadingState] =
    useState<loadingPropsTypes>(initialdata);
    
  const [approveloading, setApprovedloading] = useState<boolean>(false);
  const [burnBtnCheck, setBurnBtnCheck] = useState<boolean>(false);
  const [putOnSaleCheck, setPutOnSaleCheck] = useState<boolean>(false);
  const [putOffSaleCheck, setPutOffSaleCheck] = useState<boolean>(false);

  const [placeForBidCheck, setPlaceBidCheck] = useState<boolean>(false);
  const [buyBtnCheck, setBuyBtnCheck] = useState<boolean>(false);
  const [placeABidLoading, setPlaceABidLoading] = useState<boolean>(false);

  const [hideCursor, setHideCursor] = useState<boolean>(false);
  const [isWarningModalVisible, setIsWarningModalVisible] =
    useState<boolean>(false);
  const [shareModal, setShareModal] = useState<boolean>(false);
  const [isPlaceABidModalVisible, setIsPlaceABidModalVisible] =
    useState<boolean>(false);
  const [showRedeemNowModal, setShowRedeemNowModal] = useState<boolean>(false);
  const [showRedeemApproveModal, setShowRedeemApproveModal] =
    useState<boolean>(false);
  const [openRedeemRequestModal, setOpenRedeemRequestModal] =
    useState<boolean>(false);

  const [bidModal, setBidModal] = useState<boolean>(false);
  const [puonsaleModal, SetputonsaleModal] = useState<boolean>(false);
  const [transfermodel, SetTransfermodel] = useState<boolean>(false);
  const [trackingsubmitmodel, SetTrackingsubmitmodel] =
    useState<boolean>(false);
  const [trackingviewmodel, SetTrackingviewmodel] = useState<boolean>(false);
  const [openmakeofferModel, openSetmakeofferModel] = useState<boolean>(false);
  const [hashmodel, Sethashmodel] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [editItemOpen, setEditItemOpen] = useState<boolean>(false);
  const [offertabstatus, Setoffertabstatus] = useState<boolean>(false);

  const openReportModal = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setReportOpen(true);
    document.getElementById('explore-detail-dropdown')?.click();
  };

  const openEditItemModal = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEditItemOpen(true);
    document.getElementById('explore-detail-dropdown')?.click();
  };

  const handleOutSideClick = (event: any) => {
    if (menuRef && menuRef.current && !menuRef.current.contains(event.target)) {
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutSideClick);
  }, []);

  // Broker validation contract handler
  const brokerValidatorHandler = async (
    validatorContranct: any,
    brokerContract: any,
    orderTuple: any,
  ) => {
    const brokerValidRes = await validatorContranct.methods
      ._verifyOrderSig(orderTuple)
      .call();
    if (brokerValidRes && brokerValidRes[0]) {
      const isSigInvalid = await brokerContract.methods
        .cancelledOrFinalized(brokerValidRes[0])
        .call();
      return isSigInvalid;
    } else {
      return true;
    }
  };

  // this function used for nft buy
  const handleBuy = async () => {
    try {
      setLoading(true);
      setHideCursor(true);
      window.onbeforeunload = function () {
        return 'If you reload this page, your previous action will be repeated';
      };
      const price = itemDetails?.auctionDetails?.buyPrice;
      const collectionAddress = itemDetails?.auctionDetails?.collection_address;
      const contractAddress = itemDetails?.auctionDetails?.contract_address;
      const listTime = Math.round(
        new Date(itemDetails?.auctionDetails?.startingTime).getTime() / 1000,
      );
      const noncedata = Number(itemDetails?.auctionDetails?.nonce);
      const isNotClubrare =
        itemDetails?.collectible_type === 'clubrare' ? false : true;
      const tokenId1 = itemDetails?.token_id ? itemDetails?.token_id : 0;
      const ordertype = itemDetails?.redeemable ? 1 : 0;
      const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
      const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
      const signature = itemDetails?.auctionDetails?.signature;
      const tupple = {
        seller: itemDetails?.collectible_owner.toString(),
        contractaddress: collectionAddress,
        royaltyFee: itemDetails.royalties ? itemDetails.royalties * 100 : 0,
        royaltyReceiver: itemDetails?.userObj?.wallet_address.toString(),
        paymentToken: itemDetails?.auctionDetails?.erc20Token,
        basePrice: price.toString(),
        listingTime: listTime,
        expirationTime: 0,
        nonce: noncedata,
        tokenId: tokenId1,
        orderType: ordertype,
        signature1: signature,
        uri: itemDetails?.ipfs_hash,
        item_id: itemDetails?._id.toString(),
        isTokenGated: isTokenGated,
        tokenGateAddress: tokenGateAddress,
        // isEscrow: false,
        // isMetamask: false,
      };
      const buyarray = [
        tupple.seller,
        tupple.contractaddress,
        tupple.royaltyFee,
        tupple.royaltyReceiver,
        tupple.paymentToken,
        tupple.basePrice,
        tupple.listingTime,
        tupple.expirationTime,
        tupple.nonce,
        tupple.tokenId,
        tupple.orderType,
        tupple.signature1,
        tupple.uri,
        tupple.item_id,
        tupple.isTokenGated,
        tupple.tokenGateAddress,
        // tupple.isEscrow,
        // tupple.isMetamask,
      ];
      if (networkId == process.env.REACT_APP_KLATYN_NETWORK_ID) {
        await klaytnWallConnCheck();
        if (displayValues.unit === 'KLAY') {
          const { caver }: any = await GetCaver();
          const userCurrentBalance = await caver.klay.getBalance(
            wallet_address,
          );
          if (Number(price) > +userCurrentBalance) {
            addToast("You don't have enough balance to buy this item", {
              appearance: 'error',
              autoDismiss: true,
            });
            setLoading(false);
            setHideCursor(false);
            setBidModal(false);
            window.onbeforeunload = null;
            setBuynowModel(false);
            return;
          }
        }
        const { brokerContract }: any = await makeBrokerContractForKlytn(
          contractAddress,
          true,
        );
        let send_obj: string = JSON.stringify({
          from: wallet_address,
          value: tupple?.basePrice,
          gas: null,
        });
        if (displayValues.unit === 'AGOV' || displayValues.unit === 'USDT') {
          send_obj = JSON.stringify({ from: wallet_address, gas: null });
        }
        if (
          klaytn_broker_address?.toLowerCase() ===
          contractAddress?.toLowerCase()
        ) {
          try {
            // check balance for llc token base sale for admin
            if (isTokenGated) {
              const { CbrforKlyContr }: any = await CbrNftforKlyContract(
                tokenGateAddress,
                true,
              );
              const checkTokenGateBalance = await CbrforKlyContr.methods
                .balanceOf(wallet_address)
                .call();
              if (+checkTokenGateBalance === 0) {
                setLoading(false);
                setHideCursor(false);
                setBidModal(false);
                window.onbeforeunload = null;
                setBuynowModel(false);
                addToast('Only LazyLeo NFT holders can buy/bid on this item', {
                  appearance: 'error',
                  autoDismiss: true,
                });
                return;
              }
            }
            const { brokerValidatorContract }: any = await EnableKlyten();
            const isSigInvalid = await brokerValidatorHandler(
              brokerValidatorContract,
              brokerContract,
              buyarray,
            );
            if (isSigInvalid) {
              addToast('There is some issue, Please try again later', {
                appearance: 'error',
                autoDismiss: true,
              });
              return;
            }

            const brokerTransactionHash = await brokerContract.methods
              .buy(collectionAddress, tokenId1, tupple.basePrice, buyarray)
              .send(JSON.parse(send_obj));

            if (brokerTransactionHash.transactionHash) {
              const buyAction = {
                transaction_hash: brokerTransactionHash.transactionHash,
                contract_address: contractAddress,
                network_id: '2',
              };
              await dispatch(eventsAction(buyAction));
              await getItemDetails();
              setBuynowModel(false);
              setLoading(false);
              setHideCursor(false);
              setHistorySwitch('description');
              addToast('Your item buy successfully', {
                appearance: 'success',
                autoDismiss: true,
              });
            }
          } catch (err: any) {
            setLoading(false);
            setHideCursor(false);
            setBidModal(false);
            window.onbeforeunload = null;
            setBuynowModel(false);
            addToast(err.message, {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } else {
          const brokerTransactionHash = await brokerContract.methods
            .buy(token_id, collectionAddress)
            .send(JSON.parse(send_obj));
          if (brokerTransactionHash) {
            const buyAction = {
              transaction_hash: brokerTransactionHash.transactionHash,
              contract_address: brokerContract._address,
              network_id: '2',
            };
            await dispatch(eventsAction(buyAction));
            await getItemDetails();
            await dispatch(
              updateTransactionHashAction(
                brokerTransactionHash.transactionHash,
              ),
            );
            await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
            dispatch(showHideModalAction(true));
            setLoading(false);
            setHideCursor(false);
            setShareModal(false);
            setBidModal(false);
            window.onbeforeunload = null;
            setBuynowModel(false);

            addToast('Your item buy successfully', {
              appearance: 'success',
              autoDismiss: true,
            });
          }
        }
      } else {
        if (displayValues.unit === 'ETH') {
          const { web3 }: any = await getWeb3();
          const userCurrentBalance = await web3.eth.getBalance(wallet_address);
          if (Number(price) > +userCurrentBalance) {
            addToast("You don't have enough balance to buy this item", {
              appearance: 'error',
              autoDismiss: true,
            });
            setLoading(false);
            setHideCursor(false);
            setBidModal(false);
            window.onbeforeunload = null;
            setBuynowModel(false);
            return;
          }
        }
        if (broker_address?.toLowerCase() === contractAddress?.toLowerCase()) {
          try {
            // check balance for llc token base sale for admin
            if (isTokenGated) {
              const { CbrforEthContr }: any = await CbrNftforEthContract(
                tokenGateAddress,
              );
              const checkTokenGateBalance = await CbrforEthContr.methods
                .balanceOf(wallet_address)
                .call();
              if (+checkTokenGateBalance === 0) {
                setLoading(false);
                setHideCursor(false);
                setBidModal(false);
                window.onbeforeunload = null;
                setBuynowModel(false);
                addToast('Only LazyLeo NFT holders can buy/bid on this item', {
                  appearance: 'error',
                  autoDismiss: true,
                });
                return;
              }
            }
            const { brokerContract }: any = await makeBrokerContractForEth(
              contractAddress,
              true,
            );
            const { brokerValidatorContract }: any = await EnableEthereum();
            const isSigInvalid = await brokerValidatorHandler(
              brokerValidatorContract,
              brokerContract,
              buyarray,
            );
            if (isSigInvalid) {
              addToast('There is some issue, Please try again later', {
                appearance: 'error',
                autoDismiss: true,
              });
              return;
            }
            let send_obj: string = JSON.stringify({
              from: wallet_address,
              value: price.toString(),
            });
            if (
              displayValues.unit === 'WETH' ||
              displayValues.unit === 'AGOV' ||
              displayValues.unit === 'MPWR' ||
              displayValues.unit === 'USDT'
            ) {
              send_obj = JSON.stringify({ from: wallet_address });
            }
            const brokerTransactionHash = await brokerContract.methods
              .buy(collectionAddress, tokenId1, price.toString(), buyarray)
              .send(JSON.parse(send_obj));

            if (brokerTransactionHash.transactionHash) {
              const buyAction = {
                transaction_hash: brokerTransactionHash.transactionHash,
                contract_address: contractAddress,
                network_id: '1',
              };
              await dispatch(eventsAction(buyAction));
              setBuynowModel(false);
              setLoading(false);
              setHideCursor(false);
              await getItemDetails();
              setHistorySwitch('description');
              addToast('Your item buy successfully', {
                appearance: 'success',
                autoDismiss: true,
              });
            }
          } catch (err: any) {
            setLoading(false);
            setHideCursor(false);
            setBidModal(false);
            window.onbeforeunload = null;
            setBuynowModel(false);
            addToast(err.message, {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } else {
          const { brokerContract }: any = await makeBrokerContractForEth(
            contractAddress,
            true,
          );
          let send_obj: any = JSON.stringify({
            from: wallet_address,
            value: price,
          });
          if (displayValues.unit === 'WETH') {
            send_obj = JSON.stringify({ from: wallet_address });
          }
          let brokerTransactionHash: any;
          if (
            broker_address_v3?.toLowerCase() === contractAddress?.toLowerCase()
          ) {
            brokerTransactionHash = await brokerContract.methods
              .buy(token_id, collectionAddress, isNotClubrare)
              .send(JSON.parse(send_obj));
          } else {
            brokerTransactionHash = await brokerContract.methods
              .buy(token_id, collectionAddress)
              .send(JSON.parse(send_obj));
          }
          if (brokerTransactionHash) {
            const buyAction = {
              contract_address: brokerContract?._address,
              network_id: '1',
              transaction_hash: brokerTransactionHash.transactionHash,
            };
            await dispatch(eventsAction(buyAction));
            await getItemDetails();
            await dispatch(
              updateTransactionHashAction(
                brokerTransactionHash.transactionHash,
              ),
            );
            await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
            dispatch(showHideModalAction(true));
            setLoading(false);
            setHideCursor(false);
            setBidModal(false);
            window.onbeforeunload = null;
            setBuynowModel(false);
            addToast('Your item buy successfully', {
              appearance: 'success',
              autoDismiss: true,
            });
          }
        }
      }
    } catch (err: any) {
      setLoading(false);
      setHideCursor(false);
      setBidModal(false);
      window.onbeforeunload = null;
      setBuynowModel(false);
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  function urlify(text: string) {
    if (!text) {
      return '<a></a>';
    }
    // var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    const urlRegex =
      /(((https?:\/\/)|(www\.))[^\s]+)|[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return text?.replace(urlRegex, function (url: string) {
      let hyperlink: string = url;
      if (!hyperlink.match('^https?://')) {
        hyperlink = 'https://' + hyperlink;
      }
      return (
        '<a href="' +
        hyperlink +
        '" target="_blank" rel="noopener noreferrer">' +
        url +
        '</a>'
      );
    });
  }

  const callChangeHideStatus = async () => {
    // setDetailsLoading(true);
    setAllLoadingState((prevState: loadingPropsTypes) => ({
      ...prevState,
      detailsLoading: true,
    }));
    const result: any = await dispatch(
      setChageHideStatusAction(itemDetails?._id),
    );
    if (result.status === 200) {
      // setDetailsLoading(true);
      setAllLoadingState((prevState: loadingPropsTypes) => ({
        ...prevState,
        detailsLoading: true,
      }));
      await getItemDetails();
      addToast(result.data.message, {
        appearance: 'success',
        autoDismiss: true,
      });
    } else if (result.status === 400) {
      addToast(result.data.message, { appearance: 'error', autoDismiss: true });
    }
  };

  const goToWalletConnect = () => {
    history.push('/connect-wallet');
  };

  //this function used for  NFT delist (new broker)
  const delistItemBylazyListing = async () => {
    // setHideCursor(true);
    // Setdelistingloading(true);

    setAllLoadingState((prevState: loadingPropsTypes) => ({
      ...prevState,
      delistloading: true,
      hideCursor: true,
    }));
    const contractAddress = itemDetails?.auctionDetails?.contract_address;
    const collectionAddress = itemDetails?.auctionDetails?.collection_address;
    const noncedata = Number(itemDetails?.auctionDetails?.nonce);
    const tokenId1 = itemDetails?.token_id ? itemDetails?.token_id : 0;
    const ordertype = itemDetails?.redeemable ? 1 : 0;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
    const signature = itemDetails?.auctionDetails?.signature;
    const auctionType: string = itemDetails?.auctionDetails?.auctionType;
    const priceVal =
      auctionType === '1'
        ? itemDetails?.auctionDetails?.buyPrice
        : itemDetails?.auctionDetails?.startingPrice;
    const closingtime: any = Math.round(
      new Date(itemDetails?.auctionDetails?.initialClosingTime).getTime() /
      1000,
    );
    const listTime = Math.round(
      new Date(itemDetails?.auctionDetails?.startingTime).getTime() / 1000,
    );
    const Endtime = auctionType === '1' ? 0 : closingtime;
    const deslistQuery = {
      seller: itemDetails?.collectible_owner,
      contractaddress: collectionAddress,
      royaltyFee: itemDetails.royalties * 100,
      royaltyReceiver: itemDetails?.userObj?.wallet_address,
      paymentToken: itemDetails?.auctionDetails?.erc20Token,
      basePrice: priceVal,
      listingTime: listTime,
      expirationTime: Endtime,
      nonce: noncedata,
      tokenId: tokenId1,
      orderType: ordertype,
      signature1: signature,
      uri: itemDetails?.ipfs_hash,
      objId: itemDetails?._id.toString(),
      isTokenGated: isTokenGated,
      tokenGateAddress: tokenGateAddress,
      // isEscrow: false,
      // isMetamask: false,
    };

    const delistArray = [
      deslistQuery.seller,
      deslistQuery.contractaddress,
      deslistQuery.royaltyFee,
      deslistQuery.royaltyReceiver,
      deslistQuery.paymentToken,
      deslistQuery.basePrice,
      deslistQuery.listingTime,
      deslistQuery.expirationTime,
      deslistQuery.nonce,
      deslistQuery.tokenId,
      deslistQuery.orderType,
      deslistQuery.signature1,
      deslistQuery.uri,
      deslistQuery.objId,
      deslistQuery.isTokenGated,
      deslistQuery.tokenGateAddress,
      // deslistQuery.isEscrow,
      // deslistQuery.isMetamask,
    ];

    if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
      await klaytnWallConnCheck();
      var { brokerContract }: any = await makeBrokerContractForKlytn(
        contractAddress,
        true,
      );
      try {
        const sendObj = { from: wallet_address, gas: null };
        const brokerTransactionHash = await brokerContract.methods
          .invalidateSignedOrder(delistArray)
          .send(sendObj);

        if (brokerTransactionHash.transactionHash) {
          const delistAction = {
            transaction_hash: brokerTransactionHash.transactionHash,
            contract_address: contractAddress,
            network_id: '2',
          };
          await dispatch(eventsAction(delistAction));
          // setHideCursor(false);
          // Setdelistingloading(false);
          setAllLoadingState((prevState: loadingPropsTypes) => ({
            ...prevState,
            delistloading: false,
            hideCursor: false,
          }));
          await getItemDetails();
          addToast('Your item delisted', {
            appearance: 'success',
            autoDismiss: true,
          });
        }
      } catch (err: any) {
        // setHideCursor(false);
        // Setdelistingloading(false);
        setAllLoadingState((prevState: loadingPropsTypes) => ({
          ...prevState,
          delistloading: false,
          hideCursor: false,
        }));
      }
    } else {
      var { escrowEthContr }: any = await makeBrokerContractForEth(
        contractAddress,
        true,
      );
      try {
        const brokerTransactionHash = await brokerContract.methods
          .invalidateSignedOrder(delistArray)
          .send({ from: wallet_address });

        if (brokerTransactionHash.transactionHash) {
          const delistAction = {
            transaction_hash: brokerTransactionHash.transactionHash,
            contract_address: contractAddress,
            network_id: '1',
          };
          await dispatch(eventsAction(delistAction));
          // setHideCursor(false);
          // Setdelistingloading(false);
          setAllLoadingState((prevState: loadingPropsTypes) => ({
            ...prevState,
            delistloading: false,
            hideCursor: false,
          }));
          await getItemDetails();
          addToast('Your item delisted', {
            appearance: 'success',
            autoDismiss: true,
          });
        }
      } catch (err: any) {
        // setHideCursor(false);
        // Setdelistingloading(false);
        setAllLoadingState((prevState: loadingPropsTypes) => ({
          ...prevState,
          delistloading: false,
          hideCursor: false,
        }));
      }
    }
  };

  const handlePutOffSale = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let contractAddress = itemDetails?.auctionDetails?.contract_address;

      let current_item_id =
        itemDetails?.network_id == 1 ? nftNetworkId : klatynNetworkId;
      if (networkId != current_item_id) {
        if (itemDetails?.network_id == 2) {
          addToast('Please connect with Klaytn network for Delist this item.', {
            appearance: 'error',
            autoDismiss: true,
          });
        } else if (itemDetails?.network_id == 1) {
          addToast(
            'Please connect with Metamask network for Delist  this item.',
            { appearance: 'error', autoDismiss: true },
          );
        }
        return;
      }
      const currentBrokerNeetwork =
        networkId === nftNetworkId ? broker_address : klaytn_broker_address;
      const IsValidUser = await checkValidUser(itemDetails?.network_id);

      if (IsValidUser) {
        if (
          currentBrokerNeetwork?.toLowerCase() ===
          contractAddress?.toLowerCase()
        ) {
          delistItemBylazyListing();
        } else {
          if (
            ((profileDetails?.role === 'admin' ||
              profileDetails?.isSuperAdmin) &&
              (itemDetails?.collectible_owner?.toLowerCase() ===
                process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
                itemDetails?.collectible_owner?.toLowerCase() ===
                process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase())) ||
            (profileDetails?.role === 'user' &&
              !profileDetails?.isSuperAdmin &&
              wallet_address?.toLowerCase() ===
              itemDetails?.collectible_owner?.toLowerCase())
          ) {
            let send_obj: any = { from: wallet_address };
            if (itemDetails?.network_id == '2') {
              send_obj = { from: wallet_address, gas: null };
              await klaytnWallConnCheck();
              var { brokerContract }: any = await makeBrokerContractForKlytn(
                itemDetails.auctionDetails.contract_address,
                true,
              );
            } else {
              var { brokerContract }: any = await makeBrokerContractForEth(
                itemDetails.auctionDetails.contract_address,
                true,
              );
            }
            try {
              // setHideCursor(true);
              // Setdelistingloading(true);
              setAllLoadingState((prevState: loadingPropsTypes) => ({
                ...prevState,
                delistloading: true,
                hideCursor: true,
              }));
              const putoffSaleResult = await brokerContract.methods
                .putSaleOff(
                  itemDetails.token_id,
                  itemDetails.collection_address,
                )
                .send(send_obj);
              const body = {
                contract_address: itemDetails?.auctionDetails?.contract_address,
                network_id: itemDetails.network_id,
                transaction_hash: putoffSaleResult.transactionHash,
              };
              // setHideCursor(false);
              // Setdelistingloading(false);
              await dispatch(eventsAction(body));
              await getItemDetails();
              await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
              setAllLoadingState((prevState: loadingPropsTypes) => ({
                ...prevState,
                delistloading: false,
                hideCursor: false,
              }));
              addToast('Your item delisted', {
                appearance: 'success',
                autoDismiss: true,
              });
              // show transaction pop up
              // loading
            } catch (err) {
              // close model
              // loading stop
              // setHideCursor(false);
              // Setdelistingloading(false);

              setAllLoadingState((prevState: loadingPropsTypes) => ({
                ...prevState,
                delistloading: false,
                hideCursor: false,
              }));
            }
          }
        }
      }
    } catch (error) {
      // setHideCursor(false);
      // Setdelistingloading(false);
      setAllLoadingState((prevState: loadingPropsTypes) => ({
        ...prevState,
        delistloading: false,
        hideCursor: false,
      }));
    }
  };

  const timeDiffCalc = (dateFuture: any, dateNow: any) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    // calculate hours
    let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    // calculate minutes
    const seconds = Math.floor(diffInMilliSeconds);
    if (days) {
      hours = hours;
    }
    setBidTimeObj({
      daysLeft: days,
      hoursLeft: hours,
      minutesLeft: minutes,
      secondsLeft: seconds,
    });

    let difference = '';
    if (days > 0) {
      difference += days === 1 ? `${days} day, ` : `${days} days, `;
    }

    difference +=
      hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

    difference +=
      minutes === 0 || hours === 1
        ? `${minutes} minutes`
        : `${minutes} minutes`;

    return difference;
  };

  const timeDiffCalc1 = (dateFuture: any, dateNow: any) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    // calculate hours
    let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    // calculate minutes
    const seconds = Math.floor(diffInMilliSeconds);
    if (days) {
      hours = hours;
    }
    setBidTimeCloseObj({
      daysLeft1: days,
      hoursLeft1: hours,
      minutesLeft1: minutes,
      secondsLeft1: seconds,
    });

    let difference = '';
    if (days > 0) {
      difference += days === 1 ? `${days} day, ` : `${days} days, `;
    }

    difference +=
      hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

    difference +=
      minutes === 0 || hours === 1
        ? `${minutes} minutes`
        : `${minutes} minutes`;

    return difference;
  };

  useEffect(() => {
    setLike(itemDetails?.is_like);
    return () => {
      setLike(false);
    };
  }, [itemDetails?.is_like]);

  useEffect(() => {
    const connected = localStorage.getItem('isConnected');
    setisConnected(connected);
    setLoading(false);
    // setDetailsLoading(true);
    setAllLoadingState((prevState: loadingPropsTypes) => ({
      ...prevState,
      detailsLoading: true,
    }));
    getItemDetails();
  }, []);

  const changecategory = (e: any) => {
    Settrackingdrop(e);
  };

  useEffect(() => {
    if (hideCursor) {
      window.onbeforeunload = function () {
        if (!hideCursor) {
          return 'If you reload this page, your previous action will be repeated';
        } else {
        }
      };
    } else {
      window.onbeforeunload = null;
    }
  }, [hideCursor]);

  useEffect(() => {
    if (itemDetails) {
      setLike(itemDetails?.is_like);
    }
    const closingTime = itemDetails?.auctionDetails?.closingTime;
    const startingTime = itemDetails?.auctionDetails?.startingTime;
    let interval: any = null;

    interval = setInterval(() => {
      if (
        itemDetails?.auctionDetails?.auctionType == '2' &&
        new Date(itemDetails?.auctionDetails?.closingTime).getTime() >
        new Date().getTime()
      ) {
        const closingdate1 = new Date(closingTime).getTime();
        const closingdate2 = new Date(startingTime).getTime();
        const currentDate = new Date().getTime();
        const comparValue = closingdate1 - currentDate;
        if (comparValue < 0) {
          setPlaceBidCheck(false);
        }

        timeDiffCalc(closingdate1, currentDate);
        timeDiffCalc1(closingdate2, currentDate);
      } else {
        setPlaceBidCheck(false);
      }
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, [itemDetails]);

  useEffect(() => {
    if (itemDetails && itemDetails?._id) {
      // setApproved(itemDetails?.is_approve);
      setAllLoadingState((prevState: loadingPropsTypes) => ({
        ...prevState,
        approved: itemDetails?.is_approve,
      }));
      if (
        itemDetails &&
        itemDetails?.auctionDetails &&
        itemDetails?.auctionDetails?.eth_current_bid
      ) {
        const temp =
          parseFloat('' + itemDetails?.auctionDetails.eth_current_bid) +
          parseFloat('' + itemDetails.auctionDetails?.eth_current_bid) * 0.1;
        setBidValue(temp.toFixed(2));
      }
      if (Number(itemDetails?.auctionDetails?.currentBid)) {
        setLastPrice(
          (itemDetails?.auctionDetails?.currentBid).toString(),
          +itemDetails?.network_id,
          itemDetails?.auctionDetails?.erc20Token,
        );
      } else if (Number(itemDetails?.auctionDetails?.buyPrice)) {
        setLastPrice(
          (itemDetails?.auctionDetails?.buyPrice).toString(),
          +itemDetails?.network_id,
          itemDetails?.auctionDetails?.erc20Token,
        );
      } else if (Number(itemDetails?.auctionDetails?.startingPrice)) {
        setLastPrice(
          (itemDetails?.auctionDetails?.startingPrice).toString(),
          +itemDetails?.network_id,
          itemDetails?.auctionDetails?.erc20Token,
        );
      } else if (Number(itemDetails?.eth_price)) {
        setEthPrice(
          itemDetails?.eth_price,
          +itemDetails?.network_id,
          itemDetails?.last_erc20_address,
        );
      } else if (Number(itemDetails?.last_price)) {
        setLastPrice(
          itemDetails.last_price.toString(),
          +itemDetails?.network_id,
          itemDetails?.last_erc20_address,
        );
      } else {
        setDiaplayValues({ value: '', unit: '' });
        setUsdAmount(0);
      }
    }
    return () => {};
  }, [itemDetails]);

  useEffect(() => {
    if (
      profileDetails?.role === 'user' &&
      !profileDetails?.isSuperAdmin &&
      itemDetails?.collectible_owner?.toUpperCase() ===
      wallet_address?.toUpperCase()
    ) {
      setPutOffSaleCheck(true);
    } else if (
      (profileDetails?.role === 'admin' || profileDetails?.isSuperAdmin) &&
      (itemDetails?.collectible_owner?.toLowerCase() ===
        process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
        itemDetails?.collectible_owner?.toLowerCase() ===
        process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase())
    ) {
      setPutOffSaleCheck(true);
    } else {
      setPutOffSaleCheck(false);
    }
    if (
      wallet_address &&
      itemDetails?.collectible_owner?.toUpperCase() !==
      wallet_address?.toUpperCase() &&
      itemDetails?.auctionDetails?.highestBidder?.toUpperCase() !==
      wallet_address?.toUpperCase() &&
      new Date(itemDetails?.auctionDetails?.startingTime).getTime() >
      new Date().getTime() &&
      itemDetails?.auctionDetails?.auctionType == '2' &&
      !(profileDetails?.role === 'admin' || profileDetails?.isSuperAdmin)
    ) {
      setPlaceBidCheck(false);
    } else if (
      wallet_address &&
      itemDetails?.collectible_owner?.toUpperCase() !==
      wallet_address?.toUpperCase() &&
      itemDetails?.auctionDetails?.highestBidder?.toUpperCase() !==
      wallet_address?.toUpperCase() &&
      new Date(itemDetails?.auctionDetails?.closingTime).getTime() >
      new Date().getTime() &&
      itemDetails?.auctionDetails?.auctionType == '2' &&
      !(profileDetails?.role === 'admin' || profileDetails?.isSuperAdmin)
    ) {
      setPlaceBidCheck(true);
    } else if (
      new Date(itemDetails?.auctionDetails?.closingTime).getTime() >
      new Date().getTime() &&
      itemDetails?.auctionDetails?.auctionType == '2' &&
      !userConnected
    ) {
      setPlaceBidCheck(true);
    } else {
      setPlaceBidCheck(false);
    }
    if (
      itemDetails?.on_sale &&
      itemDetails?.auctionDetails?.auctionType == '1' &&
      profileDetails?.role === 'user' &&
      !profileDetails?.isSuperAdmin &&
      wallet_address?.toUpperCase() !=
      itemDetails?.collectible_owner?.toUpperCase()
    ) {
      setBuyBtnCheck(true);
    } else if (
      itemDetails?.on_sale &&
      itemDetails?.auctionDetails?.auctionType == '1' &&
      !userConnected
    ) {
      setBuyBtnCheck(true);
    } else {
      setBuyBtnCheck(false);
    }
    if (profileDetails?.role === 'admin' || profileDetails?.isSuperAdmin) {
      setBurnBtnCheck(false);
      setPutOnSaleCheck(false);
      if (profileDetails?.role === 'admin' && itemDetails?.redeem_type == 2) {
        if (
          itemDetails?.collectible_owner?.toLowerCase() ===
          process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
          itemDetails?.collectible_owner?.toLowerCase() ===
          process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()
        ) {
          setBurnButtonAfterAdminExist(itemDetails?.collectible_owner);
        }
      }
      if (profileDetails?.isSuperAdmin && itemDetails?.redeem_type == 2) {
        if (
          itemDetails?.collectible_owner?.toLowerCase() ===
          process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
          itemDetails?.collectible_owner?.toLowerCase() ===
          process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()
        ) {
          setBurnBtnCheck(true);
        }
      }
      if (profileDetails?.role === 'admin') {
        if (
          itemDetails?.collectible_owner?.toLowerCase() ===
          process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
          itemDetails?.collectible_owner?.toLowerCase() ===
          process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()
        ) {
          setPutOnSaleAfterAdminExist(itemDetails?.collectible_owner);
        }
      }
      if (profileDetails?.isSuperAdmin) {
        if (
          itemDetails?.collectible_owner?.toLowerCase() ===
          process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
          itemDetails?.collectible_owner?.toLowerCase() ===
          process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()
        ) {
          setPutOnSaleCheck(true);
        }
      }
    } else if (
      wallet_address?.toUpperCase() ==
      itemDetails?.collectible_owner?.toUpperCase() &&
      itemDetails?.redeem_type == 2 &&
      itemDetails?.redeem_status == 'delivered' &&
      (!itemDetails?.on_sale ||
        (itemDetails?.on_sale &&
          itemDetails?.auctionDetails?.auctionType === '2' &&
          new Date(itemDetails?.auctionDetails?.closingTime).getTime() <
          new Date().getTime() &&
          itemDetails?.history?.bid?.length === 0))
    ) {
      setBurnBtnCheck(true);
    } else {
      setBurnBtnCheck(false);
      setPutOnSaleCheck(false);
    }
  }, [itemDetails, profileDetails]);

  const setBurnButtonAfterAdminExist = async (address: any) => {
    if (networkId == process.env.REACT_APP_KLATYN_NETWORK_ID) {
      var { brokerContract }: any = await makeBrokerContractForKlytn(
        address,
        true,
      );
    } else {
      var { brokerContract }: any = await makeBrokerContractForEth(
        address,
        true,
      );
    }
    await brokerContract.methods
      .admins(localStorage.getItem('Wallet Address'))
      .call()
      .then(async (res: any) => {
        if (res) {
          setBurnBtnCheck(true);
        }
      });
  };

  const setPutOnSaleAfterAdminExist = async (address: any) => {
    if (networkId == process.env.REACT_APP_KLATYN_NETWORK_ID) {
      var { brokerContract }: any = await makeBrokerContractForKlytn(
        address,
        true,
      );
    } else {
      var { brokerContract }: any = await makeBrokerContractForEth(
        address,
        true,
      );
    }
    await brokerContract.methods
      .admins(localStorage.getItem('Wallet Address'))
      .call()
      .then(async (res: any) => {
        if (res) {
          setPutOnSaleCheck(true);
        }
      });
  };

  const setLastPrice = async (
    price: any,
    network_id: any,
    last_erc20_address: any,
  ) => {
    const result = await getWeiPrice(price, network_id, last_erc20_address);
    let priceUnit = 'ETH';
    if (network_id === 2) {
      const res: any = await CheckCurrency(last_erc20_address);
      if (res?.name === 'AGOV') {
        const bal = await getAGOVBalance();
        setAgovBal(bal);
        setAllTokenPrice({
          agovBal: bal,
        });
      } else if (res?.name === 'USDT') {
        const bal = await getUsdtKlaytnBalance();
        setUsdtKlaytnBal(bal);
      }
      priceUnit = res?.name;
    } else {
      const res: any = await CheckCurrencyMetaMask(last_erc20_address);
      if (res?.name === 'WETH') {
        // const bal = await getWETHBalance();
        const bal = await getBalanceOfErc20(weth_contract);

        setAllTokenPrice({
          wethBal: bal,
        });
      } else if (res?.name === 'MPWR') {
        // const bal = await getMpwrBalance();
        const bal = await getBalanceOfErc20(mpwr_token_address);
        setAllTokenPrice({
          mpwrBal: bal,
        });
      } else if (res?.name === 'AGOV') {
        const bal = await getAgovEthBalance();
        setAgovEthBal(bal);
        setAllTokenPrice({
          agovEthBal: bal,
        });
      } else if (res?.name === 'USDT') {
        const bal = await getUsdtEthBalance();
        setUsdtEthBal(bal);
      }
      priceUnit = res?.name;
    }
    setDiaplayValues({ value: result, unit: priceUnit });
    getUsdRate(result, network_id, last_erc20_address);
  };

  const setEthPrice = async (
    price: any,
    network_id: any,
    last_erc20_address: any,
  ) => {
    let priceUnit = 'ETH';
    if (network_id === 2) {
      const res: any = await CheckCurrency(last_erc20_address);
      if (res?.name === 'AGOV') {
        const bal = await getAGOVBalance();
        setAgovBal(bal);
      } else if (res?.name === 'USDT') {
        const bal = await getUsdtKlaytnBalance();
        setUsdtKlaytnBal(bal);
      }
      priceUnit = res?.name;
    } else {
      const res: any = await CheckCurrencyMetaMask(last_erc20_address);
      if (res?.name === 'WETH') {
        // const bal = await getWETHBalance();
        const bal = await getBalanceOfErc20(weth_contract);

        setAllTokenPrice({
          wethBal: bal,
        });
      } else if (res?.name === 'MPWR') {
        const bal = await getMpwrBalance();
        setAllTokenPrice({
          mpwrBal: bal,
        });
        setMpwrBal(bal);
      } else if (res?.name === 'USDT') {
        const bal = await getUsdtEthBalance();
        setUsdtEthBal(bal);
      } else if (res?.name === 'AGOV') {
        // const bal = await getAgovEthBalance();
        const bal = await getBalanceOfErc20(agov_eth_token_address);
        setAllTokenPrice({
          agovEthBal: bal,
        });
      }
      priceUnit = res?.name;
    }
    setDiaplayValues({ value: price, unit: priceUnit });
    getUsdRate(price, network_id, last_erc20_address);
  };

  const getUsdRate = async (
    price: any,
    network_id: any,
    erc20_address: string,
  ) => {
    let usdAmount: any;
    let royaltyusd: any;
    let platformusd: any;

    let {
      ethRate,
      klayRate,
      agovRate,
      mpwrRate,
      agovEthRate,
      ethUSDTRate,
      klaytnUSDTRate,
    } = currencyDetails;
    let { royalties } = itemDetails;
    if (network_id === 1) {
      if (erc20_address?.toLowerCase() === mpwr_token_address?.toLowerCase()) {
        usdAmount = price * mpwrRate;
        royaltyusd = ((price * royalties) / 100) * mpwrRate;
        platformusd = ((price * 2.5) / 100) * mpwrRate;
      } else if (
        erc20_address?.toLowerCase() === agov_eth_token_address?.toLowerCase()
      ) {
        usdAmount = price * agovEthRate;
        royaltyusd = ((price * royalties) / 100) * agovEthRate;
        platformusd = ((price * 2.5) / 100) * agovEthRate;
      } else if (
        erc20_address?.toLowerCase() === usdt_eth_token_address?.toLowerCase()
      ) {
        usdAmount = price * ethUSDTRate;
        royaltyusd = ((price * royalties) / 100) * ethUSDTRate;
        platformusd = ((price * 2.5) / 100) * ethUSDTRate;
      } else {
        usdAmount = price * ethRate;
        royaltyusd = ((price * royalties) / 100) * ethRate;
        platformusd = ((price * 2.5) / 100) * ethRate;
      }
    } else {
      if (erc20_address == '0x0000000000000000000000000000000000000000') {
        usdAmount = price * klayRate;
        royaltyusd = ((price * royalties) / 100) * klayRate;
        platformusd = ((price * 2.5) / 100) * klayRate;
      } else if (
        erc20_address?.toLowerCase() ===
        usdt_klaytn_token_address?.toLowerCase()
      ) {
        usdAmount = price * klaytnUSDTRate;
        royaltyusd = ((price * royalties) / 100) * klaytnUSDTRate;
        platformusd = ((price * 2.5) / 100) * klaytnUSDTRate;
      } else {
        usdAmount = price * agovRate;
        royaltyusd = ((price * royalties) / 100) * agovRate;
        platformusd = ((price * 2.5) / 100) * agovRate;
      }
    }
    if (usdAmount > 0) {
      setUsdAmount(usdAmount?.toFixed(2));

      if (royalties > 0) {
        Setroyalityusd(royaltyusd.toFixed(2));
        Setplatformusd(platformusd.toFixed(2));
      }
    }
  };

  const getWeiPrice = async (
    price: any,
    network_id: any,
    last_erc20_address: any,
  ) => {
    const result = itemDetails?.auctionDetails?.erc20Token;
    if (network_id === 2) {
      const { caver }: any = await GetCaver();
      return await customFromWei(price, caver, last_erc20_address);
    } else {
      const { web3 }: any = await EnableEthereum(true);
      return await customFromWei(price, web3, last_erc20_address);
    }
  };

  useEffect(() => {
    const id: any =
      itemDetails?.network_id == 1 ? nftNetworkId : klatynNetworkId;
    setNetworkdIdUrl(id);
  }, [itemDetails?.network_id]);

  const getItemDetails = async () => {
    let query;
    if (wallet_address) {
      query = {
        collectible_id: props?.match?.params?.collectible_id,
        wallet_address: wallet_address,
      };
    } else {
      query = {
        collectible_id: props?.match?.params?.collectible_id,
      };
    }

    const result: any = await dispatch(ItemDetailsAction(query));

    setTrackingvalue(result?.data?.tracking_number);
    Settrackingdrop(result?.data?.courier_type);
    setLoading(false);
    if (!result?.status && result.code === 400) {
      addToast('Item Not Found', { appearance: 'error', autoDismiss: true });
      setBidTransactionHash('');
      setTimeout(() => {
        history.push('/home');
      }, 1000);
      if (showRedeemNowModal) {
        closeRedeemNowModal();
      }
    }
    // setDetailsLoading(false);
    setAllLoadingState((prevState: loadingPropsTypes) => ({
      ...prevState,
      detailsLoading: false,
    }));

    if (result) {
      if (showRedeemNowModal) {
        closeRedeemNowModal();
      }
    }
  };

  const getReaction = async () => {
    if (!isConnected) {
      history.push('/connect-wallet');
    }
    if (!props?.itemDetails?.is_like) {
      setLike(true);
    } else {
      setLike(false);
    }
    if (wallet_address) {
      const object = {
        collectible_id: itemDetails?._id,
      };
      const result: any = await dispatch(reactOnPost(object));
      getItemDetails();
      if (result?.data?.data) {
        if (result?.data?.data?.isLike) {
        } else {
          setLike(false);
        }
      }
    }
  };

  const handleClaim = async () => {
    let current_item_id =
      itemDetails?.network_id == 1 ? nftNetworkId : klatynNetworkId;
    if (networkId != current_item_id) {
      if (itemDetails?.network_id == 2) {
        addToast(
          'Please connect with Klaytn network in order to claim this item.',
          { appearance: 'error', autoDismiss: true },
        );
      } else if (itemDetails?.network_id == 1) {
        addToast(
          'Please connect with Metamask network in order to claim this item.',
          { appearance: 'error', autoDismiss: true },
        );
      }
      return;
    }

    const IsValidUser = await checkValidUser(itemDetails?.network_id);
    if (IsValidUser) {
      setLoading(true);
      setHideCursor(true);
      window.onbeforeunload = function () {
        return 'If you reload this page, your previous action will be repeated';
      };
      try {
        const contractAddress = itemDetails?.auctionDetails?.contract_address;
        const isNotClubrare =
          itemDetails?.collectible_type == 'clubrare' ? false : true;

        const endTime = Math.round(
          new Date(itemDetails?.auctionDetails?.initialClosingTime).getTime() /
          1000,
        );
        const noncedata = Number(itemDetails?.auctionDetails?.nonce);

        const listTime = Math.round(
          new Date(itemDetails?.auctionDetails?.startingTime).getTime() / 1000,
        );

        const signature = itemDetails?.auctionDetails?.signature;
        const ordertype = itemDetails?.redeemable ? 1 : 0;
        const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
        const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
        const lastOwner = itemDetails?.auctionDetails?.lastOwner;
        const ClaimObj = {
          seller: lastOwner,
          contractAddress: itemDetails?.collection_address,
          royaltyFee: itemDetails?.royalties ? itemDetails.royalties * 100 : 0,
          royaltyReceiver: itemDetails?.userObj?.wallet_address.toString(),
          paymentToken: itemDetails?.auctionDetails?.erc20Token,
          startingPrice: itemDetails?.auctionDetails?.startingPrice,
          listingTime: listTime,
          expirationTime: endTime ? endTime : 0,
          nonce: noncedata,
          tokenId: itemDetails?.token_id ? itemDetails?.token_id : 0,
          orderType: ordertype,
          signature: signature,
          uri: itemDetails?.ipfs_hash,
          item_id: itemDetails?._id.toString(),
          isTokenGated: isTokenGated,
          tokenGateAddress: tokenGateAddress,
          // isEscrow: false,
          // isMetamask: false,
        };
        const claimArray: string | boolean | number[] = [
          ClaimObj.seller,
          ClaimObj.contractAddress,
          ClaimObj.royaltyFee,
          ClaimObj.royaltyReceiver,
          ClaimObj.paymentToken,
          ClaimObj.startingPrice,
          ClaimObj.listingTime,
          ClaimObj.expirationTime,
          ClaimObj.nonce,
          ClaimObj.tokenId,
          ClaimObj.orderType,
          ClaimObj.signature,
          ClaimObj.uri,
          ClaimObj.item_id,
          ClaimObj.isTokenGated,
          ClaimObj.tokenGateAddress,
          // ClaimObj.isEscrow,
          // ClaimObj.isMetamask,
        ];

        if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
          await klaytnWallConnCheck();
          if (
            klaytn_broker_address?.toLowerCase() ===
            contractAddress?.toLowerCase()
          ) {
            try {
              const { brokerContract }: any = await makeBrokerContractForKlytn(
                contractAddress,
                true,
              );
              const send_obj = JSON.stringify({
                from: wallet_address,
                gas: null,
              });
              const { brokerValidatorContract }: any = await EnableKlyten();
              const isSigInvalid = await brokerValidatorHandler(
                brokerValidatorContract,
                brokerContract,
                claimArray,
              );
              if (isSigInvalid) {
                addToast('There is some issue, Please try again later', {
                  appearance: 'error',
                  autoDismiss: true,
                });
                return;
              }

              const brokerTransactionHash = await brokerContract.methods
                .claim(claimArray)
                .send(JSON.parse(send_obj));

              if (brokerTransactionHash.transactionHash) {
                const buyAction = {
                  transaction_hash: brokerTransactionHash.transactionHash,
                  contract_address: contractAddress,
                  network_id: '2',
                };
                await dispatch(eventsAction(buyAction));

                setLoading(false);
                setHideCursor(false);
                await getItemDetails();
                addToast('Your item Claim successfully', {
                  appearance: 'success',
                  autoDismiss: true,
                });
              }
            } catch (err: any) {
              setLoading(false);
              setHideCursor(false);
              addToast(err.message, {
                appearance: 'error',
                autoDismiss: true,
              });
            }
          } else {
            const contractAddress =
              itemDetails?.auctionDetails?.contract_address;
            const { brokerContract }: any = await makeBrokerContractForKlytn(
              contractAddress,
              true,
            );

            const collectResult: any = await brokerContract.methods
              .collect(token_id, itemDetails.collection_address)
              .send({ from: wallet_address, gas: null });
            const collectionEvent = {
              network_id: '2',
              contract_address: brokerContract?._address,
              transaction_hash: collectResult.transactionHash,
            };
            await dispatch(eventsAction(collectionEvent));
            setHideCursor(false);
            window.onbeforeunload = null;
          }
        } else {
          const { brokerContract }: any = await makeBrokerContractForEth(
            contractAddress,
            true,
          );

          if (
            broker_address?.toLowerCase() === contractAddress?.toLowerCase()
          ) {
            try {
              const { brokerValidatorContract }: any = await EnableEthereum();
              const isSigInvalid = await brokerValidatorHandler(
                brokerValidatorContract,
                brokerContract,
                claimArray,
              );
              if (isSigInvalid) {
                addToast('There is some issue, Please try again later', {
                  appearance: 'error',
                  autoDismiss: true,
                });
                return;
              }

              const brokerTransactionHash = await brokerContract.methods
                .claim(claimArray)
                .send({ from: wallet_address });
              if (brokerTransactionHash.transactionHash) {
                const buyAction = {
                  transaction_hash: brokerTransactionHash.transactionHash,
                  contract_address: contractAddress,
                  network_id: '1',
                };
                await dispatch(eventsAction(buyAction));

                setLoading(false);
                setHideCursor(false);
                await getItemDetails();
              }
            } catch (err) {
              setLoading(false);
              setHideCursor(false);
            }
          } else {
            let collectResult: any;
            if (
              broker_address_v3?.toLowerCase() === contractAddress.toLowerCase()
            ) {
              collectResult = await brokerContract.methods
                .collect(
                  token_id,
                  itemDetails.collection_address,
                  isNotClubrare,
                )
                .send({ from: wallet_address });
            } else {
              collectResult = await brokerContract.methods
                .collect(token_id, itemDetails.collection_address)
                .send({ from: wallet_address });
            }

            const collectionEvent = {
              network_id: '1',
              contract_address: brokerContract?._address,
              transaction_hash: collectResult?.transactionHash,
            };
            await dispatch(eventsAction(collectionEvent));
            setHideCursor(false);
            window.onbeforeunload = null;
          }
        }

        setLoading(false);
        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        getItemDetails();
      } catch (err) {
        setLoading(false);
        setHideCursor(false);
        window.onbeforeunload = null;
      }
    }
  };

  const disableCursor = (res: any) => {
    setHideCursor(res);
  };

  const openRedeemNowModal = () => {
    setShowRedeemNowModal(true);
  };

  const closeRedeemNowModal = () => {
    setShowRedeemNowModal(false);
  };

  const openRedeemApproveModal = () => {
    setShowRedeemApproveModal(true);
  };

  const onPlaceBid = () => {
    try {
      if (bidValue === '') {
        setError({
          ...error,
          bidValueError: 'Price can not be empty',
        });
        return;
      } else if (error.bidValueError) {
        return;
      } else {
        let current_item_id =
          itemDetails?.network_id == 1 ? nftNetworkId : klatynNetworkId;

        if (networkId != current_item_id) {
          if (itemDetails?.network_id === '2') {
            addToast(
              'Please connect with Klaytn network in order to place bid on this item.',
              { appearance: 'error', autoDismiss: true },
            );
          } else if (itemDetails?.network_id === '1') {
            addToast(
              'Please connect with Metamask network in order to place bid on this item.',
              { appearance: 'error', autoDismiss: true },
            );
          }
          setBidValue('');
          setLoading(false);
          setHideCursor(false);
          setBidModal(false);
          window.onbeforeunload = null;
          setBuynowModel(false);
          return;
        } else if (networkId == klatynNetworkId) {
          if (displayValues.unit === 'AGOV') {
            approve(true);
            return;
          } else if (displayValues.unit === 'USDT') {
            usdtKlaytnApprove(true);
            return;
          } else {
            handleBidMethod();
          }
        } else {
          if (displayValues.unit === 'WETH') {
            wethApprove(true);
            return;
          } else if (displayValues.unit === 'MPWR') {
            mpwrApprove(true);
            return;
          } else if (displayValues.unit === 'AGOV') {
            agovEthApprove(true);
            return;
          } else if (displayValues.unit === 'USDT') {
            usdtEthApprove(true);
            return;
          } else {
            handleBidMethod();
          }
        }
      }
    } catch (error) {
      addToast('Something went wrong', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const handleBidMethod = async () => {
    try {
      window.onbeforeunload = function () {
        return 'If you reload this page, your previous action will be repeated';
      };
      setPlaceABidLoading(true);
      setHideCursor(true);
      const collectionAddress = itemDetails?.collection_address;
      const contractAddress = itemDetails?.auctionDetails?.contract_address;
      if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
        await klaytnWallConnCheck();
        if (
          klaytn_broker_address?.toLowerCase() ===
          contractAddress?.toLowerCase()
        ) {
          getSignatureForBid();
        } else {
          const { brokerContract }: any = await makeBrokerContractForKlytn(
            contractAddress,
            true,
          );
          const { caver }: any = await GetCaver();
          const amountToSend = await customToWei(
            bidValue,
            caver,
            itemDetails?.auctionDetails?.erc20Token,
          );
          let send_obj: any = {
            from: wallet_address,
            value: amountToSend,
            gas: null,
          };
          if (displayValues.unit === 'AGOV') {
            send_obj = { from: wallet_address, gas: null };
          }
          const bidResult = await brokerContract.methods
            .bid(token_id, collectionAddress, amountToSend)
            .send(send_obj);
          const bidEvent: any = {
            contract_address: brokerContract._address,
            network_id: '2',
            transaction_hash: bidResult.transactionHash,
          };
          await dispatch(eventsAction(bidEvent));
          await setBidTransactionHash(bidResult.transactionHash);
        }
      } else {
        const { web3 }: any = await getWeb3();
        const { brokerContract }: any = await makeBrokerContractForEth(
          contractAddress,
          true,
        );
        if (broker_address?.toLowerCase() === contractAddress?.toLowerCase()) {
          getSignatureForBid();
        } else {
          const amountToSend = await customToWei(
            bidValue,
            web3,
            itemDetails?.auctionDetails?.erc20Token,
          );

          let eth_send_obj: any = { from: wallet_address, value: amountToSend };
          if (displayValues.unit === 'WETH') {
            eth_send_obj = { from: wallet_address };
          }
          const bidResult = await brokerContract.methods
            .bid(token_id, collectionAddress, amountToSend)
            .send(eth_send_obj);

          const bidEvent: any = {
            contract_address: brokerContract.address,
            network_id: '1',
            transaction_hash: bidResult.transactionHas,
          };
          await dispatch(eventsAction(bidEvent));
          await setBidTransactionHash(bidResult.transactionHash);
          addToast('Your bid successfully placed.', {
            appearance: 'success',
            autoDismiss: true,
          });
        }
      }
      setIsPlaceABidModalVisible(false);

      window.onbeforeunload = null;
      getItemDetails();
    } catch (err) {
      setLoading(false);
      setIsPlaceABidModalVisible(false);
      setPlaceABidLoading(false);
      setHideCursor(false);
      setBidModal(false);
      setBidValue('');
      window.onbeforeunload = null;
    }
  };

  const showRedeemRequestModal = () => {
    setShowRedeemNowModal(false);
    setOpenRedeemRequestModal(true);
  };

  const closeReddemRequestModal = () => {
    setOpenRedeemRequestModal(false);
    setLoading(true);
    getItemDetails();
  };

  // for kly network
  const getAGOVBalance = async () => {
    const { caver }: any = await GetCaver();
    const erc20Contract = new caver.klay.Contract(
      erc20Artifacts.abi, //ABI
      agov_contract, //Address
    );
    try {
      const res = await erc20Contract.methods.balanceOf(wallet_address).call();
      const bal = await customFromWei(res, caver, agov_contract);

      return bal;
    } catch (err) {}
  };

  const getUsdtKlaytnBalance = async () => {
    const { caver }: any = await GetCaver();
    const erc20Contract = new caver.klay.Contract(
      erc20Artifacts.abi, //ABI
      usdt_klaytn_token_address, //Address
    );
    try {
      const res = await erc20Contract.methods.balanceOf(wallet_address).call();
      const bal = await customFromWei(res, caver, usdt_klaytn_token_address);

      return bal;
    } catch (err) {}
  };

  const getWETHBalance = async () => {
    const { web3 }: any = await getWeb3();
    const erc20Contract = new web3.eth.Contract(
      erc20Artifacts.abi,
      weth_contract,
    );
    try {
      const res = await erc20Contract.methods.balanceOf(wallet_address).call();
      const bal = await customFromWei(res, web3, weth_contract);
      return bal;
    } catch (err) {}
  };

  const getMpwrBalance = async () => {
    const { web3 }: any = await getWeb3();
    const erc20Contract = new web3.eth.Contract(
      erc20Artifacts.abi,
      mpwr_token_address,
    );
    try {
      const res = await erc20Contract.methods.balanceOf(wallet_address).call();
      const bal = customFromWei(res, web3, mpwr_token_address);
      return bal;
    } catch (err) {}
  };

  const getBalanceOfErc20 = async (erc20Address: any) => {
    const { web3 }: any = await getWeb3();
    const erc20Contract = new web3.eth.Contract(
      erc20Artifacts.abi,
      erc20Address,
    );
    try {
      const res = await erc20Contract.methods.balanceOf(wallet_address).call();
      const bal = customFromWei(res, web3, mpwr_token_address);
      return bal;
    } catch (err) {}
  };

  const getAgovEthBalance = async () => {
    const { web3 }: any = await getWeb3();
    const erc20Contract = new web3.eth.Contract(
      erc20Artifacts.abi,
      agov_eth_token_address,
    );
    try {
      const res = await erc20Contract.methods.balanceOf(wallet_address).call();
      const bal = customFromWei(res, web3, agov_eth_token_address);
      return bal;
    } catch (err) {}
  };

  const getUsdtEthBalance = async () => {
    const { web3 }: any = await getWeb3();
    const erc20Contract = new web3.eth.Contract(
      erc20Artifacts.abi,
      usdt_eth_token_address,
    );
    try {
      const res = await erc20Contract.methods.balanceOf(wallet_address).call();
      const bal = await customFromWei(res, web3, usdt_eth_token_address);      
      return bal;
    } catch (err) {}
  };

  // handleBidValue used for handle vid validation
  const handleBidValue = (e: any) => {
    const price = Number(displayValues.value) ? displayValues.value : 0;
    const regex1 = /^[0-9][.\d]{0,17}$/;

    if (networkId == klatynNetworkId) {
      if (displayValues.unit === 'KLAY' && +e.target.value > +walletAmount) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Your token balance is not enough to bid.',
        });
      } else if (
        displayValues.unit === 'AGOV' &&
        +e.target.value > +allTokenPrice.agovBal
      ) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Your token balance is not enough to bid.',
        });
      } else if (
        displayValues.unit === 'USDT' &&
        +e.target.value > +usdtKlaytnBal
      ) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Your token balance is not enough to bid.',
        });
      } else if (+e.target.value <= +price) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError:
            'Bid value must be greater than minimum/current bid value.',
        });
      } else if (!regex1.test(e.target.value)) {
        // 18 carector
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Price should not more then 18 digit.',
        });
      } else {
        setBidValue(e.target.value);
        setError({ ...error, bidValueError: '' });
      }
    } else {
      if (displayValues.unit === 'ETH' && +e.target.value > +walletAmount) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Your token balance is not enough to bid.',
        });
      } else if (
        displayValues.unit === 'WETH' &&
        +e.target.value > +allTokenPrice.wethBal
      ) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Your token balance is not enough to bid.',
        });
      } else if (
        displayValues.unit === 'MPWR' &&
        +e.target.value > +allTokenPrice.mpwrBal
      ) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Your token balance is not enough to bid.',
        });
      } else if (
        displayValues.unit === 'USDT' &&
        +e.target.value > +usdtEthBal
      ) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Your token balance is not enough to bid.',
        });
      } else if (
        displayValues.unit === 'AGOV' &&
        +e.target.value > +allTokenPrice.agovEthBal
      ) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Your token balance is not enough to bid.',
        });
      } else if (+e.target.value <= +price) {
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError:
            'Bid value must be greater than minimum/current bid value.',
        });
      } else if (!regex1.test(e.target.value)) {
        // 18 carector
        setBidValue(e.target.value);
        setError({
          ...error,
          bidValueError: 'Price should not more then 18 digit.',
        });
      } else {
        setBidValue(e.target.value);
        setError({ ...error, bidValueError: '' });
      }
    }
  };

  // approve used for Agov approval
  const approve = async (isAuction: any) => {
    setPlaceABidLoading(true);
    setHideCursor(true);
    setLoading(true);
    await klaytnWallConnCheck();
    const { caver }: any = await GetCaver();
    const contractAddress = itemDetails?.auctionDetails?.contract_address;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
    if (
      klaytn_broker_address?.toLowerCase() === contractAddress?.toLowerCase()
    ) {
      let price = itemDetails?.auctionDetails?.buyPrice;
      if (isAuction) {
        price = await customToWei(
          bidValue,
          caver,
          itemDetails?.auctionDetails?.erc20Token,
        );
      }
      const bal = await getAGOVBalance();
      const agovbal = await customToWei(
        bal,
        caver,
        itemDetails?.auctionDetails?.erc20Token,
      );
      if (Number(price) > +agovbal) {
        addToast("You don't have enough balance to buy this item", {
          appearance: 'error',
          autoDismiss: true,
        });
        setPlaceABidLoading(false);
        setHideCursor(false);
        setLoading(false);
        setBuynowModel(false);
        return;
      }

      // check balance for llc token base sale for admin
      if (isTokenGated) {
        const { CbrforKlyContr }: any = await CbrNftforKlyContract(
          tokenGateAddress,
          true,
        );
        const checkTokenGateBalance = await CbrforKlyContr.methods
          .balanceOf(wallet_address)
          .call();
        if (+checkTokenGateBalance === 0) {
          setLoading(false);
          setHideCursor(false);
          setBidModal(false);
          window.onbeforeunload = null;
          setBuynowModel(false);
          addToast('Only LazyLeo NFT holders can buy/bid on this item', {
            appearance: 'error',
            autoDismiss: true,
          });
          return;
        }
      }

      const send_obj = { from: wallet_address, gas: null };

      const erc20Contract = new caver.klay.Contract(
        erc20Artifacts.abi,
        itemDetails?.auctionDetails?.erc20Token,
      );
      try {
        const approvetakelResult = await erc20Contract.methods
          .approve(contractAddress, price)
          .send(send_obj);
        if (approvetakelResult.transactionHash) {
          if (isAuction) {
            handleBidMethod();
          } else {
            handleBuy();
          }
        }
      } catch (err) {
        setPlaceABidLoading(false);
        setHideCursor(false);
        setLoading(false);
        setBuynowModel(false);
      }
    } else {
      try {
        setHideCursor(true);
        setLoading(true);
        let price = itemDetails?.auctionDetails?.buyPrice;
        if (isAuction) {
          price = await customToWei(
            bidValue,
            caver,
            itemDetails?.auctionDetails?.erc20Token,
          );
        }
        const erc20Contract = new caver.klay.Contract(
          erc20Artifacts.abi,
          itemDetails?.auctionDetails?.erc20Token,
        );
        const send_obj = { from: wallet_address, gas: null };
        await erc20Contract.methods
          .approve(klaytn_broker_address, price)
          .send(send_obj);
        await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        if (isAuction) {
          handleBidMethod();
        } else {
          handleBuy();
        }
      } catch (err) {
        setLoading(false);
        setHideCursor(false);
        setBidModal(false);
        setBuynowModel(false);
        setPlaceABidLoading(false);
      }
    }
  };

  // approve used for usdt klaytn approval
  const usdtKlaytnApprove = async (isAuction: any) => {
    setPlaceABidLoading(true);
    setHideCursor(true);
    setLoading(true);
    await klaytnWallConnCheck();
    const { caver }: any = await GetCaver();
    const contractAddress = itemDetails?.auctionDetails?.contract_address;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
    let price = itemDetails?.auctionDetails?.buyPrice;
    if (isAuction) {
      price = await customToWei(
        bidValue,
        caver,
        itemDetails?.auctionDetails?.erc20Token,
      );
    }
    const bal = await getUsdtKlaytnBalance();
    const agovbal = await customToWei(
      bal,
      caver,
      itemDetails?.auctionDetails?.erc20Token,
    );
    if (Number(price) > +agovbal) {
      addToast("You don't have enough balance to buy this item", {
        appearance: 'error',
        autoDismiss: true,
      });
      setPlaceABidLoading(false);
      setHideCursor(false);
      setLoading(false);
      setBuynowModel(false);
      return;
    }

    // check balance for llc token base sale for admin
    if (isTokenGated) {
      const { CbrforKlyContr }: any = await CbrNftforKlyContract(
        tokenGateAddress,
        true,
      );
      const checkTokenGateBalance = await CbrforKlyContr.methods
        .balanceOf(wallet_address)
        .call();
      if (+checkTokenGateBalance === 0) {
        setLoading(false);
        setHideCursor(false);
        setBidModal(false);
        window.onbeforeunload = null;
        setBuynowModel(false);
        addToast('Only LazyLeo NFT holders can buy/bid on this item', {
          appearance: 'error',
          autoDismiss: true,
        });
        return;
      }
    }

    const send_obj = { from: wallet_address, gas: null };

    const erc20Contract = new caver.klay.Contract(
      erc20Artifacts.abi,
      itemDetails?.auctionDetails?.erc20Token,
    );

    try {
      const isAllowance = await erc20Contract.methods
        .allowance(wallet_address, contractAddress)
        .call();

      if (Number(price) > Number(isAllowance)) {
        const approvetakelResult = await erc20Contract.methods
          .approve(contractAddress, allowanceAmount)
          .send(send_obj);
        if (approvetakelResult.transactionHash) {
          if (isAuction) {
            handleBidMethod();
          } else {
            handleBuy();
          }
        }
      } else {
        if (isAuction) {
          handleBidMethod();
        } else {
          handleBuy();
        }
      }
    } catch (err) {
      setPlaceABidLoading(false);
      setHideCursor(false);
      setLoading(false);
      setBuynowModel(false);
    }
  };
  // wethApprove  used for WETH approval
  const wethApprove = async (isAuction: any) => {
    setPlaceABidLoading(true);
    setHideCursor(true);
    setLoading(true);
    const { web3 }: any = await getWeb3();
    const contractAddress = itemDetails?.auctionDetails?.contract_address;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
    try {
      if (broker_address?.toLowerCase() === contractAddress?.toLowerCase()) {
        let price = itemDetails?.auctionDetails?.buyPrice;
        if (isAuction) {
          price = await customToWei(
            bidValue,
            web3,
            itemDetails?.auctionDetails?.erc20Token,
          );
        }
        try {
          // check Balance of current account
          const bal = await getWETHBalance();
          const balConvt = await customToWei(bal, web3, weth_contract);

          if (Number(price) > balConvt) {
            addToast("You don't have enough balance to buy this item", {
              appearance: 'error',
              autoDismiss: true,
            });
            setPlaceABidLoading(false);
            setHideCursor(false);
            setLoading(false);
            setBuynowModel(false);
            return;
          }
          // check balance for llc token base sale for admin
          if (isTokenGated) {
            const { CbrforEthContr }: any = await CbrNftforEthContract(
              tokenGateAddress,
            );
            const checkTokenGateBalance = await CbrforEthContr.methods
              .balanceOf(wallet_address)
              .call();
            if (+checkTokenGateBalance === 0) {
              setLoading(false);
              setHideCursor(false);
              setBidModal(false);
              window.onbeforeunload = null;
              setBuynowModel(false);
              addToast('Only LazyLeo NFT holders can buy/bid on this item', {
                appearance: 'error',
                autoDismiss: true,
              });
              return;
            }
          }
          const { wethContract }: any = await makeWethContractforEth(
            itemDetails?.auctionDetails?.erc20Token,
          );
          const approvetakelResult = await wethContract.methods
            .approve(contractAddress, price)
            .send({ from: wallet_address });
          if (approvetakelResult.transactionHash) {
            if (isAuction) {
              handleBidMethod();
            } else {
              handleBuy();
            }
          }
        } catch (err: any) {
          setBuynowModel(false);
          setPlaceABidLoading(false);
          setHideCursor(false);
          setBidModal(false);
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } else {
        let price = itemDetails?.auctionDetails?.buyPrice;
        if (isAuction) {
          price = await customToWei(
            bidValue,
            web3,
            itemDetails?.auctionDetails?.erc20Token,
          );
        }
        const { wethContract }: any = await makeWethContractforEth(
          itemDetails?.auctionDetails?.erc20Token,
        );
        const send_obj = { from: wallet_address };
        await wethContract.methods
          .approve(broker_address, price)
          .send(send_obj);
        await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        if (isAuction) {
          handleBidMethod();
        } else {
          handleBuy();
        }
      }
    } catch (err: any) {
      setPlaceABidLoading(false);
      setHideCursor(false);
      setLoading(false);
      setBidModal(false);
      setBuynowModel(false);
      setBidValue('');
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  // Mpwr Approve function
  const mpwrApprove = async (isAuction: any) => {
    setPlaceABidLoading(true);
    setHideCursor(true);
    setLoading(true);
    const { web3 }: any = await getWeb3();
    const contractAddress = itemDetails?.auctionDetails?.contract_address;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
    try {
      if (broker_address?.toLowerCase() === contractAddress?.toLowerCase()) {
        let price = itemDetails?.auctionDetails?.buyPrice;
        if (isAuction) {
          price = await customToWei(
            bidValue,
            web3,
            itemDetails?.auctionDetails?.erc20Token,
          );
        }
        const bal = await getMpwrBalance();
        const balConvt = await customToWei(bal, web3, '');
        if (Number(price) > +balConvt) {
          addToast("You don't have enough balance to buy this item", {
            appearance: 'error',
            autoDismiss: true,
          });
          setPlaceABidLoading(false);
          setHideCursor(false);
          setLoading(false);
          setBuynowModel(false);
          return;
        }
        try {
          // check balance for llc token base sale for admin
          if (isTokenGated) {
            const { CbrforEthContr }: any = await CbrNftforEthContract(
              tokenGateAddress,
            );
            const checkTokenGateBalance = await CbrforEthContr.methods
              .balanceOf(wallet_address)
              .call();
            if (+checkTokenGateBalance === 0) {
              setLoading(false);
              setHideCursor(false);
              setBidModal(false);
              window.onbeforeunload = null;
              setBuynowModel(false);
              addToast('Only LazyLeo NFT holders can buy/bid on this item', {
                appearance: 'error',
                autoDismiss: true,
              });
              return;
            }
          }
          const { mpwrContract }: any = await makeMpwrContractforEth(
            itemDetails?.auctionDetails?.erc20Token,
          );
          const approvetakelResult = await mpwrContract.methods
            .approve(contractAddress, price)
            .send({ from: wallet_address });
          if (approvetakelResult.transactionHash) {
            if (isAuction) {
              handleBidMethod();
            } else {
              handleBuy();
            }
          }
        } catch (err: any) {
          setBuynowModel(false);
          setPlaceABidLoading(false);
          setHideCursor(false);
          setBidModal(false);
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } else {
        let price = itemDetails?.auctionDetails?.buyPrice;
        if (isAuction) {
          price = await customToWei(
            bidValue,
            web3,
            itemDetails?.auctionDetails?.erc20Token,
          );
        }
        const { mpwrContract }: any = await makeMpwrContractforEth(
          itemDetails?.auctionDetails?.erc20Token,
        );
        const send_obj = { from: wallet_address };
        await mpwrContract.methods
          .approve(broker_address, price)
          .send(send_obj);
        await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        if (isAuction) {
          handleBidMethod();
        } else {
          handleBuy();
        }
      }
    } catch (err: any) {
      setPlaceABidLoading(false);
      setHideCursor(false);
      setLoading(false);
      setBidModal(false);
      setBuynowModel(false);
      setBidValue('');
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  // Agov Eth Approve function
  const agovEthApprove = async (isAuction: any) => {
    setPlaceABidLoading(true);
    setHideCursor(true);
    setLoading(true);
    const { web3 }: any = await getWeb3();
    const contractAddress = itemDetails?.auctionDetails?.contract_address;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;

    try {
      if (broker_address?.toLowerCase() === contractAddress?.toLowerCase()) {
        let price = itemDetails?.auctionDetails?.buyPrice;
        if (isAuction) {
          price = await customToWei(
            bidValue,
            web3,
            itemDetails?.auctionDetails?.erc20Token,
          );
        }
        try {
          const bal = await getAgovEthBalance();
          const balConvt = await customToWei(bal, web3, '');
          if (Number(price) > +balConvt) {
            addToast("You don't have enough balance to buy this item", {
              appearance: 'error',
              autoDismiss: true,
            });
            setPlaceABidLoading(false);
            setHideCursor(false);
            setLoading(false);
            setBuynowModel(false);
            return;
          }
          // check balance for llc token base sale for admin
          if (isTokenGated) {
            const { CbrforEthContr }: any = await CbrNftforEthContract(
              tokenGateAddress,
            );
            const checkTokenGateBalance = await CbrforEthContr.methods
              .balanceOf(wallet_address)
              .call();
            if (+checkTokenGateBalance === 0) {
              setLoading(false);
              setHideCursor(false);
              setBidModal(false);
              window.onbeforeunload = null;
              setBuynowModel(false);
              addToast('Only LazyLeo NFT holders can buy/bid on this item', {
                appearance: 'error',
                autoDismiss: true,
              });
              return;
            }
          }
          const { agovEthContract }: any = await makeAgovContractforEth(
            itemDetails?.auctionDetails?.erc20Token,
          );
          const approvetakelResult = await agovEthContract.methods
            .approve(contractAddress, price)
            .send({ from: wallet_address });
          if (approvetakelResult.transactionHash) {
            if (isAuction) {
              handleBidMethod();
            } else {
              handleBuy();
            }
          }
        } catch (err: any) {
          setBuynowModel(false);
          setPlaceABidLoading(false);
          setHideCursor(false);
          setBidModal(false);
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } else {
        let price = itemDetails?.auctionDetails?.buyPrice;
        if (isAuction) {
          price = await customToWei(
            bidValue,
            web3,
            itemDetails?.auctionDetails?.erc20Token,
          );
        }
        const { agovEthContract }: any = await makeAgovContractforEth(
          itemDetails?.auctionDetails?.erc20Token,
        );
        const send_obj = { from: wallet_address };
        await agovEthContract.methods
          .approve(broker_address, price)
          .send(send_obj);
        await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        if (isAuction) {
          handleBidMethod();
        } else {
          handleBuy();
        }
      }
    } catch (err: any) {
      setPlaceABidLoading(false);
      setHideCursor(false);
      setLoading(false);
      setBidModal(false);
      setBuynowModel(false);
      setBidValue('');
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  // Usdt Eth Approve function
  const usdtEthApprove = async (isAuction: any) => {
    setPlaceABidLoading(true);
    setHideCursor(true);
    setLoading(true);
    const { web3 }: any = await getWeb3();
    const contractAddress = itemDetails?.auctionDetails?.contract_address;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;

    try {
      let price = itemDetails?.auctionDetails?.buyPrice;
      if (isAuction) {
        price = await customToWei(
          bidValue,
          web3,
          itemDetails?.auctionDetails?.erc20Token,
        );
      }
      try {
        const bal = await getUsdtEthBalance();
        const balConvt = await customToWei(
          bal,
          web3,
          itemDetails?.auctionDetails?.erc20Token,
        );
        if (Number(price) > +balConvt) {
          addToast("You don't have enough balance to buy this item", {
            appearance: 'error',
            autoDismiss: true,
          });
          setPlaceABidLoading(false);
          setHideCursor(false);
          setLoading(false);
          setBuynowModel(false);
          return;
        }
        // check balance for llc token base sale for admin
        if (isTokenGated) {
          const { CbrforEthContr }: any = await CbrNftforEthContract(
            tokenGateAddress,
          );
          const checkTokenGateBalance = await CbrforEthContr.methods
            .balanceOf(wallet_address)
            .call();
          if (+checkTokenGateBalance === 0) {
            setLoading(false);
            setHideCursor(false);
            setBidModal(false);
            window.onbeforeunload = null;
            setBuynowModel(false);
            addToast('Only LazyLeo NFT holders can buy/bid on this item', {
              appearance: 'error',
              autoDismiss: true,
            });
            return;
          }
        }
        const { usdtEthContract }: any = await makeUsdtContractforEth(
          itemDetails?.auctionDetails?.erc20Token,
        );

        const isAllowance = await usdtEthContract.methods
          .allowance(wallet_address, contractAddress)
          .call();

        if (Number(price) > Number(isAllowance)) {
          const approvetakelResult = await usdtEthContract.methods
            .approve(contractAddress, allowanceAmount)
            .send({ from: wallet_address });
          if (approvetakelResult.transactionHash) {
            if (isAuction) {
              handleBidMethod();
            } else {
              handleBuy();
            }
          }
        } else {
          if (isAuction) {
            handleBidMethod();
          } else {
            handleBuy();
          }
        }
      } catch (err: any) {
        setBuynowModel(false);
        setLoading(false);
        setPlaceABidLoading(false);
        setHideCursor(false);
        setBidModal(false);
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }

    } catch (err: any) {
      setPlaceABidLoading(false);
      setHideCursor(false);
      setLoading(false);
      setBidModal(false);
      setBuynowModel(false);
      setBidValue('');
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  //  getSignatureForBid function for place a bid
  const getSignatureForBid = async () => {
    const endTime = Math.round(
      new Date(itemDetails?.auctionDetails?.initialClosingTime).getTime() /
      1000,
    );
    const noncedata = Number(itemDetails?.auctionDetails?.nonce);

    const listTime = Math.round(
      new Date(itemDetails?.auctionDetails?.startingTime).getTime() / 1000,
    );
    const contract_address = itemDetails?.auctionDetails?.contract_address;
    const signature = itemDetails?.auctionDetails?.signature;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
    const ordertype = itemDetails?.redeemable ? 1 : 0;
    let pricevalueconvert: string;

    if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
      await klaytnWallConnCheck();
      const { caver }: any = await GetCaver();
      pricevalueconvert = await customToWei(
        bidValue,
        caver,
        itemDetails?.auctionDetails?.erc20Token,
      );

      if (isTokenGated) {
        const { CbrforKlyContr }: any = await CbrNftforKlyContract(
          tokenGateAddress,
          true,
        );
        const checkTokenGateBalance = await CbrforKlyContr.methods
          .balanceOf(wallet_address)
          .call();
        if (+checkTokenGateBalance === 0) {
          setPlaceABidLoading(false);
          setPlaceABidLoading(false);
          handleCloseBidModal();
          setBidModal(false);
          setHideCursor(false);
          addToast('Only LazyLeo NFT holders can buy/bid on this item', {
            appearance: 'error',
            autoDismiss: true,
          });
          return;
        }
      }
    } else {
      const { web3 }: any = await getWeb3();
      pricevalueconvert = await customToWei(
        bidValue,
        web3,
        itemDetails?.auctionDetails?.erc20Token,
      );

      if (isTokenGated) {
        const { CbrforEthContr }: any = await CbrNftforEthContract(
          tokenGateAddress,
        );
        const checkTokenGateBalance = await CbrforEthContr.methods
          .balanceOf(wallet_address)
          .call();
        if (+checkTokenGateBalance === 0) {
          setPlaceABidLoading(false);
          setPlaceABidLoading(false);
          handleCloseBidModal();
          setBidModal(false);
          setHideCursor(false);
          addToast('Only LazyLeo NFT holders can buy/bid on this item', {
            appearance: 'error',
            autoDismiss: true,
          });
          return;
        }
      }
    }
    const bidObj = {
      seller: itemDetails?.collectible_owner,
      contractAddress: itemDetails?.collection_address,
      royaltyFee: itemDetails?.royalties ? itemDetails.royalties * 100 : 0,
      royaltyReceiver: itemDetails?.userObj?.wallet_address.toString(),
      paymentToken: itemDetails?.auctionDetails?.erc20Token,
      startingPrice: itemDetails?.auctionDetails?.startingPrice,
      listingTime: listTime,
      expirationTime: endTime ? endTime : 0,
      nonce: noncedata,
      tokenId: itemDetails?.token_id ? itemDetails?.token_id : 0,
      orderType: ordertype,
      signature: signature,
      uri: itemDetails?.ipfs_hash,
      item_id: itemDetails?._id.toString(),
      isTokenGated: isTokenGated,
      tokenGateAddress: tokenGateAddress,
      // isEscrow: false,
      // isMetamask: false,
    };
    const bidarray = [
      bidObj.seller,
      bidObj.contractAddress,
      bidObj.royaltyFee,
      bidObj.royaltyReceiver,
      bidObj.paymentToken,
      bidObj.startingPrice,
      bidObj.listingTime,
      bidObj.expirationTime,
      bidObj.nonce,
      bidObj.tokenId,
      bidObj.orderType,
      bidObj.signature,
      bidObj.uri,
      bidObj.item_id,
      bidObj.isTokenGated,
      bidObj.tokenGateAddress,
      // bidObj.isEscrow,
      // bidObj.isMetamask,
    ];

    if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
      try {
        await klaytnWallConnCheck();
        const { brokerContract }: any = await makeBrokerContractForKlytn(
          contract_address,
          true,
        );

        let send_obj: string = JSON.stringify({
          from: wallet_address,
          value: pricevalueconvert,
          gas: null,
        });
        if (displayValues.unit === 'AGOV' || displayValues.unit === 'USDT') {
          send_obj = JSON.stringify({ from: wallet_address, gas: null });
        }

        const brokerTransactionHash = await brokerContract.methods
          .bidding(bidarray, pricevalueconvert)
          .send(JSON.parse(send_obj));

        if (brokerTransactionHash.transactionHash) {
          const buyAction = {
            transaction_hash: brokerTransactionHash.transactionHash,
            contract_address: contract_address,
            network_id: '2',
          };
          await dispatch(eventsAction(buyAction));
          await getItemDetails();
          setPlaceABidLoading(false);
          handleCloseBidModal();
          setBidModal(false);
          setHideCursor(false);
          addToast('Your item bid successfully', {
            appearance: 'success',
            autoDismiss: true,
          });
        }
      } catch (err) {
        setPlaceABidLoading(false);

        setPlaceABidLoading(false);
        handleCloseBidModal();
        setBidModal(false);
        setHideCursor(false);
        addToast(`${err}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } else {
      const { brokerContract }: any = await makeBrokerContractForEth(
        contract_address,
        true,
      );

      try {
        let eth_send_obj: string = JSON.stringify({
          from: wallet_address,
          value: pricevalueconvert,
        });
        if (
          displayValues.unit === 'WETH' ||
          displayValues.unit === 'MPWR' ||
          displayValues.unit === 'AGOV' ||
          displayValues.unit === 'USDT'
        ) {
          eth_send_obj = JSON.stringify({ from: wallet_address });
        }
        const brokerTransactionHash = await brokerContract.methods
          .bidding(bidarray, pricevalueconvert)
          .send(JSON.parse(eth_send_obj));
        if (brokerTransactionHash.transactionHash) {
          const bidAction = {
            transaction_hash: brokerTransactionHash.transactionHash,
            contract_address: contract_address,
            network_id: '1',
          };
          await dispatch(eventsAction(bidAction));
          await getItemDetails();
          setPlaceABidLoading(false);
          handleCloseBidModal();
          setBidModal(false);
          setHideCursor(false);
        }
      } catch (err) {
        setPlaceABidLoading(false);
        handleCloseBidModal();
        setBidModal(false);
        setHideCursor(false);
      }
    }
  };

  // this is for nft buy
  const onClickBuy = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (userConnected) {
      const current_item_id =
        itemDetails?.network_id == 1 ? nftNetworkId : klatynNetworkId;
      if (networkId != current_item_id) {
        if (itemDetails?.network_id == 2) {
          addToast(
            'Please connect with Klaytn network in order to buy this item.',
            { appearance: 'error', autoDismiss: true },
          );
        } else if (itemDetails?.network_id == 1) {
          addToast(
            'Please connect with Metamask network in order to buy this item.',
            { appearance: 'error', autoDismiss: true },
          );
        }

        return;
      }      
      const IsValidUser = await checkValidUser(itemDetails?.network_id);
      if (itemDetails?.network_id === '1') {
        if (IsValidUser) {
          setBuynowModel(true);
        }
      } else {
        if (IsValidUser) {
          setBuynowModel(true);
        }
      }
    } else {
      if (itemDetails?.network_id === '1') {
        await metamaskClickHandler();
      } else {
        await kaikasClickHandler();
      }
    }
  };

  const onClickBid = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    let current_item_id =
    itemDetails?.network_id == 1 ? nftNetworkId : klatynNetworkId;
  if (networkId != current_item_id) {
    if (itemDetails?.network_id == 2) {
      addToast('Please connect with Klaytn network for Delist this item.', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else if (itemDetails?.network_id == 1) {
      addToast(
        'Please connect with Metamask network for Delist  this item.',
        { appearance: 'error', autoDismiss: true },
      );
    }
    return;
  }
    if (userConnected) {
      const IsValidUser = await checkValidUser(itemDetails?.network_id);
      if (itemDetails?.network_id === '1') {
        if (IsValidUser) {
          setBidModal(true);
        }
      } else {
        if (IsValidUser) {
          setBidModal(true);
        }
      }
    } else {
      if (itemDetails?.network_id === '1') {
        await metamaskClickHandler();
      } else {
        await kaikasClickHandler();
      }
    }
  };

  const handleApprove = async () => {
    try {
      setBtnApprove(false);
      setApprovedloading(true);
      let nftContract: any = undefined;
      let send_obj: any = { from: wallet_address };
      let broker_add: any = '';
      if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
        broker_add = process.env.REACT_APP_KLYTN_BROKER_ACCOUNT;
        await klaytnWallConnCheck();
        const { caver }: any = await GetCaver();
        send_obj = { from: wallet_address, gas: null };
        nftContract = new caver.klay.Contract(
          transfernft.abi, //ABI
          itemDetails?.collection_address,
        );
      } else {
        broker_add = process.env.REACT_APP_BROKER_ADDRESS;
        const { web3 }: any = await getWeb3();
        nftContract = new web3.eth.Contract(
          transfernft.abi, //ABI
          itemDetails?.collection_address,
        );
      }
      const approveResult = await nftContract.methods
        .approve(broker_add, token_id)
        .send(send_obj);
      setShowRedeemApproveModal(false);
      setShowRedeemNowModal(true);
      setApproveTransactionHash(approveResult.transactionHash);
      setBtnApprove(true);
      setApprovedloading(false);
    } catch (error) {
      setBtnApprove(true);
      setShowRedeemApproveModal(false);
      setApprovedloading(false);
    }
  };

  const goToProfile = () => {
    if (itemDetails?.collectible_owner) {
      history.push(`/${itemDetails?.collectible_owner}`);
    }
  };
  // burnItem used for item burn
  const burnItem = async () => {
    const contractOwner = itemDetails?.collectible_owner;
    let nftContract = undefined;
    const collectionAddress = itemDetails?.collection_address;
    let send_obj: any = { from: wallet_address };
    const network_id = itemDetails?.network_id;
    const current_item_id = network_id == 1 ? nftNetworkId : klatynNetworkId;
    if (networkId != current_item_id) {
      if (network_id == 2) {
        addToast(
          'Please connect with Klaytn network in order to burn this item.',
          { appearance: 'error', autoDismiss: true },
        );
      } else if (network_id == 1) {
        addToast(
          'Please connect with Metamask network in order to burn this item.',
          { appearance: 'error', autoDismiss: true },
        );
      }
      return;
    }
    setHideCursor(true);
    window.onbeforeunload = function () {
      return 'If you reload this page, your previous action will be repeated';
    };
    try {
      if (profileDetails?.role === 'admin' || profileDetails?.isSuperAdmin) {
        if (network_id == 1) {
          const { brokerContract }: any = await makeBrokerContractForEth(
            broker_address,
            true,
          );
          const res: any = await brokerContract.methods
            .burnNFT(collectionAddress, token_id)
            .send(send_obj);
          if (res.blockHash) {
            addToast('Successfully burn', {
              appearance: 'success',
              autoDismiss: true,
            });
            const body = {
              contract_address: collectionAddress,
              network_id:
                networkId === process.env.REACT_APP_KLATYN_NETWORK_ID
                  ? '2'
                  : '1',
              transaction_hash: res.transactionHash,
            };
            setHideCursor(false);
            window.onbeforeunload = null;
            await dispatch(eventsAction(body));
            history.push('/home');
          }
        } else if (network_id == 2) {
          send_obj = { from: wallet_address, gas: null };
          const { brokerContract }: any = await makeBrokerContractForKlytn(
            klaytn_broker_address,
            true,
          );
          const res: any = await brokerContract.methods
            .burnNFT(collectionAddress, token_id)
            .send(send_obj);
          if (res.blockHash) {
            addToast('Successfully burn', {
              appearance: 'success',
              autoDismiss: true,
            });
            const body = {
              contract_address: collectionAddress,
              network_id:
                networkId === process.env.REACT_APP_KLATYN_NETWORK_ID
                  ? '2'
                  : '1',

              transaction_hash: res.transactionHash,
            };

            await dispatch(eventsAction(body));
            setHideCursor(false);
            window.onbeforeunload = null;
            history.push('/home');
          }
        }
      } else {
        if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
          await klaytnWallConnCheck();
          const { caver }: any = await GetCaver();
          send_obj = { from: wallet_address, gas: null };
          nftContract = new caver.klay.Contract(
            transfernft.abi, //ABI
            collectionAddress, //Address
          );
        } else {
          const { web3 }: any = await EnableEthereum(true);
          nftContract = new web3.eth.Contract(
            transfernft.abi, //ABI
            collectionAddress, //Address
          );
        }
        const res: any = await nftContract.methods
          .burn(token_id)
          .send(send_obj);
        if (res.blockHash) {
          addToast('Successfully burn', {
            appearance: 'success',
            autoDismiss: true,
          });
          const body = {
            contract_address: nftContract?._address,
            network_id:
              networkId === process.env.REACT_APP_KLATYN_NETWORK_ID ? '2' : '1',

            transaction_hash: res.transactionHash,
          };
          setHideCursor(false);
          window.onbeforeunload = null;
          await dispatch(eventsAction(body));
          history.push('/home');
        }
      }
    } catch (err) {
      setHideCursor(false);
      setBidModal(false);
      window.onbeforeunload = null;
    }
  };

  function likeFormatter(num: any) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'b';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  }

  const handleHistoryShow = async () => {
    setHistoryLoad(true);
    setHistorySwitch('history');
    Setoffertabstatus(false);
    let query;
    if (wallet_address) {
      query = {
        collectible_id: props?.match?.params?.collectible_id,
        wallet_address: wallet_address,
      };
    } else {
      query = {
        collectible_id: props?.match?.params?.collectible_id,
      };
    }
    const historyResult: any = await dispatch(historyapiAction(query));
    if (
      historyResult?.status &&
      historyResult?.status === false &&
      historyResult.code === 400
    ) {
      addToast('Item Not Found', { appearance: 'error', autoDismiss: true });
      setHistoryLoad(false);
    } else {
      setHistoryData(historyResult);
      setHistoryLoad(false);
    }
  };

  const handlePutOnSaleStatus=()=>{
    const current_item_id =
        itemDetails?.network_id == 1 ? nftNetworkId : klatynNetworkId;
      if (networkId != current_item_id) {
        if (itemDetails?.network_id == 2) {
          addToast(
            'Please connect with Klaytn network in order to buy this item.',
            { appearance: 'error', autoDismiss: true },
          );
        } else if (itemDetails?.network_id == 1) {
          addToast(
            'Please connect with Metamask network in order to buy this item.',
            { appearance: 'error', autoDismiss: true },
          );
        }

        return;
      }
      SetputonsaleModal(true)
  }

  const handleOfferShow = async () => {
    setOfferLoad(true);
    setHistorySwitch('offer');
    Setoffertabstatus(true);
    const query = {
      _id: itemDetails?._id,
    };
    const offerResult: any = await dispatch(offerApiAction(query));

    if (
      offerResult?.status &&
      offerResult?.status === false &&
      offerResult.code === 400
    ) {
      addToast('Item Not Found', { appearance: 'error', autoDismiss: true });
      setOfferLoad(false);
    } else {
      setOfferData(offerResult);

      setOfferLoad(false);
    }
  };

  useEffect(() => {}, [itemDetails]);
  const submitTrakingNumber = async () => {
    if (trackingvalue === '' || trackingvalue == null || !trackingvalue) {
      if (!trackingvalue) {
        setTrackingError({ ...trackingError, trackingVal: 'cannot be empty' });
      }
    } else {
      // setTrackingError({ ...trackingError, trackingVal: "" });
      setLoading(true);
      setHideCursor(true);

      try {
        const query = {
          tracking_number: trackingvalue,
          redeem_id: itemDetails.redeem_id,
          courier_type: trackingdrop,
        };
        const res = await dispatch(submitTrackingAPiAction(query));
        await getItemDetails();
        setLoading(false);
        setHideCursor(false);

        addToast('Tracking number submitted successfully', {
          appearance: 'success',
          autoDismiss: true,
        });

        submittrackingModal();

        // history.push("/home");
      } catch {
        addToast('Something went wrong', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const handleSaveData = async () => {
    if (transferValue === '' || transferValue == null || !transferValue) {
      if (!transferValue) {
        setTransferError({ ...transferError, transferVal: 'cannot be empty' });
      }
    } else {
      setTransferError({ ...transferError, transferVal: '' });
      setLoading(true);
      setHideCursor(true);
      if (wallet_address.toLowerCase() === transferValue.toLowerCase()) {
        setHideCursor(false);
        setLoading(false);
        SetTransfermodel(false);
        setTransferValue('');
        addToast('Please enter Valid token ID', {
          appearance: 'error',
          autoDismiss: true,
        });
      } else {
        if (
          ((profileDetails?.role === 'admin' || profileDetails?.isSuperAdmin) &&
            (itemDetails?.collectible_owner?.toLowerCase() ===
              process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
              itemDetails?.collectible_owner?.toLowerCase() ===
              process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase())) ||
          (profileDetails?.role === 'user' &&
            !profileDetails?.isSuperAdmin &&
            wallet_address?.toLowerCase() ===
            itemDetails?.collectible_owner?.toLowerCase())
        ) {
          let send_obj: any = { from: wallet_address };
          let nftContract = null;
          if (itemDetails?.network_id == '2') {
            await klaytnWallConnCheck();
            const { caver }: any = await GetCaver();
            send_obj = { from: wallet_address, gas: null };
            nftContract = new caver.klay.Contract(
              transfernft.abi,
              itemDetails?.collection_address,
            );
          } else {
            const { web3 }: any = await getWeb3();
            nftContract = new web3.eth.Contract(
              transfernft.abi, //ABI
              itemDetails?.collection_address,
            );
          }
          try {
            setHideCursor(true);
            const transferResult = await nftContract.methods
              .transferFrom(
                itemDetails?.collectible_owner,
                transferValue,
                itemDetails.token_id,
              )
              .send(send_obj);
            sethashkey(transferResult?.transactionHash);
            const transferAction = {
              transaction_hash: transferResult.transactionHash,
              contract_address: itemDetails?.collection_address,
              network_id: itemDetails.network_id,
            };
            await dispatch(eventsAction(transferAction));
            await getItemDetails();
            await dispatch(
              updateTransactionHashAction(transferResult.transactionHash),
            );
            await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
            setHideCursor(false);
            addToast('Your item successfully Transfer', {
              appearance: 'success',
              autoDismiss: true,
            });
            setLoading(false);

            Sethashmodel(true);
            SetTransfermodel(false);
          } catch (err: any) {
            setHideCursor(false);
            setLoading(false);
            Sethashmodel(false);
            SetTransfermodel(false);
            setTransferValue('');
            if (err.message.includes('The requested account and/or')) {
              addToast(err.message, {
                appearance: 'error',
                autoDismiss: true,
              });
            } else if (err.message.includes('invalid address')) {
              addToast('Please enter Valid token ID', {
                appearance: 'error',
                autoDismiss: true,
              });
            }
          }
        }
      }
    }
  };

  const handleCursorShow = (data: boolean) => {
    setHideCursor(data);
  };
  const handleCloseNftMdal = () => {
    SetTransfermodel(false);
    setTransferError({ ...transferError, transferVal: '' });
    setTransferValue('');
  };
  const submittrackingModal = () => {
    SetTrackingsubmitmodel(false);
    setTrackingError({ ...trackingError, trackingVal: '' });
  };
  const closeviewmodel = () => {
    SetTrackingviewmodel(false);
  };

  const handleCloseBidModal = () => {
    setShareModal(false);
    setBidModal(false);
    setBidValue('');
    setError({ ...error, bidValueError: '' });
  };

  function truncateDecimals(num: any, digits: any) {
    const numS = num.toString(),
      decPos = numS.indexOf('.'),
      substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
      trimmedResult = numS.substr(0, substrLength),
      finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;
    return finalResult;
  }

  const checkNetworkforoffer = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (userConnected) {
      const current_item_id =
        itemDetails?.network_id == 1 ? nftNetworkId : klatynNetworkId;
      if (networkId != current_item_id) {
        if (itemDetails?.network_id == 2) {
          addToast(
            'Please connect with Klaytn network for offer place this item.',
            { appearance: 'error', autoDismiss: true },
          );
        } else if (itemDetails?.network_id == 1) {
          addToast(
            'Please connect with Metamask network for offer place this item.',
            { appearance: 'error', autoDismiss: true },
          );
        }
        return;
      } else {
        const IsValidUser = await checkValidUser(itemDetails?.network_id);
        if (itemDetails?.network_id === '1') {
          if (IsValidUser) {
            openSetmakeofferModel(true);
          }
        } else {
          if (IsValidUser) {
            openSetmakeofferModel(true);
          }
        }
      }
    } else {
      if (itemDetails?.network_id === '1') {
        await metamaskClickHandler();
      } else {
        await kaikasClickHandler();
      }
    }
  };

  const updateMakeOfferApi = async (
    signature: string,
    { _id, amount, nonce, erc20_address, time }: any,
    clearCurrentinputdata: (key: any) => void,
  ) => {
    const apiquery = {
      _id: _id,
      amount: amount,
      erc20_address: erc20_address,
      nonce: nonce.toString(),
      signature: signature,
      time: time,
    };

    if (signature) {
      const result: any = await dispatch(
        LazylistingMakeOfferAPiAction(apiquery),
      );
      if (result?.status) {
        addToast(result?.message, {
          appearance: 'success',
          autoDismiss: true,
        });
        handleOfferShow();
      } else {
        addToast(result?.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }

      await getItemDetails();
      openSetmakeofferModel(false);
      setHideCursor(false);
      setLoading(false);
      clearCurrentinputdata('');
    }
  };

  const getSignatureforMakeOfferPrice = async (
    nonce: string,
    price: string,
    clearCurrentinputdata: (key: any) => void,
    selectedCurrency: string,
  ) => {
    const makeofferTime = Math.round(new Date().getTime() / 1000);
    const noncedata = Number(nonce);
    if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
      const paymenttype =
        selectedCurrency === 'AGOV'
          ? agov_contract
          : selectedCurrency === 'USDT'
            ? usdt_klaytn_token_address
            : '0x0000000000000000000000000000000000000000';
      await klaytnWallConnCheck();
      const { caver }: any = await GetCaver();
      const pricevalueconvert = await customToWei(price, caver, paymenttype);

      const sign_signature =
        '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const bidObj = {
        seller: itemDetails?.collectible_owner,
        bidder: wallet_address,
        contractAddress: itemDetails?.collection_address,
        paymentToken: paymenttype,
        bidAmount: pricevalueconvert,
        bidTime: makeofferTime,
        expirationTime: 0,
        nonce: noncedata,
        tokenId: itemDetails?.token_id ? itemDetails?.token_id : 0,
        objId: itemDetails?._id,
        bidId: '',
      };
      const bidArray = [
        bidObj.seller,
        bidObj.bidder,
        bidObj.contractAddress,
        bidObj.paymentToken,
        bidObj.bidAmount,
        bidObj.bidTime,
        bidObj.expirationTime,
        bidObj.nonce,
        bidObj.tokenId,
        sign_signature,
        bidObj.objId,
        bidObj.bidId,
      ];

      const apiKeys = {
        _id: itemDetails?._id,
        amount: pricevalueconvert,
        nonce: noncedata,
        erc20_address: paymenttype,
        time: makeofferTime,
      };
      try {
        const { brokerContract }: any = await makeBrokerContractForKlytn(
          klaytn_broker_address,
          true,
        );
        const brokerTransactionHash = await brokerContract.methods
          .hashBid(bidArray)
          .call();
        const fromAddress = wallet_address;
        const params = [fromAddress, brokerTransactionHash];
        const method = 'klay_sign';
        await caver.klay.currentProvider.sendAsync(
          {
            method,
            params,
            from: fromAddress,
          },
          (err: Error, result: any) => {
            if (err || result.error) {
              openSetmakeofferModel(false);
              setHideCursor(false);
              setLoading(false);
              clearCurrentinputdata('');
              return;
            }
            const signature = result.result;
            updateMakeOfferApi(signature, apiKeys, clearCurrentinputdata);
          },
        );
      } catch (err) {
        openSetmakeofferModel(false);
        setHideCursor(false);
        setLoading(false);
        clearCurrentinputdata('');
      }
    } else {
      const { web3 }: any = await getWeb3();
      const paymenttype =
        selectedCurrency === 'WETH'
          ? weth_contract
          : selectedCurrency === 'MPWR'
            ? mpwr_token_address
            : selectedCurrency === 'AGOV'
              ? agov_eth_token_address
              : selectedCurrency === 'USDT'
                ? usdt_eth_token_address
                : '0x0000000000000000000000000000000000000000';

      const pricevalueconvert: string = await customToWei(
        price,
        web3,
        paymenttype,
      );

      const msgParams = JSON.stringify({
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Bid: [
            { name: 'seller', type: 'address' },
            { name: 'bidder', type: 'address' },
            { name: 'contractAddress', type: 'address' },
            { name: 'paymentToken', type: 'address' },
            { name: 'bidAmount', type: 'uint256' },
            { name: 'bidTime', type: 'uint256' },
            { name: 'expirationTime', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'objId', type: 'string' },
          ],
        },
        primaryType: 'Bid',
        domain: {
          name: 'Clubrare Marketplace',
          version: '1.0.1',
          chainId: process.env.REACT_APP_NFT_NETWORK_ID,
          verifyingContract: process.env.REACT_APP_ETH_BROKER_VALIDATOR,
        },
        message: {
          seller: itemDetails?.collectible_owner,
          bidder: wallet_address,
          contractAddress: itemDetails?.collection_address,
          paymentToken: paymenttype,
          bidAmount: pricevalueconvert,
          bidTime: makeofferTime,
          expirationTime: 0,
          nonce: noncedata,
          tokenId: itemDetails?.token_id ? itemDetails?.token_id : 0,
          objId: itemDetails?._id,
        },
      });
      const apiKeys = {
        _id: itemDetails?._id,
        amount: pricevalueconvert,
        nonce: noncedata,
        erc20_address: paymenttype,
        time: makeofferTime,
      };
      const fromAddress = wallet_address;
      const params = [fromAddress, msgParams];
      const method = 'eth_signTypedData_v4';
      await web3.currentProvider.sendAsync(
        {
          method,
          params,
          fromAddress,
        },
        (err: Error, result: any) => {
          if (err) {
            openSetmakeofferModel(false);
            setHideCursor(false);
            setLoading(false);
            clearCurrentinputdata('');
          }
          const signature = result.result;
          updateMakeOfferApi(signature, apiKeys, clearCurrentinputdata);
        },
      );
    }
  };

  const checkMakeOfferApproval = async (
    price: string,
    clearCurrentinputdata: (key: any) => void,
    selectedCurrency: string,
  ) => {
    setHideCursor(true);
    setLoading(true);
    if (networkId === process.env.REACT_APP_KLATYN_NETWORK_ID) {
      await klaytnWallConnCheck();
      const { caver }: any = await GetCaver();
      try {
        const send_obj = { from: wallet_address, gas: null };
        const { brokerContract }: any = await makeBrokerContractForKlytn(
          klaytn_broker_address,
          true,
        );
        if (selectedCurrency === 'AGOV') {
          const erc20Contract = new caver.klay.Contract(
            erc20Artifacts.abi,
            agov_contract,
          );

          const offerprice: string = await customToWei(
            price,
            caver,
            agov_contract,
          );

          await erc20Contract.methods
            .approve(klaytn_broker_address, offerprice)
            .send(send_obj);
        } else if (selectedCurrency === 'USDT') {
          const erc20Contract = new caver.klay.Contract(
            erc20Artifacts.abi,
            usdt_klaytn_token_address,
          );

          const offerprice: string = await customToWei(
            price,
            caver,
            usdt_klaytn_token_address,
          );

          const isAllowance = await erc20Contract.methods
            .allowance(wallet_address, klaytn_broker_address)
            .call();

          if (Number(offerprice) > Number(isAllowance)) {
            await erc20Contract.methods
              .approve(klaytn_broker_address, allowanceAmount)
              .send(send_obj);
          }
        }
        const nonceRes = await brokerContract.methods
          .getCurrentOrderNonce(wallet_address)
          .call();
        if (nonceRes) {
          getSignatureforMakeOfferPrice(
            nonceRes,
            price,
            clearCurrentinputdata,
            selectedCurrency,
          );
        }
      } catch (err: any) {
        setHideCursor(false);
        openSetmakeofferModel(false);
        setLoading(false);
        clearCurrentinputdata('');
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } else {
      const { web3 }: any = await getWeb3();

      // let contractAddress = itemDetails?.auctionDetails?.contract_address;
      try {
        const { brokerContract }: any = await makeBrokerContractForEth(
          broker_address,
          true,
        );
        if (selectedCurrency === 'WETH') {
          const { wethContract }: any = await makeWethContractforEth(
            weth_contract,
          );
          const offerprice: string = await customToWei(
            price,
            web3,
            weth_contract,
          );

          await wethContract.methods
            .approve(broker_address, offerprice)
            .send({ from: wallet_address });
        } else if (selectedCurrency === 'MPWR') {
          const { mpwrContract }: any = await makeMpwrContractforEth(
            mpwr_token_address,
          );

          const offerprice: string = await customToWei(
            price,
            web3,
            mpwr_token_address,
          );

          await mpwrContract.methods
            .approve(broker_address, offerprice)
            .send({ from: wallet_address });
        } else if (selectedCurrency === 'AGOV') {
          const { agovEthContract }: any = await makeAgovContractforEth(
            agov_eth_token_address,
          );

          const offerprice: string = await customToWei(
            price,
            web3,
            agov_eth_token_address,
          );

          await agovEthContract.methods
            .approve(broker_address, offerprice)
            .send({ from: wallet_address });
        } else if (selectedCurrency === 'USDT') {
          const { usdtEthContract }: any = await makeUsdtContractforEth(
            usdt_eth_token_address,
          );

          const offerprice: string = await customToWei(
            price,
            web3,
            usdt_eth_token_address,
          );
          const isAllowance = await usdtEthContract.methods
            .allowance(wallet_address, broker_address)
            .call();

          if (Number(offerprice) > Number(isAllowance)) {
            await usdtEthContract.methods
              .approve(broker_address, allowanceAmount)
              .send({ from: wallet_address });
          }
        }
        const nonceRes = await brokerContract.methods
          .getCurrentOrderNonce(wallet_address)
          .call();
        if (nonceRes) {
          getSignatureforMakeOfferPrice(
            nonceRes,
            price,
            clearCurrentinputdata,
            selectedCurrency,
          );
        }
      } catch (err: any) {
        setHideCursor(false);
        openSetmakeofferModel(false);
        clearCurrentinputdata('');
        setLoading(false);
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const { metamaskClickHandler, kaikasClickHandler, checkValidUser } =
    useCommonWalletConnection(getItemDetails, getEditProfileAction);
  const { customFromWei, customToWei } = useCustomStableCoin();

  return (
    <>
      {openRedeemRequestModal && (
        <div
          className="redeem-now-modal"
          style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000b0',
            position: 'fixed',
            zIndex: 99999,
          }}
        >
          <div
            className="redeem-modal-inner"
            style={{
              width: '35%',
              backgroundColor: 'white',
              minWidth: '300px',
              position: 'relative',
            }}
          >
            <div className="text-center">
              <h2 className="text-center">Redeem Request</h2>
              <div className="modal-content text-center">
                Your redeem request has been sent successfully.
              </div>
              <button
                className="comm_follow_btn"
                onClick={closeReddemRequestModal}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {showRedeemApproveModal && (
        <div
          className="redeem-now-modal"
          style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000b0',
            position: 'fixed',
            zIndex: 99999,
          }}
        >
          <div
            className="redeem-modal-inner"
            style={{
              width: '25%',
              backgroundColor: 'white',
              minWidth: '300px',
              position: 'relative',
            }}
          >
            <span
              aria-hidden="true"
              onClick={() => setShowRedeemApproveModal(false)}
              className="close_btn"
            >
              X
            </span>
            <div className="text-center">
              <h2 className="text-center">Approve</h2>
              <div className="modal-content text-center">
                Approve admin to redeem and burn your token
              </div>
              <button
                onClick={handleApprove}
                disabled={!btnApprove}
                className="comm_follow_btn"
              >
                {approveloading ? 'Loading...' : 'Approved'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isWarningModalVisible && (
        <div
          className="redeem-now-modal redeem-warning-popup"
          style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000b0',
            position: 'fixed',
            zIndex: 99999,
          }}
        >
          <div
            className="redeem-modal-inner"
            style={{
              width: '35%',
              backgroundColor: 'white',
              minWidth: '300px',
              position: 'relative',
            }}
          >
            <div className="text-right redeemclosewrp">
              <span
                aria-hidden="true"
                className="close_btn"
                onClick={() => {
                  setIsWarningModalVisible(false);
                }}
              >
                X
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-center">Warning</h2>
              <div className="modal-content text-center">
                This product is not verified. Do you still want to
                <br /> buy this?
              </div>
              <button
                className="comm_follow_btn"
                onClick={() => {
                  setIsWarningModalVisible(false);
                  handleBuy();
                }}
              >
                Yes, I want
              </button>
            </div>
          </div>
        </div>
      )}
      {showRedeemNowModal && (
        <RedeemNowModal
          itemDetails={itemDetails}
          openRedeemRequestModal={showRedeemRequestModal}
          closeModal={() => setShowRedeemNowModal(false)}
        />
      )}

      {buynowModel && (
        <BuyNow
          show={buynowModel}
          onHide={() => setBuynowModel(false)}
          displayValues={displayValues}
          itemDetails={itemDetails}
          usdAmount={usdAmount}
          loading={loading}
          handleBuy={handleBuy}
          hideCursor={hideCursor}
          approve={() => approve(false)}
          wethApprove={() => wethApprove(false)}
          agovEthApproveFun={() => agovEthApprove(false)}
          usdtEthApproveFun={() => usdtEthApprove(false)}
          usdtKlaytnApproveFun={() => usdtKlaytnApprove(false)}
          mpwrApproveFun={() => mpwrApprove(false)}
          royaltiesusd={royaltiesusd}
          platformusd={platformusd}
        />
      )}

      <Layout
        mainClassName="live-auction-lg"
        displayStickySidebar
        // loading={loading}
        hideCursor={hideCursor||allLoadingState?.hideCursor}
      >
        {allLoadingState.detailsLoading && <Spinner />}
        {!allLoadingState.detailsLoading && (
          <div
            className="container-fluid"
            style={{ pointerEvents: hideCursor||allLoadingState?.hideCursor ? 'none' : 'auto' }}
          >
            <React.Suspense fallback={'Laoding'}>
              <BidModal open={bidOpen} onCloseModal={() => setBidOpen(false)} />
            </React.Suspense>
            <React.Suspense fallback={'Laoding'}>
              <Poster
                itemDetails={itemDetails}
                img={itemDetails?.s3_url}
                wrapperClass="block md:hidden"
              />
            </React.Suspense>
            <div className="row">
              <div className=" col-6 live_auction_left">
                <Poster
                  itemDetails={itemDetails}
                  img={itemDetails?.s3_url}
                  wrapperClass="hidden md:block"
                />
                <CreatedBy />
              </div>
              <div className="col-6 live_auction_right">
                <div className="row d-flex justify-content-between">
                  <div className="col-6">
                    {itemDetails?.auctionDetails?.auctionType == 2 && (
                      <div className=" auction_right_col text_wrp ">
                        <BiTime className="auction_right_timeICon" />

                        {itemDetails?.auctionDetails?.auctionType == 2 &&
                          new Date(
                            itemDetails?.auctionDetails?.startingTime,
                          ).getTime() > new Date().getTime() ? (
                          <p>
                            <span>
                              {' '}
                              Starts :{' '}
                              {+bidTimeCloseObj.daysLeft1 < 10
                                ? '0' + bidTimeCloseObj.daysLeft1
                                : bidTimeCloseObj.daysLeft1}
                              d&nbsp;:&nbsp;
                              {+bidTimeCloseObj.hoursLeft1 < 10
                                ? '0' + bidTimeCloseObj.hoursLeft1
                                : bidTimeCloseObj.hoursLeft1}
                              h&nbsp;:&nbsp;
                              {+bidTimeCloseObj.minutesLeft1 < 10
                                ? '0' + bidTimeCloseObj.minutesLeft1
                                : bidTimeCloseObj.minutesLeft1}
                              m&nbsp;:&nbsp;
                              {+bidTimeCloseObj.secondsLeft1 < 10
                                ? '0' + bidTimeCloseObj.secondsLeft1
                                : bidTimeCloseObj.secondsLeft1}
                            </span>
                          </p>
                        ) : itemDetails?.auctionDetails?.auctionType == 2 &&
                          (bidTimeObj.minutesLeft !== 0 ||
                            bidTimeObj.secondsLeft !== 0) &&
                          new Date(
                            itemDetails?.auctionDetails?.closingTime,
                          ).getTime() > new Date().getTime() ? (
                          <p>
                            <span>
                              {' '}
                              Ends : {''}
                              {+bidTimeObj.daysLeft < 10
                                ? '0' + bidTimeObj.daysLeft
                                : bidTimeObj.daysLeft}
                              d&nbsp;:&nbsp;
                              {+bidTimeObj.hoursLeft < 10
                                ? '0' + bidTimeObj.hoursLeft
                                : bidTimeObj.hoursLeft}
                              h&nbsp;:&nbsp;
                              {+bidTimeObj.minutesLeft < 10
                                ? '0' + bidTimeObj.minutesLeft
                                : bidTimeObj.minutesLeft}
                              m&nbsp;:&nbsp;
                              {+bidTimeObj.secondsLeft < 10
                                ? '0' + bidTimeObj.secondsLeft
                                : bidTimeObj.secondsLeft}
                              s
                            </span>
                          </p>
                        ) : (
                          <p>Auction Ended</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-6 text-end">
                    <div className="auction_like_share_wrap d-flex">
                      <div className="d-flex flex-row auction_like_share">
                        <span className="auction_like_text">
                          {likeFormatter(itemDetails?.total_like)}{' '}
                        </span>

                        <div
                          className="auction_like_wrp"
                          style={{ width: '20px', margin: '5px' }}
                        >
                          {isLike ? (
                            <img
                              className="likedIcon"
                              onClick={getReaction}
                              src={imgConstants.fillHeartIcon}
                              alt="fillHeartIcon"
                            />
                          ) : (
                            <div className="likeIconWrp">
                              <img
                                onClick={getReaction}
                                src={imgConstants.heartIcon}
                                alt="heartIcon"
                                className="likeIcon"
                              />
                              <img
                                onClick={getReaction}
                                src={imgConstants.hoverHeartIcon}
                                className="hoverIcon"
                                alt="hoverHeartIcon"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        onClick={() => setShareModal(true)}
                        className="auction_share"
                      >
                        <p>Share</p>
                      </div>
                      {burnBtnCheck &&
                        itemDetails?.token_id &&
                        (!itemDetails?.on_sale ||
                          (itemDetails?.on_sale &&
                            itemDetails?.auctionDetails?.auctionType === '2' &&
                            new Date(
                              itemDetails?.auctionDetails?.closingTime,
                            ).getTime() < new Date().getTime() &&
                            itemDetails?.history?.bid?.length === 0)) && (
                          <div className="mx-right">
                            <div className=" text-danger aaa ">
                              <button
                                className="button-connect redeemable-btn burn-btn "
                                style={{
                                  boxShadow:
                                    '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                                }}
                                type="button"
                                onClick={burnItem}
                              >
                                Burn
                              </button>
                            </div>
                          </div>
                        )}

                      <DropdownButton
                        className="action_option_drop"
                        id="explore-detail-dropdown"
                        align="end"
                        title={<BsThreeDotsVertical />}
                      >
                        {/* <Dropdown.Item href="#/action-1" onClick={goToOpenSea}>
                          View on Opensea
                        </Dropdown.Item> */}

                        <Dropdown.Item onClick={openReportModal}>
                          Report
                        </Dropdown.Item>

                        {(((profileDetails?.role === 'admin' ||
                          profileDetails?.isSuperAdmin) &&
                          ((profileDetails?.network_id === '1' &&
                            itemDetails?.collectible_owner?.toLowerCase() ===
                            process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase()) ||
                            (profileDetails?.network_id === '2' &&
                              itemDetails?.collectible_owner?.toLowerCase() ===
                              process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()))) ||
                          (profileDetails?.role === 'user' &&
                            !profileDetails?.isSuperAdmin &&
                            wallet_address?.toUpperCase() ===
                            itemDetails?.collectible_owner?.toUpperCase())) && (
                            <Dropdown.Item onClick={openEditItemModal}>
                              Edit
                            </Dropdown.Item>
                          )}

                        {(((profileDetails?.role === 'admin' ||
                          profileDetails?.isSuperAdmin) &&
                          ((profileDetails?.network_id === '1' &&
                            itemDetails?.collectible_owner?.toLowerCase() ===
                            process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase()) ||
                            (profileDetails?.network_id === '2' &&
                              itemDetails?.collectible_owner?.toLowerCase() ===
                              process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()))) ||
                          (profileDetails?.role === 'user' &&
                            !profileDetails?.isSuperAdmin &&
                            wallet_address?.toUpperCase() ===
                            itemDetails?.collectible_owner?.toUpperCase())) &&
                          (!itemDetails?.on_sale ||
                            (itemDetails?.on_sale &&
                              itemDetails?.auctionDetails?.auctionType === '2' &&
                              new Date(
                                itemDetails?.auctionDetails?.closingTime,
                              ).getTime() < new Date().getTime() &&
                              itemDetails?.history?.bid?.length === 0)) &&
                          (!itemDetails?.redeem_status ||
                            itemDetails?.redeem_status == 'delivered') &&
                          itemDetails?.token_id &&
                          itemDetails?.is_hide === false ? (
                          <Dropdown.Item onClick={() => SetTransfermodel(true)}>
                            Transfer Item
                          </Dropdown.Item>
                        ) : (
                          ''
                        )}

                        {itemDetails?.redeemable &&
                          itemDetails?.history?.buy &&
                          itemDetails?.history?.buy.length > 0 &&
                          (((profileDetails?.role === 'admin' ||
                            profileDetails?.isSuperAdmin) &&
                            ((profileDetails?.network_id === '1' &&
                              itemDetails?.history?.buy[
                                itemDetails.history.buy.length - 1
                              ].seller?.toLowerCase() ===
                              process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase()) ||
                              (profileDetails?.network_id === '2' &&
                                itemDetails?.history?.buy[
                                  itemDetails.history.buy.length - 1
                                ].seller?.toLowerCase() ===
                                process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()))) ||
                            (profileDetails?.role === 'user' &&
                              !profileDetails?.isSuperAdmin &&
                              wallet_address?.toLowerCase() ===
                              itemDetails?.history?.buy[
                                itemDetails.history.buy.length - 1
                              ].seller?.toLowerCase())) &&
                          (!itemDetails?.on_sale ||
                            (itemDetails?.on_sale &&
                              itemDetails?.auctionDetails?.auctionType === '2' &&
                              new Date(
                                itemDetails?.auctionDetails?.closingTime,
                              ).getTime() < new Date().getTime() &&
                              itemDetails?.history?.bid?.length === 0)) &&
                          itemDetails?.redeem_id &&
                          itemDetails?.token_id &&
                          itemDetails?.redeem_status != 'delivered' &&
                          !itemDetails?.is_hide ? (
                          <Dropdown.Item
                            onClick={() => SetTrackingsubmitmodel(true)}
                          >
                            Submit Tracking Number
                          </Dropdown.Item>
                        ) : (
                          ''
                        )}
                        {itemDetails?.redeemable &&
                          itemDetails?.history?.buy &&
                          itemDetails?.history?.buy.length > 0 &&
                          (((profileDetails?.role === 'admin' ||
                            profileDetails?.isSuperAdmin) &&
                            ((profileDetails?.network_id === '1' &&
                              itemDetails?.history?.buy[
                                itemDetails.history.buy.length - 1
                              ].seller?.toLowerCase() ===
                              process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase()) ||
                              (profileDetails?.network_id === '2' &&
                                itemDetails?.history?.buy[
                                  itemDetails.history.buy.length - 1
                                ].seller?.toLowerCase() ===
                                process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()))) ||
                            (profileDetails?.role === 'user' &&
                              !profileDetails?.isSuperAdmin &&
                              wallet_address?.toLowerCase() ===
                              itemDetails?.history?.buy[
                                itemDetails.history.buy.length - 1
                              ].seller?.toLowerCase())) &&
                          (!itemDetails?.on_sale ||
                            (itemDetails?.on_sale &&
                              itemDetails?.auctionDetails?.auctionType === '2' &&
                              new Date(
                                itemDetails?.auctionDetails?.closingTime,
                              ).getTime() < new Date().getTime() &&
                              itemDetails?.history?.bid?.length === 0)) &&
                          itemDetails?.redeem_id &&
                          itemDetails?.token_id &&
                          itemDetails?.tracking_number &&
                          !itemDetails?.is_hide ? (
                          <Dropdown.Item
                            onClick={() => SetTrackingviewmodel(true)}
                          >
                            View Tracking Number
                          </Dropdown.Item>
                        ) : (
                          ''
                        )}
                        {itemDetails?.redeemable &&
                          profileDetails?.role === 'user' &&
                          !profileDetails?.isSuperAdmin &&
                          wallet_address?.toLowerCase() ===
                          itemDetails?.collectible_owner?.toLowerCase() &&
                          (!itemDetails?.on_sale ||
                            (itemDetails?.on_sale &&
                              itemDetails?.auctionDetails?.auctionType === '2' &&
                              new Date(
                                itemDetails?.auctionDetails?.closingTime,
                              ).getTime() < new Date().getTime() &&
                              itemDetails?.history?.bid?.length === 0)) &&
                          itemDetails?.redeem_id &&
                          itemDetails?.token_id &&
                          itemDetails?.tracking_number &&
                          !itemDetails?.is_hide ? (
                          <Dropdown.Item
                            onClick={() => SetTrackingviewmodel(true)}
                          >
                            View Tracking Number
                          </Dropdown.Item>
                        ) : (
                          ''
                        )}
                        {wallet_address &&
                          ((profileDetails?.role === 'user' &&
                            !profileDetails?.isSuperAdmin &&
                            wallet_address?.toUpperCase() ===
                            itemDetails?.collectible_owner?.toUpperCase()) ||
                            profileDetails?.role === 'admin' ||
                            profileDetails?.isSuperAdmin) &&
                          (!itemDetails?.on_sale ||
                            (itemDetails?.on_sale &&
                              itemDetails?.auctionDetails?.auctionType ===
                              '1') ||
                            (itemDetails?.on_sale &&
                              itemDetails?.auctionDetails?.auctionType ===
                              '2' &&
                              new Date(
                                itemDetails?.auctionDetails?.closingTime,
                              ).getTime() < new Date().getTime() &&
                              itemDetails?.history?.bid?.length === 0)) &&
                          (!itemDetails?.redeem_status ||
                            itemDetails?.redeem_status == 'delivered') && (
                            <Dropdown.Item
                              onClick={() => callChangeHideStatus()}
                            >
                              {itemDetails?.is_hide ? 'Unhide NFT' : 'Hide NFT'}
                            </Dropdown.Item>
                          )}
                        {
                          <React.Suspense fallback="Loading">
                            <NftTransferModel
                              transferValue={transferValue}
                              setValue={setTransferValue}
                              show={transfermodel}
                              transferValErr={transferError.transferVal}
                              // onCloseModal={() => SetTransfermodel(false)}
                              onCloseModal={handleCloseNftMdal}
                              handleSaveData={handleSaveData}
                              cursor={hideCursor}
                              loading={loading}
                              removeError={() =>
                                setTransferError({
                                  ...transferError,
                                  transferVal: '',
                                })
                              }
                            />
                          </React.Suspense>
                        }
                      </DropdownButton>
                    </div>
                  </div>
                </div>

                {
                  <React.Suspense fallback="Loading">
                    <TransitionHashModel
                      hashkey={hashkey}
                      show={hashmodel}
                      onCloseModal={() => Sethashmodel(false)}
                    />
                  </React.Suspense>
                }

                {
                  <React.Suspense fallback="Loading">
                    <SubmitTrackingModel
                      trackingdrop={trackingdrop}
                      changecategory={changecategory}
                      trackingValue={trackingvalue}
                      setValue={setTrackingvalue}
                      show={trackingsubmitmodel}
                      trackingValErr={trackingError.trackingVal}
                      onCloseModal={submittrackingModal}
                      trackingid={itemDetails?.tracking_number}
                      handleSaveData={submitTrakingNumber}
                      cursor={hideCursor}
                      loading={loading}
                      removeError={() =>
                        setTrackingError({
                          ...trackingError,
                          trackingVal: '',
                        })
                      }
                    />
                  </React.Suspense>
                }

                {
                  <React.Suspense fallback="Loading">
                    <ViewTracking
                      trackingid={itemDetails?.tracking_number}
                      viewtype={itemDetails?.courier_type}
                      show={trackingviewmodel}
                      onCloseModal={closeviewmodel}
                    />
                  </React.Suspense>
                }

                <div className="row live_inner mt-3">
                  <div className="col-12">
                    <div className="d-flex text justify-content-start">
                      <Tooltip
                        className="cardtooltip_wrp"
                        content={itemDetails?.title}
                      >
                        <h6 className="live_inner_details_heading card-det-truncate-line-clamp">
                          {itemDetails?.title}
                        </h6>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="row live_inner auction_createdby_wrp d-flex justify-content-between flex-row mt-3">
                  <div className="col-5 d-flex ownedby_tit_left flex-row justify-content-start pl-0">
                    <div className="auction_createdby_inner">
                      <figure>
                        <img
                          width="48px"
                          height="48px"
                          src={
                            itemDetails?.ownerObj?.image || imgConstants.avatar
                          }
                          alt="img"
                        />
                      </figure>
                      {itemDetails?.owner_verified && (
                        <img
                          className="varified_user_img"
                          src={varified_seller}
                          alt="varified-Seller"
                        />
                      )}
                    </div>
                    <p className="ml-2 owner_dtl_wrp">
                      Owned by <br />
                      <span onClick={goToProfile}>
                        {itemDetails && itemDetails?.ownerObj?.name
                          ? itemDetails?.ownerObj?.name
                          : itemDetails?.ownerObj?.wallet_address
                            ? itemDetails?.ownerObj?.wallet_address
                              .toString()
                              .substring(0, 10) +
                            '.....' +
                            itemDetails?.ownerObj?.wallet_address
                              .toString()
                              .substring(
                                itemDetails?.ownerObj?.wallet_address.length -
                                8,
                              )
                            : itemDetails?.collectible_owner
                              ? itemDetails?.collectible_owner
                                .toString()
                                .substring(0, 10) +
                              '.....' +
                              itemDetails?.collectible_owner
                                .toString()
                                .substring(
                                  itemDetails?.collectible_owner.length - 8,
                                )
                              : ''}
                      </span>
                      {itemDetails?.owner_verified && (
                        <div className="varified_seller_btn_wrp">
                          <button className="varified_seller_btn" type="button">
                            <img src={seller_varified} alt="seller-varified" />
                            Verified seller
                          </button>
                        </div>
                      )}
                    </p>
                  </div>
                  <div className="col-7 d-flex justify-content-end pr-0 pl-0">
                    <div className="product_network_show">
                      {itemDetails?.network_id == '2' ? (
                        <>
                          <figure className="network_img_show">
                            <img src={imgConstants.klaytn} alt="" />
                          </figure>
                          <span>Klaytn</span>
                        </>
                      ) : (
                        <>
                          <CryptoIcon size="20" />
                          <span>Ethereum</span>
                        </>
                      )}
                    </div>
                    <div className="auction_history_switch_wrap">
                      <button
                        onClick={() => {
                          Setoffertabstatus(false);
                          setHistorySwitch('description');
                        }}
                        className={`  ${historySwitch == 'description'
                            ? 'switch_round'
                            : 'auction_description_switch'
                          }`}
                      >
                        Description
                      </button>
                      <button
                        onClick={handleHistoryShow}
                        className={`ml-3 ${historySwitch == 'history'
                            ? 'switch_round'
                            : 'auction_history_switch'
                          }`}
                      >
                        History
                      </button>

                      {/* {
                      (!itemDetails?.on_sale ||
                        (itemDetails?.on_sale &&
                          itemDetails?.auctionDetails?.auctionType === "2"
                         
                          ))? */}
                      <button
                        onClick={handleOfferShow}
                        className={`ml-3 ${historySwitch == 'offer'
                            ? 'switch_round'
                            : 'auction_history_switch'
                          }`}
                      >
                        Offers
                      </button>

                      {/* :""
                          
                          } */}
                    </div>
                  </div>
                </div>
                {historySwitch == 'description' ? (
                  <div className="details_description mt-2">
                    <p className="light_text description_pre text_break_item">
                      {parse(urlify(itemDetails?.description))}
                      {/* {itemDetails?.description} */}
                    </p>
                  </div>
                ) : historySwitch == 'history' ? (
                  <div className="details_history">
                    {historyLoad ? (
                      <Spinner />
                    ) : historyData?.length > 0 && !historyLoad ? (
                      <History
                        bids={historyData}
                        network_id={networkIdInUrl}
                        wrapperClass="mt-2 detail_hist_inn"
                      />
                    ) : (
                      <span className="text-24 text-blue font-bold mb-1 text-center block noofferitem">
                        No Items Available
                      </span>
                    )}
                  </div>
                ) : historySwitch == 'offer' ? (
                  <div className="details_offer details_history detail_offer_tab">
                    <div className="d-flex justify-content-end"></div>
                    {offerLoad ? (
                      <Spinner />
                    ) : offerData?.length > 0 && !offerLoad ? (
                      <OfferDetail
                        data={offerData}
                        itemDetails={itemDetails}
                        network_id={networkIdInUrl}
                        setHideCursorReset={handleCursorShow}
                        offerItemChanges={() => handleOfferShow()}
                        itemDetailChanges={() => getItemDetails()}
                        descriptionSwitch={() =>
                          setHistorySwitch('description')
                        }
                        profileDetailsCheck={profileDetails}
                      />
                    ) : (
                      <span className="text-24 text-blue font-bold mb-1 text-center noofferitem">
                        No Items Available
                      </span>
                    )}
                  </div>
                ) : (
                  ''
                )}

                <div className="row curr_bid_wrp">
                  <div className="col-8 curr_bid_lft">
                    {allLoadingState.approved && (
                      <div className="col-12 curr_bid_col d-flex justify-content-start ">
                        <h6 className=" details_bid_price">
                          <figure>
                            {networkId == klatynNetworkId ? (
                              displayValues.unit === 'KLAY' ? (
                                <CryptoIcon3 size="29" />
                              ) : displayValues.unit === 'AGOV' ? (
                                <AGOVICON size="29" />
                              ) : displayValues.unit === 'USDT' ? (
                                <UsdtIcon />
                              ) : (
                                ''
                              )
                            ) : displayValues.unit === 'ETH' ? (
                              <CryptoIcon size="27" />
                            ) : displayValues.unit === 'WETH' ? (
                              <WethIcon size="27" />
                            ) : displayValues.unit === 'MPWR' ? (
                              <img
                                src={imgConstants.mpwr_icon}
                                alt="Mpwr Icon"
                                className="mpwr-detail-icon"
                              />
                            ) : displayValues.unit === 'USDT' ? (
                              <UsdtIcon />
                            ) : displayValues.unit === 'AGOV' ? (
                              <AGOVICON size="29" />
                            ) : (
                              ''
                            )}
                          </figure>

                          <span>
                            {Number(displayValues.value) ? (
                              <span
                                style={{
                                  cursor: 'pointer',
                                }}
                                data-toggle="tooltip"
                                data-placement="top"
                                title={displayValues.value}
                              >
                                {truncateDecimals(displayValues.value, 2)}
                              </span>
                            ) : (
                              ''
                            )}
                            &nbsp;
                            {displayValues.unit ? displayValues.unit : ''}
                          </span>
                          <p className=" details_bid_usd ml-1 ">
                            {usdAmount ? (
                              <span
                                style={{
                                  cursor: 'pointer',
                                }}
                                data-toggle="tooltip"
                                data-placement="top"
                                title={`($ ${usdAmount} USD)`}
                              >
                                {`($ ${truncateDecimals(usdAmount, 2)} USD)`}
                              </span>
                            ) : (
                              ''
                            )}
                          </p>
                        </h6>

                        {Number(displayValues.value) ? (
                          <h6 className="details_bid_name d-flex">
                            <span>
                              <FiTrendingUp />
                            </span>
                            {itemDetails?.auctionDetails?.auctionType === '1'
                              ? 'Price'
                              : itemDetails?.auctionDetails?.auctionType ==
                                '2' && itemDetails?.history?.bid?.length === 0
                                ? 'Minimum Bid'
                                : itemDetails?.auctionDetails?.auctionType ===
                                  '2' && itemDetails?.history?.bid?.length > 0
                                  ? 'Current Bid'
                                  : itemDetails?.auctionDetails?.auctionType ===
                                    null && itemDetails?.last_price !== 0
                                    ? 'Final Price'
                                    : ''}
                          </h6>
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                    {Number(displayValues.value) > 0 ? (
                      <div className="fee_dtl_wrp">
                        {itemDetails?.royalties > 0 ? (
                          <div className="fee_dtl_inner">
                            <div className="fee_dtl_inner_lft_wrp">
                              <p>Royalty fee</p>
                            </div>
                            <div className="fee_dtl_inner_right_wrp">
                              <h6 className=" details_bid_price">
                                <span>
                                  {' '}
                                  {(
                                    (Number(displayValues.value) *
                                      itemDetails?.royalties) /
                                    100
                                  ).toFixed(6)}{' '}
                                  {displayValues.unit ? displayValues.unit : ''}
                                </span>
                                <p className=" details_bid_usd ml-1 ">
                                  {royaltiesusd
                                    ? `{
                                   $ ${royaltiesusd} USD
                                  }`
                                    : ''}
                                </p>
                              </h6>
                            </div>
                          </div>
                        ) : (
                          ''
                        )}

                        <div className="fee_dtl_inner">
                          <div className="fee_dtl_inner_lft_wrp">
                            <p>Platform fee</p>
                          </div>
                          <div className="fee_dtl_inner_right_wrp">
                            <h6 className=" details_bid_price">
                              <span>
                                {(
                                  (Number(displayValues.value) * 2.5) /
                                  100
                                ).toFixed(6)}{' '}
                                {''}
                                {displayValues.unit ? displayValues.unit : ''}
                              </span>
                              <p className=" ml-1 ">
                                {' '}
                                {platformusd ? `{ $ ${platformusd} USD}` : ''}
                              </p>
                            </h6>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="col-4 popup_button_wrp">
                    <div>
                      {offertabstatus &&
                        (!itemDetails?.on_sale ||
                          (itemDetails?.on_sale &&
                            itemDetails?.auctionDetails?.auctionType === '2' &&
                            new Date(
                              itemDetails?.auctionDetails?.closingTime,
                            ).getTime() < new Date().getTime() &&
                            itemDetails?.history?.bid?.length === 0) ||
                          (itemDetails.on_sale &&
                            itemDetails.auctionDetails &&
                            itemDetails.auctionDetails.auctionType === '1')) &&
                        profileDetails?.role !== 'admin' &&
                        !profileDetails?.isSuperAdmin &&
                        itemDetails?.collectible_owner?.toLowerCase() !==
                        wallet_address?.toLowerCase() ? (
                        <button
                          className="place_bid_btn"
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                          ) => checkNetworkforoffer(e)}
                        >
                          {' '}
                          Place Offer
                        </button>
                      ) : (
                        ''
                      )}

                      {
                        <React.Suspense fallback="Loading">
                          <MakeofferModel
                            openModel={openmakeofferModel}
                            onHide={(): void => openSetmakeofferModel(false)}
                            loading={loading}
                            network_id={itemDetails?.network_id}
                            checkMakeOfferApproval={checkMakeOfferApproval}
                            hideCursor={hideCursor}
                            geterc20Bal={getBalanceOfErc20}
                            getagovBal={getAGOVBalance}
                            getAgovEthBal={getAgovEthBalance}
                            getMpwrBal={getMpwrBalance}
                            getUsdtEthBal={getUsdtEthBalance}
                            getUsdtKlaytnBal={getUsdtKlaytnBalance}
                          />
                        </React.Suspense>
                      }

                      {itemDetails?.redeemable &&
                        itemDetails?.redeem_type == '1' &&
                        itemDetails?.collectible_owner?.toLowerCase() ===
                        wallet_address?.toLowerCase() &&
                        (itemDetails?.collectible_owner?.toLowerCase() !=
                          itemDetails?.userObj?.wallet_address?.toLowerCase() ||
                          (itemDetails?.history?.buy &&
                            itemDetails?.history?.buy.length > 0 &&
                            itemDetails?.history?.buy[
                              itemDetails?.history?.buy.length - 1
                            ].buyer &&
                            itemDetails?.history?.buy[
                              itemDetails?.history?.buy.length - 1
                            ].buyer.toLowerCase() ==
                            itemDetails?.userObj?.wallet_address?.toLowerCase())) &&
                        (!itemDetails?.on_sale ||
                          (itemDetails?.on_sale &&
                            itemDetails?.auctionDetails?.auctionType === '2' &&
                            new Date(
                              itemDetails?.auctionDetails?.closingTime,
                            ).getTime() < new Date().getTime() &&
                            itemDetails?.history?.bid?.length === 0)) &&
                        itemDetails?.is_approve &&
                        itemDetails?.redeem_status !== 'dispatched' &&
                        itemDetails?.redeem_status !== 'pending' &&
                        itemDetails?.redeem_status !== 'delivered' && (
                          <button
                            className="button-connect redeemable-btn placea_beat button-create"
                            style={{
                              boxShadow:
                                '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                            }}
                            type="button"
                            onClick={openRedeemNowModal}
                          >
                            {' '}
                            Redeem
                          </button>
                        )}
                      {itemDetails?.redeemable &&
                        itemDetails?.redeem_type == '2' &&
                        itemDetails?.collectible_owner?.toLowerCase() ===
                        wallet_address?.toLowerCase() &&
                        (itemDetails?.collectible_owner?.toLowerCase() !=
                          itemDetails?.userObj?.wallet_address?.toLowerCase() ||
                          (itemDetails?.history?.buy &&
                            itemDetails?.history?.buy.length > 0 &&
                            itemDetails?.history?.buy[
                              itemDetails?.history?.buy.length - 1
                            ].buyer &&
                            itemDetails?.history?.buy[
                              itemDetails?.history?.buy.length - 1
                            ].buyer.toLowerCase() ==
                            itemDetails?.userObj?.wallet_address?.toLowerCase())) &&
                        (!itemDetails?.on_sale ||
                          (itemDetails?.on_sale &&
                            itemDetails?.auctionDetails?.auctionType === '2' &&
                            new Date(
                              itemDetails?.auctionDetails?.closingTime,
                            ).getTime() < new Date().getTime() &&
                            itemDetails?.history?.bid?.length === 0)) &&
                        itemDetails?.is_approve &&
                        itemDetails?.redeem_status !== 'dispatched' &&
                        itemDetails?.redeem_status !== 'pending' &&
                        itemDetails?.redeem_status !== 'delivered' && (
                          <button
                            className="button-connect redeemable-btn placea_beat"
                            style={{
                              boxShadow:
                                '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                            }}
                            type="button"
                            onClick={openRedeemApproveModal}
                          >
                            Redeem And Burn
                          </button>
                        )}
                    </div>

                    {placeForBidCheck && (
                      <button
                        onClick={(
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                        ) => onClickBid(e)}
                        className="place_bid_btn"
                      >
                        Place Bid
                      </button>
                    )}
                    {buyBtnCheck && (
                      <button
                        // disabled={loading}
                        onClick={(
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                        ) => onClickBuy(e)}
                        className="place_bid_btn"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Buy Now"
                      >
                        Buy Now
                      </button>
                    )}
                    
                    {/* admin */}
                    {putOnSaleCheck &&
                      // !puonsaleModal &&
                      (!itemDetails?.on_sale ||
                        (itemDetails?.on_sale &&
                          itemDetails?.auctionDetails?.auctionType === '2' &&
                          new Date(
                            itemDetails?.auctionDetails?.closingTime,
                          ).getTime() < new Date().getTime() &&
                          itemDetails?.history?.bid?.length === 0)) &&
                      itemDetails?.is_approve &&
                      !itemDetails?.is_hide &&
                      !itemDetails?.redeem_status &&
                      (profileDetails?.role === 'admin' ||
                        profileDetails?.isSuperAdmin) && (
                        <button
                          className="place_bid_btn"
                          onClick={() => SetputonsaleModal(true)}
                        >
                          {puonsaleModal ? (
                            <div className="d-flex justify-center putonsale_btnstatus">
                              {' '}
                              <Loading margin={'0'} size={'25px'} />
                            </div>
                          ) : (
                            t('productPage.PutOnSale.PutOnSale')
                          )}
                        </button>
                      )}

                    {itemDetails?.collectible_owner?.toLowerCase() ===
                      wallet_address?.toLowerCase() &&
                      (!itemDetails?.on_sale ||
                        (itemDetails?.on_sale &&
                          itemDetails?.auctionDetails?.auctionType === '2' &&
                          new Date(
                            itemDetails?.auctionDetails?.closingTime,
                          ).getTime() < new Date().getTime() &&
                          itemDetails?.history?.bid?.length === 0)) &&
                      itemDetails?.is_approve &&
                      !itemDetails?.is_hide &&
                      (!itemDetails?.redeem_status ||
                        itemDetails?.redeem_status == 'delivered') &&
                      profileDetails?.role === 'user' &&
                      !profileDetails?.isSuperAdmin && (
                        <button
                          className="place_bid_btn"
                          // onClick={() => SetputonsaleModal(true)}
                          onClick={()=>handlePutOnSaleStatus()}
                        >
                          {puonsaleModal ? (
                            <div className="d-flex justify-center putonsale_btnstatus">
                              {' '}
                              <Loading margin={'0'} size={'25px'} />
                            </div>
                          ) : (
                            t('productPage.PutOnSale.PutOnSale')
                          )}
                        </button>
                      )}

                    {putOffSaleCheck &&
                      !itemDetails?.is_hide &&
                      itemDetails?.on_sale &&
                      (itemDetails?.auctionDetails?.auctionType === '1' ||
                        (itemDetails?.auctionDetails?.auctionType === '2' &&
                          new Date(
                            itemDetails?.auctionDetails?.closingTime,
                          ).getTime() > new Date().getTime() &&
                          itemDetails?.history?.bid?.length === 0)) && (
                        <button
                          className="place_bid_btn"
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                          ) => handlePutOffSale(e)}
                        >
                          {' '}
                          {allLoadingState.delistloading ? (
                            <div className="d-flex justify-center putonsale_btnstatus">
                              {' '}
                              <Loading margin={'0'} size={'25px'} />
                            </div>
                          ) : (
                            'Delist Item'
                          )}
                        </button>
                      )}

                    {itemDetails &&
                      wallet_address &&
                      (itemDetails.collectible_owner?.toUpperCase() ==
                        wallet_address?.toUpperCase() ||
                        itemDetails?.auctionDetails?.highestBidder?.toUpperCase() ===
                        wallet_address?.toUpperCase()) &&
                      itemDetails?.auctionDetails?.highestBidder !=
                      '0x0000000000000000000000000000000000000000' &&
                      itemDetails?.auctionDetails?.auctionType == '2' &&
                      itemDetails?.auctionDetails?.buyer &&
                      new Date(
                        itemDetails?.auctionDetails?.closingTime,
                      ).getTime() < new Date().getTime() ? (
                      <div className="">
                        <button
                          // className="button-connect"
                          className="place_bid_btn"
                          style={{
                            boxShadow:
                              '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                          }}
                          onClick={() => {
                            handleClaim();
                          }}
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Claim'}
                        </button>
                      </div>
                    ) : null}

                    {itemDetails &&
                      (profileDetails?.role === 'admin' ||
                        profileDetails?.isSuperAdmin) &&
                      (itemDetails?.collectible_owner?.toLowerCase() ===
                        process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
                        itemDetails?.collectible_owner?.toLowerCase() ===
                        process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()) &&
                      itemDetails?.auctionDetails?.highestBidder !=
                      '0x0000000000000000000000000000000000000000' &&
                      itemDetails?.auctionDetails?.auctionType == '2' &&
                      new Date(
                        itemDetails?.auctionDetails?.closingTime,
                      ).getTime() < new Date().getTime() ? (
                      <div className="">
                        <button
                          className="place_bid_btn"
                          style={{
                            boxShadow:
                              '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                          }}
                          onClick={() => {
                            handleClaim();
                          }}
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Claim'}
                        </button>
                      </div>
                    ) : null}

                    <React.Suspense fallback="Loading">
                      <PlaceBid
                        bidValue={bidValue}
                        handleBidValue={handleBidValue}
                        show={bidModal}
                        onHide={handleCloseBidModal}
                        placeABidLoading={placeABidLoading}
                        onPlaceBid={onPlaceBid}
                        displayValues={displayValues}
                        itemName={itemDetails?.title}
                        placeForBidCheck={placeForBidCheck}
                        bidValueError={error.bidValueError}
                        mustLoginToBid={mustLoginToBid}
                        mustLoginToBuy={mustLoginToBuy}
                        goToWalletConnect={goToWalletConnect}
                        price={usdAmount}
                        currencyname={displayValues.unit}
                        redeemable={itemDetails?.redeemable}
                      />
                    </React.Suspense>

                    <React.Suspense fallback={'Laoding'}>
                      <PutOnSale
                        disableCursor={disableCursor}
                        network_id={itemDetails?.network_id}
                        openModal={openRedeemNowModal}
                        itemDetails={itemDetails}
                        profileDetails={profileDetails}
                        tokenId={token_id}
                        getItemDetails={getItemDetails}
                        show={puonsaleModal}
                        onHide={() => SetputonsaleModal(false)}
                      />
                    </React.Suspense>
                    {putOnSaleCheck &&
                      (!itemDetails?.on_sale ||
                        (itemDetails?.on_sale &&
                          itemDetails?.auctionDetails?.auctionType === '2' &&
                          new Date(
                            itemDetails?.auctionDetails?.closingTime,
                          ).getTime() < new Date().getTime() &&
                          itemDetails?.history?.bid?.length === 0)) &&
                      itemDetails?.is_approve &&
                      !itemDetails?.redeem_status &&
                      (profileDetails?.role === 'admin' ||
                        profileDetails?.isSuperAdmin) && (
                        <PutOnSale
                          disableCursor={disableCursor}
                          network_id={itemDetails?.network_id}
                          openModal={openRedeemNowModal}
                          itemDetails={itemDetails}
                          tokenId={token_id}
                          title={itemDetails?.title || 'N/A'}
                          description={itemDetails?.description || 'N/A'}
                          getItemDetails={getItemDetails}
                        />
                      )}

                    {itemDetails?.collectible_owner?.toLowerCase() ===
                      wallet_address?.toLowerCase() &&
                      (!itemDetails?.on_sale ||
                        (itemDetails?.on_sale &&
                          itemDetails?.auctionDetails?.auctionType === '2' &&
                          new Date(
                            itemDetails?.auctionDetails?.closingTime,
                          ).getTime() < new Date().getTime() &&
                          itemDetails?.history?.bid?.length === 0)) &&
                      itemDetails?.is_approve &&
                      !itemDetails?.redeem_status &&
                      profileDetails?.role === 'user' &&
                      !profileDetails?.isSuperAdmin && (
                        <PutOnSale
                          disableCursor={disableCursor}
                          network_id={itemDetails?.network_id}
                          openModal={openRedeemNowModal}
                          itemDetails={itemDetails}
                          tokenId={token_id}
                          title={itemDetails?.title || 'N/A'}
                          description={itemDetails?.description || 'N/A'}
                          getItemDetails={getItemDetails}
                        />
                      )}

                    {!itemDetails?.on_sale &&
                      !itemDetails?.is_approve &&
                      (profileDetails?.role === 'admin' ||
                        profileDetails?.isSuperAdmin) &&
                      itemDetails?.collectible_owner?.toLowerCase() !==
                      process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() &&
                      itemDetails?.collectible_owner?.toLowerCase() !==
                      process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase() && (
                        <div className="p-0 ">
                          <div className="text-18 md:text-24 text-blue font-semibold">
                            NFT not approved yet from admin
                          </div>
                        </div>
                      )}
                    {!itemDetails?.on_sale &&
                      !itemDetails?.is_approve &&
                      profileDetails?.role === 'user' &&
                      !profileDetails?.isSuperAdmin &&
                      itemDetails?.collectible_owner?.toLowerCase() ===
                      wallet_address?.toLowerCase() && (
                        <div className="p-0 ">
                          <div className="text-18 md:text-24 text-blue font-semibold">
                            NFT not approved yet from admin
                          </div>
                        </div>
                      )}
                    {(itemDetails?.collectible_owner?.toLowerCase() ===
                      process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
                      itemDetails?.collectible_owner?.toLowerCase() ===
                      process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()) &&
                      !itemDetails?.on_sale &&
                      itemDetails?.is_approve &&
                      (itemDetails?.redeem_status === 'dispatched' ||
                        itemDetails?.redeem_status === 'pending') &&
                      (profileDetails?.role === 'admin' ||
                        profileDetails?.isSuperAdmin) && (
                        <button
                          className="button-connect redeemable-btn placea_beat"
                          style={{
                            boxShadow:
                              '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                          }}
                          type="button"
                        >
                          Redeem Request Sent
                        </button>
                      )}
                    {(itemDetails?.collectible_owner?.toLowerCase() ===
                      process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
                      itemDetails?.collectible_owner?.toLowerCase() ===
                      process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase()) &&
                      (!itemDetails?.on_sale ||
                        (itemDetails?.on_sale &&
                          itemDetails?.auctionDetails?.auctionType === '2' &&
                          new Date(
                            itemDetails?.auctionDetails?.closingTime,
                          ).getTime() < new Date().getTime() &&
                          itemDetails?.history?.bid?.length === 0)) &&
                      itemDetails?.is_approve &&
                      itemDetails?.redeem_status === 'delivered' &&
                      (profileDetails?.role === 'admin' ||
                        profileDetails?.isSuperAdmin) && (
                        <button
                          className="button-connect redeemable-btn placea_beat cursor-pointer ml-1"
                          style={{
                            boxShadow:
                              '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                            pointerEvents: 'none',
                          }}
                          type="button"
                        >
                          Redeemed
                        </button>
                      )}
                    {itemDetails?.collectible_owner?.toLowerCase() ===
                      wallet_address?.toLowerCase() &&
                      !itemDetails?.on_sale &&
                      itemDetails?.is_approve &&
                      (itemDetails?.redeem_status === 'dispatched' ||
                        itemDetails?.redeem_status === 'pending') &&
                      profileDetails?.role === 'user' &&
                      !profileDetails?.isSuperAdmin && (
                        <button
                          className="button-connect redeemable-btn  place_bid_btn"
                          style={{
                            boxShadow:
                              '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                          }}
                          type="button"
                        >
                          Redeem Request Sent
                        </button>
                      )}
                    {itemDetails?.collectible_owner?.toLowerCase() ===
                      wallet_address?.toLowerCase() &&
                      (!itemDetails?.on_sale ||
                        (itemDetails?.on_sale &&
                          itemDetails?.auctionDetails?.auctionType === '2' &&
                          new Date(
                            itemDetails?.auctionDetails?.closingTime,
                          ).getTime() < new Date().getTime() &&
                          itemDetails?.history?.bid?.length === 0)) &&
                      itemDetails?.is_approve &&
                      itemDetails?.redeem_status === 'delivered' &&
                      profileDetails?.role === 'user' &&
                      !profileDetails?.isSuperAdmin && (
                        <button
                          className="button-connect redeemable-btn placea_beat ml-1"
                          style={{
                            boxShadow:
                              '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                            pointerEvents: 'none',
                          }}
                          type="button"
                        >
                          Redeemed
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>

      {isPlaceABidModalVisible ? (
        <div className="modal-backdrop">
          <div className="modal-body">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div
                  onClick={() => {
                    setIsPlaceABidModalVisible(false);
                  }}
                  className="close-btn"
                ></div>
                <div className="modal-header">
                  <div className="placeabid_popup_item">
                    <h1 className="placeabid_popup_head">Place a bid</h1>

                    <div className="text-left">
                      <h6>Your bid</h6>
                    </div>
                    <div className="row ethh_wrp">
                      <div className="col-6 text-left">
                        <input
                          className="bid-input responsive-placeholder bg-transparent border-b-2 border-solid border-white
                        py-1.5 w-full mt-3"
                          placeholder={'Enter an amount'}
                          value={bidValue}
                          name="Bid"
                          type="number"
                          onChange={(e) => handleBidValue(e)}
                        />
                      </div>
                      <div className="col-6 text-right">
                        <p>
                          {' '}
                          <span className="wethpara">{displayValues.unit}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-left middle_para">
                      <p className="comm_popup_para">{`Must be greater than ${itemDetails?.auctionDetails?.eth_current_bid} ${displayValues.unit}`}</p>
                    </div>
                    {!bidTransactionHash ? (
                      <div className="placeabit_popup_btn_wrp">
                        <>
                          <button
                            className="w-full text-16 md:text-20 text-white font-semibold bg-blue rounded-12 rounded-b-30 py-4 md:py-3.5 mt-10"
                            style={{
                              boxShadow:
                                '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                            }}
                            type="button"
                            disabled={placeABidLoading}
                            onClick={onPlaceBid}
                          >
                            {' '}
                            {placeABidLoading
                              ? 'Loading...'
                              : 'Place a bid'}{' '}
                          </button>
                        </>
                        <p className="text-center" style={{ color: 'red' }}>
                          {error.bidValueError}
                        </p>
                      </div>
                    ) : (
                      <button
                        className="details_comm_btn"
                        type="button"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <ShareModal
        show={shareModal}
        onHide={() => setShareModal(false)}
        title={itemDetails?.title}
        description={itemDetails?.description}
        itemimage={itemDetails?.userObj?.image}
      />
      <Helmentcomponent
        title={itemDetails?.title}
        description={itemDetails?.description}
        itemimage={itemDetails?.s3_url}
      />

      {
        <ReportModal
          report_to_add={itemDetails?.userObj?.wallet_address}
          open={reportOpen}
          onCloseModal={() => setReportOpen(false)}
          report_by_add={wallet_address}
          collectible_id={itemDetails?._id}
          network_id={itemDetails?.network_id}
        />
      }
      {editItemOpen && (
        <EditItemModal
          show={editItemOpen}
          onHide={() => setEditItemOpen(false)}
          description={itemDetails?.description ? itemDetails?.description : ''}
          title={itemDetails?.title ? itemDetails?.title : ''}
          id={itemDetails?._id}
          getItemDetails={getItemDetails}
        />
      )}
    </>
  );
}

export default LiveAuction;
