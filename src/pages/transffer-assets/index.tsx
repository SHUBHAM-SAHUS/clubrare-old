import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import Layout from '../../layouts/main-layout/main-layout';
import { AirDrops } from '../../components/airdrop-stash';
import { SelectNFTs } from '../../components/select-nfts';
import './transffer-assets.scss';
import { CollectionApproval } from '../../components/collection-approval';
import {
  airdropContract,
  createCollectionContract,
  makeBrokerContractForEth,
  CbrNftforEthContract,
} from '../../service/web3-service';
import { getOpenseaCollectionAction } from '../../redux/actions/opensea-collections';
import PutOnSaleTA from '../../components/select-nfts/put-on-sale-ta';
import { UPDATE_WALLET_AMOUNT } from '../../redux/types/connect-wallet-types';
import moment from 'moment';

import { eventsAction, LazylistingPutOnSaleAPiAction } from '../../redux';
import { AddToToken } from '../../components/add-to-token';
import { NonVerifiedModal } from '../../components/select-nfts/non-verified-modal';
import { commonPutOnSaleLazyListingHandler } from '../../utils/common-put-on-sale-lazy-listing';
const Footer = React.lazy(() => import('../../components/footer/footer'));

declare const window: any;

const TransfferAssets = () => {
  const [collectionModel, setCollectionModel] = useState<any>([]);
  const [initialcollectionList, setIntialCollectionList] = useState<any>('');
  const [collectibles, setCollectibles] = useState<any>([]);
  const [intialcollectibles, setIntialCollectibles] = useState<any>('');
  const [finalCollectibles, setFinalCollectibles] = useState<any>([]);
  const [collectionType, setCollectionType] = useState<any>('OpenSea');
  const [puonsaleModal, setPutOnSaleModal] = useState(false);
  const [collectionOwner, setCollectionOwner] = useState();
  const [collectionAddress, setCollectionAddress] = useState('');
  const [networkID, setNetworkId] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState('KLAY');
  const [title, setTitle] = useState('');
  const [priceType, setPriceType] = useState('fixedPrice');
  const [price, setPrice] = useState('');
  const [startDateHandle, setStartDateHandle] = useState('');
  const [expiryDateHandle, setExpiryDateHandle] = useState<any>('');
  const [minExpiryDate, setMinExpirationDate] = useState<any>('');
  const [minExpiryDate1, setMinExpirationDate1] = useState<any>('');
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [hideCursor, SetHideCursor] = useState<boolean>(false);
  const [approveloading, Setapproveloading] = useState<boolean>(false);
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [airdropStashData, setAirdropStashData] = useState<any>([]);
  const [airdropStashLoading, setAirdropStashLoading] =
    useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [isAllApproved, setIsAllApproved] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<any>(true);
  const [nonVerifiedModal, setNonVerifiedModal] = useState<boolean>(false);
  const [addTokenLoading, setAddTokenLoading] = useState<boolean>(false);
  const [stakeRewardLoading, setStakeRewardLoading] = useState<boolean>(false);
  const [claimSuccessCheck, setClaimSuccessCheck] = useState<boolean>(false);
  const [putOnSaleLoading, setPutOnSaleLoading] = useState<boolean>(false);
  const [delistLoading, setDelistLoading] = useState<boolean>(false);
  const [CollectibleDetails, setCollectibleDetails] = useState<any>({});

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { t } = useTranslation();
  const wallet_address: any = localStorage
    .getItem('Wallet Address')
    ?.toLowerCase();

  const broker_address: any = process.env.REACT_APP_BROKER_ADDRESS;
  const broker_address_v3: any = process.env.REACT_APP_BROKER_ADDRESS_V3;
  const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const mpwr_token = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const brokerContractAddress =
    process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase();
  const salesModels = [
    {
      key: 'fixedPrice',
      title: t('create.FixedPrice'),
      priceType: 'fixedPrice',
    },
    { key: 'auction', title: t('create.Auction'), priceType: 'auction' },
  ];
  const startingDateOptions = [
    {
      name: 'Right after listing',
      value: t('productPage.PutOnSale.rightAfterListing'),
    },
  ];
  const [currencyOptions, setCurrencyOptions]: any = useState([
    { name: 'ETH', value: 'ETH' },
    { name: 'WETH', value: 'WETH' },
    { name: 'MPWR', value: 'MPWR' },
    { name: 'AGOV', value: 'AGOV' },
  ]);

  const [error, setError] = useState({
    displayName: '',
    symbol: '',
    collectionImage: '',
    collectionDescription: '',
    shortUrl: '',
    size: '',
    price: '',
    priceType: '',
    currencyType: '',
    title: '',
    description: '',
    royalties: '',
    properties: '',
    putOnMarketplace: '',
    attachment: '',
    category: '',
    startDateHandle: '',
    expiryDateHandle: '',
  });

  useEffect(() => {
    getAllCollection();
    getAirdropStashData();
  }, []);

  useEffect(() => {
    if (hideCursor) {
      window.onbeforeunload = function () {
        if (!hideCursor) {
          return 'If you reload this page, your previous action will be repeated';
        } else {
        }
      };
    } else {
      window.onbeforeunload = null;
    }
  }, [hideCursor]);

  const getAllCollection = async () => {
    try {
      setCollectionLoading(true);
      const result: any = await dispatch(getOpenseaCollectionAction());
      if (result?.data?.status) {
        for (const collection of result.data.data.collectionList) {
          const { collectionsContract }: any = await createCollectionContract(
            collection?.collection_address,
          );
          try {
            collection.isApproved = await collectionsContract.methods
              .isApprovedForAll(wallet_address, broker_address)
              .call();
            if (collection.isApproved) {
              if (
                result &&
                result.data &&
                result.data.data &&
                result.data.data.collectibleList.length > 0
              ) {
                result.data.data.collectibleList.forEach((collectible: any) => {
                  if (
                    collectible.collection_address.toLowerCase() ===
                    collection.collection_address.toLowerCase()
                  ) {
                    collectible.isApproved = true;
                    collectible.isChecked = false;
                  }
                });
              }
            }
          } catch (err) {
            continue;
          }
          collection.isChecked = false;
        }
        setIntialCollectionList(
          JSON.stringify(result.data.data.collectionList),
        );
        setCollectionModel(result.data.data.collectionList);
        setCollectibles(result.data.data.collectibleList);
        setIntialCollectibles(JSON.stringify(result.data.data.collectibleList));
        setCollectionLoading(false);
      } else {
        setIntialCollectionList(JSON.stringify([]));
        setCollectionModel([]);
        setCollectibles([]);
        setIntialCollectibles(JSON.stringify([]));
        setCollectionLoading(false);
      }
    } catch (err: any) {
      setCollectionLoading(false);
      return false;
    }
  };

  const getAirdropStashData = async () => {
    /* TODO : AirdropStash Hide (July 30 2022) */
    return false;
  };

  const handleCollectionType = (type: any) => {
    setFinalCollectibles([]);
    setCollectionModel([]);
    setCollectionType(type);
    if (type === 'OpenSea') {
      getAllCollection();
    } else if (type === 'ClubRare') {
      try {
        const filterList = JSON.parse(intialcollectibles).filter(
          (collectible: any) =>
            collectible.on_sale == true && collectible.isApproved === true,
        );
        const collectionList: any = [];
        if (filterList && filterList.length > 0) {
          filterList.forEach((element: any) => {
            if (collectionList.length == 0) {
              const collectionIndex = JSON.parse(
                initialcollectionList,
              ).findIndex(
                (collection: any) =>
                  collection.collection_address.toLowerCase() ==
                  element.collection_address.toLowerCase(),
              );
              if (collectionIndex != -1) {
                collectionList.push(
                  JSON.parse(initialcollectionList)[collectionIndex],
                );
              }
            } else if (
              collectionList.filter(
                (collection: any) =>
                  collection.collection_address.toLowerCase() ==
                  element.collection_address.toLowerCase(),
              ).length == 0
            ) {
              const collectionIndex = JSON.parse(
                initialcollectionList,
              ).findIndex(
                (collection: any) =>
                  collection.collection_address.toLowerCase() ==
                  element.collection_address.toLowerCase(),
              );
              if (collectionIndex != -1) {
                collectionList.push(
                  JSON.parse(initialcollectionList)[collectionIndex],
                );
              }
            }
          });
          setCollectionModel(collectionList);
        }
        setCollectionLoading(false);
      } catch (err: any) {
        return false;
      }
    } else if (type === 'Not Listed') {
      try {
        const filterList = JSON.parse(intialcollectibles).filter(
          (collectible: any) => collectible.on_sale == false,
        );
        const collectionList: any = [];
        if (filterList && filterList.length > 0) {
          filterList.forEach((element: any) => {
            if (collectionList.length == 0) {
              const collectionIndex = JSON.parse(
                initialcollectionList,
              ).findIndex(
                (collection: any) =>
                  collection.collection_address.toLowerCase() ==
                  element.collection_address.toLowerCase(),
              );
              if (collectionIndex != -1) {
                collectionList.push(
                  JSON.parse(initialcollectionList)[collectionIndex],
                );
              }
            } else if (
              collectionList.filter(
                (collection: any) =>
                  collection.collection_address.toLowerCase() ==
                  element.collection_address.toLowerCase(),
              ).length == 0
            ) {
              const collectionIndex = JSON.parse(
                initialcollectionList,
              ).findIndex(
                (collection: any) =>
                  collection.collection_address.toLowerCase() ==
                  element.collection_address.toLowerCase(),
              );
              if (collectionIndex != -1) {
                collectionList.push(
                  JSON.parse(initialcollectionList)[collectionIndex],
                );
              }
            }
          });
          setCollectionModel(collectionList);
        }
        setCollectionLoading(false);
      } catch (err: any) {
        return false;
      }
    }
  };

  const handleAllCollections = (e: any) => {
    const { name } = e.target;
    if (name === 'allSelect') {
      const allApproved = collectionModel.every(
        (collection: any) => collection.isApproved === true,
      );
      if (allApproved === true) {
        setIsAllApproved(true);
      } else {
        setIsAllApproved(false);
      }
      const updatedList = collectionModel.map((collection: any) => {
        return { ...collection, isChecked: true };
      });

      setCollectionModel(updatedList);
      const filterList = collectibles.filter((x: any) =>
        updatedList.some((collection: any) => {
          if (collectionType === 'OpenSea') {
            return collection.collection_address === x.collection_address;
          } else if (collectionType === 'Not Listed') {
            return (
              collection.collection_address === x.collection_address &&
              x.on_sale === false
            );
          } else if (collectionType === 'ClubRare') {
            return (
              collection.collection_address === x.collection_address &&
              x.on_sale === true
            );
          }
        }),
      );
      setFinalCollectibles(filterList);
    } else {
      const updatedList = collectionModel.map((collection: any) => {
        return { ...collection, isChecked: false };
      });
      setCollectionModel(updatedList);
      setFinalCollectibles([]);
    }
  };

  const handleCollections = (e: any, collection: any) => {
    const { checked } = e.target;
    collectionModel.forEach((collectionobj: any) => {
      if (collectionobj._id == collection._id) {
        collectionobj.isChecked = checked;
      }
    });
    const allApproved = collectionModel.every(
      (collection: any) => collection.isApproved === true,
    );
    if (allApproved === true) {
      setIsAllApproved(true);
    } else {
      setIsAllApproved(false);
    }
    const updatedList = collectionModel.filter(
      (collection: any) => collection.isChecked === true,
    );
    const filterList = collectibles.filter((x: any) =>
      updatedList.some((collection: any) => {
        if (collectionType === 'OpenSea') {
          return collection.collection_address === x.collection_address;
        } else if (collectionType === 'Not Listed') {
          return (
            collection.collection_address === x.collection_address &&
            x.on_sale === false
          );
        } else if (collectionType === 'ClubRare') {
          return (
            collection.collection_address === x.collection_address &&
            x.on_sale === true
          );
        }
      }),
    );
    setFinalCollectibles(filterList);
  };

  const handleCollectionsApprove = async () => {
    const checkedCollection = collectionModel.filter(
      (collection: any) => collection.isChecked === true,
    );
    for (const collections of checkedCollection) {
      const { collectionsContract }: any = await createCollectionContract(
        collections.collection_address,
      );
      setCollectionType('OpenSea');
      SetHideCursor(true);
      Setapproveloading(true);
      try {
        const isApproved = await collectionsContract.methods
          .isApprovedForAll(wallet_address, broker_address)
          .call();
        if (!isApproved) {
          collections.isApproved = false;
          const res = await collectionsContract.methods
            .setApprovalForAll(broker_address, 'true')
            .send({ from: wallet_address });
          if (res) {
            finalCollectibles.forEach((x: any) => {
              if (
                x.collection_address.toLowerCase() ==
                collections.collection_address.toLowerCase()
              ) {
                x.isApproved = true;
              }
            });
            SetHideCursor(false);
            Setapproveloading(false);
            setFinalCollectibles([]);
          }
        } else {
          collections.isApproved = true;
          SetHideCursor(false);
          Setapproveloading(false);
        }
      } catch (err) {
        collections.isApproved = false;
        SetHideCursor(false);
        Setapproveloading(false);
      }
    }
    getAllCollection();
  };

  const disableCursor = (res: any) => {
    SetHideCursor(res);
  };

  const handleClosePutOnSaleModal = () => {
    setPutOnSaleModal(false);
    setPutOnSaleLoading(false);
    setPutOnSaleModal(false);
    SetHideCursor(false);
    setError({ ...error, price: '' });
    setPrice('');
  };
  //this function used for  NFT delist (new broker)
  const newbrokerdeslistfunction = async (itemDetails: any) => {
    const contractAddressVal = itemDetails?.auctionDetails?.contract_address;
    const collectionAddress = itemDetails?.auctionDetails?.collection_address;
    const noncedata = Number(itemDetails?.auctionDetails?.nonce);
    const tokenId1 = itemDetails?.token_id ? itemDetails?.token_id : 0;
    const ordertype = itemDetails?.redeemable ? 1 : 0;
    const isTokenGated = itemDetails?.auctionDetails?.isTokenGated;
    const tokenGateAddress = itemDetails?.auctionDetails?.tokenGateAddress;
    const auctionType: string = itemDetails?.auctionDetails?.auctionType;
    const priceVal =
      auctionType === '1'
        ? itemDetails?.auctionDetails?.buyPrice
        : itemDetails?.auctionDetails?.startingPrice;

    const closingtime: any = Math.round(
      new Date(itemDetails?.auctionDetails?.initialClosingTime).getTime() /
        1000,
    );
    const listTime = Math.round(
      new Date(itemDetails?.auctionDetails?.startingTime).getTime() / 1000,
    );
    const Endtime: number = auctionType === '1' ? 0 : closingtime;

    const deslistquery = {
      seller: itemDetails?.collectible_owner,
      contractaddress: collectionAddress,
      royaltyFee: itemDetails?.royalties ? itemDetails?.royalties * 100 : 0,
      royaltyReceiver: itemDetails?.userObj?.wallet_address,
      paymentToken: itemDetails?.auctionDetails?.erc20Token,
      basePrice: priceVal,
      listingTime: listTime,
      expirationTime: Endtime,
      nonce: noncedata,
      tokenId: tokenId1,
      orderType: ordertype,
      signature: itemDetails?.auctionDetails?.signature,
      uri: itemDetails?.file,
      objId: itemDetails?._id.toString(),
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
    try {
      SetHideCursor(true);
      itemDetails['delist_loading'] = true;
      setDelistLoading(true);
      const { brokerContract }: any = await makeBrokerContractForEth(
        contractAddressVal,
        true,
      );
      try {
        const brokerTransactionHash = await brokerContract.methods
          .invalidateSignedOrder(buyarray)
          .send({ from: wallet_address });
        if (brokerTransactionHash.transactionHash) {
          const delistAction = {
            transaction_hash: brokerTransactionHash.transactionHash,
            contract_address: contractAddressVal,
            network_id: '1',
          };
          await dispatch(eventsAction(delistAction));
          addToast('Item delist successfully', {
            appearance: 'success',
            autoDismiss: true,
          });
          SetHideCursor(false);
          itemDetails['delist_loading'] = false;
          setDelistLoading(false);
          getAllCollection();
          setFinalCollectibles([]);
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        SetHideCursor(false);
        itemDetails['delist_loading'] = false;
        setDelistLoading(false);
      }
    } catch (err: any) {
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
      SetHideCursor(false);
      itemDetails['delist_loading'] = false;
      setDelistLoading(false);
    }
  };

  const handlePutOffSale = async (collectible: any) => {
    const contractAddress = collectible?.auctionDetails?.contract_address;
    if (broker_address?.toLowerCase() === contractAddress?.toLowerCase()) {
      newbrokerdeslistfunction(collectible);
    } else if (
      broker_address_v3?.toLowerCase() === contractAddress?.toLowerCase()
    ) {
      if (
        wallet_address?.toUpperCase() ===
        collectible?.collectible_owner?.toUpperCase()
      ) {
        const send_obj: any = { from: wallet_address };
        const { brokerContract }: any = await makeBrokerContractForEth(
          contractAddress?.toLowerCase(),
          true,
        );
        try {
          SetHideCursor(true);
          collectible['delist_loading'] = true;
          setDelistLoading(true);
          const colltokenId = collectible?.token_id ? collectible?.token_id : 0;
          const putoffSaleResult = await brokerContract.methods
            .putSaleOff(colltokenId, collectible?.collection_address)
            .send(send_obj);
          if (putoffSaleResult?.transactionHash) {
            const body = {
              contract_address: process.env.REACT_APP_BROKER_ADDRESS,
              network_id: collectible?.network_id,
              transaction_hash: putoffSaleResult.transactionHash,
            };
            const collectibleIndex = finalCollectibles.findIndex(
              (x: any) =>
                x.token_id == colltokenId &&
                x.collection_address.toLowerCase() ==
                  collectible.collection_address.toLowerCase() &&
                x.network_id == collectible.network_id,
            );
            if (collectibleIndex != '-1') {
              finalCollectibles[collectibleIndex]['on_sale'] = false;
            }
            SetHideCursor(false);
            collectible['delist_loading'] = false;
            setDelistLoading(false);
            getAllCollection();
            setFinalCollectibles([]);
            addToast('Item delist successfully', {
              appearance: 'success',
              autoDismiss: true,
            });
            await dispatch(eventsAction(body));
            await dispatch({ type: UPDATE_WALLET_AMOUNT, payload: true });
          }
        } catch (err: any) {
          SetHideCursor(false);
          collectible['delist_loading'] = false;
          setDelistLoading(false);
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
    }
  };

  const handlePutOnSale = (data: any) => {
    setCollectibleDetails(data);
    setCollectionOwner(data.collectible_owner);
    setCollectionAddress(data.collection_address);
    setNetworkId(data.network_id);
    setPutOnSaleModal(true);
  };

  useEffect(() => {
    if (puonsaleModal) {
      const date: any = new Date();
      const expiryDate = moment(date)
        .add(10, 'minutes')
        .format('YYYY-MM-DDTHH:mm');
      const minExpiryDate = moment(date).format('YYYY-MM-DDTHH:mm');
      const currentDateTime = moment(date).format('YYYY-MM-DDTHH:mm');
      setExpiryDateHandle(expiryDate);
      setMinExpirationDate1(expiryDate);
      setStartDateHandle(currentDateTime);
      setMinExpirationDate(minExpiryDate);
    }
  }, [puonsaleModal]);

  useEffect(() => {
    if (networkID) {
      const network =
        Number(networkID) == 1
          ? process.env.REACT_APP_NFT_NETWORK_ID
          : process.env.REACT_APP_KLATYN_NETWORK_ID;
      setNetworkId(networkID);
      if (network == klatynNetworkId) {
        setCurrencyOptions([
          { name: 'KLAY', value: 'KLAY' },
          { name: 'AGOV', value: 'AGOV' },
        ]);

        setSelectedCurrency('KLAY');
      } else {
        setCurrencyOptions([
          { name: 'ETH', value: 'ETH' },
          { name: 'WETH', value: 'WETH' },
          { name: 'MPWR', value: 'MPWR' },
          { name: 'AGOV', value: 'AGOV' },
        ]);

        setSelectedCurrency('ETH');
      }
    }
  }, [networkID]);

  const onCurrencyChange = (selected: any) => {
    setSelectedCurrency(selected.value);
  };

  const handleExpiry = (date: any) => {
    if (date === '') {
      setExpiryDateHandle('');
    } else if (date <= minExpiryDate1) {
      addToast(`Date and time should be greater than ${minExpiryDate1}`, {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    } else {
      setExpiryDateHandle(date);
    }
  };

  const handleStartDate = (e: any) => {
    const dateValue = e.target.value;
    const id = e.target.id;

    const endDateAndTime = moment(dateValue).format('YYYY-MM-DDTHH:mm');
    const currentDateAndTime = moment().format('YYYY-MM-DDTHH:mm');

    if (endDateAndTime == currentDateAndTime) {
      setStartDate(dateValue, id);
    } else if (endDateAndTime <= currentDateAndTime) {
      addToast(`Date and time should be greater than current time`, {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    } else {
      setStartDate(dateValue, id);
    }
  };

  const setStartDate = (value: any, id: string) => {
    setStartDateHandle(value);
    const expiryDate = moment(value)
      .add(10, 'minutes')
      .format('YYYY-MM-DDTHH:mm');
    if (value === '') {
      if (id === 'meeting-time-start') {
        setMinExpirationDate1(expiryDate);
      } else if (id === 'meeting-time-end') {
        setExpiryDateHandle(expiryDate);
      }
    } else {
      setExpiryDateHandle(expiryDate);
      setMinExpirationDate1(expiryDate);
    }
  };

  const inputClickHandler = (event: any) => {
    const { name, value } = event.target;
    switch (name) {
      case 'title':
        if (value === '') {
          setError({ ...error, title: 'Can not be empty' });
        } else {
          setError({ ...error, title: '' });
        }
        setTitle(value);
        break;
      case 'priceType':
        setPriceType(value);
        break;
      case 'price':
        const regex1 = /^[0-9][.\d]{0,17}$/;
        if (value === '') {
          setError({ ...error, price: 'can not be empty' });
        } else if (!regex1.test(value)) {
          setError({ ...error, price: 'Price should not more then 18 digit' });
        } else {
          setError({ ...error, price: '' });
        }
        setPrice(value);
        break;

      default:
        break;
    }
  };

  const handleModal = () => {
    let errorMsg1 = '';
    let errorMsg5 = '';
    let errorMsg6 = '';
    const regex1 = /^[0-9][.\d]{0,17}$/;

    if (price === '') {
      errorMsg1 = 'Can not be empty';
    } else if (!regex1.test(price)) {
      errorMsg1 = 'Price should not more then 18 digit';
    } else if (startDateHandle === '') {
      errorMsg5 = 'Can not be empty. Please Select Start Date ';
    } else if (expiryDateHandle === '') {
      errorMsg6 = 'Can not be empty. Please Select End Date';
    } else {
      errorMsg1 = '';
    }

    setError({
      ...error,
      price: errorMsg1,
      startDateHandle: errorMsg5,
      expiryDateHandle: errorMsg6,
    });
    if (errorMsg1 == '' && errorMsg5 == '' && errorMsg6 == '') {
      putOnSaleApprovedHandler();
    }
  };

  const putOnSaleApprovedHandler = async () => {
    if (error.price) {
      return;
    }
    setPutOnSaleLoading(true);
    SetHideCursor(true);
    const { CbrforEthContr }: any = await CbrNftforEthContract(
      collectionAddress,
    );
    const { brokerContract }: any = await makeBrokerContractForEth(
      brokerContractAddress,
      true,
    );
    try {
      const colltokenId = CollectibleDetails?.token_id
        ? CollectibleDetails?.token_id
        : 0;
      let cbrresult = await CbrforEthContr.methods
        .isApprovedForAll(wallet_address, brokerContractAddress)
        .call();

      if (!cbrresult) {
        try {
          cbrresult = await CbrforEthContr.methods
            .setApprovalForAll(brokerContractAddress, true)
            .send({ from: wallet_address });
          addToast(`Approved successfully`, {
            appearance: 'success',
            autoDismiss: true,
          });
        } catch (error: any) {
          setPutOnSaleLoading(false);
          setPutOnSaleModal(false);
          SetHideCursor(false);
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
        if (getnonse) {
          const resLazyMint: any = await commonPutOnSaleLazyListingHandler(
            getnonse,
            CollectibleDetails,
            startDateHandle,
            expiryDateHandle,
            selectedCurrency,
            price,
            priceType,
          );
          if (resLazyMint && resLazyMint?.signature) {
            const response: any = await dispatch(
              LazylistingPutOnSaleAPiAction(resLazyMint),
            );
            if (response) {
              disableCursor(false);
              SetHideCursor(false);
              setPutOnSaleModal(false);
              const collectibleIndex = finalCollectibles.findIndex(
                (x: any) =>
                  x.token_id == colltokenId &&
                  x.collection_address.toLowerCase() ==
                    collectionAddress.toLowerCase() &&
                  x.network_id == '1',
              );
              if (collectibleIndex != '-1') {
                finalCollectibles[collectibleIndex]['on_sale'] = true;
              }
              getAirdropStashData();
              window.onbeforeunload = null;
              setPutOnSaleLoading(false);
              setPutOnSaleModal(false);
              SetHideCursor(false);
              getAllCollection();
              setFinalCollectibles([]);
              addToast('Item listed successfully', {
                appearance: 'success',
                autoDismiss: true,
              });
            }
          } else {
            setPutOnSaleLoading(false);
            setPutOnSaleModal(false);
            SetHideCursor(false);
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
    } catch (error: any) {
      setPutOnSaleLoading(false);
      setPutOnSaleModal(false);
      SetHideCursor(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const getStartTime = () => {
    const startingDate = new Date(startDateHandle);
    const startingUTCDate = Date.UTC(
      startingDate.getUTCFullYear(),
      startingDate.getUTCMonth(),
      startingDate.getUTCDate(),
      startingDate.getUTCHours(),
      startingDate.getUTCMinutes(),
    );
    return Math.ceil(startingUTCDate.valueOf() / 1000);
  };

  const geteEndTime = () => {
    const endingDate = new Date(expiryDateHandle);
    const endingUTCDate = Date.UTC(
      endingDate.getUTCFullYear(),
      endingDate.getUTCMonth(),
      endingDate.getUTCDate(),
      endingDate.getUTCHours(),
      endingDate.getUTCMinutes(),
    );
    return Math.ceil(endingUTCDate.valueOf() / 1000);
  };

  const addToken = async () => {
    const tokenAddress = mpwr_token;
    const tokenSymbol = 'MPWR';
    const tokenDecimals = 18;
    setAddTokenLoading(true);
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });
      setAddTokenLoading(false);
    } catch (err: any) {
      setAddTokenLoading(false);
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const handleClaim = async () => {
    setClaimLoading(true);
    SetHideCursor(true);
    try {
      const { airdropContr }: any = await airdropContract(
        process.env.REACT_APP_AIRDROP_ADDRESS,
      );
      const walletAdd = localStorage.getItem('Wallet Address');
      const merkleProof = airdropStashData.merkle_proof;
      const amount = airdropStashData.mpwr_to_claim;
      const res: any = await airdropContr.methods
        .claim(amount, merkleProof, false)
        .send({ from: walletAdd });

      if (res) {
        handleShow();
        setClaimLoading(false);
        SetHideCursor(false);
        setClaimSuccessCheck(true);
        getAirdropStashData();
        addToast('Claim successfully.', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        setClaimLoading(false);
        SetHideCursor(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (err: any) {
      setClaimLoading(false);
      SetHideCursor(false);
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const handleStakeRewards = async () => {
    SetHideCursor(true);
    setStakeRewardLoading(true);
    try {
      const { airdropContr }: any = await airdropContract(
        process.env.REACT_APP_AIRDROP_ADDRESS,
      );
      const walletAdd = localStorage.getItem('Wallet Address');
      const merkleProof = airdropStashData.merkle_proof;
      const amount = airdropStashData.mpwr_to_claim;
      const res: any = await airdropContr.methods
        .claim(amount, merkleProof, true)
        .send({ from: walletAdd });
      if (res) {
        handleShow();
        SetHideCursor(false);
        setStakeRewardLoading(false);
        getAirdropStashData();
        setClaimSuccessCheck(true);
        addToast('Stake Rewards successfully.', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        SetHideCursor(false);
        setStakeRewardLoading(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (err: any) {
      SetHideCursor(false);
      setStakeRewardLoading(false);
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const handleCursor = (data: any) => {
    SetHideCursor(data);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { airdropContr }: any = await airdropContract(
          process.env.REACT_APP_AIRDROP_ADDRESS,
        );
        const walletAdd = localStorage.getItem('Wallet Address');
        try {
          const res: any = await airdropContr.methods
            .isClaimed(walletAdd)
            .call();
          if (res) {
            setClaimSuccessCheck(true);
          }
        } catch (err: any) {
          setClaimSuccessCheck(false);
        }
      } catch (err: any) {
        return false;
      }
    }
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="transfferassets_main_wrp">
        <Layout mainClassName="transfferassets_wrp" hideCursor={hideCursor}>
          <div
            className="container-fluid"
            style={{ pointerEvents: hideCursor ? 'none' : 'auto' }}
          >
            {airdropStashData?.mpwr_to_claim === '0' && (
              <div className={`mpwr_notify_wrp ${showNote ? '' : 'hidenote'}`}>
                <p> {t('transffer-assets.heading')}</p>
                <button
                  type="button"
                  className="closenotewrp"
                  onClick={() => setShowNote(false)}
                >
                  X
                </button>
              </div>
            )}

            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-12  transfferassets_left_wrp">
                {airdropStashData?.mpwr_to_claim !== '0' &&
                  airdropStashData?.mpwr_to_claim !== undefined && (
                    <AirDrops
                      claimLoading={claimLoading}
                      airdropStashData={airdropStashData}
                      airdropStashLoading={airdropStashLoading}
                      addToken={addToken}
                      handleClaim={handleClaim}
                      handleStakeRewards={handleStakeRewards}
                      stakeRewardLoading={stakeRewardLoading}
                      cursor={hideCursor}
                      claimSuccessCheck={claimSuccessCheck}
                    />
                  )}
                <CollectionApproval
                  collectionModel={collectionModel}
                  handleAllCollections={handleAllCollections}
                  handleCollections={handleCollections}
                  handleCollectionType={handleCollectionType}
                  collectionType={collectionType}
                  handleCollectionsApprove={handleCollectionsApprove}
                  approveloading={approveloading}
                  collectionLoading={collectionLoading}
                  isAllApproved={isAllApproved}
                />
              </div>
              <div className="col-8 transfferassets_right_wrp">
                <SelectNFTs
                  finalCollectibles={finalCollectibles}
                  handlePutOnSale={handlePutOnSale}
                  handlePutOffSale={handlePutOffSale}
                  handleCursor={handleCursor}
                  getAllCollection={getAllCollection}
                  setCollectionType={setCollectionType}
                  delistLoading={delistLoading}
                />
              </div>
              <PutOnSaleTA
                putOnSaleLoading={putOnSaleLoading}
                disableCursor={disableCursor}
                show={puonsaleModal}
                onHide={handleClosePutOnSaleModal}
                collectionOwner={collectionOwner}
                collection_address={collectionAddress}
                salesModels={salesModels}
                startingDateOptions={startingDateOptions}
                inputClickHandler={inputClickHandler}
                onCurrencyChange={onCurrencyChange}
                currencyOptions={currencyOptions}
                currencyOptionsAuction={currencyOptions}
                error={error}
                title={title}
                selectedCurrency={selectedCurrency}
                price={price}
                startDateHandle={startDateHandle}
                minExpiryDate={minExpiryDate}
                expiryDateHandle={expiryDateHandle}
                handleExpiry={handleExpiry}
                handleStartDate={handleStartDate}
                handleModal={handleModal}
                hideCursor={hideCursor}
              />
              <NonVerifiedModal
                show={nonVerifiedModal}
                onHide={() => setNonVerifiedModal(false)}
                puonsaleModal={() => setPutOnSaleModal(true)}
              />
              <AddToToken
                hideCursor={hideCursor}
                setShowMethod={setShow}
                addTokenLoading={addTokenLoading}
                show={show}
                onHide={handleClose}
                addToken={addToken}
                airdropStashData={airdropStashData}
              />
            </div>
          </div>
        </Layout>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export { TransfferAssets };
