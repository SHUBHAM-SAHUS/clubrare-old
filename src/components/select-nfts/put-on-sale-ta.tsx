import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { Select } from '../select';
import { imgConstants } from '../../assets/locales/constants';

function PutOnSaleTA(props: any) {
  const [activeSaleModel, setActiveSaleModel] = useState('fixedPrice');
  const [hideCursor, setHideCursor] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (props.hideCursor) {
      window.onbeforeunload = function () {
        if (!hideCursor) {
          return 'If you reload this page, your previous action will be repeated';
        } else {
        }
      };
    } else {
      window.onbeforeunload = null;
    }
  }, [props.hideCursor]);

  return (
    <>
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        title=""
        open={props?.show}
        className="details_bidmodal"
        backdrop="static"
      >
        <Modal.Body>
          <div
            className="w-full border border-solid border-white bg-white bg-opacity-20 rounded-50 put_on_sale"
            style={{ pointerEvents: props.hideCursor ? 'none' : 'auto' }}
          >
            <div>
              <div className="mt-9 md:mt-0 mb-4">{t('Put On Sale')}</div>
            </div>
            <button className="put_sale_close_wrp" onClick={props.onHide}>
              <img src={imgConstants.hamburgerClose} alt="img" />
            </button>
            <form className="mt-5 w-full flex flex-col fixed_price_form">
              <div className="auction_btn_wrp text-center form_input_wrp">
                <div>
                  {props.salesModels.map((m: any) => (
                    <button
                      key={m.key}
                      className={`button-connect  ${
                        m.key === activeSaleModel
                          ? 'fixed_price_btn'
                          : 'auction_btn'
                      }`}
                      onClick={(e) => {
                        setActiveSaleModel(m.key);
                        e.preventDefault();
                        props.inputClickHandler({
                          target: { name: 'priceType', value: m.priceType },
                        });
                      }}
                    >
                      {m.title == 'Fixed Price' ? (
                        <img src={imgConstants.lightning} alt="lightning" />
                      ) : (
                        <img src={imgConstants.clock} alt="clock" />
                      )}
                      {m.title}
                    </button>
                  ))}
                </div>
              </div>

              {activeSaleModel === 'fixedPrice' && (
                <>
                  <div className="form_input_wrp">
                    <label className="text-18 text-blue font-semibold">
                      {t('productPage.PutOnSale.Price')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="responsive-placeholder bg-transparent border-b-2 border-solid border-white py-1.5 w-full"
                        placeholder={`0.00 ${props.selectedCurrency}`}
                        value={props.price}
                        name="price"
                        onChange={props.inputClickHandler}
                      />
                      <div className="absolute top-0 right-0 flex items-center space-x-2">
                        {
                          <Select
                            value={props.selectedCurrency}
                            selectValueChange={props.onCurrencyChange}
                            options={props.currencyOptions}
                            width="w-24"
                          />
                        }
                      </div>
                    </div>
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {props.error.price}
                    </p>
                  </div>
                </>
              )}
              {activeSaleModel === 'auction' && (
                <div className="flex flex-col space-y-5 w-full">
                  <div className="fixed_price_wrp form_input_wrp">
                    <label className="text-18 text-blue font-semibold mb-2">
                      {t('productPage.PutOnSale.MinimumBid')}
                    </label>
                    <div className="flex items-center justify-between minimum_bid_wrp">
                      <div className="w-full">
                        <input
                          type="number"
                          className="responsive-placeholder bg-transparent border-b-2 border-solid border-white w-full minimumbid"
                          placeholder={`0.00 ${props.selectedCurrency}`}
                          value={props.price}
                          name="price"
                          onChange={props.inputClickHandler}
                        />
                      </div>
                      <div className="top-0 right-0 flex items-center space-x-2">
                        <Select
                          value={props.selectedCurrency}
                          selectValueChange={props.onCurrencyChange}
                          options={props.currencyOptionsAuction}
                          width="w-24"
                        />
                      </div>
                    </div>
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {props.error.price}
                    </p>
                  </div>
                  <div className="row form_input_wrp">
                    <div className="col-6">
                      <label
                        className="text-18 text-blue font-semibold mb-2"
                        htmlFor="meeting-time-start"
                      >
                        {t('productPage.PutOnSale.StartingDate')}
                      </label>
                      <input
                        className="responsive-placeholder bg-transparent border-b border-solid border-white w-full"
                        value={props.startDateHandle}
                        onChange={(e) => {
                          props.handleStartDate(e);
                        }}
                        min={props.minExpiryDate}
                        type="datetime-local"
                        id="meeting-time-start"
                        name="meeting-time"
                      />
                      <p className="text-red justify-self-start mt-2 pl-2">
                        {props.error.startDateHandle}
                      </p>
                    </div>
                    <div className="col-6">
                      <label
                        className="text-18 text-blue font-semibold"
                        htmlFor="meeting-time-end"
                      >
                        {t('productPage.PutOnSale.ExpirationDate')}
                      </label>
                      <input
                        className="responsive-placeholder bg-transparent border-b border-solid border-white
                 w-full"
                        value={props.expiryDateHandle}
                        onChange={(e) => {
                          props.handleExpiry(e.target.value);
                        }}
                        min={'2022-02-28T12:20'}
                        type="datetime-local"
                        id="meeting-time-end"
                        name="meeting-time"
                      />
                      <p className="text-red justify-self-start mt-2 pl-2">
                        {props.error.expiryDateHandle}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div
                className={
                  props.itemDetails?.redeemable
                    ? 'put-on-sale-btn-wrapper d-flex justify-content-center'
                    : 'liveauction_btnwrp text-center'
                }
              >
                <button
                  className="button-connect cancel_button"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onHide();
                  }}
                >
                  cancel
                </button>

                <div
                  className=""
                  style={
                    props.putOnSaleLoading
                      ? { pointerEvents: 'none', opacity: '0.4' }
                      : {}
                  }
                >
                  {' '}
                  <button
                    className="redeem-burn-btn placea_beat"
                    style={{
                      boxShadow: '10px 20px 25px 7px rgba(27, 49, 66, 0.13)',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      props.handleModal();
                    }}
                    disabled={props.putOnSaleLoading}
                  >
                    {props.putOnSaleLoading
                      ? 'Loading...'
                      : t('productPage.PutOnSale.PutOnSale')}
                  </button>{' '}
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PutOnSaleTA;
