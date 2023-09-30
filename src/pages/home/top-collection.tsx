import React, { useState, useEffect } from 'react';
import './top-members.css';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getTopCollectionAction } from '../../redux/actions/create-collectibles-action';
import LazyLoad from 'react-lazyload';
import VideoThumbnail from 'react-video-thumbnail';
import { routeMap } from '../../router-map';
import { imgConstants } from '../../assets/locales/constants';
import CollectionsSkeleton from '../../components/skeleton/collections-skeleton';

function TopCollection({ wrapperClass }: any) {
  const { t } = useTranslation();

  const [membersList, setMembersList] = useState<any>([{}]);
  const [listLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();
  const [dayNo, setDayNo]: any = useState('all');

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
        },
      },
      {
        breakpoint: 374,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    getTopCollection();
  }, [dayNo]);

  const getImgContentTyp = (img: any) => {
    return fetch(img)
      .then((response) => response.headers.get('Content-type'))
      .catch((err) =>{return;});
  };

  const getTopCollection = async () => {
    const result: any = await dispatch(getTopCollectionAction(dayNo));    
    const list: any = [];
    if (result && result?.data?.data) {
      for (const obj of result?.data?.data) {
        await getImgContentTyp(obj.image_id).then((type) => {
          if (type?.split('/')[0]) {
            const content = type?.split('/')[0];
            obj.contentType = content;
            list.push(obj);
          }
        });
      }
    }
    if (dayNo !== 'all') {
      setMembersList(list);
      setIsLoading(false);
    } else {
      setMembersList(list);
      setIsLoading(false);
    }
  };

  const onChangeOption = (eventKey: any) => {
    if (eventKey === 'all') {
      setDayNo(eventKey);
    } else {
      setDayNo(eventKey);
    }
  };

  const goToProfile = (collection_address: any, network_id: any) => {
    history.push(routeMap.topCollection.view(collection_address, network_id));
  };

  return (
    <React.Fragment>
      {(membersList?.length > 0 || dayNo !== 'all') && (
        <div className={wrapperClass}>
          <div className="topcollection_wrp">
            <div className="container-fluid">
              <div
                className="home_buy_sell_dropdown"
                style={{ marginTop: '20px' }}
              >
                <div className="row topcollection_head mb-4">
                  <div className="col-6">
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      Top Collections{' '}
                    </span>
                  </div>
                  <div className="col-6 text-right">
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
              </div>
              <div className="leaderboard_slider text-center">
                {listLoading ? (
                  <CollectionsSkeleton />
                ) : (
                  <Slider {...settings}>
                    {membersList?.length > 0 ? (
                      membersList.map((item: any, index: any) => {
                        return (
                          <div
                            className="leaderboard_card text-center"
                            key={index}
                            onClick={() =>
                              goToProfile(
                                item?.collection_address,
                                item?.network_id,
                              )
                            }
                          >
                            <h3>{index + 1}</h3>
                            <div className="leaderboard_imgwrp text-center">
                              {item.contentType == 'text' ||
                              item.contentType == '' ? (
                                <LazyLoad>
                                  <img
                                    className="mx-auto sldimg"
                                    src={imgConstants.avatar}
                                    alt="avatar"
                                  />
                                </LazyLoad>
                              ) : item.contentType == 'image' ? (
                                <LazyLoad>
                                  <img
                                    className="mx-auto sldimg"
                                    src={item.image_id}
                                    alt="imageId"
                                  />
                                </LazyLoad>
                              ) : item.contentType == 'audio' ? (
                                <div className="">
                                  <figure>
                                    <img
                                      className="mx-auto sldimg audioimg"
                                      src={imgConstants.musicIcon}
                                      alt="musicIcon"
                                    />
                                  </figure>
                                </div>
                              ) : (
                                <VideoThumbnail
                                  className="mx-auto sldimg"
                                  videoUrl={item?.image_id}
                                  style={{
                                    width: '200px',
                                    height: '110px',
                                  }}
                                />
                              )}

                              <p>
                                {item['displayName'] &&
                                item['displayName'].length > 25
                                  ? item['displayName'] + '...'
                                  : item['displayName']}
                              </p>
                              <h1 className="d-flex">
                                {' '}
                                $ {item['doller_amount']?.toFixed(3)}
                              </h1>
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

export default TopCollection;
