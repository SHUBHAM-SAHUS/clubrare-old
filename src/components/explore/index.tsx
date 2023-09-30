import React, { useState, useEffect, memo } from 'react';
import './explore.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ExploreAction, ExploreAllCollections } from '../../redux';
import InfiniteScroll from 'react-infinite-scroller';
import { useHistory, useLocation } from 'react-router-dom';
import {
  EXPLORE_LIST_LOADING,
  SEARCH_KEYWORD,
  SET_EXPLORE_IS_NULL,
  SET_EXPLORE_ITEMS,
  UPDATE_EXPLORE_PAGE,
} from '../../redux/types';
import CardSkeleton from '../skeleton/card-skeleton';
const ExploreFilter = React.lazy(() => import('./explore-filter'));
const BidCard = React.lazy(() => import('../bit-card'));

const ExploreContainer=(props: any)=> {
  const dispatch = useDispatch();
  const searchCategory: any = useLocation();
  const { wrapperClass } = props;
  const history = useHistory();
  const exploreListLoading = useSelector((state: any) => {return state.exploreReducer.explore_loading});
  const explorePageNo = useSelector((state: any) => {return state.exploreReducer.explorePageNo});
  const exploreIsNull = useSelector((state: any) => {return state.exploreReducer.exploreIsNull});
  const explore = useSelector((state: any) => state.exploreReducer.exploreItems);
  const search_keyword = useSelector((state: any) => state.exploreReducer.search_keyword);
  const searchval = search_keyword ? search_keyword : '';
  const [isLoading, setIsLoading] = useState(false);
  const [categoryitem, setcategoryitem] = useState('Category');
  const [allValues, setAllValues] = useState({
    network: '',
    category: '',
    collection_address: '',
    sale_type: '',
    price: '',
    sort: '',
  });

  const fetchMoreExploreData = async (exploreIsNullValue: boolean) => {
    if (
      !isLoading &&
      !exploreIsNullValue &&
      explore.length % 20 === 0 &&
      explorePageNo > 1
    ) {      
      callListAPi();
    }
  };

  const getFilterValues = (data: any) => {    
    setAllValues(data);
    dispatch({ type: SET_EXPLORE_ITEMS, payload: [] });
    dispatch({ type: SET_EXPLORE_IS_NULL, payload: true });
    dispatch({ type: UPDATE_EXPLORE_PAGE, payload: 1 });
    // dispatch({ type: SEARCH_KEYWORD, payload: '' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (history.location.pathname === '/explore') {
      return () => {
        dispatch({ type: SET_EXPLORE_ITEMS, payload: [] });
        dispatch({ type: SET_EXPLORE_IS_NULL, payload: true });
        dispatch({ type: UPDATE_EXPLORE_PAGE, payload: 1 });
        dispatch({ type: SEARCH_KEYWORD, payload: '' });
      };
    }
    if (searchCategory && searchCategory?.state === '') {
      dispatch(ExploreAllCollections());
      setcategoryitem('Category');
    }
  }, []);

  const callListAPi = async () => {
    setIsLoading(true);
    await dispatch({ type: EXPLORE_LIST_LOADING, payload: true });
    try {
      await dispatch(
        ExploreAction(
          Number(explorePageNo),
          allValues?.network,
          allValues?.collection_address,
          searchCategory.state ? searchCategory.state : allValues?.category,
          allValues?.sort,
          allValues?.sale_type,
          searchval,
        ),
      );
      await dispatch({ type: EXPLORE_LIST_LOADING, payload: false });
    } catch (err) {
      dispatch({ type: EXPLORE_LIST_LOADING, payload: false });
    }
    await dispatch({ type: UPDATE_EXPLORE_PAGE, payload: explorePageNo + 1 });
    setIsLoading(false);
  };

  return (
   <React.Fragment>
    <div
      className={
        history.location.pathname === '/explore'
          ? 'container-fluid'
          : wrapperClass
      }
    >
      <ExploreFilter getFilterValues={getFilterValues} />
      <InfiniteScroll
        pageStart={0}
        loadMore={() => fetchMoreExploreData(exploreIsNull)}
        hasMore={!exploreIsNull}
      >
          <div className="explore_cmn_page_wrp">
            <div className="grid grid-cols-4 gap-y-8 gap-x-13 md:gap-x-13 mt-16 md:mt-8 liveauctipagerow">
              {explore.map((ele: any, i: number) => (
                <div key={i} className="cmn_club_card_wrp">
                  {
                    <BidCard
                      collectible={ele?.collectible_data}
                      collectibleType={ele?.auctionDetails?.auctionType || null}
                      closingTime={ele?.auctionDetails?.closingTime || null}
                      startingTime={ele?.auctionDetails?.startingTime || null}
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
      {exploreListLoading && (
        <div className="row cardskeleton_wrp">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((loading) => (
            <div className=" cardskeleton_inner" key={loading}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      )}
      {(!explore || explore?.length === 0) && !exploreListLoading && (
        <div className="w-full py-6 flex items-center justify-center flex-row md:flex-col explore_cmn_page_wrp">
          <div className="flex items-start flex-col justify-center md:items-center">
            <span className="text-24 text-blue font-bold mb-1">
              No Items Available
            </span>
          </div>
        </div>
      )}
    </div>
    </React.Fragment>
  );
}
export default memo(ExploreContainer);
