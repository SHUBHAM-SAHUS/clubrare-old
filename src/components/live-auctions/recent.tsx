import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { routeMap } from '../../router-map';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../components/spinner';
import { ClubrareDropsRecentAction } from '../../redux';
import { SET_CLUBRARE_RECENT__LIST_LOADING } from '../../redux/types';
import CardSkeleton from '../skeleton/card-skeleton';
const BidCard = React.lazy(() => import('../bit-card'));

function RecentAuctions({ wrapperClass }: any) {
  const dispatch = useDispatch();

  const auctionItems = useSelector(
    (state: any) => state.exploreReducer.clubrareDropsRecentItems,
  );
  const [updatedActionItems, setUpdatedActionItems]: any = useState([]);
  const [pageNo, setPageNo]: any = useState(1);

  const [callCategoryList, setCallCategoryList] = useState<boolean>(true);
  const history = useHistory();

  const [listLoading, setIsLoading] = useState(true);

  const settings = {
    swipeToSlide: true,
    infinite: auctionItems.length > 3,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 979,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 649,
        settings: {
          slidesToShow: 1.2,
        },
      },
    ],
  };

  const clickUseEffect = async () => {
    const result = await dispatch(
      ClubrareDropsRecentAction(pageNo, '', '', ''),
    );

    setUpdatedActionItems(result);
  };

  useEffect(() => {
    if (callCategoryList) {
      callListAPi();
    }
  }, [callCategoryList]);

  const callListAPi = async () => {
    dispatch({ type: SET_CLUBRARE_RECENT__LIST_LOADING, payload: true });
    await dispatch(ClubrareDropsRecentAction(pageNo, '', '', ''));
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      {auctionItems?.length > 0 && (
        <div className={wrapperClass} style={{ marginTop: '.5rem' }}>
          <div className="container-fluid">
            <div className="Latest_Drops_main">
              <div className="flex flex-row justify-between items-center row">
                <div className="col-6">
                  <div className=" flex text-16 lg:text-22 text-blue font-semibold Latest_Drops">
                    Latest Drops
                  </div>
                </div>
                <div className="col-6 text-right viewall_btn_wrp">
                  <div className="viewall_btn_wrp">
                    <button
                      type="button"
                      onClick={() => history.push('/clubrare-drops')}
                    >
                      View All
                    </button>
                  </div>
                </div>
                <Link to={routeMap.liveAuctions.index}>
                  <div className="flex items-center space-x-1"></div>
                </Link>
              </div>

              <div className="mt-3 clubraredroplist_wrp">
                {listLoading ? (
                  // <Spinner />
                  <div className="row cardskeleton_wrp">
                    {[1, 2, 3, 4].map((loading) => (
                      <div className=" cardskeleton_inner" key={loading}>
                        <CardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Slider {...settings} className="cmn_club_card_wrp">
                    {auctionItems?.length > 0 ? (
                      auctionItems.map((ele: any, i: number) => (
                        <BidCard
                          key={i}
                          handlerUseEffect={clickUseEffect}
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
                          likeCount={ele?.total_like}
                        />
                      ))
                    ) : (
                      <div className="w-full py-6 flex items-center justify-center flex-row md:flex-col">
                        <div className="flex items-start flex-col justify-center md:items-center">
                          <span className="not_avail">No Items Available</span>
                        </div>
                      </div>
                    )}
                  </Slider>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default RecentAuctions;
