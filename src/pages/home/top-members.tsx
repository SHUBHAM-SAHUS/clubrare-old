import React, { useState, useEffect } from 'react';
import './top-members.css';
import { Dropdown } from 'react-bootstrap';
import {
  getTopBuyersAction,
  getTopSellersAction,
} from '../../redux/actions/top-members-action';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { Spinner } from '../../components/spinner';
import { imgConstants } from '../../assets/locales/constants';
import CollectionsSkeleton from '../../components/skeleton/collections-skeleton';

function TopMembers({ wrapperClass }: any) {
  const [membersList, setMembersList] = useState<any>([{}]);
  const [listLoading, setIsLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('TopBuyers');
  const history = useHistory();
  const dispatch = useDispatch();
  const [dayNo, setDayNo]: any = useState('all');
  const [isBuyerActive, setBuyerActive] = useState(true);
  const [isSellerActive, setSellerActive] = useState(false);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 979,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 649,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          initialSlide: 2.5,
        },
      },
      {
        breakpoint: 374,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          initialSlide: 1.5,
        },
      },
    ],
  };

  useEffect(() => {
    if (membersList.length > 0) {
      getBuyers(dayNo);
      getSellers(dayNo);
    }
  }, []);

  const getBuyers = async (day: any) => {
    const list: any = await dispatch(getTopBuyersAction(day));
    setIsLoading(false);
    setMembersList(list);
  };

  const getSellers = async (day: any) => {
    const list: any = await dispatch(getTopSellersAction(day));
    setMembersList(list);
  };

  const onChangeOption = (event: any) => {
    if (event === 'TopBuyers') {
      setBuyerActive(true);
      setSellerActive(false);
      getBuyers(dayNo);
    } else {
      setBuyerActive(false);
      setSellerActive(true);
      getSellers(dayNo);
    }
    setSelectedCat(event);
  };

  const onChangeOption1 = (eventKey: any) => {
    setDayNo(eventKey);
    if (eventKey === 'all') {
      if (selectedCat === 'TopBuyers') {
        getBuyers(eventKey);
      } else {
        getSellers(eventKey);
      }
    } else if (eventKey === '1') {
      if (selectedCat === 'TopBuyers') {
        getBuyers(eventKey);
      } else {
        getSellers(eventKey);
      }
    } else if (eventKey === '7') {
      if (selectedCat === 'TopBuyers') {
        getBuyers(eventKey);
      } else {
        getSellers(eventKey);
      }
    } else if (eventKey === '30') {
      if (selectedCat === 'TopBuyers') {
        getBuyers(eventKey);
      } else {
        getSellers(eventKey);
      }
    }
  };

  const goToProfile = (address: string) => {
    if (address) history.push(`/${address}`);
  };

  return (
    <React.Fragment>
      {(membersList?.length > 0 || dayNo !== 'all') && (
        <div className={wrapperClass}>
          <div className="leaderboard_main_wrp mt-5">
            <div className="container-fluid">
              <div
                className="home_buy_sell_dropdown"
                style={{ marginTop: '20px' }}
              >
                <div className="row leaderboard_head topcollection_head mb-4">
                  <div className="col-6 d-flex">
                    <h2>Leaderboard </h2>
                    <div className="leaderboard_btn_wrp">
                      <button
                        type="button"
                        className={isBuyerActive ? 'activebtn' : ''}
                        onClick={() => onChangeOption('TopBuyers')}
                      >
                        Buyers
                      </button>
                      <button
                        type="button"
                        className={isSellerActive ? 'activebtn' : ''}
                        onClick={() => onChangeOption('TopSellers')}
                      >
                        Sellers
                      </button>
                    </div>
                  </div>

                  <div className="col-6 text-right">
                    <Dropdown onSelect={onChangeOption1}>
                      <Dropdown.Toggle variant="" id="dropdown-basic">
                        {dayNo === 'all' ? 'All Time' : `Last ${dayNo} days`}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="all">All time</Dropdown.Item>
                        <Dropdown.Item eventKey="1">1 day</Dropdown.Item>
                        <Dropdown.Item eventKey="7">7 days</Dropdown.Item>
                        <Dropdown.Item eventKey="30">30 days</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="leaderboard_slider text-center">
                {listLoading ? (
                  // <Spinner />
                  <CollectionsSkeleton />
                ) : (
                  <Slider {...settings}>
                    {membersList?.length > 0 ? (
                      membersList.map((item: any, index: any) => {
                        return (
                          <div
                            key={index}
                            className="leaderboard_card text-center"
                            onClick={() => goToProfile(item?.wallet_address)}
                          >
                            <h3>{index + 1}</h3>
                            <div className="leaderboard_imgwrp text-center">
                              <img
                                className="mx-auto sldimg"
                                src={
                                  item.image ? item.image : imgConstants.avatar
                                }
                                alt="avatar"
                              />

                              {(item.network_id == 2 ||
                                item.network_id == 1) && (
                                <p>
                                  {item['name'] != ''
                                    ? item['wallet_address']
                                        .toString()
                                        .substring(0, 8) +
                                      '.....' +
                                      item['wallet_address']
                                        .toString()
                                        .substr(
                                          item['wallet_address'].length - 8,
                                        )
                                    : item['name']}
                                </p>
                              )}
                              {(item.network_id == 2 ||
                                item.network_id == 1) && (
                                <h1 className="d-flex">
                                  {' '}
                                  $ {item['doller_amount'].toFixed(3)}
                                </h1>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <React.Fragment>
                        <div className="w-full py-6 flex items-center justify-center flex-row md:flex-col explore_cmn_page_wrp">
                          <div className="flex items-start flex-col justify-center md:items-center">
                            <h1>No Items Available</h1>
                          </div>
                        </div>
                      </React.Fragment>
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

export default TopMembers;
