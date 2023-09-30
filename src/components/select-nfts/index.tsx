import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './Selectnfts.scss';
import { SaleItem } from './SaleItem';
import { ImageCheck } from './image-check';
import { useCustomStableCoin } from '../../hooks';

import {
  makeBrokerContractForEth,
  CheckCurrencyMetaMask,
  getWeb3,
  CbrNftforEthContract,
} from '../../service/web3-service';
import { eventsAction, LazylistingPutOnSaleAPiAction } from '../../redux';
import { UPDATE_WALLET_AMOUNT } from '../../redux/types/connect-wallet-types';
import Tooltip from 'react-simple-tooltip';
import checkedimg from '../../assets/images/checkedimg.png';
import { Select } from '../select';
import { imgConstants } from '../../assets/locales/constants';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import { commonPutOnSaleLazyListingHandler } from '../../utils/common-put-on-sale-lazy-listing';
import moment from 'moment';

const broker_address: any = process.env.REACT_APP_BROKER_ADDRESS;
const broker_address_v3: any = process.env.REACT_APP_BROKER_ADDRESS_V3;
const SelectNFTs = (props: any) => {
  const { t } = useTranslation();
    const { customFromWei } = useCustomStableCoin();
  const [allCollectibles, setAllCollectibles] = useState<any>([]);
  const [finalAllCollectibles, setFinalAllCollectibles] = useState<any>([]);
  const [isListItem, setIsListItem] = useState<boolean>(false);
  const [isDelistItem, setIsDeistItem] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [currencyOptions, setCurrencyOptions]: any = useState([
    { name: 'ETH', value: 'ETH' },
    { name: 'WETH', value: 'WETH' },
    { name: 'MPWR', value: 'MPWR' },
    { name: 'AGOV', value: 'AGOV' },
  ]);
  const wallet_address: any = localStorage
    .getItem('Wallet Address')
    ?.toLowerCase();
  const currentBidVal = '0';

  const getWeiPrice = async (price: any,last_erc20_address:any) => {
    const { web3 }: any = await getWeb3();
    const result =   await customFromWei(price,web3,last_erc20_address);
    return  result
  };
  const getPriceOfCollectible = async (price: any, last_erc20_address: any) => {
    const priceValue = await getWeiPrice(price,last_erc20_address);
    let priceUnit = 'ETH';
    const res: any = await CheckCurrencyMetaMask(last_erc20_address);
    priceUnit = res?.name;
    return { priceValue: priceValue, priceUnit: priceUnit };
  };
  const addPriceInCollectibles = async (finalCollectibles: any) => {
    for (const collectible of finalCollectibles) {
      if (collectible.network_id == 1) {
        if (collectible.auctionDetails) {
          if (collectible.auctionDetails.auctionType == '1') {
            const priceRes = await getPriceOfCollectible(
              collectible.auctionDetails.buyPrice,
              collectible.last_erc20_address,
            );
            if (priceRes) {
              collectible.priceUnit = priceRes.priceUnit;
              collectible.selectedCurrency = priceRes.priceUnit;
              collectible.priceValue = priceRes.priceValue;
            }
          } else {
            if (collectible.auctionDetails.currentBid !== currentBidVal) {
              const priceRes = await getPriceOfCollectible(
                collectible.auctionDetails.currentBid,
                collectible.last_erc20_address,
              );
              if (priceRes) {
                collectible.priceUnit = priceRes.priceUnit;
                collectible.selectedCurrency = priceRes.priceUnit;
                collectible.priceValue = priceRes.priceValue;
              }
            } else {
              const priceRes = await getPriceOfCollectible(
                collectible.auctionDetails.startingPrice,
                collectible.last_erc20_address,
              );
              if (priceRes) {
                collectible.priceUnit = priceRes.priceUnit;
                collectible.selectedCurrency = priceRes.priceUnit;
                collectible.priceValue = priceRes.priceValue;
              }
            }
          }
        } else {
          if (collectible.eth_price) {
            const priceRes = await getPriceOfCollectible(
              collectible.eth_price,
              collectible.last_erc20_address,
            );
            if (priceRes) {
              collectible.priceUnit = priceRes.priceUnit;
              collectible.selectedCurrency = priceRes.priceUnit;
              collectible.priceValue = priceRes.priceValue;
            }
          } else if (collectible.last_price) {
            const priceRes = await getPriceOfCollectible(
              collectible.last_price,
              collectible.last_erc20_address,
            );
            if (priceRes) {
              collectible.priceUnit = priceRes.priceUnit;
              collectible.selectedCurrency = priceRes.priceUnit;
              collectible.priceValue = priceRes.priceValue;
            }
          } else {
            collectible.priceUnit = '';
            collectible.selectedCurrency = 'ETH';
            collectible.priceValue = 0;
          }
        }
      }
    }
    setAllCollectibles(finalCollectibles);
    setFinalAllCollectibles([]);
  };
  const onCurrencyChange = async (e: any, collectible: any) => {
    finalAllCollectibles.forEach((collectibles: any) => {
      if (collectibles._id === collectible._id) {
        collectibles.selectedCurrency = e.value;
      }
    });
  };
  const showValue = (priceValue: any) => {
    let finalValue = '';
    if (priceValue && priceValue.includes('.')) {
      const findValIndex = priceValue.indexOf('.');
      const replaceDot = priceValue.replace('.', '');
      if (replaceDot.length >= 8) {
        const isFormatedValue = replaceDot.toString().substring(0, 7) + '...';
        const addDotInValue =
          isFormatedValue.substring(0, findValIndex) +
          '.' +
          isFormatedValue.substring(findValIndex, isFormatedValue.length);
        finalValue = replaceDot ? addDotInValue : '';
      } else {
        finalValue =
          replaceDot.substring(0, 1) +
          '.' +
          replaceDot.substring(findValIndex, replaceDot.length);
      }
    } else {
      if (priceValue && priceValue.length >= 8) {
        finalValue = priceValue.toString().substring(0, 7) + '...';
      } else {
        finalValue = priceValue ? priceValue : '';
      }
    }

    return finalValue;
  };
  useEffect(() => {
    if (props.finalCollectibles) {
      addPriceInCollectibles(props.finalCollectibles);
    }
  }, [props.finalCollectibles]);

  const handleAllCollectibles = async (e: any) => {
    const { name } = e.target;
    if (name === 'allSelect') {
      const updatedList = allCollectibles.map((collectible: any) => {
        if (
          collectible.history.bid.length === 0 &&
          collectible.isApproved === true
        ) {
          return { ...collectible, isChecked: true };
        } else {
          return { ...collectible, isChecked: false };
        }
      });
      setAllCollectibles(updatedList);
      const newList = updatedList.filter(
        (collectibles: any) => collectibles.isChecked === true,
      );
      setFinalAllCollectibles(newList);
    } else {
      const updatedList = allCollectibles.map((collectible: any) => {
        return { ...collectible, isChecked: false };
      });
      setAllCollectibles(updatedList);
      const newList = updatedList.filter(
        (collectibles: any) => collectibles.isChecked === true,
      );
      setFinalAllCollectibles(newList);
    }
  };

  const handleCollectibles = (e: any, collectible: any) => {
    const { checked } = e.target;
    allCollectibles.forEach((collectibles: any) => {
      if (collectibles._id == collectible._id) {
        collectibles.isChecked = checked;
      }
    });
    const updatedList = allCollectibles.filter(
      (collectibles: any) => collectibles.isChecked === true,
    );
    setFinalAllCollectibles(updatedList);
  };

  const getPutOnSaleDisable = () => {
    const newList = finalAllCollectibles.filter(
      (collectibles: any) => collectibles.isChecked == true,
    );

    if (newList.length == 0) {
      return true;
    } else {
      const isAllValid = newList.every(
        (collectible: any) =>
          collectible.isApproved === true &&
          collectible.isChecked === true &&
          collectible.finalPrice &&
          !collectible.priceError &&
          (!collectible?.on_sale ||
            (collectible?.on_sale &&
              collectible?.auctionDetails?.auctionType == '2' &&
              collectible?.history?.bid?.length === 0 &&
              new Date() >=
                new Date(collectible?.auctionDetails?.closingTime))),
      );
      if (isAllValid) return false;
      else return true;
    }
  };
  const getPutOffSaleDisable = () => {
    const newList = finalAllCollectibles.filter(
      (collectibles: any) => collectibles.isChecked == true,
    );
    if (newList.length == 0) {
      return true;
    } else {
      const isAllValid = newList.every(
        (collectible: any) =>
          collectible.isApproved === true &&
          collectible.isChecked === true &&
          ((collectible?.on_sale &&
            collectible?.auctionDetails?.auctionType == '1') ||
            (collectible?.on_sale &&
              collectible?.auctionDetails?.auctionType == '2' &&
              collectible?.history?.bid?.length == 0 &&
              new Date() <=
                new Date(collectible?.auctionDetails?.closingTime))),
      );
      if (isAllValid) return false;
      else return true;
    }
  };

  const inputClickHandler = (event: any, collectible: any) => {
    event.preventDefault();
    const { value } = event.target;
    const updatedAllCollectibles = [...allCollectibles];
    const updatedFinalCollectibles = [...finalAllCollectibles];
    const finalCollectibleIndex = updatedFinalCollectibles.findIndex(
      (x: any) => x._id === collectible._id,
    );
    const collectibleIndex = updatedAllCollectibles.findIndex(
      (x: any) => x._id === collectible._id,
    );
    const regex1 = /^[0-9][.\d]{0,17}$/;
    if (value === '') {
      updatedFinalCollectibles[finalCollectibleIndex].priceError =
        'cannot be empty';
      updatedAllCollectibles[collectibleIndex].priceError = 'cannot be empty';
      updatedFinalCollectibles[finalCollectibleIndex].finalPrice = value;
    } else if (!regex1.test(value)) {
      updatedFinalCollectibles[finalCollectibleIndex].priceError =
        'Price should not more then 18 digit';
      updatedAllCollectibles[collectibleIndex].priceError =
        'Price should not more then 18 digit';
      updatedFinalCollectibles[finalCollectibleIndex].finalPrice = value;
    } else {
      updatedFinalCollectibles[finalCollectibleIndex].priceError = null;
      updatedAllCollectibles[collectibleIndex].priceError = null;
      updatedFinalCollectibles[finalCollectibleIndex].finalPrice = value;
    }
    setAllCollectibles(updatedAllCollectibles);
    setFinalAllCollectibles(updatedFinalCollectibles);
  };
  // function for bluk put on sale item
  const bulkListingHandler = async (CollectibleDetails: any) => {
    const collectionAddress = CollectibleDetails?.collection_address;
    const { CbrforEthContr }: any = await CbrNftforEthContract(
      collectionAddress,
    );
    const { brokerContract }: any = await makeBrokerContractForEth(
      broker_address,
      true,
    );
    try {
      let cbrresult = await CbrforEthContr.methods
        .isApprovedForAll(wallet_address, broker_address)
        .call();

      if (!cbrresult) {
        try {
          cbrresult = await CbrforEthContr.methods
            .setApprovalForAll(broker_address, true)
            .send({ from: wallet_address });
          addToast(`Approved successfully`, {
            appearance: 'success',
            autoDismiss: true,
          });
        } catch (error: any) {
          props.handleCursor(false);
          setIsListItem(false);
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          });
          return;
        }
      }

      if (cbrresult) {
        const getnonse = await brokerContract.methods
          .getCurrentOrderNonce(wallet_address)
          .call();
        const date: any = new Date();
        const currentDateTime = moment(date).format('YYYY-MM-DDTHH:mm');
        if (getnonse) {
          const resLazyMint: any = await commonPutOnSaleLazyListingHandler(
            getnonse,
            CollectibleDetails,
            currentDateTime,
            currentDateTime,
            CollectibleDetails.selectedCurrency,
            CollectibleDetails.finalPrice,
            'fixedPrice',
          );
          if (resLazyMint && resLazyMint?.signature) {
            const response: any = await dispatch(
              LazylistingPutOnSaleAPiAction(resLazyMint),
            );
            if (response) {
              addToast('Item listed successfully', {
                appearance: 'success',
                autoDismiss: true,
              });
            }
          } else {
            props.handleCursor(false);
            setIsListItem(false);
            addToast('Something was wrong', {
              appearance: 'error',
              autoDismiss: true,
            });
          }
          window.onbeforeunload = function () {
            return 'If you reload this page, your previous action will be repeated';
          };
        }
      }
      return;
    } catch (error: any) {
      props.handleCursor(false);
      setIsListItem(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
  };

  const PutOnSaleList = async () => {
    props.handleCursor(true);
    setIsListItem(true);
    finalAllCollectibles.filter(
      (collectibles: any) => collectibles.on_sale !== false,
    );
    try {
      for (const collectible of finalAllCollectibles) {
        if (
          collectible.isApproved &&
          collectible.finalPrice &&
          (!collectible?.on_sale ||
            (collectible?.on_sale &&
              collectible?.auctionDetails?.auctionType == '2' &&
              collectible?.history?.bid?.length === 0 &&
              new Date() >= new Date(collectible?.auctionDetails?.closingTime)))
        ) {
          await bulkListingHandler(collectible);
        }
      }
      props.handleCursor(false);
      setIsListItem(false);
      props.getAllCollection();
      setAllCollectibles([]);
      setFinalAllCollectibles([]);
      props.setCollectionType('OpenSea');
    } catch (error: any) {
      props.handleCursor(false);
      setIsListItem(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const bulkDelistingHandler = async (finalArray: any) => {
    try {
      const { brokerContract }: any = await makeBrokerContractForEth(
        broker_address,
        true,
      );
      try {
        const brokerTransactionHash = await brokerContract.methods
          .invalidateSignedBulkOrder(finalArray)
          .send({ from: wallet_address });
        if (brokerTransactionHash.transactionHash) {
          const delistAction = {
            transaction_hash: brokerTransactionHash.transactionHash,
            contract_address: broker_address,
            network_id: '1',
          };
          await dispatch(eventsAction(delistAction));
          return true;
        } else {
          return false;
        }
      } catch (err: any) {
        return false;
      }
    } catch (err: any) {
      return false;
    }
  };

  const PutOfSaleList = async () => {
    props.handleCursor(true);
    setIsDeistItem(true);
    finalAllCollectibles.filter(
      (collectibles: any) => collectibles.on_sale !== true,
    );
    try {
      const delistArray: any = [];
      const orderArray: any = [];
      for (const collectible of finalAllCollectibles) {
        if (collectible.on_sale && collectible.isApproved) {
          const contractAddress = collectible?.auctionDetails?.contract_address;
          if (
            broker_address?.toLowerCase() === contractAddress?.toLowerCase()
          ) {
            const collectionAddress =
              collectible?.auctionDetails?.collection_address;
            const isTokenGated = collectible?.auctionDetails?.isTokenGated;
            const tokenGateAddress =
              collectible?.auctionDetails?.tokenGateAddress;
            const noncedata = Number(collectible?.auctionDetails?.nonce);
            const tokenId1 = collectible?.token_id ? collectible?.token_id : 0;
            const ordertype = collectible?.redeemable ? 1 : 0;
            const auctionType: string =
              collectible?.auctionDetails?.auctionType;
            const priceVal =
              auctionType === '1'
                ? collectible?.auctionDetails?.buyPrice
                : collectible?.auctionDetails?.startingPrice;

            const closingtime: any = Math.round(
              new Date(
                collectible?.auctionDetails?.initialClosingTime,
              ).getTime() / 1000,
            );

            const listTime = Math.round(
              new Date(collectible?.auctionDetails?.startingTime).getTime() /
                1000,
            );
            const Endtime: number = auctionType === '1' ? 0 : closingtime;

            const deslistquery = {
              seller: collectible?.collectible_owner,
              contractaddress: collectionAddress,
              royaltyFee: collectible?.royalties
                ? collectible?.royalties * 100
                : 0,
              royaltyReceiver: collectible?.userObj?.wallet_address,
              paymentToken: collectible?.auctionDetails?.erc20Token,
              basePrice: priceVal,
              listingTime: listTime,
              expirationTime: Endtime,
              nonce: noncedata,
              tokenId: tokenId1,
              orderType: ordertype,
              signature: collectible?.auctionDetails?.signature,
              uri: collectible?.file,
              objId: collectible?._id.toString(),
              isTokenGated: isTokenGated,
              tokenGateAddress: tokenGateAddress,
            };

            const buyarray = [
              deslistquery.seller,
              deslistquery.contractaddress,
              deslistquery.royaltyFee,
              deslistquery.royaltyReceiver,
              deslistquery.paymentToken,
              deslistquery.basePrice,
              deslistquery.listingTime,
              deslistquery.expirationTime,
              deslistquery.nonce,
              deslistquery.tokenId,
              deslistquery.orderType,
              deslistquery.signature,
              deslistquery.uri,
              deslistquery.objId,
              deslistquery.isTokenGated,
              deslistquery.tokenGateAddress,
            ];

            orderArray.push(buyarray);
          } else if (
            broker_address_v3?.toLowerCase() === contractAddress?.toLowerCase()
          ) {
            delistArray.push([
              +(collectible?.token_id ? collectible?.token_id : 0),
              collectible.collection_address,
            ]);
          }
        }
      }
      let newDelistRes = false;
      let oldDelistRes = false;
      if (orderArray && orderArray.length > 0) {
        newDelistRes = await bulkDelistingHandler(orderArray);
        if (!newDelistRes) {
          addToast('There is some issue. Please try again later.', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
      if (delistArray && delistArray.length > 0) {
        try {
          const send_obj: any = { from: wallet_address };
          const { brokerContract }: any = await makeBrokerContractForEth(
            broker_address_v3,
            true,
          );
          const putoffSaleResult = await brokerContract.methods
            .batchDelisting(delistArray)
            .send(send_obj);
          if (putoffSaleResult.transactionHash) {
            const body = {
              contract_address: brokerContract._address,
              network_id: '1',
              transaction_hash: putoffSaleResult.transactionHash,
            };
            await dispatch(eventsAction(body));
            oldDelistRes = true;
          }
        } catch (err: any) {
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
      if (
        (delistArray.length > 0 && oldDelistRes) ||
        (orderArray.length > 0 && newDelistRes)
      ) {
        addToast('Item delist successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
        await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
        props.getAllCollection();
        setAllCollectibles([]);
        setFinalAllCollectibles([]);
        props.setCollectionType('OpenSea');
      }
      props.handleCursor(false);
      setIsDeistItem(false);
    } catch (error: any) {
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
      props.handleCursor(false);
      setIsDeistItem(false);
    }
  };

  return (
    <>
      <div className="Selectnfts_wrp">
        <h1>{t('select-nfts.heading')}</h1>
        {allCollectibles.length === 0 ? (
          <div className="Selectnfts_notlisted_wrp">
            <img src={imgConstants.ListBullets} alt="ListBullets" />
            <span>{t('select-nfts.text1')}</span>
            <p>{t('select-nfts.text2')}</p>
          </div>
        ) : (
          <div className="Selectnfts_listed_wrp">
            <div className=" listed_list_wrp listed_list_wrp_header ">
              <div className=" listed_list ">
                <h5>NFT</h5>
              </div>
              <div className=" listed_list listed_creator_icon_wrp">
                <h5>Title</h5>
              </div>
              <div className=" listed_list listed_list_ptice_wrp">
                <h5>Current Price</h5>
              </div>
              <div className=" listed_list listed_list_ptice_wrp">
                <h5>Sale Price</h5>
              </div>
              <div className=" listed_list listed_list_ptice_wrp">
                <h5>Price Unit</h5>
              </div>
              <div className=" listed_list listed_list_ptice_wrp">
                <h5>Action</h5>
              </div>
            </div>
            <div className="Selectnfts_listed_inner">
              {allCollectibles?.map((collectible: any, index: any) => {
                return (
                  <div className="Selectnfts_listed_inner_new" key={index}>
                    {collectible.userObj ? (
                      <div className="listed_list_wrp">
                        <div className="listed_list listed_list_nft_wrp">
                          <label className="custcheckwrp">
                            <input
                              type="checkbox"
                              name={collectible.title}
                              checked={
                                (collectible.isChecked || false) &&
                                collectible.isApproved
                              }
                              onChange={(e) =>
                                handleCollectibles(e, collectible)
                              }
                              disabled={
                                collectible.history.bid.length > 0
                                  ? true
                                  : !collectible.isApproved
                                  ? true
                                  : false
                              }
                            />
                            <span
                              className={
                                collectible.history.bid.length > 0
                                  ? 'tickmark disablebtn'
                                  : !collectible.isApproved
                                  ? 'tickmark disablebtn'
                                  : 'tickmark'
                              }
                            >
                              <img src={imgConstants.checkbox} alt="img" />
                            </span>
                          </label>
                          <div className="coll_img_wrp">
                            <ImageCheck 
                            collectible_file={collectible.file}
                            collectible={collectible}
                              />
                            {collectible.collection_status == 'verified' ? (
                              <img
                                className="checked_img"
                                src={checkedimg}
                                alt="checkedimg"
                              />
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                        <div className="listed_list listed_creator_icon_wrp">
                          <p className="aprv_txt">{collectible.title}</p>
                          <div className="description_inn d-flex justify-content-center align-items-center">
                            <div className="img_wrp">
                              <figure>
                                <img
                                  className="card_img"
                                  src={
                                    collectible.userObj.image
                                      ? collectible.userObj.image
                                      : imgConstants.avatar
                                  }
                                  alt="img"
                                />
                              </figure>
                            </div>
                            <div className="text_wrp text-left">
                              <p>
                                Creator by
                                <p>
                                  {collectible.userObj.name
                                    ? collectible.userObj.name
                                    : collectible.userObj.wallet_address
                                        .toString()
                                        .substring(0, 5) +
                                      '.....' +
                                      collectible.userObj.wallet_address
                                        .toString()
                                        .substr(
                                          collectible.userObj.wallet_address
                                            .length - 4,
                                        )
                                    ? collectible.userObj.wallet_address
                                        .toString()
                                        .substring(0, 5) +
                                      '.....' +
                                      collectible.userObj.wallet_address
                                        .toString()
                                        .substr(
                                          collectible.userObj.wallet_address
                                            .length - 4,
                                        )
                                    : ''}
                                </p>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="listed_list listed_list_ptice_wrp club_card_price_wrp">
                          <p className="res_text">Current Price</p>
                          <p className=" new-WRAP cursor-pointer d-flex justify-content-center align-items-center ">
                            {collectible.priceValue ? (
                              <Tooltip
                                className="cardtooltip_wrp"
                                content={collectible.priceValue}
                                style={{ padding: '5px' }}
                              >
                                <p className=" new-WRAP cursor-pointer d-flex justify-content-center align-items-center">
                                  {collectible.priceUnit === 'ETH' && (
                                    <img src={imgConstants.ethIcon} alt="img" />
                                  )}
                                  {collectible.priceUnit === 'WETH' && (
                                    <img
                                      src={imgConstants.wethIcon}
                                      alt="img"
                                    />
                                  )}
                                  {collectible.priceUnit === 'MPWR' && (
                                    <img
                                      src={imgConstants.mpwr_icon}
                                      alt="img"
                                      className="mpwr-icon-img"
                                    />
                                  )}
                                  {collectible.priceUnit === 'AGOV' && (
                                    <img src={imgConstants.klyicon} alt="img" />
                                  )}
                                  <span className="ml-2 curr_price">
                                    {showValue(collectible.priceValue)}{' '}
                                    {collectible.priceUnit
                                      ? collectible.priceUnit
                                      : ''}
                                  </span>
                                </p>
                              </Tooltip>
                            ) : (
                              <p className=" new-WRAP cursor-pointer d-flex justify-content-center align-items-center novaluecurrprice">
                                {collectible.priceUnit === 'ETH' && (
                                  <img src={imgConstants.ethIcon} alt="img" />
                                )}
                                {collectible.priceUnit === 'WETH' && (
                                  <img src={imgConstants.wethIcon} alt="img" />
                                )}
                                {collectible.priceUnit === 'MPWR' && (
                                  <img
                                    src={imgConstants.mpwr_icon}
                                    alt="img"
                                    className="mpwr-icon-img"
                                  />
                                )}
                                {collectible.priceUnit === 'AGOV' && (
                                  <img src={imgConstants.klyicon} alt="img" />
                                )}
                                <span className="ml-2 curr_price">
                                  {collectible.priceValue}
                                  {collectible.priceUnit
                                    ? collectible.priceUnit
                                    : ''}
                                </span>
                              </p>
                            )}
                          </p>
                        </div>
                        {collectible.isChecked &&
                        collectible.isApproved &&
                        (!collectible.on_sale ||
                          (collectible?.on_sale &&
                            collectible?.auctionDetails?.auctionType == '2' &&
                            collectible?.history?.bid?.length === 0 &&
                            new Date() >=
                              new Date(
                                collectible?.auctionDetails?.closingTime,
                              ))) ? (
                          <>
                            <div className="listed_list sale_price_wrp">
                              <input
                                type="number"
                                placeholder={`0.00`}
                                onChange={(e) =>
                                  inputClickHandler(e, collectible)
                                }
                                value={collectible?.finalPrice}
                              />
                              {collectible.priceError ? (
                                <p className="text-red justify-self-start mt-2 pl-2">
                                  {collectible.priceError}
                                </p>
                              ) : (
                                ''
                              )}
                            </div>
                            <div className="listed_list Price_unit_wrp">
                              <Select
                                value={collectible.selectedCurrency}
                                selectValueChange={(e: any) =>
                                  onCurrencyChange(e, collectible)
                                }
                                options={currencyOptions}
                                width="w-24"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="listed_list sale_price_wrp">
                              <div>-</div>
                            </div>
                            <div className="listed_list Price_unit_wrp">
                              <div>-</div>
                            </div>
                          </>
                        )}
                        <SaleItem
                          collectible={collectible}
                          delistLoading={props.delistLoading}
                          handlePutOnSale={props.handlePutOnSale}
                          handlePutOffSale={props.handlePutOffSale}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                );
              })}
            </div>
            <div className="list_selected_btn_wrp">
              <div className="row">
                <div className="col-4 text-left selected_btn_left_wrp">
                  <div className="select_wrp ">
                    <label
                      className={
                        allCollectibles.filter(
                          (collectible: any) => collectible?.isChecked !== true,
                        ).length < 1
                          ? 'active'
                          : ''
                      }
                    >
                      <input
                        type="checkbox"
                        name="allSelect"
                        onChange={handleAllCollectibles}
                        disabled={
                          allCollectibles.filter(
                            (collection: any) => collection?.isChecked !== true,
                          ).length <
                            1 ===
                          true
                        }
                      />
                      Select All
                    </label>
                    <label
                      className={
                        allCollectibles.some((x: any) => x.isChecked == true) ==
                        false
                          ? 'active'
                          : ''
                      }
                    >
                      <input
                        type="checkbox"
                        name="unSelect"
                        onChange={handleAllCollectibles}
                        disabled={
                          allCollectibles.some(
                            (x: any) => x.isChecked == true,
                          ) == false
                            ? true
                            : false
                        }
                      />
                      Clear All
                    </label>
                  </div>
                  <p>
                    <span>
                      {
                        allCollectibles.filter(
                          (collectible: any) =>
                            (collectible?.isChecked &&
                              collectible.isApproved) === true,
                        ).length
                      }
                    </span>{' '}
                    items selected
                  </p>
                </div>
                <div className="col-8 text-right selected_btn_right_wrp">
                  <button
                    disabled={getPutOnSaleDisable()}
                    onClick={PutOnSaleList}
                  >
                    {isListItem ? 'Loading...' : 'List Selected Items'}
                  </button>{' '}
                  <button
                    disabled={getPutOffSaleDisable()}
                    onClick={PutOfSaleList}
                  >
                    {isDelistItem ? 'Loading...' : 'Delist Selected Items'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { SelectNFTs };
