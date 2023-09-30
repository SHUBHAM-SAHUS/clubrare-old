import React, { useState, useMemo, useEffect, useRef, memo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Nav, NavDropdown, Modal, Button } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { useCustomStableCoin } from '../../hooks';
import {
  Menu,
  MenuDrawer,
  CryptoIcon2,
  CryptoIcon3,
  Loading,
} from '../../components';
import NotificationsModal from '../../components/notification-modal/index';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  SET_WALLET_AMOUNT,
  UPDATE_WALLET_AMOUNT,
  SET_LIVE_PRICE,
} from '../../redux/types/connect-wallet-types';
import {
  SEARCH_KEYWORD,
  SELECTED_NETWORK,
  SET_IS_CONNECTED,
} from '../../redux/types';
import {
  getWeb3,
  EnableEthereum,
  EnableKlyten,
  makeWethContractforEth,
  GetCaver,
} from '../../service/web3-service';
import {
  getEditProfileAction,
  MostLikedAction,
  EditProfileAction,
  getAllNotificatiionAction,
  NotificationSingalReadAction,
  AllReadNotificationAction,
  disconnectWalletAction,
} from '../../redux';
import { useToasts } from 'react-toast-notifications';
import { Dropdown } from 'react-bootstrap';

import './header.scss';
import { routeMap } from '../../router-map';
import Homeclub from '../../pages/home/home-club';
import TimeAgo from 'timeago-react';
import { getconversionrateapiAction } from '../../redux/actions/approval-list';
import logo from '../../assets/images/CR_logo.svg';
import coinImg from '../../assets/images/Coins.svg';
import catImg from '../../assets/images/categoryImg.svg';
import { GET_PROFILE_DETAILS } from '../../redux/types/profile-types';
import { imgConstants } from '../../assets/locales/constants';

const searchicon =
  'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/search.svg';

const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
const buyMpwr = process.env.REACT_APP_BUY_MPWR_ADDRESS;
const buyAgov = process.env.REACT_APP_BUY_AGOV_ADDRESS;

