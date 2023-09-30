import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { routeMap } from '../../router-map';
import { useSelector } from 'react-redux';
import { Spinner } from '../../components/spinner';
import './live-auction.scss';
import '../../pages/home/home-club.scss';
import CardSkeleton from '../skeleton/card-skeleton';
const BidCard = React.lazy(() => import('../bit-card'));

function LiveAuctions({ wrapperClass }: any) {
  const isLoading = useSelector(
    (state: any) => state.exploreReducer.auction_loading,
  );
  const auctionItems = useSelector(
    (state: any) => state.exploreReducer.liveAuctionItems,
  );
  const [updatedActionItems, setUpdatedActionItems]: any = useState([]);
  const [pageNo, setPageNo]: any = useState(0);
  const history = useHistory();
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
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setUpdatedActionItems(auctionItems);
    }, 1500);
    setPageNo(pageNo + 1);
  }, [auctionItems]);

  const handleClickLiveAuction = () => {
    history.push('/live-auctions');
  };

  return (
    <React.Fragment>
      {updatedActionItems?.length > 0 && (
        <div className={wrapperClass}>
          <div className="container-fluid">
            <div className="live_auction_main mt-5 mb-5">
              <div className=" justify-between items-center ">
                <div className="row live_auction_wrp">
                  <div className="col-6">
                    <h1>Live Auctions </h1>
                  </div>
                  <div className="col-6 viewall_btn_wrp text-right">
                    <button type="button" onClick={handleClickLiveAuction}>
                      View All
                    </button>
                  </div>
                </div>
                <Link to={routeMap.liveAuctions.index}>
                  <div className="flex items-center space-x-1"></div>
                </Link>
              </div>
              <div className="mt-3 clubraredroplist_wrp">
                {isLoading ? (
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
                    {updatedActionItems?.length > 0 ? (
                      updatedActionItems.map((ele: any, i: number) => (
                        <BidCard
                          collectible={ele?.collectible_data}
                          key={i}
                          keys={i}
                          list={ele}
                          headerClass="px-6 mt-6"
                          contentClass="p-0"
                          timer={ele.timer}
                          height={286}
                          name={ele.title}
                          price={ele?.eth_price}
                          collectibleType={
                            ele?.auctionDetails?.auctionType || null
                          }
                          closingTime={ele?.auctionDetails?.closingTime || null}
                          startingTime={
                            ele?.auctionDetails?.startingTime || null
                          }
                          isLiveAuction
                          auction_detail={ele?.auctionDetails}
                          itemDetails={ele}
                          likeCount={ele.total_like}
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

export default LiveAuctions;
