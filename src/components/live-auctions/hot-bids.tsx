import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { routeMap } from '../../router-map';
import { useSelector } from 'react-redux';
import { Spinner } from '../spinner';
const BidCard = React.lazy(() => import('../bit-card'));

function HotBids({ wrapperClass }: any) {
  const isLoading = useSelector(
    (state: any) => state.exploreReducer.auction_loading,
  );
  const auctionItems = useSelector(
    (state: any) => state.exploreReducer.hotBidsItems,
  );
  const [updatedActionItems, setUpdatedActionItems]: any = useState([]);
  const [pageNo, setPageNo]: any = useState(0);

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

  useEffect(() => {
    setTimeout(() => {
      setUpdatedActionItems([...updatedActionItems, ...auctionItems]);
    }, 1500);
    setPageNo(pageNo + 1);
  }, [auctionItems]);

  return (
    <React.Fragment>
      {updatedActionItems?.length > 0 && (
        <div className={wrapperClass}>
          <div className="container-fluid">
            <div>
              <div className="flex flex-row justify-between items-center ">
                <div className=" flex text-16 lg:text-22 text-blue font-semibold hot_bid_wrp">
                  Hot Bids
                </div>
                <Link to={routeMap.liveAuctions.index}>
                  <div className="flex items-center space-x-1"></div>
                </Link>
              </div>
              <div className="mt-10 clubraredroplist_wrp">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <Slider {...settings} className="cmn_club_card_wrp">
                    {updatedActionItems?.length > 0 ? (
                      updatedActionItems.map((ele: any, i: number) => (
                        <BidCard
                          collectible={ele?.collectible_data}
                          key={i}
                          list={ele}
                          src={ele.image}
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

export default HotBids;