const buyMpwrEthLP = process.env.REACT_APP_BUY_MPWR_ETH_LP_ADDRESS;
const buyAgovEthLP = process.env.REACT_APP_BUY_AGOV_ETH_LP_ADDRESS;
function Header({ hideCursor }: any) {
  const { customFromWei } = useCustomStableCoin();
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [ethBalance, setEthBalance] = useState('0');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [walletDrawerOpen, setWalletDrawerOpen] = useState(false);
  const [searchInputOpen, setSearchInputOpen] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [hideSearchPopup, setHideSearchPopup] = useState<boolean>(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const isConnected = useSelector(
    (state: any) => state.headerReducer.isConnected,
  );
  const walletAmount = useSelector(
    (state: any) => state.metamaskReducer.wallet_amount,
  );

  const [isNotificationModal, setIsNotificationModal] = useState(false);

  const updateWalletAmount = useSelector(
    (state: any) => state.metamaskReducer.update_wallet_amount,
  );
  const live_price = useSelector(
    (state: any) => state.metamaskReducer.live_price,
  );
  const unReadNotification = useSelector(
    (state: any) => state.notificationsReducer.unreadNotifications,
    shallowEqual,
  );
  const [dollarAmt, setDollarAmt] = useState<any>('');
  const networkId = localStorage.getItem('networkId');
  const wallet_address = localStorage.getItem('Wallet Address');

  const klytn_network_id: any = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const [selectedNet, setSelectedNet] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [profileDetails, setProfileDetails]: any = useState('');
  const profile_details = useSelector((state: any) => {
    return state.profileReducers.profile_details;
  });

  const [homeClub, setHomeClub] = useState(false);
  const search_keyword = useSelector(
    (state: any) => state.exploreReducer.search_keyword,
  );
  const searchRef: any = useRef(null);
  const [searchValue, setSearchVal] = useState(search_keyword);
  const [isAdmin, setIsAdmin] = useState('new Admin');

  const currencyDetails = useSelector(
    (state: any) => state.ratechangeReducer.ratechange,
  );

  const [swapModal, setSwapModal] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/home') {
      setHomeClub(true);
    }
    if (walletAmount) {
      setEthBalance(parseFloat(walletAmount).toFixed(2));
    }
  }, [walletAmount]);

  useEffect(() => {
    if (search_keyword === '') {
      setSearchVal('');
    }
  }, [search_keyword]);

  useEffect(() => {
    if (localStorage.getItem('networkId')) {
      if (localStorage.getItem('networkId') === klatynNetworkId) {
        setSelectedNet('2');
        dispatch({ type: SELECTED_NETWORK, payload: '2' });
      } else {
        setSelectedNet('1');
        dispatch({ type: SELECTED_NETWORK, payload: '1' });
      }
    } else {
      setSelectedNet('2');
      dispatch({ type: SELECTED_NETWORK, payload: '2' });
      localStorage.setItem('networkId', klytn_network_id);
    }
  }, [isConnected]);

  useEffect(() => {
    const interval: any = null;
    let token = 'ETH';
    if (networkId == klytn_network_id) {
      token = 'KLAY';
    }
    const getLivePrice = () => {
      if (token === 'ETH') {
        const { ethRate } = currencyDetails;
        dispatch({ type: SET_LIVE_PRICE, payload: ethRate });
      } else if (token === 'KLAY') {
        const { klayRate } = currencyDetails;
        dispatch({ type: SET_LIVE_PRICE, payload: klayRate });
      }
    };
    getProfileDetails(localStorage.getItem('Wallet Address'));
    getLivePrice();
    return function cleanup() {
      clearInterval(interval);
    };
  }, [currencyDetails]);

  useEffect(() => {
    if (live_price) {
      setDollarAmt((Number(ethBalance) * live_price).toFixed(2));
    }
  }, [live_price, ethBalance]);

  useEffect(() => {
    dispatch(getconversionrateapiAction());
  }, []);

  useEffect(() => {
    const add = localStorage.getItem('Wallet Address');
    const updatePrice = async () => {
      if (networkId == process.env.REACT_APP_KLATYN_NETWORK_ID) {
        const { caver }: any = await GetCaver();
        const bal = await caver.klay.getBalance(add);
        const amount = await customFromWei(bal, caver, '');
        localStorage.setItem('wallet_amount', amount);
        dispatch({ type: SET_WALLET_AMOUNT, payload: amount });
        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: false });
      } else {
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
    if (updateWalletAmount && add) {
      updatePrice();
    }
  }, [updateWalletAmount]);

  const getProfileDetails = async (add: any) => {
    if (add) {
      const data = { user_address: add };
      let res: any = await dispatch(getEditProfileAction(data));
      if (res.data) {
        setUserRole(res?.data?.role);
        setProfileDetails(res.data);
      }
    }
  };

  const setDisplayName = () => {
    if (!profile_details?.name) {
      history.push('/profile/edit');
    }
  };

  const commingSoon = () => {
    addToast('Coming Soon', { appearance: 'success', autoDismiss: true });
  };

  const readSingalNoti = (val: any, i: any) => {
    notify[i]['isRead'] = true;
    setnotifyclr('bck_clr');
    const { _id, type, collectible_id }: any = val;
    const data = {
      _id: _id,
    };

    dispatch(NotificationSingalReadAction(data));
    if (type === 'live-auctions') {
      history.push({
        pathname: '/live-auctions',
      });
      document.getElementById('noti')?.click();
    } else if (type === 'explore') {
      history.push({
        pathname: '/explore',
      });
      document.getElementById('noti')?.click();
    } else if (type === 'pending-collectibles') {
      history.replace({
        pathname: `/${wallet_address}`,
        state: `pending-collectibles-${Math.random()}`,
      });
      document.getElementById('noti')?.click();
    } else if (type === 'rewards') {
      history.replace({
        pathname: '/rewards',
      });
      document.getElementById('noti')?.click();
    } else if (
      type === 'item-approval' &&
      profile_details &&
      profile_details != '' &&
      (profile_details?.role == 'admin' || profile_details?.isSuperAdmin)
    ) {
      history.push('/item-approval');
      document.getElementById('noti')?.click();
    } else if (
      type === 'redeem-list' &&
      profile_details &&
      profile_details != '' &&
      (profile_details?.role == 'admin' || profile_details?.isSuperAdmin)
    ) {
      history.push('/redeem-list');
      document.getElementById('noti')?.click();
    } else if (type === 'my-collectibles') {
      history.replace({
        pathname: `/${wallet_address}`,
        state: `my-collectibles-${Math.random()}`,
      });
    } else if (type === 'details' && collectible_id) {
      history.push(`/item/${collectible_id}`);
      document.getElementById('noti')?.click();
    }
  };
  const allreadfunnoti = async () => {
    try {
      setMoreData(false);
      await dispatch(AllReadNotificationAction());
      getnotifictiondata();
    } catch (err: any) {
      return false;
    }
  };
  const mobileallreadfunnoti = async () => {
    try {
      setMoreData(false);
      await dispatch(AllReadNotificationAction());
      getnotifictiondata();
      document.body.style.position = 'fixed';
    } catch (err: any) {
      return false;
    }
  };

  const [isMoreData, setMoreData] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [readcount, setreadcount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  let [notify, setNotify] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [notifyclr, setnotifyclr] = useState('bck_white');
  const [checkUserLogin, setCheckUserLogin] = useState(false);
  const [checknetwork, Setchecknetwork] = useState<any>();

  const getuserconnect = () => {
    const userconnection: any = localStorage.getItem('isConnected');
    const networkIdcheck: any = localStorage.getItem('networkId');

    setCheckUserLogin(userconnection);
    Setchecknetwork(networkIdcheck);
  };

  useEffect(() => {
    getuserconnect();
  }, []);

  const LoaderScroll = () => {
    const loaderDesign = (
      <>
        <div className="d-flex justify-content-center my-3">
          <div
            className="spinner-grow text-secondary sizee"
            style={{ marginRight: '8px' }}
          ></div>
          <div
            className="spinner-grow text-secondary"
            style={{ marginRight: '8px' }}
          ></div>
          <div
            className="spinner-grow text-secondary"
            style={{ marginRight: '8px' }}
          ></div>
          <div
            className="spinner-grow text-secondary"
            style={{ marginRight: '8px' }}
          ></div>
          <div className="spinner-grow text-secondary"></div>
        </div>
      </>
    );
    return loaderDesign;
  };

  const getnotifictiondata = async (pageno: any = null) => {
    if (isMoreData) {
      const object: any = {
        page_size: pageSize,
      };
      if (pageno) {
        object['page_number'] = pageno;
      } else {
        object['page_number'] = 1;
        setPageNumber(1);
      }
      setLoader(true);
      const data: any = await dispatch(getAllNotificatiionAction(object));
      setreadcount(data?.unReadCount);
      setTotalCount(data?.totalCount);
      const rows = data?.rows;

      if (!rows || rows?.length === 0) {
        setMoreData(false);
        setLoader(false);
      }
      if (!pageno) {
        notify = [];
        setNotify([]);
      }

      if (rows && rows.length > 0) {
        setMoreData(true);
        setLoader(false);
        // eslint-disable-next-line no-lone-blocks
        {
          rows?.map((val: any) => {
            return setNotify((oldData: any) => {
              return [...oldData, val];
            });
          });
        }
      } else {
        setMoreData(false);
      }
    }
  };

  useEffect(() => {
    if (isConnected) getnotifictiondata(pageNumber);
  }, []);

  const handledata = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop < 20;
    if (bottom) {
      const showedNoti = (pageNumber * pageSize).toString();
      setPageNumber(pageNumber + 1);
      if (pageNumber > 1 && parseInt(showedNoti) < totalCount) {
        getnotifictiondata(pageNumber);
      }
    }
  };

  const disconnetWallet = async (redirect_to_login: any = false) => {
    let req = {
      deviceToken: '',
    };
    try {
      const res: any = await dispatch(disconnectWalletAction(req));
      if (res) {
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
        localStorage.removeItem('Custom Url');
        if (redirect_to_login) {
          history.push('/connect-wallet');
        } else {
          history.push('/home');
        }
      }
    } catch (error) {}
  };

  const handleSelect = async (net: string) => {
    if (net === selectedNet) {
      return;
    }
    if (isConnected) {
      addToast('Please change wallet', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    } else {
      setSelectedNet(net);
      dispatch({ type: SELECTED_NETWORK, payload: net });
      if (net == '1') {
        const netId: any = process.env.REACT_APP_NFT_NETWORK_ID;
        await localStorage.setItem('networkId', netId);
      } else {
        const netId: any = process.env.REACT_APP_KLATYN_NETWORK_ID;
        await localStorage.setItem('networkId', netId);
      }
      history.push('/home');

      dispatch(MostLikedAction());
    }
  };
  const goToAdmin = (path: string) => {
    history.push(path);
  };

  const onCLickCreate = async () => {
    if (!profile_details) {
      history.push('/connect-wallet');
      return;
    }
    if (profile_details?.role === 'admin' || profile_details?.isSuperAdmin) {
      if (
        localStorage.getItem('networkId') ===
        process.env.REACT_APP_KLATYN_NETWORK_ID
      ) {
        var { brokerContract }: any = await EnableKlyten();
      } else {
        var { brokerContract }: any = await EnableEthereum();
      }
      await brokerContract.methods
        .owner()
        .call()
        .then(async (ownerRes: any) => {
          if (
            ownerRes?.toLowerCase() ==
            localStorage.getItem('Wallet Address')?.toLowerCase()
          ) {
            setIsAdmin('new Admin');
            history.push('/create');
          } else {
            await brokerContract.methods
              .admins(localStorage.getItem('Wallet Address'))
              .call()
              .then(async (res: any) => {
                if (res) {
                  setIsAdmin('new Admin');
                  history.push('/create');
                } else {
                  setIsAdmin('old Amin');
                  addToast('Old Admin can not create NFT', {
                    appearance: 'error',
                    autoDismiss: true,
                  });
                }
              });
          }
        });
    } else {
      if (!profile_details?.email || profile_details?.email == '') {
        setShowEmailModal(true);
      } else {
        history.push('/create');
      }
    }
  };

  const WalletOptions = (isDrawer?: any) =>
    useMemo(() => {
      if (isConnected) {
        const titleOption = {
          key: 1,
          title: (
            <div
              className={
                isDrawer
                  ? 'text-18 text-blue font-semibold mt-20'
                  : 'text-18 text-blue border-b border-solid border-gray pb-2 w-full -mt-1'
              }
            >
              {t('header.WalletBalance')}
            </div>
          ),
          onClick: () => {},
        };
        const mainOptionsItems = [{ key: 2, title: 'Balance' }];
        const mainOptions = mainOptionsItems.map((i) => ({
          key: i.key,
          title: (
            <div className="w-full">
              <div
                className={`flex justify-between items-end w-full ${
                  isDrawer ? 'mt-7' : 'px-4'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {networkId == klytn_network_id ? (
                    <CryptoIcon3 fill={i.key === 2 ? '#000000' : '#000000'} />
                  ) : (
                    <CryptoIcon2 fill={i.key === 2 ? '#000000' : '#000000'} />
                  )}
                  <div className="flex flex-col items-start">
                    <div className="text-14 text-gray font-semibold">
                      {i.title}
                    </div>
                    <div className="text-16 text-blue font-semibold">
                      {localStorage.getItem('networkId') == klatynNetworkId
                        ? ethBalance + ' KLAY'
                        : ethBalance + ' ETH'}{' '}
                    </div>
                  </div>
                </div>
                <div className="text-16 text-gray font-semibold text-right">
                  $ {dollarAmt}
                </div>
              </div>
              {profile_details?.isSuperAdmin && (
                <div
                  onClick={() => goToAdmin('/user-list')}
                  className="w-full text-left ml-4 mt-3"
                >
                  UserList
                </div>
              )}
              {(userRole == 'admin' || profile_details?.isSuperAdmin) && (
                <>
                  <div
                    onClick={() => goToAdmin(routeMap.create)}
                    className="w-full text-left ml-4"
                  >
                    Clubrare Drop
                  </div>
                  <div
                    onClick={() => goToAdmin(routeMap.admin)}
                    className="w-full text-left ml-4"
                  >
                    Admin
                  </div>

                  <div
                    onClick={() => goToAdmin(routeMap.redeemList)}
                    className="w-full text-left ml-4"
                  >
                    Redeem List
                  </div>

                  <div
                    onClick={() => goToAdmin(routeMap.reportsList)}
                    className="w-full text-left ml-4"
                  >
                    Reports
                  </div>
                  <div
                    onClick={() => goToAdmin(routeMap.approveList)}
                    className="w-full text-left ml-4"
                  >
                    Approval List
                  </div>
                  <div
                    onClick={() => goToAdmin(routeMap.authenticationPurchase)}
                    className="w-full text-left ml-4"
                  >
                    Authentication Lists
                  </div>
                  <div
                    onClick={() => goToAdmin(routeMap.spaceLists)}
                    className="w-full text-left ml-4"
                  >
                    Space Lists
                  </div>
                </>
              )}
            </div>
          ),
          onClick: () => {},
        }));
        const lastOption = {
          key: mainOptions.length + 2,
          title: (
            <button
              className={`text-14 text-blue font-bold border border-solid border-gray
                        py-3 px-6 rounded-12 w-full ${
                          isDrawer ? 'mt-11' : 'mx-6.5'
                        }`}
              onClick={disconnetWallet}
            >
              {t('header.DisconnectWallet')}
            </button>
          ),
        };
        return [titleOption, ...mainOptions, lastOption];
      } else {
        const titleOption = {
          key: 1,
          title: (
            <div
              className={
                isDrawer
                  ? 'text-18 text-blue font-semibold mt-20'
                  : 'text-18 text-blue border-b border-solid border-gray pb-2 w-full -mt-1'
              }
            ></div>
          ),
          onClick: () => {
            history.push('/connect-wallet');
          },
        };
        return [
          titleOption,
          {
            key: 2,
            title: (
              <button
                onClick={() => history.push('/connect-wallet')}
                className={`text-14 text-blue font-bold border border-solid border-gray
                        py-3 px-6 rounded-12 w-full ${
                          isDrawer ? 'mt-11' : 'mx-6.5'
                        }`}
              >
                {t('header.ConnectWallet')}
              </button>
            ),
            onClick: () => {},
          },
        ];
      }
    }, []);

  const onChangeSearch = (e: any) => {
    setSearchVal(e.target.value);
  };

  const onInputSearch = async (e: any) => {
    if (e.key === 'Enter' || e.currentTarget.className === 'search-icon') {
      await dispatch({ type: SEARCH_KEYWORD, payload: searchValue });
      history.push('/explore');
      setHideSearchPopup(true);
      handleMenuClose(e);
    }
  };

  const bellIconClickHandler = () => {
    setIsNotificationModal(!isNotificationModal);
  };

  const SMHeader = () => (
    <div
      className="items-center lightShadow mobile_head_inner
                      border border-solid border-white rounded-b-40"
    >
      <div
        className="searchcol"
        style={{ height: 22 }}
        onClick={() => setSearchInputOpen(true)}
      >
        <img src={imgConstants.magnifier} alt="magnifier" />
      </div>
      <div className="headlogowrp">
        <Menu
          selectedNet={selectedNet}
          handleNotification={bellIconClickHandler}
          profile_details={profile_details}
          handleSelect={handleSelect}
        />
      </div>

      <div
        className="justify-self-end flex items-center pt-1 headrightcol"
        onClick={() => setWalletDrawerOpen(true)}
      >
        {isConnected && (
          <div className="text-12 font-semibold textGradient">
            {localStorage.getItem('networkId') == klatynNetworkId
              ? ethBalance + ' KLAY'
              : ethBalance + ' ETH'}
          </div>
        )}
        <img src={imgConstants.wallet} alt="wallet" />
      </div>
    </div>
  );

  const closeEmailModal = () => {
    setShowEmailModal(false);
  };

  const inputClickHandler = (event: any) => {
    const { value } = event.target;
    setEmail(value);
  };

  const updateProfile = async (e: any) => {
    e.preventDefault();
    const matchEmailString = /^\w+([.-]?\w+)*@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (email.match(matchEmailString)) {
      setSubmitLoading(true);
      const address: any = localStorage.getItem('Wallet Address');
      if (address) {
        const formData = new FormData();
        formData.append('_id', profile_details?._id);
        formData.append('wallet_address', profile_details?.wallet_address);
        formData.append('email', email ? email : '');

        await dispatch(EditProfileAction(formData));
        let res: any = await dispatch(
          getEditProfileAction({ user_address: wallet_address }),
        );
        if (res?.data) {
          setProfileDetails(res?.data);
          history.push('/create');
        }
        setSubmitLoading(false);
        setShowEmailModal(false);
      }
    } else {
      if (!email.match(matchEmailString)) {
        addToast('Please enter valid email', {
          appearance: 'error',
          autoDismiss: true,
        });
      } else {
        addToast('user address not available', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const handleMenuOpen = () => {
    document.body.style.position = 'fixed';
    setHideSearchPopup(false);
  };

  const handleMenuClose = (e: any) => {
    const currElemId = e.target.id;
    if (
      currElemId !== 'buy-mobile-nav-dropdown' &&
      currElemId !== 'resource-mobile-nav-dropdown' &&
      currElemId !== 'universe-mobile-nav-dropdown' &&
      currElemId !== 'back_buy_arr' &&
      currElemId !== 'back_resource_arr' &&
      currElemId !== 'back_universe_arr'
    ) {
      document.body.style.position = 'unset';
    }
  };

  return (
    <React.Fragment>
      <header className="header">
        <div className="container-fluid">
          <div className="header_inn">
            {showEmailModal && (
              <EmailModal
                hide={closeEmailModal}
                inputClickHandler={inputClickHandler}
                email={email}
                updateProfile={updateProfile}
                submitLoading={submitLoading}
              />
            )}

            {swapModal && (
              <AssertConverter
                showModal={swapModal}
                swapCloseModal={() => setSwapModal(false)}
              />
            )}

            <NotificationsModal
              unreadNotifications={unReadNotification}
              open={notificationsOpen}
              onCloseModal={() => setNotificationsOpen(false)}
            />
            <MenuDrawer
              open={searchInputOpen}
              onClose={() => setSearchInputOpen(false)}
              wrapperClass="pt-15"
            >
              <div className="px-2">
                <div className="flex items-center">
                  <div className="col-10 pl-0">
                    <div className={`w-full searchinput`}>
                      <input
                        type="text"
                        className="backgroup-trans
                                pl-12 pr-6 py-2 scrch_plc"
                        ref={searchRef}
                        value={searchValue}
                        onChange={onChangeSearch}
                        placeholder={t('header.search')}
                        onKeyDown={onInputSearch}
                      />
                      <img
                        src={searchicon}
                        className="search-icon"
                        onClick={onInputSearch}
                        alt="search-icon"
                      />
                    </div>
                  </div>
                  <div className="col-2 searchcolosewrp pl-0">
                    <div
                      className="text-right"
                      onClick={() => setSearchInputOpen(false)}
                    >
                      <img src={imgConstants.closeBox} alt="closeBox" />
                    </div>
                  </div>
                </div>
              </div>
            </MenuDrawer>
            <MenuDrawer
              open={walletDrawerOpen}
              onClose={() => setWalletDrawerOpen(false)}
              wrapperClass="pt-15 walletbal_popup"
              displayBgShadow={false}
            >
              <div className="flex flex-col walletbal_inn_popup">
                <div
                  className="closewallet"
                  onClick={() => setWalletDrawerOpen(false)}
                >
                  <img src={imgConstants.closeBox} alt="closeBox" />
                </div>
                {WalletOptions(true)?.map((i) => (
                  <div key={i.key} className="">
                    {i.title}
                  </div>
                ))}
              </div>
            </MenuDrawer>
            <div
              className="lg:flex items-center px-4 lg:pl-9 lg:pr-6 xl:pr-10 header_main_wrp club_head_wrp row d-flex"
              style={{ pointerEvents: hideCursor ? 'none' : 'auto' }}
            >
              <div className="text-blue d-flex items-center justify-between col-4 head_left_wrp">
                <Link to={routeMap.home} className="headlogowrp">
                  <img src={logo} alt="logo" />
                  <span>BETA</span>
                </Link>
                <div className="search_box_wrp desktop_searchbox">
                  <div className={`relative w-full searchinput`}>
                    <input
                      type="text"
                      className="backgroup-trans
                            pl-12 pr-6 py-2"
                      ref={searchRef}
                      value={searchValue}
                      onChange={onChangeSearch}
                      placeholder={t('Search NFTs...')}
                      onKeyDown={onInputSearch}
                    />
                    <img
                      src={searchicon}
                      className="search-icon"
                      onClick={onInputSearch}
                      alt="search-icon"
                    />
                  </div>
                </div>
              </div>
              <div className="justify-between  headerrightpart col-8">
                <div className="flex items-center head_menu_wrp">
                  <Nav className="align-items-center">
                    <NavDropdown
                      title="Buy"
                      id="collasible-nav-dropdown"
                      className="by_nav_dropdown"
                    >
                      <NavDropdown.Item href={buyMpwr} target="_blank">
                        Buy MPWR
                      </NavDropdown.Item>
                      <NavDropdown.Item href={buyAgov} target="_blank">
                        Buy AGOV
                      </NavDropdown.Item>
                      <NavDropdown.Item href={buyMpwrEthLP} target="_blank">
                        Buy MPWR/ETH LP
                      </NavDropdown.Item>
                      <NavDropdown.Item href={buyAgovEthLP} target="_blank">
                        Buy AGOV/ETH LP
                      </NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Earn" id="collasible-nav-dropdown">
                      <NavDropdown.Item
                        onClick={() => history.push(routeMap.rewards)}
                      >
                        Rewards
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => history.push(routeMap.agovDaoLpStaking)}
                      >
                        AGOV Migration
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => history.push(routeMap.mpwrDaoLpStaking)}
                      >
                        MPWR Migration
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => history.push(routeMap.llcMigration)}
                      >
                        LLC Migration
                      </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link onClick={() => history.push(routeMap.explore)}>
                      {t('header.explore')}
                    </Nav.Link>
                    <div>
                      {isAdmin === 'old Admin' ? (
                        <Nav.Link
                          href="#"
                          onClick={() =>
                            addToast(
                              'Old Admin can not Create new collectible',
                              {
                                appearance: 'success',
                                autoDismiss: true,
                              },
                            )
                          }
                        >
                          Create
                        </Nav.Link>
                      ) : (
                        profile_details &&
                        isConnected && (
                          <Nav.Link href="#" onClick={onCLickCreate}>
                            Create
                          </Nav.Link>
                        )
                      )}
                    </div>

                    <NavDropdown title="Resources" id="collasible-nav-dropdown">
                      <NavDropdown.Item
                        onClick={() => history.push(routeMap.about)}
                      >
                        About ClubRare
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="https://docs.clubrare.xyz/"
                        target="_blank"
                      >
                        Docs & Guides
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="https://docs.clubrare.xyz/marketplace-user-guide/physical-authentication"
                        target="_blank"
                      >
                        Authentications
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="https://docs.clubrare.xyz/roadmap"
                        target="_blank"
                      >
                        Roadmap
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => history.push(routeMap.careers)}
                      >
                        Careers
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => history.push(routeMap.support)}
                      >
                        Support
                      </NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Universe" id="collasible-nav-dropdown">
                      <NavDropdown.Item
                        href="https://mpwr.clubrare.xyz/"
                        target="_blank"
                      >
                        MPWR Token
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="https://agov.clubrare.xyz/"
                        target="_blank"
                      >
                        AGOV Token
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="https://lazyleoclub.com/"
                        target="_blank"
                      >
                        Lazy Leo Club
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="https://farm.clubrare.xyz/"
                        target="_blank"
                      >
                        DeFi Farm
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#" onClick={commingSoon}>
                        ClubRare Metaverse
                      </NavDropdown.Item>
                      <NavDropdown.Divider className="clubimg_wrp" />
                      <div className="universe_imgwrp d-flex">
                        <a
                          href="https://twitter.com/clubrare_nft"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img src={imgConstants.twitter_1} alt="twitter" />
                        </a>
                        <a
                          href="https://discord.gg/clubrare"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img src={imgConstants.discord} alt="discord" />
                        </a>
                        <a
                          href="https://medium.com/@clubrare"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img src={imgConstants.mediumLogo} alt="mediumLogo" />
                        </a>
                      </div>
                    </NavDropdown>
                    {isConnected && (
                      <NavDropdown
                        className="profile_dropdown"
                        title={
                          <img
                            src={
                              profile_details && profile_details?.image
                                ? profile_details?.image
                                : imgConstants.avatar
                            }
                            alt="user pic"
                          />
                        }
                        id="collasible-nav-dropdown"
                      >
                        <NavDropdown.Item
                          href="#"
                          className="flex gap-2"
                          onClick={() => history.push(`/${wallet_address}`)}
                        >
                          <img
                            src={imgConstants.clubprofile}
                            alt="clubprofile"
                          />{' '}
                          Profile
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#"
                          className="flex gap-2"
                          onClick={() =>
                            history.replace({
                              pathname: `/${wallet_address}`,
                              state: `favorites-${Math.random()}`,
                            })
                          }
                        >
                          <img
                            src={imgConstants.clubfavorites}
                            alt="clubfavorites"
                          />{' '}
                          Favorites
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#"
                          className="flex gap-2"
                          onClick={() => history.push(`/${wallet_address}`)}
                        >
                          <img src={imgConstants.clubitem} alt="clubitem" />
                          Items
                        </NavDropdown.Item>

                        {profile_details?.isWhiteListedSeller ? (
                          <NavDropdown.Item
                            href="#"
                            className="flex gap-2"
                            onClick={() => history.push('/view-sells')}
                          >
                            <img src={imgConstants.clubitem} alt="clubitem" />
                            View-Sells
                          </NavDropdown.Item>
                        ) : (
                          ''
                        )}

                        <NavDropdown.Item
                          href="#"
                          className="flex gap-2"
                          onClick={() => history.push('/profile/edit')}
                        >
                          <img src={imgConstants.clubedit} alt="clubedit" />
                          Edit Profile
                        </NavDropdown.Item>
                        {/* <NavDropdown.Item
                          href="#"
                          className="flex gap-2"
                          onClick={() => history.push("/agov-dao-lp-staking")}
                        >
                          <img src={imgConstants.userList} alt="userList" />
                          AGOV Staking
                        </NavDropdown.Item> */}
                        {profile_details?.isPresaleAdmin &&
                          profile_details?.network_id == '1' && (
                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() => goToAdmin(routeMap.presale)}
                            >
                              <img
                                src={imgConstants.clubSignOut}
                                alt="clubSignOut"
                              />
                              Presale Settings
                            </NavDropdown.Item>
                          )}
                        {profile_details?.isStakeAdmin &&
                          profile_details?.network_id == '1' && (
                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() => goToAdmin(routeMap.stake)}
                            >
                              <img src={coinImg} alt="coinImg" />
                              Stake Setting
                            </NavDropdown.Item>
                          )}
                        {(profile_details?.role === 'admin' ||
                          profile_details?.isSuperAdmin) && (
                          <NavDropdown.Item
                            href="#"
                            className="flex gap-2"
                            onClick={() => goToAdmin(routeMap.whitelistSeller)}
                          >
                            <img src={imgConstants.userList} alt="userList" />
                            Whitelist Seller
                          </NavDropdown.Item>
                        )}
                        {(profile_details?.role === 'admin' ||
                          profile_details?.isSuperAdmin) && (
                          <NavDropdown.Item
                            href="#"
                            className="flex gap-2 catmenu"
                            onClick={() => goToAdmin(routeMap.category)}
                          >
                            <img src={catImg} alt="coinImg" />
                            Category
                          </NavDropdown.Item>
                        )}
                        {(profile_details?.role === 'admin' ||
                          profile_details?.isSuperAdmin) && (
                          <NavDropdown.Item
                            href="#"
                            className="flex gap-2 catmenu"
                            onClick={() =>
                              goToAdmin(routeMap.backgroundTemplate)
                            }
                          >
                            <img src={catImg} alt="coinImg" />
                            Background Template
                          </NavDropdown.Item>
                        )}
                        {(profile_details?.role === 'admin' ||
                          profile_details?.isSuperAdmin) && (
                          <NavDropdown.Item
                            href="#"
                            className="flex gap-2 catmenu"
                            onClick={() => goToAdmin(routeMap.color)}
                          >
                            <img src={catImg} alt="coinImg" />
                            Color
                          </NavDropdown.Item>
                        )}
                        {(profile_details?.role === 'admin' ||
                          profile_details?.isSuperAdmin) && (
                          <NavDropdown.Item
                            href="#"
                            onClick={() => goToAdmin(routeMap.adminWarehouse)}
                            className="flex gap-2 catmenu"
                          >
                            <img src={catImg} alt="coinImg" />
                            Ware House
                          </NavDropdown.Item>
                        )}

                        {(profile_details?.role === 'admin' ||
                          profile_details?.isSuperAdmin) && (
                          <React.Fragment>
                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() => goToAdmin(routeMap.redeemList)}
                            >
                              <img
                                src={imgConstants.redeemList}
                                alt="redeemList"
                              />{' '}
                              Redeem List
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() => goToAdmin(routeMap.reportsList)}
                            >
                              <img src={imgConstants.reports} alt="reports" />{' '}
                              Reports
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() => goToAdmin(routeMap.approveList)}
                            >
                              <img
                                src={imgConstants.approvalList}
                                alt="approvalList"
                              />{' '}
                              Approval List
                            </NavDropdown.Item>

                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() => goToAdmin(routeMap.statsReports)}
                            >
                              <img
                                src={imgConstants.clubitem}
                                alt="statsReports"
                              />{' '}
                              Stats Report
                            </NavDropdown.Item>

                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() =>
                                goToAdmin(routeMap.adminSellReport)
                              }
                            >
                              <img
                                src={imgConstants.clubitem}
                                alt="statsReports"
                              />{' '}
                              Sells Report
                            </NavDropdown.Item>

                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() =>
                                goToAdmin(routeMap.adminallItemReport)
                              }
                            >
                              <img src={imgConstants.clubitem} alt="Reports" />{' '}
                              All Item Report
                            </NavDropdown.Item>

                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() =>
                                goToAdmin(routeMap.escrowlistReport)
                              }
                            >
                              <img src={imgConstants.clubitem} alt="Reports" />{' '}
                              Escrow Report
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() =>
                                goToAdmin(routeMap.vaultItemListReport)
                              }
                            >
                              <img src={imgConstants.clubitem} alt="Reports" />{' '}
                              Vault Item Report
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() =>
                                goToAdmin(routeMap.authenticationPurchase)
                              }
                            >
                              <img
                                src={imgConstants.clubitem}
                                alt="authenticationPurchase"
                              />{' '}
                              Authentication Lists
                            </NavDropdown.Item>

                            <NavDropdown.Item
                              href="#"
                              className="flex gap-2"
                              onClick={() =>
                                goToAdmin(routeMap.spaceLists)
                              }
                            >
                              <img
                                src={imgConstants.clubitem}
                                alt="spaceLists"
                              />{' '}
                              Space Lists
                            </NavDropdown.Item>
                          </React.Fragment>
                        )}
                        {profile_details?.isSuperAdmin && (
                          <NavDropdown.Item
                            href="#"
                            className="flex gap-2"
                            onClick={() => goToAdmin('/user-list')}
                          >
                            <img src={imgConstants.userList} alt="userList" />
                            UserList
                          </NavDropdown.Item>
                        )}
                        <NavDropdown.Item
                          href="#"
                          className="flex gap-2"
                          onClick={disconnetWallet}
                        >
                          <img
                            src={imgConstants.clubSignOut}
                            alt="clubSignOut"
                          />
                          Sign Out
                        </NavDropdown.Item>
                        <NavDropdown.Divider className="clubimg_wrp" />
                        <p className="prfl_balance text-right">BALANCE</p>
                        <div className="row ">
                          <div className="col-4 clubrofile_left">
                            <img
                              src={
                                localStorage.getItem('networkId') ===
                                process.env.REACT_APP_KLATYN_NETWORK_ID
                                  ? imgConstants.klaytn
                                  : imgConstants.balanceIcon
                              }
                              alt="klaytn"
                            />
                          </div>
                          <div className="col-8 clubrofile_right text-right">
                            <h6>
                              {ethBalance}{' '}
                              {localStorage.getItem('networkId') ===
                              process.env.REACT_APP_KLATYN_NETWORK_ID
                                ? 'KLAY'
                                : 'ETH'}
                            </h6>
                            <p>${dollarAmt} USD</p>
                          </div>
                        </div>
                        <NavDropdown.Divider className="my-0" />
                        {localStorage.getItem('networkId') !==
                        process.env.REACT_APP_KLATYN_NETWORK_ID ? (
                          <NavDropdown.Item href="#" className="swap_ethitem">
                            <div className="swap_btn_wrp mt-3">
                              <button
                                className="blkfull_btn"
                                onClick={() => setSwapModal(true)}
                              >
                                Swap ETH/WETH
                              </button>
                            </div>
                          </NavDropdown.Item>
                        ) : (
                          ''
                        )}
                      </NavDropdown>
                    )}
                    {isConnected && (
                      <div>
                        <button className="network_dropdown">
                          {networkId ===
                          process.env.REACT_APP_KLATYN_NETWORK_ID ? (
                            <>
                              <img
                                className="w-5"
                                src={imgConstants.kaikas}
                                alt=""
                              />
                              <span>Klaytn</span>
                            </>
                          ) : (
                            <>
                              <img
                                className="w-5"
                                src={imgConstants.metamaskIcon}
                                alt=""
                              />
                              <span>Ethereum</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {!isConnected && (
                      <Nav.Link className="btnnav_link">
                        <div className="clubheader_btnwrp">
                          <button
                            type="button"
                            className="headbtn"
                            onClick={() => history.push('/connect-wallet')}
                          >
                            Connect
                          </button>
                        </div>
                      </Nav.Link>
                    )}
                    <NavDropdown
                      title="V1"
                      id="collasible-nav-dropdown"
                      className="switcher-v1"
                    >
                      <NavDropdown.Item
                        href={process.env.REACT_APP_V2_URL}
                      >
                        V2
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </div>

                {isConnected && (
                  <div className="flex club_notifi_icon_wrp">
                    <div className="">
                      <Dropdown className="main_drop_noti alert_noti" id="noti">
                        <Dropdown.Toggle className="bck_clr tglt_clr position-relative">
                          {notify.length > 0 ? (
                            <h6 className="bages_cls">{readcount}</h6>
                          ) : null}

                          <svg
                            width="16"
                            height="20"
                            viewBox="0 0 16 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 20C9.1 20 10 19.1 10 18H6C6 19.1 6.9 20 8 20ZM14 14V9C14 5.93 12.37 3.36 9.5 2.68V2C9.5 1.17 8.83 0.5 8 0.5C7.17 0.5 6.5 1.17 6.5 2V2.68C3.64 3.36 2 5.92 2 9V14L0 16V17H16V16L14 14ZM12 15H4V9C4 6.52 5.51 4.5 8 4.5C10.49 4.5 12 6.52 12 9V15Z"
                              fill="#4C4D4C"
                            />
                          </svg>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className=" clubrare_dropdown_option notificat_dropdown py-2">
                          {notify?.length > 0 ? (
                            <div>
                              <div>
                                <Dropdown.Item className="relative mobilenothead menu_close_wrp">
                                  <Link
                                    to={routeMap.home}
                                    className="headlogowrp notification_logo"
                                  >
                                    <img src={logo} alt="logo" />
                                    <span>BETA</span>
                                  </Link>
                                  <button className="menu_close"></button>
                                </Dropdown.Item>

                                <div className="notifi_head d-flex justify-content-start mb-3">
                                  <h1 className="w-50">Notifications</h1>
                                  <div className="w-50 text-right">
                                    <button
                                      type="button"
                                      onClick={() => allreadfunnoti()}
                                    >
                                      Mark as Read
                                    </button>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between pr-3"></div>

                                <div
                                  className=" scrolladdclss"
                                  onScroll={handledata}
                                >
                                  {
                                    <>
                                      {notify?.map((val: any, i: any) => {
                                        const {
                                          isRead,
                                          title,
                                          content,
                                          created_on,
                                        }: any = val;
                                        return (
                                          <div
                                            key={i}
                                            className={
                                              isRead === false
                                                ? 'cursor-pointer cmnn_cls activenoti'
                                                : 'falseclss cmnn_cls'
                                            }
                                            onClick={() =>
                                              readSingalNoti(val, i)
                                            }
                                          >
                                            <h1 className="text-left ttle_one font-ttle noti_innhead">
                                              {' '}
                                              {title}{' '}
                                            </h1>
                                            <h2 className=" ttle_twp">
                                              {' '}
                                              {content}{' '}
                                            </h2>
                                            <p>
                                              <TimeAgo datetime={created_on} />
                                            </p>
                                          </div>
                                        );
                                      })}
                                      {isMoreData ? (
                                        ''
                                      ) : (
                                        <div className="text-center my-2 font-weight-bolder ">
                                          {' '}
                                          No More Notification{' '}
                                        </div>
                                      )}
                                      {loader ? <LoaderScroll /> : ''}
                                    </>
                                  }
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <Dropdown.Item className="menu_close_wrp">
                                <h2 className="mt-2 text-center no_show_noti mb-2">
                                  {' '}
                                  Notifications
                                </h2>
                                <button className="menu_close"></button>
                              </Dropdown.Item>
                              <div className="text-14 nonotificationwrp"></div>
                              <h6 className="text-center">
                                No new notifications
                              </h6>
                            </div>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                )}
                <div className="flex items-center check_this"></div>
              </div>
              <div className="row mobile_view">
                <div className=" mobile_view_left_wrp">
                  <Link to={routeMap.home} className="headlogowrp">
                    <img src={logo} alt="logo" />
                    <span>BETA</span>
                  </Link>
                </div>
                <div className="mobile_view_right_wrp">
                  <div className="mobile_view_right_inner">
                    <div className="search_box_wrp desktop_searchbox">
                      <div className={`relative w-full searchinput`}>
                        <input
                          type="text"
                          className="backgroup-trans
                                            pl-12 pr-6 py-2"
                          ref={searchRef}
                          value={searchValue}
                          onChange={onChangeSearch}
                          placeholder={t('Search NFTs...')}
                          onKeyDown={onInputSearch}
                        />
                        <img
                          src={searchicon}
                          className="search-icon"
                          onClick={onInputSearch}
                          alt="search-icon"
                        />
                      </div>
                    </div>
                    <div
                      id="search-box-responsive-wrp"
                      className={`responsive_searchbox ${
                        isConnected ? 'responsive_searchbox_wrp' : ''
                      }`}
                    >
                      <Dropdown
                        id="dropdown-basic-button"
                        align="end"
                        title="cancel"
                      >
                        <div onClick={() => handleMenuOpen()} className="">
                          <Dropdown.Toggle
                            className=""
                            id="dropdown-basic-button"
                          ></Dropdown.Toggle>
                        </div>

                        <Dropdown.Menu
                          className={`${
                            hideSearchPopup ? 'hide-search-popup-wrp' : ''
                          } clubrare_dropdown_option notificat_dropdown search_dropdown_new_icon py-2`}
                        >
                          <div className="responsive-search-new-wrp">
                            <div className="search_box_wrp">
                              <div className={`relative w-full searchinput`}>
                                <input
                                  type="text"
                                  className="backgroup-trans
                                              pl-12 pr-6 py-2"
                                  ref={searchRef}
                                  value={searchValue}
                                  onChange={onChangeSearch}
                                  placeholder={t('header.search')}
                                  onKeyDown={onInputSearch}
                                />
                                <img
                                  src={searchicon}
                                  id="search-icon-unique"
                                  className="search-icon"
                                  onClick={onInputSearch}
                                  alt="search-icon"
                                />
                              </div>
                            </div>
                            <Dropdown.Item className="menu_close_wrp">
                              <button
                                className="menu_cancel"
                                onClick={handleMenuClose}
                              >
                                cancel
                              </button>
                            </Dropdown.Item>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="mobile_notification">
                      {isConnected && (
                        <div className="flex club_notifi_icon_wrp">
                          <div className="">
                            <Dropdown
                              className="main_drop_noti alert_noti"
                              id="noti"
                            >
                              <div
                                onClick={() => handleMenuOpen()}
                                className="main_drop_noti alert_noti"
                              >
                                <Dropdown.Toggle className="bck_clr tglt_clr position-relative">
                                  {notify.length > 0 ? (
                                    <h6 className="bages_cls">{readcount}</h6>
                                  ) : null}

                                  <svg
                                    width="16"
                                    height="20"
                                    viewBox="0 0 16 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8 20C9.1 20 10 19.1 10 18H6C6 19.1 6.9 20 8 20ZM14 14V9C14 5.93 12.37 3.36 9.5 2.68V2C9.5 1.17 8.83 0.5 8 0.5C7.17 0.5 6.5 1.17 6.5 2V2.68C3.64 3.36 2 5.92 2 9V14L0 16V17H16V16L14 14ZM12 15H4V9C4 6.52 5.51 4.5 8 4.5C10.49 4.5 12 6.52 12 9V15Z"
                                      fill="#4C4D4C"
                                    />
                                  </svg>
                                </Dropdown.Toggle>
                              </div>

                              <Dropdown.Menu
                                onClick={handleMenuClose}
                                className=" clubrare_dropdown_option notificat_dropdown py-2"
                              >
                                {notify?.length > 0 ? (
                                  <div>
                                    <div>
                                      <Dropdown.Item className="relative mobilenothead menu_close_wrp">
                                        <Link
                                          to={routeMap.home}
                                          className="headlogowrp notification_logo"
                                        >
                                          <img src={logo} alt="logo" />
                                          <span>BETA</span>
                                        </Link>
                                        <button
                                          className="closenotimobile"
                                          id="close_menu"
                                        ></button>
                                      </Dropdown.Item>

                                      <div className="notifi_head d-flex justify-content-start mb-3">
                                        <h1 className="w-50">Notifications</h1>
                                        <div className="w-50 text-right">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              mobileallreadfunnoti()
                                            }
                                          >
                                            Mark as Read
                                          </button>
                                        </div>
                                      </div>
                                      <div className="d-flex justify-content-between pr-3"></div>

                                      <div
                                        className=" scrolladdclss"
                                        onScroll={handledata}
                                      >
                                        {
                                          <>
                                            {notify?.map((val: any, i: any) => {
                                              const {
                                                isRead,
                                                title,
                                                content,
                                                created_on,
                                              }: any = val;
                                              return (
                                                <div
                                                  // className={
                                                  //   isRead === false
                                                  //     ? `border py-3 mt-3 falseclss ${notifyclr}`
                                                  //     : `border py-3 mt-3 cursor-pointer ${notifyclr}`
                                                  // }
                                                  key={i}
                                                  className={
                                                    isRead === false
                                                      ? 'cursor-pointer cmnn_cls activenoti'
                                                      : 'falseclss cmnn_cls'
                                                  }
                                                  onClick={() =>
                                                    readSingalNoti(val, i)
                                                  }
                                                >
                                                  <h1 className="text-left ttle_one font-ttle noti_innhead">
                                                    {' '}
                                                    {title}{' '}
                                                  </h1>
                                                  <h2 className=" ttle_twp">
                                                    {' '}
                                                    {content}{' '}
                                                  </h2>
                                                  <p>
                                                    <TimeAgo
                                                      datetime={created_on}
                                                    />
                                                  </p>
                                                </div>
                                              );
                                            })}
                                            {isMoreData ? (
                                              ''
                                            ) : (
                                              <div className="text-center my-2 font-weight-bolder ">
                                                {' '}
                                                No More Notification{' '}
                                              </div>
                                            )}
                                            {loader ? <LoaderScroll /> : ''}
                                          </>
                                        }
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <Dropdown.Item className="menu_close_wrp">
                                      <h2 className="mt-2 text-center no_show_noti mb-2">
                                        {' '}
                                        Notifications
                                      </h2>
                                      <button className="menu_close"></button>
                                    </Dropdown.Item>
                                    <div className="text-14 nonotificationwrp"></div>
                                    <h6 className="text-center">
                                      No new notifications
                                    </h6>
                                  </div>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                      )}
                    </div>
                    {isConnected && (
                      <div className="mobile_network_switch_outside">
                        <button className="network_dropdown">
                          {networkId ===
                          process.env.REACT_APP_KLATYN_NETWORK_ID ? (
                            <>
                              <img
                                className="w-5"
                                src={imgConstants.kaikas}
                                alt=""
                              />
                              <span>Klaytn</span>
                            </>
                          ) : (
                            <>
                              <img
                                className="w-5"
                                src={imgConstants.metamaskIcon}
                                alt=""
                              />
                              <span>Ethereum</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    <div className="mobile_menu_dropdowns">
                      <Dropdown
                        id="dropdown-basic-button"
                        align="end"
                        title="cancel"
                      >
                        <div onClick={() => handleMenuOpen()} className="">
                          <Dropdown.Toggle
                            className=""
                            id="dropdown-basic-button"
                          ></Dropdown.Toggle>
                        </div>

                        <Dropdown.Menu
                          onClick={handleMenuClose}
                          className=" clubrare_dropdown_option notificat_dropdown py-2"
                        >
                          <Dropdown.Item className="menu_close_wrp">
                            <Link to={routeMap.home} className="headlogowrp">
                              <img src={logo} alt="" />
                              <span>BETA</span>
                            </Link>
                            <div className="d-flex">
                              {isConnected && (
                                <div className="mobile_network_switch_inside">
                                  <button className="network_dropdown">
                                    {networkId ===
                                    process.env.REACT_APP_KLATYN_NETWORK_ID ? (
                                      <>
                                        <img
                                          className="w-5"
                                          src={imgConstants.kaikas}
                                          alt=""
                                        />
                                        <span>Klaytn</span>
                                      </>
                                    ) : (
                                      <>
                                        <img
                                          className="w-5"
                                          src={imgConstants.metamaskIcon}
                                          alt=""
                                        />
                                        <span>Ethereum</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                              <button className="menu_close"></button>
                            </div>
                          </Dropdown.Item>
                          <div
                            className="dropdown-item"
                            title="Resources"
                            id="collasible-nav-dropdown"
                          >
                            <Nav>
                              <NavDropdown
                                className="dropdown_menu"
                                title="Buy"
                                id="buy-mobile-nav-dropdown"
                              >
                                <Dropdown.Item className="menu_close_wrp">
                                  <Link
                                    to={routeMap.home}
                                    className="headlogowrp"
                                  >
                                    <img src={logo} alt="" />
                                    <span>BETA</span>
                                  </Link>
                                  <button
                                    className="menu_close"
                                    id="back_buy_arr"
                                  ></button>
                                </Dropdown.Item>
                                <NavDropdown.Item className="dropdown_menu_heading">
                                  Buy
                                  <img
                                    src={imgConstants.arrowleft}
                                    alt="arrowleft"
                                    id="back_buy_arr"
                                  />
                                </NavDropdown.Item>

                                <NavDropdown.Item
                                  href={buyMpwr}
                                  target="_blank"
                                >
                                  Buy MPWR
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href={buyAgov}
                                  target="_blank"
                                >
                                  Buy AGOV
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href={buyMpwrEthLP}
                                  target="_blank"
                                >
                                  Buy MPWR/ETH LP
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href={buyAgovEthLP}
                                  target="_blank"
                                >
                                  Buy AGOV/ETH LP
                                </NavDropdown.Item>
                                <NavDropdown.Divider className="clubimg_wrp" />
                                <div className="universe_imgwrp d-flex">
                                  <a
                                    href="https://t.me/ANSWER_GOVERNANCE"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.telegram}
                                      alt="telegram"
                                    />
                                  </a>
                                  <a
                                    href="https://twitter.com/clubrare_nft"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.twitter_1}
                                      alt="twitter"
                                    />
                                  </a>
                                  <a
                                    href="https://discord.gg/clubrare"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img src={imgConstants.discord} alt="" />
                                  </a>
                                  <a
                                    href="https://medium.com/@clubrare"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.mediumLogo}
                                      alt="mediumLogo"
                                    />
                                  </a>
                                </div>
                              </NavDropdown>
                            </Nav>
                          </div>

                          <div
                            className="dropdown-item"
                            title="Earn"
                            id="collasible-nav-dropdown"
                          >
                            <Nav>
                              <NavDropdown
                                className="dropdown_menu"
                                title="Earn"
                                id="resource-mobile-nav-dropdown"
                              >
                                <Dropdown.Item className="menu_close_wrp">
                                  <Link
                                    to={routeMap.home}
                                    className="headlogowrp"
                                  >
                                    <img src={logo} alt="" />
                                    <span>BETA</span>
                                  </Link>
                                  <button
                                    className="menu_close"
                                    id="back_resource_arr"
                                  ></button>
                                </Dropdown.Item>
                                <NavDropdown.Item className="dropdown_menu_heading">
                                  Earn
                                  <img
                                    src={imgConstants.arrowleft}
                                    alt="arrowleft"
                                    id="back_resource_arr"
                                  />
                                </NavDropdown.Item>

                                <NavDropdown.Item
                                  onClick={() => history.push(routeMap.rewards)}
                                >
                                  Rewards
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  onClick={() =>
                                    history.push(routeMap.agovDaoLpStaking)
                                  }
                                >
                                  AGOV Migration
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  onClick={() =>
                                    history.push(routeMap.mpwrDaoLpStaking)
                                  }
                                >
                                  MPWR Migration
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  onClick={() =>
                                    history.push(routeMap.llcMigration)
                                  }
                                >
                                  LLC Migration
                                </NavDropdown.Item>
                                <NavDropdown.Divider className="clubimg_wrp" />
                                <div className="universe_imgwrp d-flex">
                                  <a
                                    href="https://t.me/ANSWER_GOVERNANCE"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.telegram}
                                      alt="telegram"
                                    />
                                  </a>
                                  <a
                                    href="https://twitter.com/clubrare_nft"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.twitter_1}
                                      alt="twitter_1"
                                    />
                                  </a>
                                  <a
                                    href="https://discord.gg/clubrare"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img src={imgConstants.discord} alt="" />
                                  </a>
                                  <a
                                    href="https://medium.com/@clubrare"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.mediumLogo}
                                      alt="mediumLogo"
                                    />
                                  </a>
                                </div>
                              </NavDropdown>
                            </Nav>
                          </div>
                          <Dropdown.Item>
                            <Nav>
                              <Nav.Link
                                onClick={() => history.push(routeMap.explore)}
                              >
                                {t('header.explore')}
                              </Nav.Link>
                            </Nav>
                          </Dropdown.Item>
                          <div className="dropdown-item">
                            {isAdmin === 'old Admin' ? (
                              <Nav.Link
                                href="#"
                                onClick={() =>
                                  addToast(
                                    'Old Admin can not Create new collectible',
                                    {
                                      appearance: 'success',
                                      autoDismiss: true,
                                    },
                                  )
                                }
                              >
                                Create
                              </Nav.Link>
                            ) : profile_details?.role === 'admin' ||
                              profile_details?.isSuperAdmin ? (
                              <Nav.Link href="#" onClick={onCLickCreate}>
                                Create
                              </Nav.Link>
                            ) : profile_details?.isWhiteListedSeller ? null : (
                              <Nav.Link href="#" onClick={onCLickCreate}>
                                Create
                              </Nav.Link>
                            )}
                          </div>

                          <div
                            className="dropdown-item"
                            title="Resources"
                            id="collasible-nav-dropdown"
                          >
                            <Nav>
                              <NavDropdown
                                className="dropdown_menu"
                                title="Resources"
                                id="resource-mobile-nav-dropdown"
                              >
                                <Dropdown.Item className="menu_close_wrp">
                                  <Link
                                    to={routeMap.home}
                                    className="headlogowrp"
                                  >
                                    <img src={logo} alt="" />
                                    <span>BETA</span>
                                  </Link>
                                  <button
                                    className="menu_close"
                                    id="back_resource_arr"
                                  ></button>
                                </Dropdown.Item>
                                <NavDropdown.Item className="dropdown_menu_heading">
                                  Resources
                                  <img
                                    src={imgConstants.arrowleft}
                                    alt="arrowleft"
                                    id="back_resource_arr"
                                  />
                                </NavDropdown.Item>

                                <NavDropdown.Item
                                  onClick={() => history.push(routeMap.about)}
                                >
                                  About ClubRare
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href="https://docs.clubrare.xyz/"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Docs & Guides
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href="https://docs.clubrare.xyz/marketplace-user-guide/physical-authentication"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Authentications
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href="https://docs.clubrare.xyz/roadmap"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Roadmap
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  onClick={() => history.push(routeMap.careers)}
                                >
                                  Careers
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  onClick={() => history.push(routeMap.support)}
                                >
                                  Support
                                </NavDropdown.Item>
                                <NavDropdown.Divider className="clubimg_wrp" />
                                <div className="universe_imgwrp d-flex">
                                  <a
                                    href="https://t.me/ANSWER_GOVERNANCE"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.telegram}
                                      alt="telegram"
                                    />
                                  </a>
                                  <a
                                    href="https://twitter.com/clubrare_nft"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.twitter_1}
                                      alt="twitter_1"
                                    />
                                  </a>
                                  <a
                                    href="https://discord.gg/clubrare"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img src={imgConstants.discord} alt="" />
                                  </a>
                                  <a
                                    href="https://medium.com/@clubrare"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.mediumLogo}
                                      alt="mediumLogo"
                                    />
                                  </a>
                                </div>
                              </NavDropdown>
                            </Nav>
                          </div>

                          <div
                            className="dropdown-item"
                            title="Universe"
                            id="collasible-nav-dropdown"
                          >
                            <Nav>
                              <NavDropdown
                                className="dropdown_menu"
                                title="Universe"
                                id="universe-mobile-nav-dropdown"
                              >
                                <Dropdown.Item className="menu_close_wrp">
                                  <Link
                                    to={routeMap.home}
                                    className="headlogowrp"
                                  >
                                    <img src={logo} alt="" />
                                    <span>BETA</span>
                                  </Link>
                                  <button
                                    className="menu_close"
                                    id="back_universe_arr"
                                  ></button>
                                </Dropdown.Item>
                                <NavDropdown.Item className="dropdown_menu_heading">
                                  Universe{' '}
                                  <img
                                    src={imgConstants.arrowleft}
                                    id="back_universe_arr"
                                    alt="arrowleft"
                                  />
                                </NavDropdown.Item>

                                <NavDropdown.Item
                                  href="https://mpwr.clubrare.xyz/"
                                  target="_blank"
                                >
                                  MPWR Token
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href="https://agov.clubrare.xyz/"
                                  target="_blank"
                                >
                                  AGOV Token
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href="https://lazyleoclub.com/"
                                  target="_blank"
                                >
                                  Lazy Leo Club
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href="https://farm.clubrare.xyz/"
                                  target="_blank"
                                >
                                  DeFi Farm
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                  href="#"
                                  onClick={commingSoon}
                                >
                                  {' '}
                                  ClubRare Metaverse
                                </NavDropdown.Item>
                                <NavDropdown.Divider className="clubimg_wrp" />
                                <div className="universe_imgwrp asd d-flex">
                                  <a
                                    href="https://twitter.com/clubrare_nft"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.twitter_1}
                                      alt="twitter_1"
                                    />
                                  </a>
                                  <a
                                    href="https://discord.gg/clubrare"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img src={imgConstants.discord} alt="" />
                                  </a>
                                  <a
                                    href="https://medium.com/@clubrare"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={imgConstants.mediumLogo}
                                      alt="mediumLogo"
                                    />
                                  </a>
                                </div>
                              </NavDropdown>
                            </Nav>
                          </div>
                          <div
                            className="dropdown-item"
                            title="Universe"
                            id="collasible-nav-dropdown"
                          >
                            <Nav>
                              <NavDropdown
                                title="V1"
                                id="collasible-nav-dropdown"
                              >
                                <NavDropdown.Item
                                  href={process.env.REACT_APP_V2_URL}
                                >
                                  V2
                                </NavDropdown.Item>
                              </NavDropdown>
                            </Nav>
                          </div>
                          <Dropdown.Item href="">
                            <Nav>
                              {!isConnected && (
                                <Nav.Link className="btnnav_link">
                                  <div className="clubheader_btnwrp">
                                    <button
                                      type="button"
                                      className="headbtn"
                                      onClick={() =>
                                        history.push('/connect-wallet')
                                      }
                                    >
                                      Connect
                                    </button>
                                  </div>
                                </Nav.Link>
                              )}
                            </Nav>
                          </Dropdown.Item>
                          {isConnected && (
                            <div className="responsive_connected_wallet">
                              <Dropdown.Item href="">
                                <Nav>
                                  <NavDropdown.Item
                                    href="#"
                                    className="flex gap-2"
                                    onClick={() =>
                                      history.push(`/${wallet_address}`)
                                    }
                                  >
                                    <img
                                      src={imgConstants.clubprofile}
                                      alt="clubprofile"
                                    />{' '}
                                    Profile
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    href="#"
                                    className="flex gap-2"
                                    onClick={() =>
                                      history.replace({
                                        pathname: `/${wallet_address}`,
                                        state: `favorites-${Math.random()}`,
                                      })
                                    }
                                  >
                                    <img
                                      src={imgConstants.clubfavorites}
                                      alt="clubfavorites"
                                    />{' '}
                                    Favorites
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    href="#"
                                    className="flex gap-2"
                                    onClick={() =>
                                      history.push(`/${wallet_address}`)
                                    }
                                  >
                                    <img
                                      src={imgConstants.clubitem}
                                      alt="clubitem"
                                    />
                                    Items
                                  </NavDropdown.Item>
                                  <NavDropdown.Item
                                    href="#"
                                    className="flex gap-2"
                                    onClick={() =>
                                      history.push('/profile/edit')
                                    }
                                  >
                                    <img
                                      src={imgConstants.clubedit}
                                      alt="clubedit"
                                    />
                                    Edit Profile
                                  </NavDropdown.Item>
                                  {profile_details?.isPresaleAdmin &&
                                    profile_details?.network_id == '1' && (
                                      <NavDropdown.Item
                                        href="#"
                                        className="flex gap-2"
                                        onClick={() =>
                                          goToAdmin(routeMap.presale)
                                        }
                                      >
                                        <img
                                          src={imgConstants.clubSignOut}
                                          alt=""
                                        />
                                        Presale Settings
                                      </NavDropdown.Item>
                                    )}
                                  {(profile_details?.role === 'admin' ||
                                    profile_details?.isSuperAdmin) && (
                                    <NavDropdown.Item
                                      href="#"
                                      className="flex gap-2"
                                      onClick={() =>
                                        goToAdmin(routeMap.whitelistSeller)
                                      }
                                    >
                                      <img
                                        src={imgConstants.userList}
                                        alt="userList"
                                      />
                                      Whitelist Seller
                                    </NavDropdown.Item>
                                  )}
                                  {(profile_details?.role === 'admin' ||
                                    profile_details?.isSuperAdmin) && (
                                    <NavDropdown.Item
                                      href="#"
                                      className="flex gap-2 catmenu"
                                      onClick={() =>
                                        goToAdmin(routeMap.category)
                                      }
                                    >
                                      <img src={catImg} alt="" />
                                      Category
                                    </NavDropdown.Item>
                                  )}
                                  {(profile_details?.role === 'admin' ||
                                    profile_details?.isSuperAdmin) && (
                                    <NavDropdown.Item
                                      href="#"
                                      className="flex gap-2 catmenu"
                                      onClick={() =>
                                        goToAdmin(routeMap.backgroundTemplate)
                                      }
                                    >
                                      <img src={catImg} alt="coinImg" />
                                      Background Template
                                    </NavDropdown.Item>
                                  )}
                                  {(profile_details?.role === 'admin' ||
                                    profile_details?.isSuperAdmin) && (
                                    <NavDropdown.Item
                                      href="#"
                                      className="flex gap-2 catmenu"
                                      onClick={() => goToAdmin(routeMap.color)}
                                    >
                                      <img src={catImg} alt="coinImg" />
                                      Color
                                    </NavDropdown.Item>
                                  )}
                                  {(profile_details?.role === 'admin' ||
                                    profile_details?.isSuperAdmin) && (
                                    <NavDropdown.Item
                                      href="#"
                                      className="flex gap-2 catmenu"
                                      onClick={() =>
                                        goToAdmin(routeMap.adminWarehouse)
                                      }
                                    >
                                      <img src={catImg} alt="" />
                                      Ware House
                                    </NavDropdown.Item>
                                  )}
                                  {(profile_details?.role === 'admin' ||
                                    profile_details?.isSuperAdmin) && (
                                    <React.Fragment>
                                      <NavDropdown.Item
                                        href="#"
                                        className="flex gap-2"
                                        onClick={() =>
                                          goToAdmin(routeMap.redeemList)
                                        }
                                      >
                                        <img
                                          src={imgConstants.redeemList}
                                          alt="redeemList"
                                        />{' '}
                                        Redeem List........
                                      </NavDropdown.Item>
                                      <NavDropdown.Item
                                        href="#"
                                        className="flex gap-2"
                                        onClick={() =>
                                          goToAdmin(routeMap.reportsList)
                                        }
                                      >
                                        <img
                                          src={imgConstants.reports}
                                          alt="reports"
                                        />{' '}
                                        Reports
                                      </NavDropdown.Item>
                                      <NavDropdown.Item
                                        href="#"
                                        className="flex gap-2"
                                        onClick={() =>
                                          goToAdmin(routeMap.approveList)
                                        }
                                      >
                                        <img
                                          src={imgConstants.approvalList}
                                          alt="approvalList"
                                        />{' '}
                                        Approval List
                                      </NavDropdown.Item>
                                      <NavDropdown.Item
                                        href="#"
                                        className="flex gap-2"
                                        onClick={() =>
                                          goToAdmin(routeMap.statsReports)
                                        }
                                      >
                                        <img
                                          src={imgConstants.clubitem}
                                          alt="statsReports"
                                        />{' '}
                                        Stats Report
                                      </NavDropdown.Item>
                                      <NavDropdown.Item
                                        href="#"
                                        className="flex gap-2"
                                        onClick={() =>
                                          goToAdmin(routeMap.adminSellReport)
                                        }
                                      >
                                        <img
                                          src={imgConstants.clubitem}
                                          alt="statsReports"
                                        />{' '}
                                        Sells Report
                                      </NavDropdown.Item>
                                      <NavDropdown.Item
                                        href="#"
                                        className="flex gap-2"
                                        onClick={() =>
                                          goToAdmin(
                                            routeMap.authenticationPurchase,
                                          )
                                        }
                                      >
                                        <img
                                          src={imgConstants.clubitem}
                                          alt="authenticationPurchase"
                                        />{' '}
                                        Authentication Lists
                                      </NavDropdown.Item>
                                      <NavDropdown.Item
                                        href="#"
                                        className="flex gap-2"
                                        onClick={() =>
                                          goToAdmin(
                                            routeMap.spaceLists,
                                          )
                                        }
                                      >
                                        <img
                                          src={imgConstants.clubitem}
                                          alt="spaceLists"
                                        />{' '}
                                        Space Lists
                                      </NavDropdown.Item>
                                    </React.Fragment>
                                  )}
                                  {profile_details?.isSuperAdmin && (
                                    <NavDropdown.Item
                                      href="#"
                                      className="flex gap-2"
                                      onClick={() => goToAdmin('/user-list')}
                                    >
                                      <img
                                        src={imgConstants.userList}
                                        alt="userList"
                                      />
                                      UserList
                                    </NavDropdown.Item>
                                  )}
                                  <NavDropdown.Item
                                    href="#"
                                    className="flex gap-2"
                                    onClick={disconnetWallet}
                                  >
                                    <img
                                      src={imgConstants.clubSignOut}
                                      alt="clubSignOut"
                                    />
                                    Sign Out
                                  </NavDropdown.Item>
                                  <NavDropdown.Divider className="clubimg_wrp" />
                                  <p className="prfl_balance text-right">
                                    BALANCE
                                  </p>
                                  <div className="row ">
                                    <div className="col-4 clubrofile_left">
                                      <img
                                        src={
                                          localStorage.getItem('networkId') ===
                                          process.env
                                            .REACT_APP_KLATYN_NETWORK_ID
                                            ? imgConstants.klaytn
                                            : imgConstants.balanceIcon
                                        }
                                        alt=""
                                      />
                                    </div>
                                    <div className="col-8 clubrofile_right text-right">
                                      <h6>
                                        {ethBalance}{' '}
                                        {localStorage.getItem('networkId') ===
                                        process.env.REACT_APP_KLATYN_NETWORK_ID
                                          ? 'KLAY'
                                          : 'ETH'}
                                      </h6>
                                      <p>${dollarAmt} USD</p>
                                    </div>
                                  </div>
                                  <NavDropdown.Divider className="my-0" />
                                  {localStorage.getItem('networkId') !==
                                  process.env.REACT_APP_KLATYN_NETWORK_ID ? (
                                    <NavDropdown.Item
                                      href="#"
                                      className="swap_ethitem"
                                    >
                                      <div className="swap_btn_wrp mt-3">
                                        <button
                                          className="blkfull_btn"
                                          onClick={() => setSwapModal(true)}
                                        >
                                          Swap ETH/WETH
                                        </button>
                                      </div>
                                    </NavDropdown.Item>
                                  ) : (
                                    ''
                                  )}
                                </Nav>
                              </Dropdown.Item>

                              {/* // end of new connected menu */}
                            </div>
                          )}
                          <div>
                            <Nav>
                              <div className="universe_imgwrp asd d-flex">
                                <a
                                  href="https://t.me/ANSWER_GOVERNANCE"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={imgConstants.telegram}
                                    alt="telegram"
                                  />
                                </a>
                                <a
                                  href="https://twitter.com/clubrare_nft"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={imgConstants.twitter_1}
                                    alt="twitter_1"
                                  />
                                </a>
                                <a
                                  href="https://discord.gg/clubrare"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img src={imgConstants.discord} alt="" />
                                </a>
                                <a
                                  href="https://medium.com/@clubrare"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={imgConstants.mediumLogo}
                                    alt="mediumLogo"
                                  />
                                </a>
                              </div>
                            </Nav>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mobile_header_wrp d-none">
              <SMHeader />
            </div>
          </div>
        </div>
      </header>
      {homeClub && (
        <Homeclub
          isAdmin={isAdmin}
          onCLickCreate={onCLickCreate}
          profile_details={profile_details}
        />
      )}
    </React.Fragment>
  );
}

const EmailModal = (props: any) => {
  return (
    <div
      className="collection-modal create-email-popup"
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b0',
        position: 'fixed',
        left: 0,
        zIndex: 999,
      }}
    >
      <div style={{ width: '40%', minWidth: '300px', position: 'relative' }}>
        <div
          className="modal text-center"
          id="collectionmodal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-content update_emailpopup">
            <span aria-hidden="true" onClick={props.hide} className="close_btn">
              X
            </span>
            <div className="collection_modal_inner ">
              <h2 className="text-left mb-4">
                Please Update Your Email Address
              </h2>

              <input
                type="file"
                accept="image/*,.mp4,.mp3,"
                className="upload-file"
                name="collectionImage"
                id="collectionChoosFile"
                style={{ display: 'none' }}
              />
              <span
                style={{ color: 'red', fontSize: 12, fontWeight: 'bold' }}
              ></span>

              <form className="collection_form_wrp text-left">
                <div id="collectionform">
                  <div className="comm_input_wrp">
                    <label>
                      Email Address <span className="req_field"> * </span>
                    </label>{' '}
                    <br />
                    <input
                      type="text"
                      className="inpt  border-b border-solid
                          w-full"
                      name="email"
                      id="email"
                      onChange={props.inputClickHandler}
                      value={props.email || ''}
                      placeholder="Enter Email"
                    />
                  </div>

                  <div className="create_collection_btn_wrp text-center">
                    <button
                      type="button"
                      className="button-create"
                      onClick={props.updateProfile}
                    >
                      {props.submitLoading ? (
                        <Loading margin={'0'} size={'16px'} />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssertConverter = (props: any) => {
  const { customFromWei, customToWei } = useCustomStableCoin();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [loading, Setloading] = useState(false);
  const [cursor, setcursor] = useState<boolean>(false);
  const [wethvalue, setwethvalue] = useState<string>('');
  const [error, setError] = useState({ SwapValueError: '' });
  const [ethcurrencytoken, SetEthcurrencytoken] = useState('WETH');
  const [btnPlaceABid, setBtnPlaceABid] = useState(false);
  const [currencyEthValue, setCurrencyEthValue] = useState<string>('');

  const swapRef: any = React.useRef(null);
  useEffect(() => {
    getEthBalance();
  }, [wethvalue]);

  useEffect(() => {
    setError({
      ...error,
      SwapValueError: '',
    });
    setCurrencyEthValue('');
  }, [ethcurrencytoken]);

  const walletAmount = useSelector(
    (state: any) => state.metamaskReducer.wallet_amount,
  );
  const eth_weth_address = process.env.REACT_APP_WETH_TOKEN_ADD?.toLowerCase();

  const wallet_address: any = localStorage
    .getItem('Wallet Address')
    ?.toLowerCase();

  const getEthBalance = async () => {
    const { web3 }: any = await getWeb3();
    try {
      const { wethContract }: any = await makeWethContractforEth(
        eth_weth_address,
      );

      const result_weth_balance = await wethContract.methods
        .balanceOf(wallet_address)
        .call();
      const weth_balance = await customFromWei(result_weth_balance, web3, '');

      setwethvalue(weth_balance);
    } catch (err) {
      return false;
    }
  };

  const handleCurrencyChange = (e: any) => {
    setCurrencyEthValue(e.target.value);
    const price = Number(currencyEthValue) ? currencyEthValue : 0;

    if (ethcurrencytoken === 'WETH' && +e.target.value > +walletAmount) {
      setCurrencyEthValue(e.target.value);
      setBtnPlaceABid(true);
      setError({
        ...error,
        SwapValueError: `Not enough ETH to complete this transaction ${parseFloat(
          walletAmount,
        ).toFixed(3)} ETH available to swap`,
      });
    } else if (ethcurrencytoken === 'ETH' && +e.target.value > +wethvalue) {
      setCurrencyEthValue(e.target.value);
      setBtnPlaceABid(true);
      setError({
        ...error,
        SwapValueError: `Not enough WETH to complete this transaction ${parseFloat(
          wethvalue,
        ).toFixed(3)} WETH available to swap`,
      });
    } else if (
      (e.target.value < 0 || e.target.value == 0) &&
      e.target.value.length >= 1
    ) {
      setError({
        ...error,
        SwapValueError: `Please enter greater than 0`,
      });
    } else if (e.target.value.length > 19) {
      setError({
        ...error,
        SwapValueError: `Do not enter more than 18 character value`,
      });
    } else {
      setCurrencyEthValue(e.target.value);
      setBtnPlaceABid(false);
      setError({ ...error, SwapValueError: '' });
    }
  };

  const handleSwap = async () => {
    if (error.SwapValueError) {
      return;
    }
    Setloading(true);
    setcursor(true);
    const { web3 }: any = await getWeb3();

    const valueconvert: any = await customToWei(currencyEthValue, web3, '');

    const { wethContract }: any = await makeWethContractforEth(
      eth_weth_address,
    );

    if (ethcurrencytoken === 'WETH') {
      try {
        const { web3 }: any = await getWeb3();

        const depositResult = await wethContract.methods
          .deposit()
          .send({ from: wallet_address, gas: null, value: valueconvert });
        Setloading(false);
        addToast(' Swap Successfully Updated', {
          appearance: 'success',
          autoDismiss: true,
        });

        props.swapCloseModal(false);
        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
      } catch (err) {
        props.swapCloseModal(false);
      }
    } else if (ethcurrencytoken === 'ETH') {
      try {
        const { web3 }: any = await getWeb3();

        const depositResult = await wethContract.methods
          .withdraw(valueconvert)
          .send({ from: wallet_address, gas: null });
        Setloading(false);
        addToast('Swap Successfully Updated', {
          appearance: 'success',
          autoDismiss: true,
        });

        props.swapCloseModal(false);

        dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
      } catch (err) {
        props.swapCloseModal(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutSideClick);
  }, []);

  const handleOutSideClick = (event: any) => {
    if (swapRef && swapRef.current && !swapRef.current.contains(event.target)) {
      props.swapCloseModal(false);
    }
  };

  return (
    <>
      <div>
        <Modal
          {...props}
          show={props?.showModal}
          onHide={props.swapCloseModal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="asset_convertermodal_wrp"
        >
          <Modal.Header className="details_placebid_heading">
            <Modal.Title id="contained-modal-title-vcenter">
              <h2 className="text-left mb-4">Asset Converter</h2>
            </Modal.Title>
            <Button
              className="details_placebidmodal_closebtn"
              style={{ pointerEvents: cursor ? 'none' : 'auto' }}
              onClick={props.swapCloseModal}
            >
              <AiOutlineClose />
            </Button>
          </Modal.Header>

          <Modal.Body
            className="transfer_modal_style"
            style={{ pointerEvents: cursor ? 'none' : 'auto' }}
          >
            <div className="collection_modal_inner ">
              <label htmlFor="">Swap</label>
              <div className="swap_sec">
                <div className="con_input_wrp">
                  <label>
                    <input
                      type="number"
                      placeholder="0.00"
                      onChange={(e) => handleCurrencyChange(e)}
                      value={currencyEthValue}
                    />
                    <span>
                      {ethcurrencytoken === 'WETH'
                        ? 'ETH'
                        : ethcurrencytoken === 'ETH'
                        ? 'WETH'
                        : ''}
                    </span>
                  </label>
                  <h1 className="text-danger inp_error">
                    {' '}
                    {error.SwapValueError}
                  </h1>

                  <label>
                    <input
                      type="text"
                      disabled={true}
                      value={currencyEthValue}
                    />
                    <span>{ethcurrencytoken}</span>
                  </label>
                </div>
                <div className="club_head_wrp eth_dropdown">
                  <Nav>
                    <NavDropdown
                      className="dropdown_menu"
                      title={ethcurrencytoken}
                      id="collasible-nav-dropdown"
                    >
                      <NavDropdown.Item
                        onClick={() => SetEthcurrencytoken('WETH')}
                      >
                        {' '}
                        WETH{' '}
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => SetEthcurrencytoken('ETH')}
                      >
                        {' '}
                        ETH{' '}
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ pointerEvents: cursor ? 'none' : 'auto' }}>
            <div className="swap_btn_wrp mt-3 w-full">
              <button
                type="button"
                className={`blkfull_btn ${
                  currencyEthValue === '' && `disablebtn`
                } `}
                onClick={handleSwap}
                disabled={currencyEthValue === ''}
                style={{ pointerEvents: cursor ? 'none' : 'auto' }}
              >
                {loading ? (
                  <div className="d-flex justify-content-center">
                    {' '}
                    <Loading margin={'0'} size={'25px'} />
                  </div>
                ) : (
                  'Swap'
                )}
              </button>
            </div>
            <div>
              <h3 className="text-left mb-2">Rate 1 ETH = 1 WETH</h3>
              <p>
                You will receive same amount WETH after the swap. No fee is
                charged and the only cost is transaction gas
              </p>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default memo(Header);
