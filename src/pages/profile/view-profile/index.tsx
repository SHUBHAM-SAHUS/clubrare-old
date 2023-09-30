import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/main-layout/main-layout';
import { CategoriesFilter } from '../../../components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { profileDetailsType } from '../../../types/profile-details-type';
import {
  ItemDetails,
  onFaviourateItemPage,
  onFaviourateItemIsNullTypes,
  favourateItemTypes,
  onSaleItemPageType,
  onSaleItemIsNullType,
  collectedItemPageType,
  pendingCollectibleItemsTypes,
  collectedItemIsNullTypes,
  pendingCollectedItemIsNullType,
  hiddenItemIsNullTypes,
  hiddenItemPageType,
  collectibleItemsTypes,
  pendingCollectedItemPageType,
  onSaleItemsTypes,
  hiddenItemsTypes,
  createdItemPageTypes,
  createdItemIsNullTypes,
  createdItemsTypes,
  collectibleListTypes,
  collectibleItemPageTypes,
  isCollectionTypes,
} from '../../../types/created-item-details';

import {
  getEditProfileAction,
  getCreatedItemsAction,
  UpdatedHiddenPage,
  getCollectionAction,
  UpdatedOnSalePage,
  UpdatedCollectablePage,
  UpdatedCreatedPage,
  getCollectibleAction,
  getOnSaleAction,
  getOnFaviourateAction,
  UpdatedOnFaviouratePage,
  getOtherCollectibleAction,
  getOtherOnSaleAction,
  UpdateCollectiblePage,
  getCollectibleByCollectionAction,
  getPendingCollectiblesAction,
  getOtherPendingCollectibleAction,
  getPendingCollectibleAction,
  UpdatePendingCollectiblePage,
  deleteData,
  getHiddenItemsAction,
} from '../../../redux';
import InfiniteScroll from 'react-infinite-scroller';
import CardSkeleton from '../../../components/skeleton/card-skeleton';
import { useLocation } from 'react-router-dom';
import {
  SET_CREATED_ITEMS,
  SET_HIDDEN_ITEMS,
  SET_COLLECTIBLE_ITEMS,
  GET_ON_SALE,
  SET_ON_SALE_ITEM_IS_NULL,
  SET_COLLECTED_ITEM_IS_NULL,
  SET_CREATED_ITEM_IS_NULL,
  SET_HIDDEN_ITEM_IS_NULL,
  UPDATE_CREATED_PAGE,
  UPDATE_HIDDEN_PAGE,
  UPDATE_ON_SALE_PAGE,
  UPDATE_COLLECTED_PAGE,
  GET_ON_FAVIOURATE,
  SET_PENDING_COLLECTIBLES_ITEMS,
  SET_PENDING_COLLECTED_ITEM_IS_NULL,
  UPDATE_PENDING_COLLECTIBLE_PAGE,
} from '../../../redux/types';
import { useHistory } from 'react-router-dom';
import './view-profile.css';
import { CollectionCard } from '../../../components/collection-card';
import './collection-mod.css';
import '../../../components/lazy-leo/lazy-leo.scss';
import { useToasts } from 'react-toast-notifications';
const PendingBidCard = React.lazy(
  () => import('../../../components/bit-card/pending-bit-card'),
);
const Footer = React.lazy(() => import('../../../components/footer/footer'));
const ColllectionModal = React.lazy(() => import('./edit-pending-collectible'));
const ProfileSummary = React.lazy(
  () => import('../../../components/profile-summary'),
);
const BidCard = React.lazy(() => import('../../../components/bit-card'));

