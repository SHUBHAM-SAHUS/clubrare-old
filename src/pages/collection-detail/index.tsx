import Footer from '../../components/footer/footer';
import { useEffect, useRef, useState } from 'react';
import MainLayout from '../../layouts/main-layout/main-layout';
import CopyToClipboard from 'react-copy-to-clipboard';
import './collection-details.scss';
import profileImg from '../../assets/images/profile.svg';
import { Dropdown } from 'react-bootstrap';
import BidCard from '../../components/bit-card';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import searchIcon from '../../assets/images/searchIcon.svg';
import banner from '../../assets/images/banner.jpg';
import {
  CollectionAction,
  getTopCollectionAction,
} from '../../redux/actions/top-collection-action';
import {
  COLLECTION_SEARCH_KEYWORD,
  SET_TOP_COLLECTION_ITEMS,
  SET_TOP_COLLECTION_IS_NULL,
  TOP_COLLECTION_LIST_LOADING,
  UPDATE_TOP_COLLECTION_PAGE,
} from '../../redux/types';
import { imgConstants } from '../../assets/locales/constants';
import CardSkeleton from '../../components/skeleton/card-skeleton';

const CollectionDetail = () => {
  const history = useHistory();
  const { collection_address, network_id }: any = useParams();
  const dispatch = useDispatch();
  const topCollectionData = useSelector((state: any) => {
    return state.topCollectionReducer.collectionItems;
  });

  const collectionSearchKeyword = useSelector((state: any) => {
    return state.topCollectionReducer.collectionSearchKeyword;
  });
  const collectionListLoading = useSelector((state: any) => {
    return state.topCollectionReducer.collectionLoading;
  });
  const collectionIsNull = useSelector((state: any) => {
    return state.topCollectionReducer.collectionIsNull;
  });
  const collectionPageNo = useSelector((state: any) => {
    return state.topCollectionReducer.collectionPageNo;
  });

  const refSortBy: any = useRef();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [allValues, setAllValues] = useState({
    network: '',
    collection_address: '',
    sort: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [topCollectionResult, setTopCollectionResult] = useState<any>({});
  const [topCollectionProfile, setTopCollectionProfile] = useState<any>({});
  const [showsearch, setShowsearch] = useState<boolean>(false);
  const [searchValue, setSearchVal] = useState(collectionSearchKeyword);
  const [isLayoutLoading, setIsLayoutLoading] = useState(true);

  const searchval = collectionSearchKeyword ? collectionSearchKeyword : '';

  useEffect(() => {
    setTimeout(() => {
      setIsLayoutLoading(false);
    }, 3000);
  }, []);
  const fetchMoreCollectionData = async (collectionIsNullValue: boolean) => {
    if (
      !isLoading &&
      !collectionIsNullValue &&
      topCollectionData.length % 20 == 0
    ) {
      callListAPi();
    }
  };

  const callListAPi = async () => {
    setIsLoading(true);
    await dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: true });
    try {
      await dispatch(
        CollectionAction(
          Number(collectionPageNo),
          collection_address,
          allValues?.sort,
          searchval,
        ),
      );
      await dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: false });
    } catch (err) {
      dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: false });
    }
    await dispatch({
      type: UPDATE_TOP_COLLECTION_PAGE,
      payload: collectionPageNo + 1,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (
      history.location.pathname ===
      '/collection/' + collection_address + '/' + network_id
    ) {
      return () => {
        setSearchVal('');
        dispatch({ type: SET_TOP_COLLECTION_ITEMS, payload: [] });
        dispatch({ type: SET_TOP_COLLECTION_IS_NULL, payload: true });
        dispatch({ type: UPDATE_TOP_COLLECTION_PAGE, payload: 1 });
        dispatch({ type: COLLECTION_SEARCH_KEYWORD, payload: '' });
      };
    }
  }, []);
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const getList = async () => {
      setIsLoading(true);
      await dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: true });
      try {
        await dispatch(
          CollectionAction(1, collection_address, allValues?.sort, searchval),
        );
        // setViewData(finalData);

        await dispatch({ type: UPDATE_TOP_COLLECTION_PAGE, payload: 2 });
        dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: false });
      } catch (err) {
        dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: false });
      }
      setIsLoading(false);
    };
    getList();
    setShowSortBy(false);
  }, [allValues, collectionSearchKeyword]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        showSortBy &&
        refSortBy.current &&
        !refSortBy.current.contains(e.target)
      ) {
        setShowSortBy(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showSortBy]);

  const handleCloseToggle = (e: any) => {
    const id = e.target.id;
    if (id === 'sortBy') {
      setShowSortBy(true);
    }
  };

  const getTopCollectionData = async () => {
    setIsLoading(true);
    await dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: true });

    try {
      const result: any = await dispatch(
        getTopCollectionAction(collection_address),
      );
      if (result?.data?.status) {
        setTopCollectionResult(result?.data?.data);
        setTopCollectionProfile(result?.data?.data?.collectionsInfo);
        setIsLoading(false);
        await dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: false });
      }
    } catch (err: any) {
      setIsLoading(false);
      await dispatch({ type: TOP_COLLECTION_LIST_LOADING, payload: false });
      return false;
    }
  };
  useEffect(() => {
    getTopCollectionData();
  }, []);

  const onChangeSearch = (e: any) => {
    setSearchVal(e.target.value);
  };
  const onInputSearch = async (e: any) => {
    if (e.key === 'Enter') {
      await dispatch({
        type: COLLECTION_SEARCH_KEYWORD,
        payload: e.target.value,
      });
    }
  };

  return (
    <>
      <MainLayout
        displaySidebar={false}
        mainClassName="flex flex-col justify-center items-center"
        loading={isLayoutLoading}
      >
        <div className="top_collection_wrp w-100">
          <div className="container">
            <div
              className="top_coll_banner"
              style={{
                backgroundImage: `url(${
                  topCollectionProfile?.banner_image
                    ? topCollectionProfile?.banner_image
                    : banner
                })`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <img
              className="profile_img"
              // src={profileImg}
              src={
                topCollectionProfile.image_id
                  ? topCollectionProfile.image_id
                  : profileImg
              }
              alt="profileImage"
            />
            <div className="coll_containt text-center">
              <h3 className="coll_title">
                {topCollectionProfile?.displayName}
              </h3>
              <div className="row align-items-center mt-2">
                {/* <div className="col-6 text-right">
                  <h2>
                    {topCollectionProfile?.create_name
                      ? topCollectionProfile?.create_name
                      : ""}
                  </h2>
                </div> */}
                <div className="col-12">
                  <div className="user_add_wrp">
                    {topCollectionResult?.collectionsInfo
                      ?.collection_address ? (
                      <CopyToClipboard
                        text={topCollectionResult?.collectionsInfo?.collection_address?.toString()}
                        onCopy={onCopyText}
                      >
                        <div className="user_addbtn flex mx-auto">
                          {topCollectionResult?.collectionsInfo?.network_id ===
                          '1' ? (
                            <img
                              src={imgConstants.ethIcon}
                              alt="currencyIcon"
                            />
                          ) : topCollectionResult?.collectionsInfo
                              ?.network_id === '2' ? (
                            <img
                              src={imgConstants.klyicon}
                              alt="currencyIcon"
                            />
                          ) : null}

                          {isCopied ? (
                            'Copied...'
                          ) : (
                            <div>
                              {topCollectionResult?.collectionsInfo
                                ?.collection_address
                                ? topCollectionResult?.collectionsInfo?.collection_address
                                    .toString()
                                    .substring(0, 5) +
                                  '.....' +
                                  topCollectionResult?.collectionsInfo?.collection_address
                                    .toString()
                                    .substr(
                                      topCollectionResult?.collectionsInfo
                                        ?.collection_address.length - 4,
                                    )
                                : ''}
                            </div>
                          )}
                        </div>
                      </CopyToClipboard>
                    ) : null}
                  </div>
                </div>
                {topCollectionProfile?.description && (
                  <p className="mx-auto">{topCollectionProfile?.description}</p>
                )}
              </div>
              <div className="flex justify-center coll_items">
                <div className="res_coll_item_initail">
                  <div className="coll_item_data coll_items">
                    <p>Items</p>
                    <h4>
                      {topCollectionResult?.items
                        ? topCollectionResult?.items
                        : '0'}
                    </h4>
                  </div>
                  <div className="coll_item_data coll_owners">
                    <p>Owners</p>
                    <h4>
                      {topCollectionResult?.owners
                        ? topCollectionResult?.owners
                        : '0'}
                    </h4>
                  </div>
                </div>
                <div className="res_coll_item_secondary">
                  <div className="coll_item_data">
                    <p>Floor Price</p>
                    <h4>
                      {topCollectionResult?.floorPrice
                        ? Number(
                            parseFloat(topCollectionResult?.floorPrice).toFixed(
                              3,
                            ),
                          )
                        : '0'}{' '}
                      <span>
                        {topCollectionResult?.collectionsInfo?.network_id ===
                        '1' ? (
                          <h1>ETH</h1>
                        ) : topCollectionResult?.collectionsInfo?.network_id ===
                          '2' ? (
                          <h1>KLAY</h1>
                        ) : null}
                      </span>
                    </h4>
                  </div>
                  <div className="coll_item_data">
                    <p>Total Volume</p>
                    <h4>
                      {topCollectionResult?.totalVolume
                        ? Number(
                            parseFloat(
                              topCollectionResult?.totalVolume,
                            ).toFixed(3),
                          )
                        : '0'}
                      <span>
                        {topCollectionResult?.collectionsInfo?.network_id ===
                        '1' ? (
                          <h1>ETH</h1>
                        ) : topCollectionResult?.collectionsInfo?.network_id ===
                          '2' ? (
                          <h1>KLAY</h1>
                        ) : null}
                      </span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center coll_search_wrp">
              <div className="col-6 search_left_wrp">
                <input
                  type="text"
                  value={searchValue}
                  onChange={onChangeSearch}
                  onKeyDown={onInputSearch}
                  className="coll_desk_srch"
                  placeholder="Search NFTs in collection"
                />

                <div className="mobile_coll_srch" style={{ display: 'none' }}>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={onChangeSearch}
                    onKeyDown={onInputSearch}
                    placeholder="Search NFTs in collection"
                    style={{ display: showsearch ? 'block' : 'none' }}
                  />
                  <a
                    onClick={() => setShowsearch(true)}
                    style={{ display: showsearch ? 'none' : 'block' }}
                  >
                    <img src={searchIcon} alt="search-icon" />
                  </a>
                </div>
              </div>

              <div className="col-6 text-right search_right_wrp">
                <div className="">
                  <Dropdown show={showSortBy} ref={refSortBy}>
                    <Dropdown.Toggle onClick={handleCloseToggle} id="sortBy">
                      Sort by
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="">
                      <div>
                        <div className="options">
                          <div className="options dropdownOpt mt-1 hvr_clr py-2">
                            <input
                              type="radio"
                              id="recentlyadded"
                              name="sort"
                              defaultChecked
                              // checked={allValues?.sort === ""}
                              value="recently_added"
                              onChange={(e) => {
                                window.scrollTo(0, 0);
                                setAllValues({
                                  ...allValues,
                                  sort: e.target.value,
                                });
                              }}
                            />
                            <label htmlFor="recentlyadded">
                              Recently Added
                            </label>
                          </div>
                          <div className="options dropdownOpt mt-1 hvr_clr py-2 ">
                            <input
                              type="radio"
                              name="sort"
                              id="forprice_low_high"
                              value="price_low_to_high"
                              onChange={(e) => {
                                window.scrollTo(0, 0);
                                setAllValues({
                                  ...allValues,
                                  sort: e.target.value,
                                });
                              }}
                            />
                            <label htmlFor="forprice_low_high">
                              Price: Low to High
                            </label>
                          </div>
                          <div className="options dropdownOpt mt-1 hvr_clr py-2 ">
                            <input
                              type="radio"
                              name="sort"
                              id="forpricehigh_low"
                              value="price_high_to_low"
                              onChange={(e) => {
                                window.scrollTo(0, 0);
                                setAllValues({
                                  ...allValues,
                                  sort: e.target.value,
                                });
                              }}
                            />
                            <label htmlFor="forpricehigh_low">
                              Price: High to Low
                            </label>
                          </div>

                          <div className="options dropdownOpt mt-1 hvr_clr py-2">
                            <input
                              type="radio"
                              name="sort"
                              id="auction_ending"
                              value="auction_ending_soon"
                              onChange={(e) => {
                                window.scrollTo(0, 0);
                                setAllValues({
                                  ...allValues,
                                  sort: e.target.value,
                                });
                              }}
                            />
                            <label htmlFor="auction_ending">
                              Auction ending Soon
                            </label>
                          </div>
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <InfiniteScroll
              pageStart={0}
              loadMore={() => fetchMoreCollectionData(collectionIsNull)}
              hasMore={!collectionIsNull}
            >
              <div className="explore_cmn_page_wrp">
                <div className="grid grid-cols-4 gap-y-8 gap-x-13 md:gap-x-13 mt-16 md:mt-8 liveauctipagerow">
                  {topCollectionData?.map((ele: any, i: number) => (
                    <div key={i} className="cmn_club_card_wrp">
                      {
                        <BidCard
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
                          isExplore={true}
                          list={ele}
                          onSale={ele.onSale}
                          auction_detail={ele?.auctionDetails}
                          itemDetails={ele}
                          likeCount={ele?.total_like}
                        />
                      }
                    </div>
                  ))}
                </div>
              </div>
            </InfiniteScroll>
            {collectionListLoading && (
              // <Spinner />
              <div className="row cardskeleton_wrp">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((loading) => (
                  <div className=" cardskeleton_inner" key={loading}>
                    <CardSkeleton />
                  </div>
                ))}
              </div>
            )}
            {(!topCollectionData || topCollectionData?.length === 0) &&
              !collectionListLoading && (
                <div className="w-full py-6 flex items-center justify-center flex-row md:flex-col explore_cmn_page_wrp no_item_coll_wrp">
                  <div className="flex items-start flex-col justify-center md:items-center">
                    <span className="text-24 text-blue font-bold mb-1">
                      No Items Available
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </MainLayout>
      <Footer />
    </>
  );
};
export default CollectionDetail;
