import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './explore.scss';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  AllcollectionCategory,
  ExploreAction,
  ExploreAllCollections,
  UpdateExplorePageNo,
} from '../../redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  EXPLORE_LIST_LOADING,
  SEARCH_KEYWORD,
  UPDATE_EXPLORE_PAGE,
} from '../../redux/types';

function ExploreFilter(props: any) {
  const searchCategory: any = useLocation();
  const { wrapperClass } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const search_keyword = useSelector((state: any) => state.exploreReducer.search_keyword);
  const allcollectionitem = useSelector((state: any) => state.exploreReducer.allCollection);
  const allcategory = useSelector((state: any) => state.categoryReducer.allcategoryitem);
  const searchval = search_keyword ? search_keyword : '';
  const [allValues, setAllValues] = useState({
    network: '',
    category: '',
    collection_address: '',
    sale_type: '',
    price: '',
    sort: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filterCollection, setfilterCollection] = useState([]);
  const [networkmval, Setnetworkmval] = useState('Network');
  const [categoryitem, setcategoryitem] = useState('Category');
  const [collectionsitem, setcollectionsitem] = useState<any>('Collections');
  const [saletypeitem, Setsaleypeitem] = useState<any>('Sale Type');
  const [showNetwork, setShowNetwork] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const refNetwork: any = useRef();
  const refCategory: any = useRef();
  const refClloection: any = useRef();
  const refSortBy: any = useRef();

  useEffect(() => {
    dispatch(AllcollectionCategory());
  }, []);

  const handleResetData = useCallback(async () => {    
    dispatch({ type: EXPLORE_LIST_LOADING, payload: true });
    history.replace({
      pathname: '/explore',
      state: '',
    });
    await dispatch(UpdateExplorePageNo(1));
    setAllValues({
      network: '',
      category: '',
      collection_address: '',
      sale_type: '',
      price: '',
      sort: '',
    });
    Setsaleypeitem("Sale Type");
    Setnetworkmval("Network");
    setcategoryitem("Category");
    setcollectionsitem("Collections");
    // dispatch({ type: SEARCH_KEYWORD, payload: "" });
    // dispatch({ type: EXPLORE_LIST_LOADING, payload: false });
    window.scrollTo(0, 0);
    props.getFilterValues(allValues);
  },[]);

  const getList = async () => {    
    setIsLoading(true);
    await dispatch({ type: EXPLORE_LIST_LOADING, payload: true });
    try {
      await dispatch(
        ExploreAction(
          1,
          allValues?.network,
          allValues?.collection_address,
          searchCategory.state ? searchCategory.state : allValues?.category,
          allValues?.sort,
          allValues?.sale_type,
          searchval,
        ),
      );
      await dispatch({ type: UPDATE_EXPLORE_PAGE, payload: 2 });
      dispatch({ type: EXPLORE_LIST_LOADING, payload: false });
    } catch (err) {
      dispatch({ type: EXPLORE_LIST_LOADING, payload: false });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    props.getFilterValues(allValues);
    getList();
    setShowNetwork(false);
    setShowCategory(false);
    setShowCollection(false);
    setShowSortBy(false);
  }, [allValues, search_keyword]);

  useEffect(() => {
    if (allcollectionitem && allcollectionitem.length > 0) {
      setfilterCollection(allcollectionitem);
    }
  }, [allcollectionitem]);

  useEffect(() => {
    if (searchCategory && searchCategory?.state) {
      const searchValue =
        searchCategory.state.substring(0, 1).toUpperCase() +
        searchCategory.state.substring(1);
      setcategoryitem(searchValue);
    }
    dispatch(ExploreAllCollections());
  }, []);

  const categoryHandle = useCallback((e: any) => {    
    const newCategory = allcollectionitem.filter((item: any) => {
      return item.displayName
        ?.toLowerCase()
        .includes(e.target.value?.toLowerCase());
    });
  setfilterCollection(newCategory);
  },[allcollectionitem]);

  const handleCloseToggle = useCallback((e: any) => {
    const id = e.target.id;
    if (id === 'network') {
      setShowNetwork(true);
      setShowCategory(false);
      setShowCollection(false);
      setShowSortBy(false);
    }

    if (id === 'category') {
      setShowCategory(true);
      setShowNetwork(false);
      setShowCollection(false);
      setShowSortBy(false);
    }

    if (id === 'collection') {
      setShowCollection(true);
      setShowNetwork(false);
      setShowCategory(false);
      setShowSortBy(false);
    }

    if (id === 'sortBy') {
      setShowSortBy(true);
      setShowNetwork(false);
      setShowCategory(false);
      setShowCollection(false);
    }
  },[]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        showNetwork &&
        refNetwork.current &&
        !refNetwork.current.contains(e.target)
      ) {
        setShowNetwork(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showNetwork]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        showCategory &&
        refCategory.current &&
        !refCategory.current.contains(e.target)
      ) {
        setShowCategory(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showCategory]);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (
        showCollection &&
        refClloection.current &&
        !refClloection.current.contains(e.target)
      ) {
        setShowCollection(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showCollection]);

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
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showSortBy]);

  // Clear Search Handler
  const clearSearchHandler  = async () => {
    await dispatch({ type: SEARCH_KEYWORD, payload: '' });
  }

  return (
    <>
    <div
      className={
        history.location.pathname === '/explore'
          ? 'container-fluid'
          : wrapperClass
      }
    >
      <div className="row club_expl_filt_main_head p-0 m-0  ">
        <div className="col-6 pl-0">
          <div className="cmn_title">{t('Explore')}</div>
          <div className="club_head_tabs_wrp club_head_tabs_wrp_desktop">
            <div className="club_head_tab aaaa">
              <input
                type="radio"
                id="sale_type"
                checked={saletypeitem === 'Sale Type'}
                value=""
                onClick={() => {
                  window.scrollTo(0, 0);
                  Setsaleypeitem('Sale Type');
                }}
                name="sale_type"
                onChange={(e) =>
                  setAllValues({
                    ...allValues,
                    sale_type: e.target.value,
                  })
                }
              />
              <label className="aaaa" htmlFor="sale_type">
                All
              </label>
            </div>

            <div className="club_head_tab aaaa">
              <input
                type="radio"
                id="Fixed Price"
                value="fixed_price"
                onClick={() => {
                  window.scrollTo(0, 0);
                  Setsaleypeitem('Fixed Price');
                }}
                name="sale_type"
                onChange={(e) =>
                  setAllValues({
                    ...allValues,
                    sale_type: e.target.value,
                  })
                }
              />
              <label className="aaaa" htmlFor="Fixed Price">
                Fixed Price
              </label>
            </div>

            <div className="club_head_tab">
              <input
                type="radio"
                id="Time_Auction"
                value="timed_auction"
                onClick={() => {
                  window.scrollTo(0, 0);
                  Setsaleypeitem('Time Auction');
                }}
                name="sale_type"
                onChange={(e) =>
                  setAllValues({
                    ...allValues,
                    sale_type: e.target.value,
                  })
                }
              />
              <label className="aaaa" htmlFor="Time_Auction">
                Time Auction
              </label>
            </div>

            <div className="club_head_tab aaaa">
              <input
                type="radio"
                id="notsale"
                value="not_for_sale"
                onClick={() => {
                  window.scrollTo(0, 0);
                  Setsaleypeitem('Not For Sale');
                }}
                name="sale_type"
                onChange={(e) =>
                  setAllValues({
                    ...allValues,
                    sale_type: e.target.value,
                  })
                }
              />
              <label className="aaaa" htmlFor="notsale">
                Not For Sale
              </label>
            </div>
          </div>
          <div className="club_head_tabs_wrp club_head_tabs_wrp_responsive">
            <Dropdown>
              <Dropdown.Toggle>All</Dropdown.Toggle>

              <Dropdown.Menu className="club_expl_fil_dropdown">
                <div>
                  <div className="options dropdownOptWrp">
                    <div className="options dropdownOpt mt-1 hvr_clr py-2">
                      <div className="club_head_tab aaaa">
                        <input
                          type="radio"
                          id="sale_type"
                          defaultChecked
                          value=""
                          onClick={() => {
                            window.scrollTo(0, 0);
                            Setsaleypeitem('Sale Type');
                          }}
                          name="sale_type"
                          onChange={(e) =>
                            setAllValues({
                              ...allValues,
                              sale_type: e.target.value,
                            })
                          }
                        />
                        <label className="aaaa" htmlFor="sale_type">
                          All
                        </label>
                      </div>
                    </div>
                    <div className="options dropdownOpt mt-1 hvr_clr py-2 ">
                      <div className="club_head_tab aaaa">
                        <input
                          type="radio"
                          id="Fixed Price"
                          value="fixed_price"
                          onClick={() => {
                            window.scrollTo(0, 0);

                            Setsaleypeitem('Fixed Price');
                          }}
                          name="sale_type"
                          onChange={(e) =>
                            setAllValues({
                              ...allValues,
                              sale_type: e.target.value,
                            })
                          }
                        />
                        <label className="aaaa" htmlFor="Fixed Price">
                          Fixed Price
                        </label>
                      </div>
                    </div>
                    <div className="options dropdownOpt mt-1 hvr_clr py-2 ">
                      <div className="club_head_tab">
                        <input
                          type="radio"
                          id="Time_Auction"
                          value="timed_auction"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            Setsaleypeitem('Time Auction');
                          }}
                          name="sale_type"
                          onChange={(e) =>
                            setAllValues({
                              ...allValues,
                              sale_type: e.target.value,
                            })
                          }
                        />
                        <label className="aaaa" htmlFor="Time_Auction">
                          Time Auction
                        </label>
                      </div>
                    </div>

                    <div className="options dropdownOpt mt-1 hvr_clr py-2">
                      <div className="club_head_tab aaaa">
                        <input
                          type="radio"
                          id="notsale"
                          value="not_for_sale"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            Setsaleypeitem('Not For Sale');
                          }}
                          name="sale_type"
                          onChange={(e) =>
                            setAllValues({
                              ...allValues,
                              sale_type: e.target.value,
                            })
                          }
                        />
                        <label className="aaaa" htmlFor="notsale">
                          Not For Sale
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="col-6 pr-0 club_expl_all_filt_wrp text-end">
          <div className="d-flex">
            {(allValues && allValues?.network) ||
            allValues?.category ||
            allValues?.collection_address ||
            allValues?.price ||
            allValues?.sale_type ||
            allValues?.sort ||
            searchCategory.state ? (
              <div className="filter_Reset" onClick={() => handleResetData()}>
                Reset
              </div>
            ) : (
              <div className="filter_by_head">Filter by</div>
            )}
            <div className="club_expl_filt_wrp" ref={refNetwork}>
              <Dropdown show={showNetwork}>
                <Dropdown.Toggle onClick={handleCloseToggle} id="network">
                  {networkmval.toString().substring(0, 10)}
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
                            value=""
                            checked={networkmval === 'Network'}
                            onClick={() => {
                              window.scrollTo(0, 0);
                              Setnetworkmval('Network');
                            }}
                            onChange={(e) =>
                              setAllValues({
                                ...allValues,
                                network: e.target.value,
                              })
                            }
                          />

                          <label htmlFor="Allnetwork"> All</label>
                        </div>

                        <div className="options dropdownOpt mt-1 hvr_clr py-2">
                          <input
                            type="radio"
                            name="network"
                            id="Ethereumfor"
                            value="1"
                            onClick={() => {
                              window.scrollTo(0, 0);
                              Setnetworkmval('Ethereum');
                            }}
                            onChange={(e) =>
                              setAllValues({
                                ...allValues,
                                network: e.target.value,
                              })
                            }
                          />

                          <label htmlFor="Ethereumfor">Ethereum</label>
                        </div>

                        <div className="options dropdownOpt mt-1 hvr_clr py-2">
                          <input
                            type="radio"
                            name="network"
                            id="klytnfor"
                            value="2"
                            onClick={() => {
                              window.scrollTo(0, 0);
                              Setnetworkmval('Klaytn');
                            }}
                            onChange={(e) =>
                              setAllValues({
                                ...allValues,
                                network: e.target.value,
                              })
                            }
                          />
                          <label htmlFor="klytnfor"> Klaytn</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="club_expl_filt_wrp" ref={refCategory}>
              <Dropdown show={showCategory}>
                <Dropdown.Toggle onClick={handleCloseToggle} id="category">
                  {categoryitem.toString().substring(0, 10)}
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
                            checked={categoryitem == 'Category'}
                            id="Catefor"
                            value=""
                            onClick={() => {
                              window.scrollTo(0, 0);
                              history.replace({
                                pathname: '/explore',
                                state: '',
                              });
                              setcategoryitem('Category');
                            }}
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
                              <>
                                <div
                                  className="options hvr_clr dropdownOpt py-2"
                                  key={i}
                                >
                                  <input
                                    type="radio"
                                    name="category"
                                    checked={val.name == categoryitem}
                                    id={val.name.toLowerCase()}
                                    value={val.name.toLowerCase()}
                                    onClick={() => {
                                      window.scrollTo(0, 0);
                                      history.replace({
                                        pathname: '/explore',
                                        state: '',
                                      });
                                      // setcategoryitem(val.name)
                                      if (val.name.length > 15) {
                                        setcategoryitem(
                                          val.name.toString().substring(0, 17) +
                                            '....',
                                        );
                                      } else {
                                        setcategoryitem(val.name);
                                      }
                                    }}
                                    onChange={(e) =>
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
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="club_expl_filt_wrp" ref={refClloection}>
              <Dropdown show={showCollection}>
                <Dropdown.Toggle onClick={handleCloseToggle} id="collection">
                  {collectionsitem.toString().substring(0, 10)}
                </Dropdown.Toggle>

                <Dropdown.Menu className="club_expl_fil_dropdown club_expl_fil_dropdown_collection">
                  <div className="input-group input-group-sm mb-3">
                    <input
                      placeholder="Search Collections"
                      type="text"
                      onChange={categoryHandle}
                      className="form-control collection_search"
                      aria-label="Small"
                      aria-describedby="inputGroup-sizing-sm"
                    />
                  </div>
                  <div className="mt-3">
                    <div>
                      <div className="options main_bx_menu dropdownOptWrp">
                        <div className="options hvr_clr dropdownOpt py-2 mt-1 ">
                          <input
                            type="radio"
                            name="collection_address"
                            id="allcollections"
                            value=""
                            defaultChecked
                            checked={collectionsitem === 'Collections'}
                            onClick={() => {
                              window.scrollTo(0, 0);
                              setcollectionsitem('Collection');
                            }}
                            onChange={(e) =>
                              setAllValues({
                                ...allValues,
                                collection_address: e.target.value,
                              })
                            }
                          />
                          <label htmlFor="allcollections">All</label>
                        </div>
                        {filterCollection?.map((item: any, i: number) => {
                          return (
                            <div key={i} className="options dropdownOpt">
                              <input
                                type="radio"
                                id={item._id}
                                className="mt-3"
                                name="collection_address"
                                value={item.collection_address}
                                onClick={() => {
                                  window.scrollTo(0, 0);
                                  setcollectionsitem(item.displayName);
                                }}
                                onChange={(e) =>
                                  setAllValues({
                                    ...allValues,
                                    collection_address: e.target.value,
                                  })
                                }
                              />
                              <label htmlFor={item._id}>
                                {item && item.displayName?.length > 12
                                  ? item.displayName
                                      .toString()
                                      .substring(0, 13) + '...'
                                  : item.displayName}
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
              <Dropdown show={showSortBy} ref={refSortBy}>
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
                          onChange={(e) => {
                            window.scrollTo(0, 0);
                            setAllValues({
                              ...allValues,
                              sort: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="recentlyadded">Recently Added</label>
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
      </div>
    </div>
      {searchval && 
        <div className="aaaa searched_value">
          <span className='srch_val'>
            {searchval}
          </span>
          <span onClick={clearSearchHandler} className='cross_search'>X</span>
        </div>
      }
    </>
  );
}
export default memo(ExploreFilter);