function Profile(props: any) {
  const location = useLocation();
  const { t } = useTranslation();
  const { addToast } = useToasts();
  const [activeCategory, setActiveCategory] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listLoading, setIsListLoading] = useState<boolean>(true);
  const [itemsList, setItemsList] = useState<ItemDetails[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [profileDetails, setProfileDetials] = useState<profileDetailsType>();
  const [getWalletAddress, setWalletAddress] = useState<string>('');
  const createdItems = useSelector((state: createdItemsTypes) => {
    return state.myItemsReducer.createdItems;
  });
  const createdItemIsNull = useSelector((state: createdItemIsNullTypes) => {
    return state.myItemsReducer.createdItemIsNull;
  });

  const createdItemPage = useSelector((state: createdItemPageTypes) => {
    return state.myItemsReducer.createdItemPage;
  });

  const hiddenItems = useSelector((state: hiddenItemsTypes) => {
    return state.myItemsReducer.hiddenItems;
  });

  const hiddenItemIsNull = useSelector((state: hiddenItemIsNullTypes) => {
    return state.myItemsReducer.hiddenItemIsNull;
  });

  const hiddenItemPage = useSelector((state: hiddenItemPageType) => {
    return state.myItemsReducer.hiddenItemPage;
  });

  const collectibleItems = useSelector((state: collectibleItemsTypes) => {
    return state.myItemsReducer.collectibleItems;
  });

  const pendingCollectibleItems = useSelector(
    (state: pendingCollectibleItemsTypes) => {
      return state.myItemsReducer.pendingCollectibleItems;
    },
  );

  const collectedItemIsNull = useSelector((state: collectedItemIsNullTypes) => {
    return state.myItemsReducer.collectedItemIsNull;
  });

  const pendingCollectedItemIsNull = useSelector(
    (state: pendingCollectedItemIsNullType) => {
      return state.myItemsReducer.pendingCollectedItemIsNull;
    },
  );

  const collectedItemPage = useSelector((state: collectedItemPageType) => {
    return state.myItemsReducer.collectedItemPage;
  });

  const pendingCollectedItemPage = useSelector(
    (state: pendingCollectedItemPageType) => {
      return state.myItemsReducer.pendingCollectedItemPage;
    },
  );

  const onSaleItems = useSelector((state: onSaleItemsTypes) => {
    return state.myItemsReducer.onSaleItems;
  });

  const onSaleItemIsNull = useSelector((state: onSaleItemIsNullType) => {
    return state.myItemsReducer.onSaleItemIsNull;
  });

  const onSaleItemPage = useSelector((state: onSaleItemPageType) => {
    return state.myItemsReducer.onSaleItemPage;
  });

  const favourateItem = useSelector((state: favourateItemTypes) => {
    return state.myItemsReducer.favourateItem;
  });

  const onFaviourateItemIsNull = useSelector(
    (state: onFaviourateItemIsNullTypes) => {
      return state.myItemsReducer.onFaviourateItemIsNull;
    },
  );

  const onFaviourateItemPage = useSelector((state: onFaviourateItemPage) => {
    return state.myItemsReducer.onFaviourateItemPage;
  });

  const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const [hideCursor, setHideCursor] = useState(false);
  const [editCollectionID, setEditCOllectionId] = useState(0);
  const [collectionList, setCollectionList] = useState<ItemDetails[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionButtonLoading, setCollectionButtonLoading] = useState(false);
  const [error, setError] = useState({
    displayName: '',
    symbol: '',
    collectionImage: '',
    collectionDescription: '',
    shortUrl: '',
  });
  const [displayName, setDisplayName] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>({});
  const dispatch = useDispatch();
  const limit = 20;
  const [otherUserProfile, setOtherUserProfile] = useState(false);
  const [userAdd, setUserAdd] = useState('');
  const history = useHistory();
  const [activeCollectionId, setActiveCollectionId] = useState(0);
  const [deleteId, setDeleteId] = useState<string>('');
  const tab: any = location.state;

  const categories: { key: number; title: string }[] = [
    { key: 1, title: t('profile.categories.created') },
    { key: 2, title: t('profile.categories.onSale') },
    { key: 3, title: t('profile.categories.collectibles') },
    { key: 4, title: t('profile.categories.faviourate') },
    { key: 5, title: t('profile.categories.myCollection') },
    { key: 6, title: t('profile.categories.Pending Collectibles') },
    { key: 7, title: t('Hidden-Item') },
  ];

  const [showCollectionItem, setShowCollectionItems] = useState(false);
  const categories2 : {key:number,title:string,show:boolean}[] = [
    { key: 2, title: t('profile.categories.onSale'), show: true },
    { key: 3, title: t('profile.categories.collectibles'), show: true },
  ];

  const [collectionWalletAdress, setCollectionWalletAdress] = useState();

  const [options, setOptions] = useState<any>([]);
  const [collectionAddress, setCollectionAddress] = useState<string|null[]>([]);
  const collectibleList = useSelector((state: collectibleListTypes) => {
    return state.myItemsReducer.collectionItem;
  });
  const isCollection = useSelector((state: isCollectionTypes) => {
    return state.myItemsReducer.collectionItemIsNull;
  });

  const collectibleItemPage = useSelector((state: collectibleItemPageTypes) => {
    return state.myItemsReducer.collectibleItemPage;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getProfileDetails = async (add: string) => {
    const data = { user_address: add };
    let res: any = await dispatch(getEditProfileAction(data));
    if (res?.status) {
      if (res?.data) {
        setProfileDetials(res?.data);

        setWalletAddress(res?.data?.wallet_address);
        if (
          props.match?.params?.address?.toLowerCase() ===
          localStorage.getItem('Wallet Address')?.toLowerCase()
        ) {
          setOtherUserProfile(false);
          if (tab?.includes('pending-collectibles')) {
            setSelectedCategory(6);
            getPendingCollectiblesList();
          } else if (tab?.includes('my-collectibles')) {
            setSelectedCategory(3);
            getCollectedItem(1);
          } else if (tab?.includes('favorites')) {
            setSelectedCategory(4);
            getCollectedItem(1);
            getFaviourateItem(1);
          } else if (tab?.includes('hidden-item')) {
            getHiddenItems(1);
            setSelectedCategory(7);
          } else {
            setSelectedCategory(1);
            getCreatedItems(1, res?.data?.wallet_address);
          }
        } else if (
          localStorage.getItem('Custom Url')?.toLowerCase() &&
          props.match?.params?.address?.toLowerCase() ===
            localStorage.getItem('Custom Url')?.toLowerCase()
        ) {
          setOtherUserProfile(false);
          if (tab?.includes('pending-collectibles')) {
            setSelectedCategory(6);
            getPendingCollectiblesList();
          } else if (tab?.includes('my-collectibles')) {
            setSelectedCategory(3);
            getCollectedItem(1);
          } else if (tab?.includes('favorites')) {
            setSelectedCategory(4);
            getCollectedItem(1);
            getFaviourateItem(1);
          } else if (tab?.includes('hidden-item')) {
            getHiddenItems(1);
            setSelectedCategory(7);
          } else {
            setSelectedCategory(1);
            getCreatedItems(1, res?.data?.wallet_address);
          }
        } else {
          setOtherUserProfile(true);
          setSelectedCategory(2);

          getOnSalesItems(1, true, res?.data?.wallet_address);

          setUserAdd(props.match?.params?.address);
        }
      } else if (localStorage.getItem('Wallet Address')) {
        if (tab?.includes('pending-collectibles')) {
          setSelectedCategory(6);
          getPendingCollectiblesList();
        } else if (tab?.includes('my-collectibles')) {
          setSelectedCategory(3);
          getCollectedItem(1);
        } else if (tab?.includes('favorites')) {
          setSelectedCategory(4);
          getCollectedItem(1);
          getFaviourateItem(1);
        } else if (tab?.includes('hidden-item')) {
     
          getHiddenItems(1);
          setSelectedCategory(7);
        } else {
          setSelectedCategory(1);
          getCreatedItems(1, res?.data?.wallet_address);
        }
        setOtherUserProfile(false);
      }
    } else {
      history.push('/home');
      addToast('User not found', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  useEffect(() => {
    /* Get all profile details */
    if (props.match?.params?.address) {
      getProfileDetails(props.match?.params?.address);
    } else if (!localStorage.getItem('Wallet Address')) {
      history.push('/connect-wallet');
    }

    return () => {
      clearAllStates();
    };
  }, [history.location.pathname, tab]);

  useEffect(() => {
    if (otherUserProfile) {
      const arr  = [...categories2];
      setOptions(arr);
    } else {
      let arr = [...categories];
      if (
        localStorage.getItem('Role') !== 'user' ||
        profileDetails?.isSuperAdmin
      ) {
        const newData = arr.filter(
          (x: { key: number; title: string }) =>
            x.title !== t('profile.categories.Pending Collectibles'),
        );
        arr = newData;
      }
      setOptions(arr);
    }
  }, [otherUserProfile]);

  const clearAllStates = async () => {
    await dispatch({ type: SET_CREATED_ITEMS, payload: [] });
    await dispatch({ type: SET_HIDDEN_ITEMS, payload: [] });
    await dispatch({ type: SET_COLLECTIBLE_ITEMS, payload: [] });
    await dispatch({ type: SET_PENDING_COLLECTIBLES_ITEMS, payload: [] });
    await dispatch({ type: GET_ON_SALE, payload: [] });
    await dispatch({ type: UPDATE_CREATED_PAGE, payload: 1 });
    await dispatch({ type: UPDATE_HIDDEN_PAGE, payload: 1 });
    await dispatch({ type: UPDATE_ON_SALE_PAGE, payload: 1 });
    await dispatch({ type: UPDATE_COLLECTED_PAGE, payload: 1 });
    await dispatch({ type: UPDATE_PENDING_COLLECTIBLE_PAGE, payload: 1 });
    await dispatch({ type: SET_ON_SALE_ITEM_IS_NULL, payload: false });
    await dispatch({ type: SET_COLLECTED_ITEM_IS_NULL, payload: false });
    await dispatch({
      type: SET_PENDING_COLLECTED_ITEM_IS_NULL,
      payload: false,
    });
    await dispatch({ type: SET_CREATED_ITEM_IS_NULL, payload: false });
    await dispatch({ type: SET_HIDDEN_ITEM_IS_NULL, payload: false });
    await dispatch({ type: GET_ON_FAVIOURATE, payload: [] });
  };

  const getCreatedItems = async (page: number, userAdd: string) => {
    setIsListLoading(true);

    await dispatch(getCreatedItemsAction(userAdd, page, limit));

    await dispatch(UpdatedCreatedPage(createdItemPage + 1));

    setIsListLoading(false);
  };

  const getHiddenItems = async (page: number) => {

    setIsListLoading(true);

    if (!otherUserProfile) {
      await dispatch(getHiddenItemsAction(getWalletAddress, page, limit));
    }

    await dispatch(UpdatedHiddenPage(hiddenItemPage + 1));
    setIsListLoading(false);
  };

  const getCollectedItem = async (page: number) => {
    setIsListLoading(true);

    if (otherUserProfile) {
      await dispatch(getOtherCollectibleAction(getWalletAddress, page, limit));
    } else {
      await dispatch(getCollectibleAction(getWalletAddress, page, limit));
    }

    await dispatch(UpdatedCollectablePage(collectedItemPage + 1));

    setIsListLoading(false);
  };

  const getPendingCollectedItem = async (page: number) => {
    setIsListLoading(true);

    if (otherUserProfile) {
      await dispatch(
        getOtherPendingCollectibleAction(getWalletAddress, page, limit),
      );
    } else {
      await dispatch(
        getPendingCollectibleAction(getWalletAddress, page, limit),
      );
    }
    await dispatch(UpdatePendingCollectiblePage(pendingCollectedItemPage + 1));

    setIsListLoading(false);
  };

  const getOnSalesItems = async (
    page: number,
    otherUserProfile: boolean,
    otherUserAdd: string,
  ) => {
    
    setIsListLoading(true);
    if (otherUserProfile) {
      await dispatch(getOtherOnSaleAction(otherUserAdd, page, limit));
    } else {
      await dispatch(getOnSaleAction(getWalletAddress, page, limit));
    }
    await dispatch(UpdatedOnSalePage(onSaleItemPage + 1));
    setIsListLoading(false);
  };

  const getFaviourateItem = async (page: number) => {
    
    setIsListLoading(true);
    if (!otherUserProfile) {
      await dispatch(getOnFaviourateAction(getWalletAddress, page, limit));
    }
    await dispatch(UpdatedOnFaviouratePage(onFaviourateItemPage + 1));
    setIsListLoading(false);
  };

  const hasMore = () => {
    if (selectedCategory === 1) {
      return !createdItemIsNull;
    } else if (selectedCategory === 7) {
      return !hiddenItemIsNull;
    } else if (selectedCategory === 2) {
      return !onSaleItemIsNull;
    } else if (selectedCategory === 3) {
      return !collectedItemIsNull;
    } else if (selectedCategory === 4) {
      // if (!onFaviourateItemIsNull) {
      //   fetchMoreData();
      // }
      return !onFaviourateItemIsNull;
    }
  };

  const fetchMoreData = () => {
    if (selectedCategory === 1 && !listLoading && !createdItemIsNull) {
      getCreatedItems(createdItemPage, getWalletAddress);
    } else if (selectedCategory === 2 && !listLoading && !onSaleItemIsNull) {
      getOnSalesItems(onSaleItemPage, otherUserProfile, getWalletAddress);
    } else if (selectedCategory === 3 && !listLoading && !collectedItemIsNull) {
      getCollectedItem(collectedItemPage);
    } else if (
      selectedCategory === 4 &&
      !listLoading &&
      !onFaviourateItemIsNull
    ) {
      getFaviourateItem(onFaviourateItemPage);
    } else if (selectedCategory === 5 && !listLoading && !isCollection) {
      getMoreCollectibleItemScroll(collectibleItemPage);
    } else if (
      selectedCategory === 6 &&
      !listLoading &&
      !pendingCollectedItemIsNull
    ) {
      getPendingCollectedItem(pendingCollectedItemPage);
    } else if (selectedCategory === 7 && !listLoading && !hiddenItemIsNull) {
      getHiddenItems(hiddenItemPage);
    }
  };

  useEffect(() => {
    if (selectedCategory === 1) {
      setItemsList(createdItems);
      setLoading(false);
      setShowCollectionItems(false);
    } else if (selectedCategory === 2) {
      setItemsList(onSaleItems);
      setLoading(false);
      setShowCollectionItems(false);
    } else if (selectedCategory === 3) {
      setItemsList(collectibleItems);
      setLoading(false);
      setShowCollectionItems(false);
    } else if (selectedCategory === 4) {
      setItemsList(favourateItem);
      setLoading(false);
      setShowCollectionItems(false);
    } else if (selectedCategory === 5) {
      setItemsList(collectionList);
      setLoading(false);
      setShowCollectionItems(false);
    } else if (selectedCategory === 6) {
      setItemsList(pendingCollectibleItems);
      setLoading(false);
      setShowCollectionItems(false);
    } else if (selectedCategory === 7) {
      setItemsList(hiddenItems);
      setLoading(false);
      setShowCollectionItems(false);
    }
  }, [
    createdItems,
    onSaleItems,
    collectibleItems,
    selectedCategory,
    favourateItem,
    collectionList,
    pendingCollectibleItems,
    setItemsList,
    hiddenItems,
  ]);

  const categoryChanged = async (cat: number) => {
    setCollectionList([]);
    clearAllStates();
    setSelectedCategory(cat);
    if (cat === 1) {
      getCreatedItems(1, getWalletAddress);
      setShowCollectionItems(false);
    } else if (cat === 2) {
      getOnSalesItems(1, otherUserProfile, getWalletAddress);
      setShowCollectionItems(false);
    } else if (cat === 3) {
      getCollectedItem(1);
      setShowCollectionItems(false);
    } else if (cat === 4) {
      // await dispatch(UpdatedOnFaviouratePage(1));
      // setShowCollectionItems(false);
      getFaviourateItem(1);
    } else if (cat === 5) {
      setShowCollectionItems(false);
      getCollectionList();
    } else if (cat === 6) {
      setShowCollectionItems(false);
      getPendingCollectiblesList();
    } else if (cat === 7) {
      getHiddenItems(1);
      setShowCollectionItems(false);
    }
  };

  const getPendingCollectiblesList = async () => {
    setIsListLoading(true);
    const object = {
      page_number: 1,
      page_size: 20,
    };
    const result: any = await dispatch(getPendingCollectiblesAction(object));
    if (result?.data?.status) {
      setItemsList(result.data.data);
    } else {
      setItemsList([]);
    }
    setIsListLoading(false);
  };

  const getCollectionList = async () => {
    const object = {
      network_id: localStorage.getItem('networkId') == klatynNetworkId ? 2 : 1,
      page_number: 1,
      page_size: 20,
    };
    const result: any = await dispatch(getCollectionAction(object));
    if (result?.data?.status) {
      setCollectionList(result.data.data);

    }
  };

  const getCollectibleByCollection = async (item: any, index: number) => {
    setDisplayName(item?.displayName);
    setShowCollectionItems(true);
    setEditCOllectionId(index);
    const object = {
      page_number: 1,
      page_size: 10,
      filter: 'all',
      wallet_address: item.wallet_address,
      collection_address: item?.collection_address,
    };
    await dispatch(getCollectibleByCollectionAction(object));
  };

  const getMoreCollectibleItemScroll = async (pageNumber: number) => {
    if (showCollectionItem) {
      const object = {
        page_number: pageNumber,
        page_size: 10,
        filter: 'all',
        wallet_address: collectionWalletAdress,
        collection_address: collectionAddress[editCollectionID],
      };
      await dispatch(getCollectibleByCollectionAction(object));
      await dispatch(UpdateCollectiblePage(+1));
    }
  };

  const removeFromFav = async (index: number) => {
    if (selectedCategory === 4) {
      const items = [...favourateItem];
      items.splice(index, 1);
      dispatch({ type: GET_ON_FAVIOURATE, payload: items });
      setItemsList(items);
    }
  };

  const updateCollection = async () => {};
  const editCollection = (item:ItemDetails, index: number) => {
    setSelectedItem(item);
    setShowCollectionModal(true);
    setEditCOllectionId(index);
  };
  const closeCollectionModal = () => {
    setShowCollectionModal(false);
    setSelectedItem({});
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId('');
  };

  const deleteCollection = (id: string) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const removePendingItem = (index: number) => {
    const newList = itemsList.filter(
      (itemsList: any) => itemsList._id !== deleteId,
    );
    setItemsList(newList);
    dispatch(deleteData({ _id: deleteId }));
    setDeleteId('');
    setShowDeleteModal(false);
  };

  return (
    <>
      {showCollectionModal && (
        <ColllectionModal
          item={selectedItem}
          getPendingCollectiblesList={getPendingCollectiblesList}
          hide={closeCollectionModal}
          updateCollection={updateCollection}
          collectionButtonLoading={collectionButtonLoading}
          error={error}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          hide={closeDeleteModal}
          removePendingItem={removePendingItem}
        />
      )}
      <MainLayout
        mainClassName="viewprofile_page_wrp"
        loading={loading}
        hideCursor={hideCursor}
        displayStickySidebar
      >
        <div
          className="club_viewprofile_inn_wrp"
          style={{ pointerEvents: hideCursor ? 'none' : 'auto' }}
        >
          <div className="md:grid-cols-12 gap-y-6 gap-x-6 lg:gap-12">
            <ProfileSummary
              otherUserProfile={otherUserProfile}
              wrapperClassName="col-span-12 md:col-span-8 h-full"
              categories={categories}
              activeCategory={activeCategory}
              onSetCategories={(catKey: string) => {}}
              profile={profileDetails}
              userAdd={userAdd}
            />
            <div className="row viewprofile_tophead_wrp">
              <div className="col-10">
                <CategoriesFilter
                  otherUserProfile={otherUserProfile}
                  listLoading={listLoading}
                  categories={options}
                  onSetCategories={categoryChanged}
                  displayName={displayName}
                  editCollection={editCollection}
                  showCollectionItem={showCollectionItem}
                  selCategory={selectedCategory}
                />
              </div>
              {otherUserProfile ? (
                ''
              ) : (
                <div className="col-2 text-right viewprofi_right_btn_wrp">
                  <button onClick={() => history.push('/profile/edit')}>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
          {selectedCategory === 5 &&
            !showCollectionItem &&
            collectionList.length > 0 && (
              <div className="grid grid-cols-4 gap-y-8 gap-x-12 md:gap-x-12 mt-16 md:mt-8 liveauctipagerow">
                {collectionList?.length > 0 &&
                  collectionList?.map((item: ItemDetails, i: number) => {
                    return (
                      <>
                        <div className="cmn_club_card_wrp">
                          <CollectionCard
                            collection={item}
                            setActiveCollectionId={setActiveCollectionId}
                            getCollectibleByCollection={
                              getCollectibleByCollection
                            }
                            index={i}
                          />
                        </div>
                      </>
                    );
                  })}
              </div>
            )}

          {showCollectionItem && collectibleList?.length > 0 && !loading && (
            <div className="">
              <div className="grid grid-cols-4 gap-y-9 gap-x-8 md:gap-x-12 mt-15 maxgridcardwrp viewprof_pendcard_wrp">
                {!isCollection
                  ? collectibleList.map((ele:ItemDetails, i: number) => (
                      <div key={i} className="cmn_club_card_wrp">
                        <BidCard
                          likeStatusChanged={() => removeFromFav(i)}
                          collectible={ele?.collectible_data}
                          collectibleType={
                            ele?.auctionDetails?.auctionType || null
                          }
                          closingTime={ele?.auctionDetails?.closingTime || null}
                          startingTime={
                            ele?.auctionDetails?.startingTime || null
                          }
                          name={ele?.name}
                          price={ele?.eth_price}
                          contentClass="lightShadow p-6"
                          timer={ele.timer}
                          auction_detail={ele?.auctionDetails}
                          collection={ele?.collection}
                          owner_image={ele?.owner_image}
                          list={ele}
                          creator_image={ele?.creator_image}
                          itemDetails={ele}
                          likeCount={ele.total_like}
                        />
                      </div>
                    ))
                  : null}
              </div>
            </div>
          )}

          {showCollectionItem && collectibleList?.length === 0 && !loading && (
            <div className="w-full py-6 flex items-center justify-center flex-row md:flex-col">
              <div className="flex items-start flex-col justify-center md:items-center">
                <span className="text-24 text-blue font-bold mb-1">
                  No Items Found in the collection
                </span>
              </div>
            </div>
          )}
          {itemsList?.length > 0 && !loading && (
            <InfiniteScroll
              pageStart={0}
              loadMore={fetchMoreData}
              hasMore={hasMore()}
              className="viewprofile_createdlist"
              loader={<div className="loader"></div>}
            >
              <div className="">
                <div className="grid grid-cols-4 gap-y-9 gap-x-8 md:gap-x-12 mt-15 maxgridcardwrp viewprof_pendcard_wrp">
                  {selectedCategory !== 5 &&
                    selectedCategory !== 6 &&
                    selectedCategory !== 7 &&
                    itemsList.map((ele:ItemDetails, i: number) => (
                      <div key={ele?.id} className="cmn_club_card_wrp">
                        <BidCard
                          likeStatusChanged={() => removeFromFav(i)}
                          collectible={ele?.collectible_data}
                          collectibleType={
                            ele?.auctionDetails?.auctionType || null
                          }
                          closingTime={ele?.auctionDetails?.closingTime || null}
                          startingTime={
                            ele?.auctionDetails?.startingTime || null
                          }
                          name={ele?.title}
                          price={ele?.eth_price}
                          contentClass="lightShadow p-6"
                          timer={ele.timer}
                          auction_detail={ele?.auctionDetails}
                          collection={ele?.collection}
                          owner_image={ele?.owner_image}
                          list={ele}
                          creator_image={ele?.creator_image}
                          itemDetails={ele}
                          likeCount={ele.total_like}
                        />
                      </div>
                    ))}

                  {selectedCategory == 6 &&
                    itemsList &&
                    itemsList.map((ele:ItemDetails, i: number) => (
                      <div key={ele?._id} className="club_pending_card">
                        
                        <PendingBidCard
                          likeStatusChanged={() => removeFromFav(i)}
                          collectible={ele?.collectible_data}
                          collectibleType={
                            ele?.auctionDetails?.auctionType || null
                          }
                          closingTime={ele?.auctionDetails?.closingTime || null}
                          startingTime={
                            ele?.auctionDetails?.startingTime || null
                          }
                          name={ele?.title}
                          src={ele?.file}
                          price={ele?.eth_price}
                          contentClass="lightShadow p-6"
                          timer={ele.timer}
                          auction_detail={ele?.auctionDetails}
                          collection={ele?.collection}
                          owner_image={ele?.owner_image}
                          list={ele}
                          creator_image={ele?.creator_image}
                          itemDetails={ele}
                          likeCount={ele.total_like}
                          closecollectionmodal={closeCollectionModal}
                          closedeletemodal={closeDeleteModal}
                          deletecollection={() => deleteCollection(ele?._id)}
                          editcollection={() => editCollection(ele, i)}
                          setHideCursor={(value: any) => setHideCursor(value)}
                          setSelectedCategory={setSelectedCategory}
                          categoryChanged={categoryChanged}
                        />
                      </div>
                    ))}

                  {selectedCategory == 7 &&
                    itemsList &&
                    itemsList.map((ele:ItemDetails, i: number) => (
                      <div key={ele._id} className="club_pending_card">
                        <BidCard
                          likeStatusChanged={() => removeFromFav(i)}
                          collectible={ele?.collectible_data}
                          collectibleType={
                            ele?.auctionDetails?.auctionType || null
                          }
                          closingTime={ele?.auctionDetails?.closingTime || null}
                          startingTime={
                            ele?.auctionDetails?.startingTime || null
                          }
                          name={ele?.title}
                          price={ele?.eth_price}
                          contentClass="lightShadow p-6"
                          timer={ele.timer}
                          auction_detail={ele?.auctionDetails}
                          collection={ele?.collection}
                          owner_image={ele?.owner_image}
                          list={ele}
                          creator_image={ele?.creator_image}
                          itemDetails={ele}
                          likeCount={ele.total_like}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </InfiniteScroll>
          )}
          {listLoading && (
            <div className="row cardskeleton_wrp">
              {[1, 2, 3, 4].map((loading) => (
                <div className=" cardskeleton_inner" key={loading}>
                  <CardSkeleton />
                </div>
              ))}
            </div>
          )}
          {((selectedCategory !== 5 &&
            (!itemsList || itemsList?.length === 0) &&
            !listLoading) ||
            (selectedCategory === 5 &&
              collectionList.length === 0 &&
              !listLoading)) && (
            <div className="w-full py-6 flex items-center justify-center flex-row md:flex-col">
              <div className="flex items-start flex-col justify-center md:items-center">
                <span className="text-24 text-blue font-bold mb-1">
                  No Items Available
                </span>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
      <Footer />
    </>
  );
}

const DeleteModal = (props: any) => {
  return (
    <div
      className="collection-modal"
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b0',
        position: 'fixed',
        zIndex: 999,
      }}
    >
      <div style={{ width: '40%', minWidth: '300px', position: 'relative' }}>
        <div
          className="modal text-center delete_modal"
          id="collectionmodal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-content">
            <span aria-hidden="true" onClick={props.hide} className="close_btn">
              {' '}
              X{' '}
            </span>
            <div className="collection_modal_inner ">
              <h2 className="text-center mb-4">Delete Modal</h2>
              <div className="create_collection_btn_wrp text-center">
                <p>Are you sure you want to delete?</p>
                <div className="card_place_bid_btn_wrp mt-4">
                  <button
                    type="button"
                    className="card_place_bid_btn"
                    onClick={props.removePendingItem}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="card_place_bid_btn"
                    onClick={props.hide}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
