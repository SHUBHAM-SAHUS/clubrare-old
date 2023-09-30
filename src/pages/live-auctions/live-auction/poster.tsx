import React, { useEffect, useState, memo } from 'react';
import './live-auction.css';
import { useSelector, useDispatch } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Spinner } from '../../../components';
import VideoThumbnail from 'react-video-thumbnail';
import $ from 'jquery';
import { imgConstants } from '../../../assets/locales/constants';
import { SET_ITEM_DETAILS } from '../../../redux/types';

function Poster(props: any) {
  const contentType = 'image';
  const dispatch = useDispatch();
  const { itemDetails } = props;
  const allcategory = useSelector((state: any) => state.categoryReducer.allcategoryitem);
  const [collectibleImageList, setCollectibleImages] = useState<any>([]);
  const [imgWithType, setImgWithType] = useState({ url: '', type: '' });

  useEffect(() => {
    if (itemDetails && itemDetails?.s3_url) {
      setImgWithType({ type: itemDetails?.file_content_type, url: itemDetails?.s3_url });

    }
  }, [itemDetails, itemDetails?.s3_url]);

  useEffect(() => {
    return () => {
      dispatch({ type: SET_ITEM_DETAILS, payload: [] });
    };
  }, []);

  useEffect(() => {
    const newCategory = allcategory.find(
      ({ _id }: any) => _id === itemDetails?.category_id,
    );
    if (itemDetails?.imageRules?.length) {
      const newArray = itemDetails?.imageRules?.map((rule: any) => {
        const oldRule = newCategory?.imageRules?.find(
          ({ _id }: any) => rule?.mongoImageId === _id,
        );
        return {
          ...rule,
          name: oldRule?.name,
          isRequired: oldRule?.isRequired,
          description: oldRule?.description,
        };
      });
      setCollectibleImages(newArray);
    }
  }, [itemDetails, allcategory]);
  const newarray = [...[{ imageRule: imgWithType }], ...collectibleImageList];
  const renderCustomThumbs = () => {
    const thumbList = newarray?.map((product: any, i: any) => {
      return (
        <>
          {product?.imageRule?.type ? (
            <picture key={i}>
              {product?.imageRule?.type?.includes('image') ? (
                <img
                  key={product._id}
                  src={product?.imageRule.url}
                  alt={product.alternativeText}
                  height="80px"
                  width="200"
                />
              ) : product?.imageRule?.type?.includes('video') ? (
                <VideoThumbnail cors="false"
                  videoUrl={product?.imageRule?.url}
                  style={{
                    width: '200px',
                    height: '110px',
                  }}
                />
              ) : product?.imageRule?.type?.includes('audio') ? (
                <img
                  src={imgConstants.musicIcon}
                  alt="music-icon"
                  style={{ height: '110px', border: '1px solid black' }}
                />
              ) : null}
            </picture>
          ) : (
            <picture key={i}>
              {product?.url && (
                <img
                  key={product._id}
                  src={
                    product.localUrl
                      ? URL.createObjectURL(product.localUrl)
                      : product.url
                  }
                  alt={product.alternativeText}
                  height="80px"
                  width="200"
                />
              )}
            </picture>
          )}
        </>
      );
    });
    return thumbList;
  };

  const handleHover = () => {
    $('.thumb').mouseover(function () {
      // retrieve image source
      const source: any = $(this).find('picture').find('img').attr('src'); // retrieve image source of hovered image
      $('.slide.selected').find('img').attr('src', source); // update main image source
    });
  };

  return (
    <>
      <div className={props.wrapperClass + ' item-poster'}>
        <div className="">
          <div className={`flex justify-between`}></div>
          {contentType == 'image' ? (
            <div
              className="adjust-modal editmodal viewpending_modal"
              onMouseOver={handleHover}
            >
              {!itemDetails?.file_content_type ? (
                <Spinner />
              ) : (
                <>
                  {newarray.length > 0 ? (
                    <Carousel
                      showArrows={true}
                      dynamicHeight={true}
                      showStatus={false}
                      showThumbs={true}
                      showIndicators={false}
                      swipeable={true}
                      infiniteLoop={true}
                      useKeyboardArrows={true}
                      renderThumbs={renderCustomThumbs}
                    >
                      {newarray &&
                        newarray.map((image: any, i: any) => {
                          return (
                            <>
                              <div
                                key={i}
                                className="sliderimg_wrp ppp"
                                style={{
                                  padding: 0,
                                  minHeight: '430px',
                                  border: 0,
                                }}
                              >
                                <div>
                                  {image?.imageRule?.type?.includes('image') ? (
                                    <div key={i} className="detail_img_wrp">
                                      <img
                                        key={i}
                                        src={image.imageRule.url}
                                        alt="imageUrl"
                                      />
                                    </div>
                                  ) : image?.imageRule?.type?.includes(
                                    'video',
                                  ) ? (
                                    <div>
                                      <video
                                        style={{
                                          width: '100%',
                                          height: '400px',
                                        }}
                                        controls
                                      >
                                        <source
                                          key={i}
                                          src={image.imageRule.url}
                                          type="video/mp4"
                                        />
                                      </video>
                                    </div>
                                  ) : image?.imageRule?.type?.startsWith(
                                    'audio',
                                  ) ? (
                                    <div>
                                      <div>
                                        <img
                                          className=""
                                          src={imgConstants.musicIcon}
                                          alt="music-icon"
                                          style={{
                                            position: 'relative',
                                            marginTop: '10px',
                                            height: '300px',
                                            width: '100%',
                                          }}
                                        />
                                        <audio
                                          controls
                                          className="row-start-1 col-start-1 w-75 rounded-50 bg-white bg-opacity-20 h-60 ml-25 md:h-14 object-contain"
                                          style={{ margin: 'auto' }}
                                        >
                                          <source
                                            src={image.imageRule.url}
                                          ></source>
                                        </audio>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                                {image.url && (
                                  <div key={i} className="detail_img_wrp">
                                    <img
                                      key={i}
                                      src={
                                        image.localUrl
                                          ? URL.createObjectURL(image.localUrl)
                                          : image.url
                                      }
                                      alt="localUrl"
                                    />
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })}
                    </Carousel>
                  ) : null}
                </>
              )}
            </div>
          ) : contentType == 'audio' ? (
            <div>
              <figure>
                <img src={imgConstants.musicIcon} alt="musicIcon" />
              </figure>
              <audio controls style={{ height: '80px', marginLeft: '40px' }}>
                <source src={props.img}></source>
              </audio>
            </div>
          ) : (
            <video
              controls
              style={{ height: 'auto', width: 'auto' }}>
              <source src={props.img} type="video/mp4">
              </source>
            </video>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(Poster);
