import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { routeMap } from '../../router-map';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMostViewedAuctionCollectiblesAction } from '../../redux';
import './live-auction.scss';
import CardSkeleton from '../skeleton/card-skeleton';
const BidCard = React.lazy(() => import('../bit-card'));

function MostViews({ wrapperClass }: any) {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: any) => state.exploreReducer.auction_loading,
  );
  const auctionItems = useSelector(
    (state: any) => state.exploreReducer.mostViewedItems,
  );
  const [updatedActionItems, setUpdatedActionItems]: any = useState([]);
  const [dayNo, setDayNo]: any = useState('all');

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
    if (dayNo !== 'all') {
      setTimeout(() => {
        setUpdatedActionItems(auctionItems);
      }, 1500);
    } else {
      setTimeout(() => {
        setUpdatedActionItems(auctionItems);
      }, 1500);
    }
  }, [auctionItems]);

  const onChangeOption = async (eventKey: any) => {
    if (eventKey === 'all') {
      setDayNo(eventKey);
    } else {
      setDayNo(eventKey);
    }
    await dispatch(fetchMostViewedAuctionCollectiblesAction(1, eventKey));
  };

  return (
    <React.Fragment>
      {(updatedActionItems?.length > 0 || dayNo !== 'all') && (
        <div className="most_view_main_wrp">
          <div className={wrapperClass}>
            <div className="container-fluid">
              <div className="most_view_main">
                <div className=" justify-between items-center ">
                  <div className=" row mostview_wrp">
                    <div className="col-6 mostview_left">
                      <h1>Most Viewed</h1>
                    </div>
                    <div className="col-6 d-flex text-right mostview_right">
                      <Dropdown onSelect={onChangeOption}>
                        <Dropdown.Toggle variant="" id="dropdown-basic">
                          {dayNo === 'all' ? 'All Time' : `Last ${dayNo} days`}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item eventKey="all">All time</Dropdown.Item>
                          <Dropdown.Item eventKey="1">1 day</Dropdown.Item>
                          <Dropdown.Item eventKey="7"> 7 days</Dropdown.Item>
                          <Dropdown.Item eventKey="30">30 days</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
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
                      {updatedActionItems.map((ele: any, i: number) => (
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
                      ))}
                    </Slider>
                  )}

                  {(!updatedActionItems || updatedActionItems?.length === 0) &&
                    !isLoading && (
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
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default MostViews;
