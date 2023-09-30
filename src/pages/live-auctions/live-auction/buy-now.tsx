import React from 'react';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import {
  AGOVICON,
  CryptoIcon,
  CryptoIcon3,
  WethIcon,
  UsdtIcon
} from '../../../components';
import './buy-now.scss';
import { imgConstants } from '../../../assets/locales/constants';

const BuyNow = (props: any) => {
  const connectedNetworkId = localStorage.getItem('networkId');
  const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;

  return (
    <>
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        title=""
        show={props?.show}
        className="details_bidmodal"
        backdrop="static"
      >
        <Modal.Body>
          <div
            className="buynow_modal_wrp"
            style={{ pointerEvents: props.hideCursor ? 'none' : 'auto' }}
          >
            <div className="head_wrp">
              <h1 className="">Buy Now</h1>
              <button onClick={props.onHide}>
                <img src={imgConstants.hamburgerClose} alt="hamburgerClose" />
              </button>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-xm-12 buynow_modal_left">
                {props?.itemDetails?.file_content_type?.includes('image') ? (
                  <figure>
                    <img src={props.itemDetails?.s3_url} alt="file" />
                  </figure>
                ) : props?.itemDetails?.file_content_type?.includes('audio') ? (
                  <div>
                    <figure>
                      <img src={imgConstants.musicIcon} alt="musicIcon" />
                    </figure>
                    <audio
                      controls
                      style={{ height: '80px', marginLeft: '40px' }}
                    >
                      <source src={props.itemDetails?.s3_url}></source>
                    </audio>
                  </div>
                ) : (
                  <video controls style={{ height: 'auto', width: 'auto' }}>
                    <source
                      src={props.itemDetails?.s3_url}
                      type="video/mp4"
                    ></source>
                  </video>
                )}
              </div>
              <div className="col-lg-6 col-md-6 col-xm-12 buynow_modal_right">
                <div className="d-flex justify-content-start">
                  <img
                    src={
                      props.itemDetails?.userObj?.image || imgConstants.avatar
                    }
                    alt="img"
                  />
                  <div className="profile_content">
                    <h2>CREATED BY</h2>
                    <p className="creator_name">
                      {props.itemDetails?.userObj?.name
                        ? props.itemDetails?.userObj?.name
                        : props.itemDetails?.userObj?.wallet_address
                        ? props.itemDetails?.userObj?.wallet_address
                            .toString()
                            .substring(0, 10) +
                          '...' +
                          props.itemDetails?.userObj?.wallet_address
                            .toString()
                            .substring(
                              props.itemDetails?.userObj?.wallet_address
                                .length - 8,
                            )
                        : ''}
                    </p>
                    <p className="creator_date">
                      {moment(props.itemDetails?.created_on).format(
                        ' Do MMMM YYYY',
                      )}
                    </p>
                  </div>
                </div>
                <p className="product_name">{props.itemDetails?.title}</p>
                <div className="row total_price ">
                  <div className="col-lg-2 col-md-2 col-xm-12 total_price_lft">
                    <p className="buy_price">Total</p>
                  </div>
                  <div className="col-lg-10 col-md-10 col-xm-12 d-flex total_price_right justify-content-end align-items-start">
                    {connectedNetworkId == klatynNetworkId ? (
                      props.displayValues.unit === 'KLAY' ? (
                        <CryptoIcon3 size="29" />
                      ) : props.displayValues.unit === 'AGOV' ? (
                        <AGOVICON size="29" />
                      ) : props.displayValues.unit === 'USDT' ? (
                        <UsdtIcon />
                      ) : (
                        ''
                      )
                    ) : props.displayValues.unit === 'ETH' ? (
                      <CryptoIcon size="27" />
                    ) : props.displayValues.unit === 'WETH' ? (
                      <WethIcon size="27" />
                    ) : props.displayValues.unit === 'MPWR' ? (
                      <img
                        src={imgConstants.mpwr_icon}
                        alt="Mpwr Icon"
                        className="mpwr-detail-icon"
                      />
                    ) : props.displayValues.unit === 'USDT' ? (
                      <UsdtIcon />
                    ) : props.displayValues.unit === 'AGOV' ? (
                      <AGOVICON size="29" />
                    ) : (
                      ''
                    )}
                    <div className="text-right">
                      <p className="buy_price">
                        <span>{props?.displayValues.value}</span>{' '}
                        {props?.displayValues.unit
                          ? props.displayValues.unit
                          : ''}
                      </p>
                      <p className="buy_curr">
                        {props.usdAmount ? `$ ${props.usdAmount} USD` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="fee_dtl_wrp">
                  <div className="fee_dtl_inner">
                    <div className="fee_dtl_inner_lft_wrp">
                      <p>Royalty fee</p>
                    </div>
                    <div className="fee_dtl_inner_middle_wrp">
                      <h6 className=" details_bid_price">
                        <span>
                          {(
                            (Number(props?.displayValues.value) *
                              props?.itemDetails?.royalties) /
                            100
                          ).toFixed(6)}{' '}
                          {props?.displayValues.unit}
                        </span>
                      </h6>
                    </div>
                    <div className="fee_dtl_inner_right_wrp">
                      <p className=" ml-1 ">
                        {props?.royaltiesusd
                          ? `($ ${props?.royaltiesusd} USD)`
                          : ''}
                      </p>
                    </div>
                  </div>

                  <div className="fee_dtl_inner">
                    <div className="fee_dtl_inner_lft_wrp">
                      <p>Platform fee</p>
                    </div>
                    <div className="fee_dtl_inner_middle_wrp">
                      <h6 className=" details_bid_price">
                        <span>
                          {(
                            (Number(props?.displayValues.value) * 2.5) /
                            100
                          ).toFixed(6)}{' '}
                          {props?.displayValues.unit}
                        </span>
                      </h6>
                    </div>
                    <div className="fee_dtl_inner_right_wrp">
                      <p className=" ml-1 ">
                        {props?.platformusd
                          ? `($ ${props?.platformusd} USD)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="buybtn_wrp">
              <button
                type="button"
                className="Cancel_btn"
                onClick={props.onHide}
              >
                Cancel
              </button>
              {connectedNetworkId == klatynNetworkId ? (
                props.displayValues.unit === 'KLAY' ? (
                  <button
                    type="button"
                    className="buy_now"
                    onClick={props.handleBuy}
                  >
                    {props.loading ? 'Loading...' : 'Buy Now'}
                  </button>
                ) : props.displayValues.unit === 'AGOV' ? (
                  <button
                    type="button"
                    className="buy_now"
                    onClick={props.approve}
                  >
                    {props.loading ? 'Loading...' : 'Buy Now'}
                  </button>
                ) : props.displayValues.unit === 'USDT' ? (
                  <button
                    type="button"
                    className="buy_now"
                    onClick={props.usdtKlaytnApproveFun}
                  >
                    {props.loading ? 'Loading...' : 'Buy Now'}
                  </button>
                ) : (
                  ''
                )
              ) : props.displayValues.unit === 'ETH' ? (
                <button
                  type="button"
                  className="buy_now"
                  onClick={props.handleBuy}
                >
                  {props.loading ? 'Loading...' : 'Buy Now'}
                </button>
              ) : props.displayValues.unit === 'WETH' ? (
                <button
                  type="button"
                  className="buy_now"
                  onClick={props.wethApprove}
                >
                  {props.loading ? 'Loading...' : 'Buy Now'}
                </button>
              ) : props.displayValues.unit === 'MPWR' ? (
                <button
                  type="button"
                  className="buy_now"
                  onClick={props.mpwrApproveFun}
                >
                  {props.loading ? 'Loading...' : 'Buy Now'}
                </button>
              ) : props.displayValues.unit === 'AGOV' ? (
                <button
                  type="button"
                  className="buy_now"
                  onClick={props.agovEthApproveFun}
                >
                  {props.loading ? 'Loading...' : 'Buy Now'}
                </button>
              ) : props.displayValues.unit === 'USDT' ? (
                <button
                  type="button"
                  className="buy_now"
                  onClick={props.usdtEthApproveFun}
                >
                  {props.loading ? 'Loading...' : 'Buy Now'}
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
          {props?.itemDetails?.redeemable && (
            <h6 className="policy_notes text-center mt-3">
              Note: Kindly note all physical items have a no return/cancellation
              policy.
            </h6>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BuyNow;
