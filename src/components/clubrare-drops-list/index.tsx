import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../layouts/main-layout/main-layout';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import {
  AllcollectionCategory,
  ClubrareDropsAction,
  ClubrareDropsRecentAction,
} from '../../redux/actions';
import {
  SET_CLUBRARE_DROP_IS_NULL,
  UPDATE_CLUBRARE_DROP_PAGE,
  SET_CLUBRARE_RECENT__LIST_LOADING,
} from '../../redux/types';

import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from '../spinner';
import './drops-list.css';
import '../../app.css';
import '../explore/explore.scss';
import Slider from 'react-slick';
import CardSkeleton from '../skeleton/card-skeleton';
const BidCard = React.lazy(() => import('../bit-card'));

function DropsList() {
  const [allValues, setAllValues] = useState({
    network_id: '',
    category: '',
    sort: '',
  });

  const [dropDownNetwork, setDropDownNetwork] = useState('Network');
  const [dropDownCategory, setDropDownCategory] = useState('Category');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [listLoading, setListLoading] = useState(true);
  const [listLoadingUpcoming, setListLoadingUpcoming] = useState(true);
  const [callCategoryList, setCallCategoryList] = useState<boolean>(false);
  const clubrareDropPageNo = useSelector((state: any) => {return state.exploreReducer.clubrareDropsPageNo});
  const clubrareDropsRecentTNull = useSelector((state: any) => {return state.exploreReducer.clubrareDropsRecentIsNull});
  const clubrareDrops = useSelector((state: any) => state.exploreReducer.clubrareDropsItems);
  const clubrareRecentDrops = useSelector((state: any) => state.exploreReducer.clubrareDropsRecentItems);
  const allcategory = useSelector((state: any) => state.categoryReducer.allcategoryitem);
  const [hideNetworkDropdown, setHideNetworkDropdown] = useState(false);
  const [hideCategoryDropdown, setCategoryHideDropdown] = useState(false);
  const [hidesortBy, setHideSortby] = useState(false);

  const networkRef: any = useRef();
  const categoryRef: any = useRef();
  const sortByRef: any = useRef();

  useEffect(() => {
    dispatch(AllcollectionCategory());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (callCategoryList) {      
      callListAPi();
    }
  }, [callCategoryList]);

  useEffect(() => {
    setListLoadingUpcoming(true);
    dispatch(ClubrareDropsAction(1, 'all'));
    setListLoadingUpcoming(false);
  }, []);

  const getList = async () => {
    await dispatch(
      ClubrareDropsRecentAction(
        1,
        allValues.network_id,
        allValues.category,
        allValues.sort,
      ),
    );
    setListLoading(false);
  };

  useEffect(() => {     
    getList();
    setHideNetworkDropdown(false);
    setCategoryHideDropdown(false);
    setHideSortby(false);
    return () => {
      dispatch({ type: SET_CLUBRARE_DROP_IS_NULL, payload: false });
      dispatch({ type: UPDATE_CLUBRARE_DROP_PAGE, payload: 1 });
    };
  }, [allValues]);

  const fetchMoreData = async (clubrareDropsRecentTNull: boolean) => {
    if (
      !listLoading &&
      !clubrareDropsRecentTNull &&
      clubrareRecentDrops.length % 20 == 0
    ) {      
      callListAPi();
    }
  };

  const callListAPi = async () => {
    setListLoading(true);
    dispatch({ type: SET_CLUBRARE_RECENT__LIST_LOADING, payload: true });
    await dispatch(
      ClubrareDropsRecentAction(
        clubrareDropPageNo,
        allValues.network_id,
        allValues.category,
        allValues.sort,
      ),
    );
    dispatch({ type: SET_CLUBRARE_RECENT__LIST_LOADING, payload: false });
    await dispatch({
      type: UPDATE_CLUBRARE_DROP_PAGE,
      payload: clubrareDropPageNo + 1,
    });
    setListLoading(false);
  };


  const settingsUpComing = {
    dots: false,
    // arrows: true,
    swipeToSlide: true,
    infinite: clubrareDrops.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 979,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        hideNetworkDropdown &&
        networkRef.current &&
        !networkRef.current.contains(e.target)
      ) {
        setHideNetworkDropdown(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [hideNetworkDropdown]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        hideCategoryDropdown &&
        categoryRef.current &&
        !categoryRef.current.contains(e.target)
      ) {
        setCategoryHideDropdown(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [hideCategoryDropdown]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        hidesortBy &&
        sortByRef.current &&
        !sortByRef.current.contains(e.target)
      ) {
        setHideSortby(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [hidesortBy]);

  const handleCloseToggle = (e: any) => {
    const id = e.target.id;
    if (id === 'network') {
      setHideNetworkDropdown(true);
      setCategoryHideDropdown(false);
      setHideSortby(false);
    }

    if (id === 'category') {
      setCategoryHideDropdown(true);
      setHideNetworkDropdown(false);
      setHideSortby(false);
    }

    if (id === 'sortBy') {
      setHideNetworkDropdown(false);
      setCategoryHideDropdown(false);
      setHideSortby(true);
    }
  };

  const handleResetValue = () => {
    setAllValues({
      network_id: '',
      category: '',
      sort: '',
    });
    setDropDownNetwork('Network');
    setDropDownCategory('Category');
  };

  return (
    <Layout mainClassName="clubraredrop_page_wrp" loading={false}>
      <div className="container-fluid">
        {clubrareDrops && clubrareDrops.length > 0 ? (
          <div>
            <div className="text-18 md:text-24 text-blue font-semibold">
              <div className="row items-center explore_filter_row">
                <div className="col-3 pl-0">
                  <div className="text-16 lg:text-22  clubraredrop_page_heading d-flex justify-content-start  text-blue font-semibold ml-3.5 lg:mr-5 xl:mr-8.5">
                    {t('home.explore.title1')}{' '}
                  </div>
                </div>
              </div>
              {clubrareDrops?.length > 0 ? (
                <div className="mt-3 clubraredroplist_wrp">
                  <Slider {...settingsUpComing}>
                    {clubrareDrops.map((ele: any, i: number) => (
                      <div key={i} className="cmn_club_card_wrp">
                        {
                          <BidCard
                            collectible={ele?.collectible_data}
                            collectibleType={
                              ele?.auctionDetails?.auctionType || null
                            }
                            closingTime={
                              ele?.auctionDetails?.closingTime || null
                            }
                            startingTime={
                              ele?.auctionDetails?.startingTime || null
                            }
                            name={ele?.title}
                            price={ele?.eth_price}
                            contentClass="lightShadow p-6"
                            timer={ele.timer}
                            isExplore={true}
                            onSale={ele?.on_sale}
                            list={ele}
                            auction_detail={ele?.auctionDetails}
                            itemDetails={ele}
                            likeCount={ele?.total_like}
                          />
                        }
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : null}
              {listLoadingUpcoming && <Spinner />}
              {(!clubrareDrops || clubrareDrops?.length === 0) &&
                !listLoadingUpcoming && (
                  <div
                    className="w-full py-6 flex items-center justify-center flex-row md:flex-col
                  "
                  >
                    <div className="flex items-start flex-col justify-center md:items-center">
                      <span className="text-24 text-blue font-bold mb-1">
                        No Items Available
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        ) : null}

        <div className="text-18 md:text-24 text-blue font-semibold clubdrop_page_card_wrp">
          <div className="row items-center explore_filter_row club_expl_filt_main_head">
            <div className="col-3 pl-0">
              <div className="text-16 lg:text-22 text-blue font-semibold ml-4 lg:mr-5 xl:mr-8.5">
                Latest Drops
              </div>
            </div>
            <div className="col-9 d-flex club_expl_all_filt_wrp justify-content-end">
              {(allValues && allValues?.network_id) ||
              allValues?.category ||
              allValues?.sort ? (
                <div
                  className="filter_Reset"
                  onClick={() => handleResetValue()}
                >
                  Reset
                </div>
              ) : null}
              <div className="club_expl_filt_wrp" ref={networkRef}>
                <Dropdown show={hideNetworkDropdown}>
                  <Dropdown.Toggle onClick={handleCloseToggle} id="network">
                    {dropDownNetwork}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="club_expl_fil_dropdown">
                    <div className="mt-1">
                      <div>
                        <div className="options dropdownOptWrp">
                          <div className="options dropdownOpt  hvr_clr py-2 maiN_drop-bx ">
                            <input
                              type="radio"
                              name="network"
                              id="Allnetwork"
                              defaultChecked
                              checked={dropDownNetwork == 'Network'}
                              value=""
                              onClick={() => setDropDownNetwork('Network')}
                              onChange={(e) =>
                                setAllValues({
                                  ...allValues,
                                  network_id: e.target.value,
                                })
                              }
                            />

                            <label
                              title="item1 comm_item border"
                              htmlFor="Allnetwork"
                            >
                              {' '}
                              All
                            </label>
                          </div>

                          <div className="options dropdownOpt mt-1 hvr_clr py-2">
                            <input
                              type="radio"
                              name="network"
                              id="Ethereumfor"
                              value="1"
                              onClick={() => setDropDownNetwork('Ethereum')}
                              onChange={(e) =>
                                setAllValues({
                                  ...allValues,
                                  network_id: e.target.value,
                                })
                              }
                            />

                            <label
                              title="item2 comm_item"
                              htmlFor="Ethereumfor"
                            >
                              Ethereum
                            </label>
                          </div>

                          <div className="options dropdownOpt mt-1 hvr_clr py-2">
                            <input
                              type="radio"
                              name="network"
                              id="klytnfor"
                              value="2"
                              onClick={() => setDropDownNetwork('Klaytn')}
                              onChange={(e) =>
                                setAllValues({
                                  ...allValues,
                                  network_id: e.target.value,
                                })
                              }
                            />

                            <label title="item3 comm_item" htmlFor="klytnfor">
                              {' '}
                              Klaytn
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="club_expl_filt_wrp" ref={categoryRef}>
                <Dropdown show={hideCategoryDropdown}>
                  <Dropdown.Toggle onClick={handleCloseToggle} id="category">
                    {dropDownCategory}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="club_expl_fil_dropdown ">
                    <div className="mt-1">
                      <div>
                        <div className="options dropdownOptWrp">
                          <div className="options hvr_clr dropdownOpt py-2">
                            <input
                              type="radio"
                              name="category"
                              defaultChecked
                              checked={dropDownCategory == 'Category'}
                              id="Catefor"
                              value=""
                              onClick={() => setDropDownCategory('Category')}
                              onChange={(e) =>
                                setAllValues({
                                  ...allValues,
                                  category: e.target.value,
                                })
                              }
                            />
                            <label
                              title="item4 comm_item border"
                              htmlFor="Catefor"
                            >
                              All
                            </label>
                          </div>
                          {allcategory &&
                            allcategory.length > 0 &&
                            allcategory?.map((val: any, i: any) => {
                              return (
                                  <div
                                    className="options hvr_clr dropdownOpt py-2"
                                    key={i}
                                  >
                                    <input
                                      type="radio"
                                      name="category"
                                      checked={val.name == dropDownCategory}
                                      id={val.name.toLowerCase()}
                                      value={val.name.toLowerCase()}
                                      onClick={() =>
                                        setDropDownCategory(val.name)
                                      }
                                      onChange={() =>
                                        setAllValues({
                                          ...allValues,
                                          category: val.name.toLowerCase(),
                                        })
                                      }
                                    />

                                    <label
                                      title="item4 comm_item border"
                                      htmlFor={val.name.toLowerCase()}
                                    >
                                      {val.name}
                                    </label>
                                  </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="club_expl_filt_wrp club_expl_sort_by_wrp">
                <Dropdown show={hidesortBy} ref={sortByRef}>
                  <Dropdown.Toggle onClick={handleCloseToggle} id="sortBy">
                    Sort by
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="club_expl_fil_dropdown">
                    <div>
                      <div className="options dropdownOptWrp">
                        <div className="options dropdownOpt mt-1 hvr_clr py-2">
                          <input
                            type="radio"
                            id="recentlyadded"
                            name="sort"
                            defaultChecked
                            checked={allValues?.sort === ''}
                            value="recently_added"
                            onChange={(e) =>
                              setAllValues({
                                ...allValues,
                                sort: e.target.value,
                              })
                            }
                          />
                          <label
                            title="item4 comm_item border"
                            htmlFor="recentlyadded"
                          >
                            Recently Added
                          </label>
                        </div>
                        <div className="options dropdownOpt mt-1 hvr_clr py-2 ">
                          <input
                            type="radio"
                            name="sort"
                            id="forprice_low_high"
                            value="price_low_to_high"
                            onChange={(e) =>
                              setAllValues({
                                ...allValues,
                                sort: e.target.value,
                              })
                            }
                          />
                          <label
                            title="item4 comm_item border"
                            htmlFor="forprice_low_high"
                          >
                            Price: Low to High
                          </label>
                        </div>
                        <div className="options dropdownOpt mt-1 hvr_clr py-2 ">
                          <input
                            type="radio"
                            name="sort"
                            id="forpricehigh_low"
                            value="price_high_to_low"
                            onChange={(e) =>
                              setAllValues({
                                ...allValues,
                                sort: e.target.value,
                              })
                            }
                          />
                          <label
                            title="item4 comm_item border"
                            htmlFor="forpricehigh_low"
                          >
                            Price: High to Low
                          </label>
                        </div>

                        <div className="options dropdownOpt mt-1 hvr_clr py-2">
                          <input
                            type="radio"
                            name="sort"
                            id="auction_ending"
                            value="auction_ending_soon"
                            onChange={(e) =>
                              setAllValues({
                                ...allValues,
                                sort: e.target.value,
                              })
                            }
                          />
                          <label
                            title="item4 comm_item border"
                            htmlFor="auction_ending"
                          >
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

          <div className=" clubraredroplist_wrp">
            <InfiniteScroll
              pageStart={0}
              loadMore={() => fetchMoreData(clubrareDropsRecentTNull)}
              hasMore={!clubrareDropsRecentTNull}
            >
              <div className="row">
                <div className="grid grid-cols-4 gap-y-8 gap-x-8 md:gap-x-8 maxgridcardwrp">
                  {clubrareRecentDrops.map((ele: any, i: number) => (

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
                          onSale={ele?.on_sale}
                          list={ele}
                          auction_detail={ele?.auctionDetails}
                          itemDetails={ele}
                          likeCount={ele.total_like}
                        />
                      }
                    </div>
                  ))}
                </div>
              </div>
            </InfiniteScroll>
          </div>

          {listLoading && (
            //  <Spinner />
            <div className="row cardskeleton_wrp">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((loading) => (
                <div className=" cardskeleton_inner" key={loading}>
                  <CardSkeleton />
                </div>
              ))}
            </div>
          )}

          {(!clubrareRecentDrops || clubrareRecentDrops?.length === 0) &&
            !listLoading && (
              <div className="w-full py-6 flex items-center justify-center flex-row md:flex-col">
                <div className="flex items-start flex-col justify-center md:items-center">
                  <span className="text-24 text-blue font-bold mb-1">
                    No Items Available
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
}

export default DropsList;
