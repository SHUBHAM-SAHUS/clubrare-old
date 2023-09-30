import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { routeMap } from '../../router-map';
import './bit-card.scss';
import { useDispatch, useSelector } from 'react-redux';
import { reactOnPost } from '../../redux';
import { useToasts } from 'react-toast-notifications';
import VideoThumbnail from 'react-video-thumbnail';
import { useCustomStableCoin } from '../../hooks';

import {
  CheckCurrency,
  CheckCurrencyMetaMask,
  EnableEthereum,
  GetCaver,
  makeBrokerContractForEth,
  makeBrokerContractForKlytn,
} from '../../service/web3-service';
import LazyLoad from 'react-lazyload';
import Tooltip from 'react-simple-tooltip';
import { imgConstants } from '../../assets/locales/constants';
import { setChageHideStatusAction } from '../../redux';
import { VideoPLayIcon } from '../icons/play-icon';
import { VideoStopIcon } from '../icons/stop-video-icon';
import { ActiveToggleIcon } from '../icons/active-toggle-icon';

const ReportModal = React.lazy(
  () => import('../../pages/profile/view-profile/report-modal'),
);

function BidCard({
  name,
  collectibleType,
  closingTime,
  startingTime,
  list,
  likeStatusChanged,
  itemDetails,
  likeCount,
}: any) {

  const history = useHistory();
  const dispatch = useDispatch();
  const isConnected = useSelector(
    (state: any) => state.headerReducer.isConnected,
  );
  const { customFromWei } = useCustomStableCoin();
  const [isLike, setLike]: any = useState();
  const menuRef: any = React.useRef(null);
  const [totalLike, setTotalLike]: any = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [daysLeft1, setDaysLeft1] = useState(0);
  const networkId = localStorage.getItem('networkId');
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [hoursLeft1, setHoursLeft1] = useState(0);
  const [minutesLeft1, setMinutesLeft1] = useState(0);
  const [secondsLeft1, setSecondsLeft1] = useState(0);
  const [displayValues, setDiaplayValues] = useState({ value: '', unit: '' });
  const [usdAmount, setUsdAmount] = useState(0);
  const profileDetails = useSelector((state: any) => state.profileReducers.profile_details);
  const CURRENCYDetailS = useSelector((state: any) => state.ratechangeReducer.ratechange);
  const wallet_address: any = localStorage.getItem('Wallet Address');
  const [buyBtnCheck, setBuyBtnCheck] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [playPause, setPlayPause] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const { addToast } = useToasts();

  const klyNetworkId = '2';
  const ethNetworkId = '1';

  const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
  const usdt_eth_token_address = process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();
  const usdt_klaytn_token_address = process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase();

  useEffect(() => {
    document.addEventListener('mousedown', handleOutSideClick);
  }, []);

  useEffect(() => {
    if (list) {
      setLike(list?.is_like);
      setTotalLike(likeCount);
    }
  }, [list]);

  useEffect(() => {
    if (
      itemDetails?.on_sale &&
      collectibleType == ethNetworkId &&
      profileDetails?.role === 'user' &&
      !profileDetails?.isSuperAdmin &&
      wallet_address?.toUpperCase() !=
      itemDetails?.collectible_owner?.toUpperCase()
    ) {
      setBuyBtnCheck(true);
    } else if (
      itemDetails?.on_sale &&
      collectibleType == ethNetworkId &&
      !isConnected
    ) {
      setBuyBtnCheck(true);
    } else {
      setBuyBtnCheck(false);
    }

    if (profileDetails?.role === 'admin' || profileDetails?.isSuperAdmin) {
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
    }
  }, [itemDetails, profileDetails]);

  useEffect(() => {
    if (itemDetails) {
      setLike(itemDetails?.is_like);
    }
    const closingTime = itemDetails?.auctionDetails?.closingTime;
    const startingTime = itemDetails?.auctionDetails?.startingTime;
    let interval: any = null;

    interval = setInterval(() => {
      if (
        itemDetails?.auctionDetails?.auctionType == klyNetworkId &&
        new Date(itemDetails?.auctionDetails?.closingTime).getTime() >
        new Date().getTime()
      ) {
        const closingdate1 = new Date(closingTime).getTime();
        const closingdate2 = new Date(startingTime).getTime();
        const currentDate = new Date().getTime();
        timeDiffCalc(closingdate1, currentDate);
        timeDiffCalc1(closingdate2, currentDate);
      }
    }, 1000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, [itemDetails]);

  const setBurnButtonAfterAdminExist = useCallback(async (address: any) => {
    if (networkId == process.env.REACT_APP_KLATYN_NETWORK_ID) {
      var { brokerContract }: any = await makeBrokerContractForEth(
        address,
        true,
      );
    } else {
      var { brokerContract }: any = await makeBrokerContractForKlytn(
        address,
        true,
      );
    }
    await brokerContract.methods
      .admins(localStorage.getItem('Wallet Address'))
      .call()
      .then(async (res: any) => {
        if (res) {
          // setBurnBtnCheck(true);
        }
      })
      .catch(() => {
        return false;
      });
  }, []);

  useEffect(() => {
    if (Number(list?.auctionDetails?.currentBid)) {
      setLastPrice(
        (list?.auctionDetails?.currentBid).toString(),
        +list?.network_id,
        list?.auctionDetails?.erc20Token,
      );
    } else if (Number(list?.auctionDetails?.buyPrice)) {
      setLastPrice(
        (list?.auctionDetails?.buyPrice).toString(),
        +list?.network_id,
        list?.auctionDetails?.erc20Token,
      );
    } else if (Number(list?.auctionDetails?.startingPrice)) {
      setLastPrice(
        (list?.auctionDetails?.startingPrice).toString(),
        +list?.network_id,
        list?.auctionDetails?.erc20Token,
      );
    } else if (Number(list?.last_price)) {
      setLastPrice(
        list.last_price.toString(),
        +list?.network_id,
        list?.last_erc20_address,
      );
    } else if (Number(list?.eth_price)) {
      setEthPrice(list?.eth_price, +list?.network_id, list?.last_erc20_address);
    } else if (list?.history?.buy?.length > 0) {
      setLastPrice(
        list?.history?.buy[list?.history?.buy.length - 1].amount,
        +list?.network_id,
        list?.history?.buy[list?.history?.buy.length - 1].ERC20Address,
      );
    } else {
      setDiaplayValues({ value: '', unit: '' });
      setUsdAmount(0);
    }
  }, [list]);

  const setLastPrice = async (
    price: any,
    network_id: any,
    last_erc20_address: any,
  ) => {

    const result = await getWeiPrice(price, network_id, last_erc20_address);
    let priceUnit = 'ETH';
    if (network_id === 2) {
      const res: any = await CheckCurrency(last_erc20_address);
      priceUnit = res?.name;
    } else {
      const res: any = await CheckCurrencyMetaMask(last_erc20_address);
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
      priceUnit = res?.name;
    } else {
      const res: any = await CheckCurrencyMetaMask(last_erc20_address);
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
    const {
      ethRate,
      klayRate,
      agovRate,
      mpwrRate,
      agovEthRate,
      ethUSDTRate,
      klaytnUSDTRate,
    } = CURRENCYDetailS;
    if (network_id === 1) {
      if (erc20_address?.toLowerCase() === mpwr_token_address?.toLowerCase()) {
        usdAmount = +price * mpwrRate;
      } else if (
        erc20_address?.toLowerCase() === agov_eth_token_address?.toLowerCase()
      ) {
        usdAmount = +price * agovEthRate;
      } else if (
        erc20_address?.toLowerCase() === usdt_eth_token_address?.toLowerCase()
      ) {
        usdAmount = +price * ethUSDTRate;
      } else {
        usdAmount = +price * ethRate;
      }
    } else {
      if (erc20_address == '0x0000000000000000000000000000000000000000') {
        usdAmount = +price * klayRate;
      } else if (
        erc20_address?.toLowerCase() ===
        usdt_klaytn_token_address?.toLowerCase()
      ) {
        usdAmount = +price * klaytnUSDTRate;
      } else {
        usdAmount = +price * agovRate;
      }
    }
    if (usdAmount && usdAmount > 0) {
      setUsdAmount(usdAmount.toFixed(2));
    }
  };
  const openReportModal = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setReportOpen(true);
  };

  const getWeiPrice = async (
    price: any,
    network_id: any,
    last_erc20_address: any,
  ) => {
    if (network_id === 2) {
      const { caver }: any = await GetCaver();
      return await customFromWei(price, caver, last_erc20_address);
    } else {
      const { web3 }: any = await EnableEthereum(true);
      return await customFromWei(price, web3, last_erc20_address);
    }
  };

  const goToProfile = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const creator = list?.userObj?.wallet_address;
    if (creator) {
      history.push(`/${creator}`);
    }
  };

  const timeDiffCalc = (dateFuture: any, dateNow: any) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    const seconds = Math.floor(diffInMilliSeconds);
    if (days) {
      hours = hours;
    }
    setDaysLeft(days);
    setHoursLeft(hours);
    setMinutesLeft(minutes);
    setSecondsLeft(seconds);

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
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    const seconds = Math.floor(diffInMilliSeconds);
    if (days) {
      hours = hours;
    }
    setDaysLeft1(days);
    setHoursLeft1(hours);
    setMinutesLeft1(minutes);
    setSecondsLeft1(seconds);

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

  const getReaction = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isConnected) {
      history.push('/connect-wallet');
    }
    if (!list?.is_like) {
      setLike(true);
      setButtonDisable(true);
    } else {
      setLike(false);
      setButtonDisable(false);
    }
    const object = {
      collectible_id: list?._id,
    };
    const result: any = await dispatch(reactOnPost(object));
    if (result?.data?.data) {
      if (result?.data?.data?.isLike) {
        setTotalLike(totalLike + 1);
        setLike(true);
      } else if (totalLike > 0) {
        likeStatusChanged && likeStatusChanged();
        setTotalLike(totalLike - 1);
        setLike(false);
      }
      setButtonDisable(false);
    } else {
      setButtonDisable(false);
    }
  };

  const handleOutSideClick = (event: any) => {
    if (menuRef && menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenu(false);
    }
  };
  const toggleMenu = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenu(!openMenu);
  };

  const goToOpenSea = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const tokenId = list?.token_id;
    const collectionAddress = list?.collection_address;
    const network_id = list?.network_id;
    const opensea_link =
      network_id == 2
        ? process.env.REACT_APP_KLYTN_OPENSEA_LINK
        : process.env.REACT_APP_OPENSEA_LINK;
    if (tokenId) {
      window.open(`${opensea_link}/${collectionAddress}/${tokenId}`, '_blank');
    }
    setOpenMenu(false);
  };
  const goToDetails = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      e.target.nodeName === 'IMG' &&
      (e.target.alt == 'like_img' ||
        e.target.alt == 'collection_img' ||
        e.target.alt == 'owner-image' ||
        e.target.alt == 'creater-image')
    ) {
      return;
    }
    history.push(routeMap.liveAuctions.view(list?._id));
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

  const showValue = (displayValues: any) => {
    const str = displayValues.value;
    let finalValue = '';
    if (str.includes('.')) {
      const findValIndex = str.indexOf('.');
      const replaceDot = str.replace('.', '');
      if (replaceDot.length >= 4) {
        const isFormatedValue = replaceDot.toString().substring(0, 3) + '...';
        const addDotInValue =
          isFormatedValue.substring(0, findValIndex) +
          '.' +
          isFormatedValue.substring(findValIndex, isFormatedValue.length);
        finalValue = replaceDot ? addDotInValue : '';
      } else {
        finalValue =
          replaceDot.substring(0, 1) +
          '.' +
          replaceDot.substring(findValIndex, replaceDot.length);
      }
    } else {
      if (str.length >= 4) {
        finalValue = str.toString().substring(0, 3) + '...';
      } else {
        finalValue = str ? str : '';
      }
    }
    return finalValue;
  };

  const showAmount = (usdAmount: any) => {
    const str = usdAmount;
    let finalValue = '';
    if (str && str.includes('.')) {
      const findValIndex = str.indexOf('.');
      const replaceDot = str.replace('.', '');
      if (replaceDot.length >= 4) {
        const isFormatedValue = replaceDot.toString().substring(0, 3) + '...';
        const addDotInValue =
          isFormatedValue.substring(0, findValIndex) +
          '.' +
          isFormatedValue.substring(findValIndex, isFormatedValue.length);
        finalValue = replaceDot ? `$ ${addDotInValue} USD` : '';
      } else {
        const finalValueTamp =
          replaceDot.substring(0, findValIndex) +
          '.' +
          replaceDot.substring(findValIndex, replaceDot.length);
        finalValue = replaceDot ? `$ ${finalValueTamp} USD` : '';
      }
    } else {
      if (str.length >= 4) {
        finalValue = str
          ? `$ ${str.toString().substring(0, 3) + '...'} USD`
          : '';
      } else {
        finalValue = str ? `$ ${str} USD` : '';
      }
    }
    return finalValue;
  };
  const changePlayPauseImg = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setPlayPause(!playPause);
  };

  const callChangeHideStatus = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const result: any = await dispatch(
      setChageHideStatusAction(itemDetails?._id),
    );
    if (result.status === 200) {
      itemDetails.is_hide = !itemDetails.is_hide;
      addToast(result.data.message, {
        appearance: 'success',
        autoDismiss: true,
      });
      setLoading(false);
    } else if (result.status === 400) {
      addToast(result.data.message, { appearance: 'error', autoDismiss: true });
      setLoading(false);
    }
    setOpenMenu(false);
  };

  return (
    <>
      <div
        className="live_auction_slider text-left bit_card_body px-3 py-2 new_club_card_wrp"
        onClick={goToDetails}
      >
        {list?.file_content_type?.includes('image') ||
          list?.file_content_type?.includes('audio') ?
          (
            <>
              {itemDetails?.preview_url ? (
                <div className="preview_img_wrp">
                  <img
                    src={itemDetails?.preview_url}
                    alt=""
                    className="preview_img"
                  />
                </div>
              ) : (
                <div
                  className={`new_club_card_imgwrp ${list?.file_content_type == 'audio'
                      ? 'audio_club_card_wrp'
                      : list?.file_content_type == 'image'
                        ? ''
                        : 'video_club_card_wrp'
                    }`}
                >
                  {list?.file_content_type?.includes('image') ? (
                    <LazyLoad>
                      <img src={list.s3_url} alt="" className="" />
                    </LazyLoad>
                  ) : list?.file_content_type?.includes('audio') ? (
                    <div className="auio_img_wrp">
                      <div className="inn_audio_box">
                        <figure>
                          <img src={imgConstants.musicIcon} alt="" />
                        </figure>
                        <audio controls>
                          <source src={list.s3_url}></source>
                        </audio>
                      </div>
                    </div>
                  ) : ('')}
                  <div className="liveauctimg_top row"></div>
                </div>
              )}
            </>
          ) : null}

        {list?.file_content_type?.includes('video') && (
          <div
            className={`new_club_card_imgwrp ${list?.file_content_type == 'audio'
                ? 'audio_club_card_wrp'
                : list?.file_content_type == 'image'
                  ? ''
                  : 'video_club_card_wrp'
              }`}
          >
            <div className="thumbnail_wrp">
              {/* <button onClick={changePlayPauseImg}>
                {playPause ? (
                  <VideoPLayIcon className="playimg" />
                ) : (
                  <VideoStopIcon className="playimg" />
                )}
              </button>
              {playPause ? (
                <VideoThumbnail videoUrl={list.s3_url}
                />

              ) : (
                <video loop autoPlay>
                  <source src={list.s3_url} type="video/mp4"></source>
                </video>
              )} */}
               <video loop autoPlay muted>
                  <source src={list?.preview_url} type="video/mp4"></source>
                </video>
            </div>
            <div className="liveauctimg_top row"></div>
          </div>
        )}
        <div className="new_club_card_bottom">
          <div className="row club_card_bottom1 d-flex">
            <div className="col-2 new_club_profile">
              <div onClick={goToProfile} className="new_club_profile_inner">
                <figure>
                  <img
                    src={list?.userObj?.image || imgConstants.avatar}
                    alt="avatar"
                  />
                </figure>
                {/* <img className="varified_user_img" src={varified_seller} alt="varified-Seller" /> */}
              </div>
            </div>
            <div className="col-8 new_club_title">
              <h3>{name}</h3>
            </div>
            <div
              className={
                openMenu ? 'crd_hvr col-2' : 'col-2 new_club_card_toggle'
              }
            >
              <div onClick={toggleMenu} className="active">
                <ActiveToggleIcon className={''} />
              </div>
              <div
                className="new_club_card_toggle_popup "
                ref={menuRef}
                style={{ display: openMenu ? 'block' : 'none' }}
              >
                <ul>
                  {isConnected && (
                    <li onClick={openReportModal}>
                      <a className="report_popup">Report</a>
                    </li>
                  )}
                  {list?.token_id ? (
                    <li onClick={goToOpenSea}>
                      <a>View on opensea</a>
                    </li>
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
                        itemDetails?.auctionDetails?.auctionType === '1') ||
                      (itemDetails?.on_sale &&
                        itemDetails?.auctionDetails?.auctionType === '2' &&
                        new Date(
                          itemDetails?.auctionDetails?.closingTime,
                        ).getTime() < new Date().getTime() &&
                        itemDetails?.history?.bid?.length === 0)) &&
                    (!itemDetails?.redeem_status ||
                      itemDetails?.redeem_status == 'delivered') && (
                      <li onClick={callChangeHideStatus}>
                        {loading
                          ? 'Loading...'
                          : itemDetails?.is_hide
                            ? 'Unhide NFT'
                            : 'Hide NFT'}
                      </li>
                    )}
                </ul>
              </div>
            </div>
          </div>
          <div className="row club_card_bottom2 d-flex">
            <div className="col-6 club_card_price_wrp">
              <Tooltip
                className="cardtooltip_wrp"
                content={displayValues.value}
              >
                <span
                  className={
                    displayValues.unit === 'KLAY'
                      ? 'cardtooltip klay'
                      : displayValues.unit === 'ETH'
                        ? 'cardtooltip eth'
                        : displayValues.unit === 'AGOV'
                          ? 'cardtooltip agov'
                          : displayValues.unit === 'WETH'
                            ? 'cardtooltip weth'
                            : displayValues.unit === 'MPWR'
                              ? 'cardtooltip mpwr'
                              : displayValues.unit === 'USDT'
                                ? 'cardtooltip usdt'
                                : ''
                  }
                >
                  {showValue(displayValues)}{' '}
                  {displayValues.unit ? displayValues.unit : ''}
                </span>
              </Tooltip>
            </div>
            <div className="col-6 club_price_usd_card">
              <h4>{showAmount(usdAmount)}</h4>
            </div>
          </div>
          <div className="row club_card_bottom3 d-flex">
            <div className="col-10 club_card_btn_wrp">
              {buyBtnCheck && (
                <button className="club_cmn_card_btn buynowbtn">Buy Now</button>
              )}

              {collectibleType == 2 && (
                <button className="club_cmn_card_btn timelinebtn">
                  {collectibleType == 2 &&
                    new Date(startingTime).getTime() > new Date().getTime() ? (
                    <span className="d-flex">
                      <span className="timelinebtn_indigator"> Starts </span>
                      {+daysLeft1 < 10 ? '0' + daysLeft1 : daysLeft1}
                      d&nbsp;:&nbsp;
                      {+hoursLeft1 < 10 ? '0' + hoursLeft1 : hoursLeft1}
                      h&nbsp;:&nbsp;
                      {+minutesLeft1 < 10 ? '0' + minutesLeft1 : minutesLeft1}
                      m&nbsp;:&nbsp;
                      {+secondsLeft1 < 10 ? '0' + secondsLeft1 : secondsLeft1}s
                    </span>
                  ) : collectibleType == 2 &&
                    new Date(closingTime).getTime() > new Date().getTime() ? (
                    <span className="d-flex">
                      <span className="timelinebtn_indigator"> Ends </span>
                      {+daysLeft < 10 ? '0' + daysLeft : daysLeft}d&nbsp;:&nbsp;
                      {+hoursLeft < 10 ? '0' + hoursLeft : hoursLeft}
                      h&nbsp;:&nbsp;
                      {+minutesLeft < 10 ? '0' + minutesLeft : minutesLeft}
                      m&nbsp;:&nbsp;
                      {+secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}s
                    </span>
                  ) : collectibleType == 2 ? (
                    <span>Auction Ended</span>
                  ) : null}
                </button>
              )}
            </div>
            <div className="col-2 club_card_like_wrp">
              {isConnected && (
                <>
                  <h6>
                    {likeFormatter(totalLike) || likeFormatter(likeCount)}
                  </h6>
                  {isLike ? (
                    <img
                      className={`${buttonDisable ? 'disabledLike' : ''}`}
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
                        className={`likeIcon ${buttonDisable ? 'disabledLike' : ''
                          }`}
                      />
                      <img
                        onClick={getReaction}
                        src={imgConstants.hoverHeartIcon}
                        className={`hoverIcon ${buttonDisable ? 'disabledLike' : ''
                          }`}
                        alt="hoverHeartIcon"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {
        <ReportModal
          report_to_add={list?.userObj?.wallet_address}
          reporty_by_add={wallet_address}
          open={reportOpen}
          onCloseModal={() => setReportOpen(false)}
          collectible_id={list?._id}
          network_id={list?.network_id}
        />
      }
    </>
  );
}

export default BidCard;
