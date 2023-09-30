import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useSelector } from 'react-redux';
import VideoThumbnail from 'react-video-thumbnail';
import './collection-mod.css';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../components';
import '../../create/create.css';
import '../../profile/edit-profile/edit-profile.css';
import '../../create/create.css';
import '../../../layouts/main-layout/header.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { imgConstants } from '../../../assets/locales/constants';

const ViewPendingCollectible: React.FC<any> = (props) => {
  const { item } = props;

  const { t } = useTranslation();
  const allcategory = useSelector(
    (state: any) => state.categoryReducer.allcategoryitem,
  );

  useEffect(() => {
    const newCategory = allcategory.find(
      ({ _id }: any) => _id === item.category_id,
    );
    if (item?.imageRules?.length) {
      const newArray = item?.imageRules?.map((rule: any) => {
        const oldRule = newCategory?.imageRules?.find(
          ({ _id }: any) => rule.mongoImageId === _id,
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
  }, [item, allcategory]);

  const [carouselimg, setCarouselImg] = useState<string[]>([]);
  const [collectibleImageList, setCollectibleImages] = useState<any>([]);
  const [imgWithType, setImgWithType] = useState({ url: '', type: '' });
  const [attactment, setAttachment] = useState<any>('');
  const [customFieldData, setCustomFieldData] = useState<any>(
    item?.customFields,
  );

  useEffect(() => {
    const { item } = props;
    if (item) {
      const newArray: string[] = [];
      item.imageRules.forEach(({ url }: any) => {
        if (!newArray.includes(url)) newArray.push(url);
      });
      setCarouselImg(newArray);
    }
  }, [props, props.item, props.item?.s3_url]);

  useEffect(() => {
    if (item && item?.s3_url) {
      setImgWithType({ type: item?.file_content_type, url: item?.s3_url });
    }
  }, [item.s3_url]);
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
                  src={
                    attactment
                      ? URL.createObjectURL(product?.imageRule.url)
                      : product?.imageRule.url
                  }
                  alt={product.alternativeText}
                  height="80px"
                  width="200"
                />
              ) : product?.imageRule?.type?.includes('video') ? (
                <VideoThumbnail
                  videoUrl={
                    attactment
                      ? URL.createObjectURL(product?.imageRule.url)
                      : product?.imageRule.url
                  }
                  style={{
                    width: '200px',
                    height: '110px',
                  }}
                />
              ) : product?.imageRule?.type?.includes('audio') ? (
                <img
                  className=""
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

  return (
    <div
      className="collection-modal"
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b0',
        position: 'fixed',
        zIndex: 99999,
      }}
    >
      <div
        className="collection-modal-inner pending_coll_wrp"
        style={{
          width: '70%',
          backgroundColor: 'white',
          minWidth: '300px',
          position: 'relative',
        }}
      >
        <div
          className="modal text-center"
          id="collectionmodal"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-content">
            <span aria-hidden="true" onClick={props.hide} className="close_btn">
              X
            </span>
            <div className="collection_modal_inner">
              <h2 className="text-center mb-4">View Collectible</h2>
              <div className="row">
                <div className="col-6 edit_coll_left">
                  <div className="collection_form_wrp text-left">
                    <div id="collectionform">
                      <div className="comm_input_wrp">
                        <label>
                          {t('create.Title')}{' '}
                          <span className="text-danger "> * </span>
                        </label>
                        <input
                          type="text"
                          className="inpt responsive-placeholder bg-transparent border-b border-solid border-black
                      w-full "
                          name="title"
                          disabled
                          id="displayName"
                          value={item?.title || ''}
                          placeholder="Enter token name"
                        />
                      </div>
                      <div className="comm_input_wrp">
                        <label>Description</label>
                        <input
                          type="text"
                          className="inpt responsive-placeholder bg-transparent border-b border-solid border-black
                          w-full"
                          name="description"
                          disabled
                          id="collectionDescription"
                          value={item?.description || ''}
                          placeholder="Spreads some words about your token collection"
                        />
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="comm_input_wrp">
                            <label>Category</label>
                            <input
                              type="text"
                              className="inpt responsive-placeholder bg-transparent border-b border-solid border-black
                          w-full"
                              name="category"
                              id="shortUrl"
                              value={
                                allcategory
                                  .filter((x: any) => x._id == item.category_id)
                                  .map((x: any) => x.name)
                                  .toString() || ''
                              }
                              placeholder=""
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="">
                          <div className="text-14 md:text-15 text-blue font-semibold  mt- mb-2 md:mt-0">
                            Properties(Optional)
                          </div>
                          {customFieldData?.length > 0 ? (
                            customFieldData &&
                            customFieldData?.map((elm: any, i: any) => {
                              if (elm.key || elm.value) {
                                return (
                                  <div
                                    className="view_pen_properties comm_input_wrp text-left row"
                                    key={i}
                                  >
                                    <div className="col-6">
                                      <input
                                        className="responsive-placeholder bg-transparent border-b border-solid relative_fld
                                        w-full inputF"
                                        placeholder={t('create.Size')}
                                        name="size"
                                        value={elm.key}
                                        disabled
                                        maxLength={10}
                                      />
                                    </div>
                                    <div className="col-6">
                                      <div className="properties_size">
                                        <input
                                          className="responsive-placeholder bg-transparent border-b border-solid relative_fld
                                                    w-full inputF"
                                          placeholder="M"
                                          name="m"
                                          value={elm.value}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })
                          ) : (
                            <div className="view_pen_properties comm_input_wrp text-left row">
                              <div className="col-6">
                                <input
                                  className="responsive-placeholder bg-transparent border-b border-solid relative_fld
                                w-full inputF"
                                  placeholder={t('create.Size')}
                                  name="size"
                                  disabled
                                  maxLength={10}
                                />
                              </div>
                              <div className="col-6">
                                <div className="properties_size">
                                  <input
                                    className="responsive-placeholder bg-transparent border-b border-solid relative_fld
                                            w-full inputF"
                                    placeholder="M"
                                    name="m"
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="comm_input_wrp">
                        <label>Royalities</label>
                        <input
                          type="text"
                          className="inpt responsive-placeholder bg-transparent border-b border-solid border-black w-full"
                          name="royalities"
                          id="shortUrl"
                          disabled
                          value={item.royalties || ''}
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 edit_coll_right">
                  <div className="row ext-center">
                    <div className="adjust-modal editmodal viewpending_modal">
                      {!imgWithType.type ? (
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
                                        className="sliderimg_wrp"
                                        style={{
                                          padding: 0,
                                          minHeight: '430px',
                                        }}
                                      >
                                        <div>
                                          {image?.imageRule?.type?.includes(
                                            'image',
                                          ) ? (
                                            <div
                                              key={i}
                                              className="view_collection_imgs"
                                            >
                                              <img
                                                key={i}
                                                src={
                                                  attactment
                                                    ? URL.createObjectURL(
                                                      image.imageRule.url,
                                                    )
                                                    : image.imageRule.url
                                                }
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
                                                  src={
                                                    attactment
                                                      ? URL.createObjectURL(
                                                        image.imageRule.url,
                                                      )
                                                      : image.imageRule.url
                                                  }
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
                                          <div
                                            key={i}
                                            className="view_collection_imgs"
                                          >
                                            <img
                                              key={i}
                                              src={
                                                image.localUrl
                                                  ? URL.createObjectURL(
                                                    image.localUrl,
                                                  )
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
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button type="button" className="mintbtn" onClick={props.hide}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPendingCollectible;
