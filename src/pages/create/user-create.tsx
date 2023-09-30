import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../layouts/main-layout/main-layout';
import { Loading, Select, Spinner } from '../../components';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import VideoThumbnail from 'react-video-thumbnail';
import sellerAgreement from './../../assets/images/selleragreement.svg';
import creatorPdf from '../../assets/documents/creator_agreement.pdf';
import checkbox from './../../assets/images/right_tick.svg';

import moment from 'moment';
import Switch from 'react-switch';
import { useCustomStableCoin } from '../../hooks';

import {
  createCollectiblesActionForUser,
  createCollectionAction,
  getCollectionByUserAction,
  getPinataForDataApi,
  getPinataForIpfsApi,
  AllcollectionCategory,
  LazylistingPutOnSaleAPiAction,
  getEditProfileAction,
} from '../../redux';

import {
  makeBrokerContractForKlytn,
  EnableEthereum,
  EnableKlyten,
  GetCaver,
  getWeb3,
  makeBrokerContractForEth,
} from '../../service/web3-service';
import collectionFactoryArtifacts from '../../smart-contract/collection-factory.json';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import './create.css';
import { SET_WALLET_AMOUNT } from '../../redux/types/connect-wallet-types';
import { SET_IS_CONNECTED } from '../../redux/types';
import ApproveModel from './approve-model';
import { imgConstants } from '../../assets/locales/constants';
import { klaytnWallConnCheck } from '../../utils/klaytn-wallet-connection-check';
import { EditProfileAction } from '../../redux';

const factory_address = process.env.REACT_APP_FACTORY_ADDRESS;
const klaytn_factory_address =
  process.env.REACT_APP_KLAYTN_COLLECTION_FACTORY_ADDRESS;
declare const window: any;
const klaytn = window.klaytn;
let propertyCounter = 0;

const currencyOptions = [
  { name: 'KLAY', value: 'KLAY' },
  { name: 'AGOV', value: 'AGOV' },
  { name: 'USDT', value: 'USDT' },
];
const currencyMetaMaskOptions = [
  { name: 'ETH', value: 'ETH' },
  { name: 'WETH', value: 'WETH' },
  { name: 'MPWR', value: 'MPWR' },
  { name: 'AGOV', value: 'AGOV' },
  { name: 'USDT', value: 'USDT' },
];

const UserCreate = () => {
  const { t } = useTranslation();
  const { customToWei } = useCustomStableCoin();

  const profileDetails = useSelector((state: any) => {
    return state.profileReducers.profile_details;
  });

  const [isDis, setDis] = useState(false);
  const [showReedemModal, setShowRedeemModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const { addToast } = useToasts();
  const history = useHistory();
  const wallet_address: any = localStorage.getItem('Wallet Address');
  const network_id: any = localStorage.getItem('networkId');
  const dispatch = useDispatch();
  const [attactment, setAttachment] = useState<any>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState('');
  const [royalties, setRoyalties] = useState<any>('');
  const [selectBrand, setSelectBrand] = useState('Select Brand');
  const [displayName, setDisplayName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [collectionImage, setCollectionImage] = useState<any>('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [price, setPrice] = useState<any>('');
  const [brandList, setBrandList] = useState<any>([]);
  const [isOtherBrand, setOthertBrand] = useState(false);
  const [otherBrandNameInput, setOtherBrandNameInput] = useState('');
  const [brand, setBrand] = useState({ value: '', label: '' });
  const [collectionButtonLoading, setCollectionButtonLoading] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState(-1);
  const [collectibleImageList, setCollectibleImages] = useState<any>([]);
  const [collectionAddress, setCollectionAddress] = useState<any>('');
  const [isLoaded, setIsLoaded] = useState(true);
  const [isComponentLoaded, setIsComponentLoaded] = useState(true);
  const [collections, setCollections] = useState('Default Clubrare Collection');
  const [selectCategory, setSelectCategory] = useState('Select Category');
  const [isdigitalnft, Setisdigitalnft] = useState<boolean>(false);
  const [Ipfs, SetIpfs] = useState<any>();
  const [collectionBannerImage, setCollectionBannerImage] = useState<any>('');
  const [itemid, Setitemid] = useState<string>('');
  const salesModels = [
    { key: 'fixedPrice', title: t('create.FixedPrice') },
    { key: 'auction', title: 'Timed Auction' },
  ];
  const [activeSaleModel, setActiveSaleModel] = useState('fixedPrice');
  const [selectedCurrency, setSelectedCurrency] = useState('KLAY');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [expiryDateHandle, setExpiryDateHandle] = useState<any>('');
  const [startDateHandle, setStartDateHandle] = useState('');
  const [minExpiryDate, setMinExpirationDate] = useState<any>('');
  const [minExpiryDate1, setMinExpirationDate1] = useState<any>('');

  const [onsaleloading, Setonsaleloading] = useState<boolean>(false);
  const [usdAmount, setUsdAmount] = useState(0);
  const [activeRedeemBurn, setActiveRedeemBurn] = useState<boolean>(false);
  const [checkSellerAgreement, setCheckSellerAgreement] =
    useState<boolean>(false);

  const agov_token_address = process.env.REACT_APP_AGOV_TOKEN_ADD;
  const weth_token_address = process.env.REACT_APP_WETH_TOKEN_ADD;
  const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
  const usdt_eth_token_address =
    process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();
  const usdt_klaytn_token_address =
    process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase();

  const brokerContractAddress =
    process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase();

  const klaytnbrokerAddress =
    process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase();

  const CURRENCYDetailS = useSelector(
    (state: any) => state.ratechangeReducer.ratechange,
  );

  const getUsdRate = async (
    price: any,
    network_id: any,
    erc20_address: any,
  ) => {
    let usdAmount: any;

    const {
      ethRate,
      klayRate,
      agovRate,
      mpwrRate,
      agovEthRate,
      ethUSDTRate,
      klaytnUSDTRate,
    } = CURRENCYDetailS;
    if (network_id === 1) {
      if (erc20_address?.toLowerCase() == mpwr_token_address?.toLowerCase()) {
        usdAmount = price * mpwrRate;
      } else if (erc20_address?.toLowerCase() === agov_eth_token_address?.toLowerCase()) {
        usdAmount = price * agovEthRate;
      } else if (erc20_address?.toLowerCase() === usdt_eth_token_address?.toLowerCase()) {
        usdAmount = price * ethUSDTRate;
      } else {
        usdAmount = price * ethRate;
      }
    } else {
      if (erc20_address == '0x0000000000000000000000000000000000000000') {
        usdAmount = price * klayRate;
      } else if (erc20_address?.toLowerCase() === usdt_klaytn_token_address) {
        usdAmount = price * klaytnUSDTRate;
      } else {
        usdAmount = price * agovRate;
      }
    }
    if (usdAmount && usdAmount > 0) {
      setUsdAmount(Number(parseFloat(usdAmount).toFixed(2)));
    }
  };

  const handleCloseapproveModel = () => {
    setIsModalVisible(false);
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

  const getEndTime = () => {
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

  const getSignatureForLazyListing = async (noncedata: any) => {
    const startTime = await getStartTime();
    const endTime = activeSaleModel === 'fixedPrice' ? 0 : await getEndTime();
    const auctionTypeval = activeSaleModel === 'fixedPrice' ? '1' : '2';
    const ordertype = isdigitalnft ? 0 : 1;
    if (
      localStorage.getItem('networkId') ===
      process.env.REACT_APP_KLATYN_NETWORK_ID
    ) {
      var paymenttype =
        selectedCurrency === 'AGOV'
          ? agov_token_address
          : selectedCurrency === 'USDT'
          ? usdt_klaytn_token_address
          : '0x0000000000000000000000000000000000000000';
      let tokenGateAddress: any = '0x0000000000000000000000000000000000000000';
      await klaytnWallConnCheck();
      const { caver }: any = await GetCaver();

      const amount1 = await customToWei(price?.toString(), caver, paymenttype);
      const sign_signature =
        '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const hashdata = {
        seller: wallet_address?.toString()?.toLowerCase(),
        contractAddress: collectionAddress?.toLowerCase(),
        royaltyFee: royalties * 100,
        royaltyReceiver: wallet_address?.toString()?.toLowerCase(),
        paymentToken: paymenttype,
        basePrice: amount1?.toString(),
        listingTime: startTime,
        expirationTime: endTime,
        nonce: +noncedata,
        tokenId: 0,
        orderType: ordertype,
        signature1: sign_signature,
        uri: Ipfs?.IpfsHash,
        objId: itemid,
        isTokenGated: false,
        tokenGateAddress: tokenGateAddress,
      };
      const hashArray = [
        hashdata.seller,
        hashdata.contractAddress,
        hashdata.royaltyFee,
        hashdata.royaltyReceiver,
        hashdata.paymentToken,
        hashdata.basePrice,
        hashdata.listingTime,
        hashdata.expirationTime,
        hashdata.nonce,
        hashdata.tokenId,
        hashdata.orderType,
        hashdata.signature1,
        hashdata.uri,
        hashdata.objId,
        hashdata.isTokenGated,
        hashdata.tokenGateAddress,
      ];

      try {
        const { brokerContract }: any = await makeBrokerContractForKlytn(
          klaytnbrokerAddress,
          true,
        );
        const brokerTransactionHash = await brokerContract.methods
          .hashOrder(hashArray)
          .call();
        const fromAddress = wallet_address;
        const params = [fromAddress, brokerTransactionHash];
        const method = 'klay_sign';
        await caver.klay.currentProvider.sendAsync(
          {
            method,
            params,
            from: fromAddress,
          },

          (err: any, result: any) => {
            if (err || result.error) {
              setHideCursor(false);
              Setonsaleloading(false);
              history.push(`/item/${itemid}`);
            }
            let signature = result.result;
            callPutOnSaleApi(signature, amount1, hashdata.tokenGateAddress);
          },
        );
      } catch (err) {
        setHideCursor(false);
        Setonsaleloading(false);
        history.push(`/item/${itemid}`);
      }
    } else {
      var paymenttype =
        selectedCurrency === 'WETH'
          ? weth_token_address
          : selectedCurrency === 'MPWR'
          ? mpwr_token_address
          : selectedCurrency === 'AGOV'
          ? agov_eth_token_address
          : selectedCurrency === 'USDT'
          ? usdt_eth_token_address
          : '0x0000000000000000000000000000000000000000';
      const { web3 }: any = await getWeb3();
      paymenttype;
      // eslint-disable-next-line no-console

      let amount1 = await customToWei(price.toString(), web3, paymenttype);

      let tokenGateAddress: any = '0x0000000000000000000000000000000000000000';
      const msgParams = JSON.stringify({
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Order: [
            { name: 'seller', type: 'address' },
            { name: 'contractAddress', type: 'address' },
            { name: 'royaltyFee', type: 'uint256' },
            { name: 'royaltyReceiver', type: 'address' },
            { name: 'paymentToken', type: 'address' },
            { name: 'basePrice', type: 'uint256' },
            { name: 'listingTime', type: 'uint256' },
            { name: 'expirationTime', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'orderType', type: 'uint8' },
            { name: 'uri', type: 'string' },
            { name: 'objId', type: 'string' },
            { name: 'isTokenGated', type: 'bool' },
            { name: 'tokenGateAddress', type: 'address' },
          ],
        },
        primaryType: 'Order',
        domain: {
          name: 'Clubrare Marketplace',
          version: '1.0.1',
          chainId: process.env.REACT_APP_NFT_NETWORK_ID,
          verifyingContract: process.env.REACT_APP_ETH_BROKER_VALIDATOR,
        },
        message: {
          seller: wallet_address?.toString()?.toLowerCase(),
          contractAddress: collectionAddress?.toLowerCase(),
          royaltyFee: (royalties * 100)?.toString(),
          royaltyReceiver: wallet_address?.toString()?.toLowerCase(),
          paymentToken: paymenttype,
          basePrice: amount1?.toString(),
          listingTime: startTime,
          expirationTime: endTime,
          nonce: noncedata,
          tokenId: 0,
          orderType: ordertype,
          uri: Ipfs?.IpfsHash,
          objId: itemid?.toLowerCase(),
          isTokenGated: false,
          tokenGateAddress: tokenGateAddress,
        },
      });
      const fromAddress = wallet_address;
      const params = [fromAddress, msgParams];

      const method = 'eth_signTypedData_v4';

      await web3.currentProvider.sendAsync(
        {
          method,
          params,
          fromAddress,
        },

        (err: any, result: any) => {
          if (err) {
            setHideCursor(false);
            Setonsaleloading(false);
            setIsModalVisible(false);
            history.push(`/item/${itemid}`);
          }
          let signature = result.result;
          callPutOnSaleApi(signature, amount1, tokenGateAddress);
        },
      );
    }

    const callPutOnSaleApi = async (
      val: any,
      amount1: any,
      tokenGateAddress: any,
    ) => {
      setHideCursor(false);
      Setonsaleloading(false);
      setIsModalVisible(false);
      const apiquery = {
        _id: itemid,
        auctionType: auctionTypeval,
        amount: amount1,
        erc20_address: paymenttype,
        nonce: noncedata,
        signature: val,
        startingTime: startTime,
        closingTime: endTime,
        isTokenGated: false,
        tokenGateAddress: tokenGateAddress,
      };
      if (val) {
        const response: any = await dispatch(
          LazylistingPutOnSaleAPiAction(apiquery),
        );
        if (response) {
          history.push(`/item/${itemid}`);
        }
      }
    };

    window.onbeforeunload = function () {
      return 'If you reload this page, your previous action will be repeated';
    };
    try {
      if (price == '') {
        setError({ ...error, price: 'Please enter price' });
      } else {
        if (!wallet_address) {
        } else {
        }
      }
    } catch {}
  };

  const handlePutOnSale = async () => {
    setHideCursor(true);
    Setonsaleloading(true);
    if (
      localStorage.getItem('networkId') ===
      process.env.REACT_APP_KLATYN_NETWORK_ID
    ) {
      await klaytnWallConnCheck();
      const { brokerContract }: any = await makeBrokerContractForKlytn(
        klaytnbrokerAddress,
        true,
      );

      try {
        const nonceRes = await brokerContract.methods
          .getCurrentOrderNonce(wallet_address)
          .call();

        if (nonceRes) {
          getSignatureForLazyListing(nonceRes);
        }
      } catch (error) {
        Setonsaleloading(false);
        setHideCursor(false);
        setIsModalVisible(false);
        history.push(`/item/${itemid}`);
      }
    } else {
      const { brokerContract }: any = await makeBrokerContractForEth(
        brokerContractAddress,
        true,
      );
      try {
        const nonceRes = await brokerContract.methods
          .getCurrentOrderNonce(wallet_address)
          .call();

        if (nonceRes) {
          getSignatureForLazyListing(nonceRes);
        }
      } catch {
        Setonsaleloading(false);
        setHideCursor(false);
        setIsModalVisible(false);
        history.push(`/item/${itemid}`);
      }
    }
  };
  useEffect(() => {
    if (profileDetails && profileDetails?.isAgreementSigned) {
      setCheckSellerAgreement(
        profileDetails?.isAgreementSigned
          ? profileDetails?.isAgreementSigned
          : false,
      );
    }
  }, [profileDetails]);

  //just for loader
  useEffect(() => {
    setTimeout(() => {
      setIsComponentLoaded(false);
    }, 2000);
  }, []);

  useEffect(() => {
    setCollectionAddress(
      network_id === process.env.REACT_APP_KLATYN_NETWORK_ID
        ? process.env.REACT_APP_KLYTN_USER_MINTABLE_ADD
        : process.env.REACT_APP_ETH_USER_MINTABLE_ADD,
    );
  }, []);
  const [error, setError] = useState({
    displayName: '',
    symbol: '',
    collectionImage: '',
    collectionBannerImage: '',
    collectionDescription: '',
    shortUrl: '',
    size: '',
    price: '',
    currencyType: '',
    title: '',
    description: '',
    royalties: '',
    properties: '',
    putOnMarketplace: '',
    attachment: '',
    category: '',
    nftType: '',
    nftCategory: '',
    startDateHandle: '',
    expiryDateHandle: '',
    dynamicimgurl: '',
    isAgreementSignedErr: '',
    nftBrand: '',
  });

  const onCurrencyChange = (selected: any) => {
    setSelectedCurrency(selected.value);
    if (network_id == process.env.REACT_APP_KLATYN_NETWORK_ID) {
      if (selected.value == 'AGOV') {
        getUsdRate(price, 2, agov_token_address);
      } else if (selected.value == 'USDT') {
        getUsdRate(price, 2, usdt_klaytn_token_address);
      } else if (selected.value == 'KLAY') {
        getUsdRate(price, 2, '0x0000000000000000000000000000000000000000');
      }
    } else {
      if (selected.value == 'WETH') {
        getUsdRate(price, 1, weth_token_address);
      } else if (selected.value == 'MPWR') {
        getUsdRate(price, 1, mpwr_token_address);
      } else if (selected.value == 'AGOV') {
        getUsdRate(price, 1, agov_eth_token_address);
      } else if (selected.value == 'USDT') {
        getUsdRate(price, 1, usdt_eth_token_address);
      } else if (selected.value == 'ETH') {
        getUsdRate(price, 1, '0x0000000000000000000000000000000000000000');
      }
    }
  };

  const [errorAttach, setErrorAttach] = useState(false);

  const [collectionList, setCollectionList] = useState<Array<any>>([]);
  const [allcatimgname, Setallcatimgname] = useState<any>([]);
  const isConnected = useSelector(
    (state: any) => state.headerReducer.isConnected,
  );
  const [redeemableType, setRedeemableType] = useState<number>(1);
  const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;

  const [isAudio, setisAudio] = useState(false);
  const [isSubmited, setIsSubmitted] = useState(false);
  const [hideCursor, setHideCursor] = useState<boolean>(false);

  const [carouselLoading, setCarouselLoading] = useState(false);
  useEffect(() => {
    dispatch(AllcollectionCategory());
  }, []);

  const allcategory = useSelector(
    (state: any) => state.categoryReducer.allcategoryitem,
  );

  const [category, setCategory] = useState<any>({
    luxury_name: '',
    category_id: null,
    created_on: null,
    imageRules: [],
    name: '',
    _id: '',
    errorMsg: '',
  });

  const changecategory = (_id: any) => {
    setBrandList([]);
    setSelectBrand('Select Brand');
    const findCategoryRes = allcategory.filter((flt: any) => flt._id === _id);
    const data = findCategoryRes[0].brands?.map((item: any) => {
      return { value: item.name, label: item.name };
    });
    setBrandList(data);

    setCategory(findCategoryRes[0]);
    if (_id) {
      setError({ ...error, nftCategory: '' });
    }
  };

  const getCategory = (event: any) => {
    setSelectCategory(event);
    Setallcatimgname([]);
    let filteredArray = collectibleImageList?.filter(
      (item: any) => item.name === 'attachment',
    );
    setCollectibleImages(filteredArray);
  };

  const getBrand = (eventKey: any) => {
    setSelectBrand(eventKey);
    if (eventKey === 'Other') {
      setOthertBrand(true);
    } else {
      setOthertBrand(false);
      setBrand({ value: eventKey, label: eventKey });
    }
  };

  const removeImage = (delName: any, val: any) => {
    setCarouselLoading(true);
    val.isUploaded = false;
    val.imgName = '';
    Setallcatimgname(
      allcatimgname.filter((item: any) => item.name !== delName),
    );
    setCollectibleImages(
      collectibleImageList.filter((item: any) => item.name !== delName),
    );
    setTimeout(() => {
      setCarouselLoading(false);
    }, 3000);
  };

  const setStartDate = (value: any) => {
    const date = new Date(value);
    const expiryDate = moment(value)
      .add(10, 'minutes')
      .format('YYYY-MM-DDTHH:mm');
    if (new Date(value) <= new Date()) {
      addToast(`Date and time should be greater than current time`, {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    } else {
      setStartDateHandle(value);
      setExpiryDateHandle(expiryDate);
      setMinExpirationDate1(expiryDate);
    }
  };

  const handleExpiryDate = (date: any) => {
    if (date <= minExpiryDate1) {
      addToast(`Date and time should be greater than ${minExpiryDate1}`, {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    } else {
      setExpiryDateHandle(date);
    }
  };

  let today: any = new Date();
  let dd: any = today.getDate();
  let mm: any = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  today = yyyy + '-' + mm + '-' + dd;

  useEffect(() => {
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
  }, []);
  //  select brand state

  const handleMyInputChange = (e: any, imageRule: any, id: string) => {
    const { name } = imageRule;
    const img = e.target.files[0];
    let value = e.target.value;
    const productRegexImg = new RegExp('(.*?).(gif|jpe?g|png|svg)$');
    if (productRegexImg.test(value?.toLowerCase())) {
      if (img && !img?.type?.startsWith('image/')) {
        const newList: any = { ...category };
        const values = newList.imageRules.map(function (o: any) {
          return o._id;
        });
        const index = values.indexOf(imageRule._id);
        newList.imageRules[index] = {
          ...newList.imageRules[index],
          errorMsg: 'Please select file  valid image format',
        };
        setCategory(newList as any);
        // @ts-ignore:next-line
        document.getElementById(id).value = '';

        return;
      } else if ((img && img?.size / (1024 * 1024)).toFixed(2) > 3) {
        const newList: any = { ...category };
        const values = newList.imageRules.map(function (o: any) {
          return o._id;
        });
        const index = values.indexOf(imageRule._id);
        newList.imageRules[index] = {
          ...newList.imageRules[index],
          errorMsg: 'Please select file size not more than 3 MB',
        };
        setCategory(newList as any);
        // @ts-ignore:next-line
        document.getElementById(id).value = '';
        return;
      } else {
        setErrorAttach(false);
        imageRule.isUploaded = true;
        imageRule.imgName = img.name;
        const newList: any = { ...category };
        const values = newList.imageRules.map(function (o: any) {
          return o._id;
        });
        const index = values.indexOf(imageRule._id);
        newList.imageRules[index] = {
          ...newList.imageRules[index],
          errorMsg: '',
        };
        setCategory(newList as any);
      }
      const newcollectibleImageList = collectibleImageList.filter(
        (x: any) => x.name != name,
      );

      const imageurl = {
        imageurl: img,
        name: name,
      };
      const list: any = [...newcollectibleImageList, ...[imageurl]];
      setCollectibleImages(list);
      const newallcatimgname = allcatimgname.filter((x: any) => x.name != name);
      Setallcatimgname([
        ...newallcatimgname,
        { name: imageRule.name, file: img },
      ]);
    } else {
      addToast('Please select file valid format(Image)', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
  };

  const openRedeemModal = (type: number) => {
    if (type === 2) {
      setShowRedeemModal(true);
    }
  };

  const closeRedeemModal = () => {
    setShowRedeemModal(false);
  };
  const openCollectionModal = () => {
    setDisplayName('');
    setSymbol('');
    setCollectionDescription('');
    setShortUrl('');
    setCollectionImage('');
    setCollectionBannerImage('');
    setShowCollectionModal(true);
  };
  const closeCollectionModal = () => {
    setShowCollectionModal(false);
    setError({
      displayName: '',
      symbol: '',
      collectionImage: '',
      collectionBannerImage: '',
      collectionDescription: '',
      shortUrl: '',
      size: '',
      price: '',
      currencyType: '',
      title: '',
      description: '',
      royalties: '',
      properties: '',
      putOnMarketplace: '',
      attachment: '',
      category: '',
      nftType: '',
      nftCategory: '',
      startDateHandle: '',
      expiryDateHandle: '',
      dynamicimgurl: '',
      isAgreementSignedErr: '',
      nftBrand: '',
    });
  };

  const handleModal = (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    let errorMsg1 = '';
    let errorMsg2 = '';
    let errorMsg3 = '';
    let errorMsg4 = '';
    const errorMsg5 = '';
    let errorMsg6 = '';
    let errorMsg7 = '';
    let errorMsg8 = '';
    let errorMsg9 = '';
    let errorMsg10 = '';
    if (attactment == '' || attactment == null || !attactment) {
      errorMsg1 = 'Image can not be empty';
      setErrorAttach(true);
    } else if (attactment.size / 1024 / 1024 > 30) {
      errorMsg1 = 'Please select file size not more than 30 MB';
      setErrorAttach(true);
      addToast(
        'Please select file size not more than 30 MB with valid format(Image, MP3, MP4)',
        { appearance: 'error', autoDismiss: true },
      );
    }

    if (title === '') {
      errorMsg2 = 'Title can not be empty';
    }
    const regex = /^\d+(\.\d{1,2})?$/;
    const regex1 = /^(?:\d*\.\d{1,17}|\d+)$/;

    if (description === '') {
      errorMsg9 = 'Description can not be empty';
    }

    if (royalties === '') {
      errorMsg3 = 'Royalties can not be empty';
    } else if (royalties > 90) {
      errorMsg3 = 'Royalties can not set more than 90';
    } else if (royalties < 0) {
      errorMsg3 = 'Royalties can not set less than 0';
    } else if (!regex.test(royalties)) {
      errorMsg3 =
        'Royalties can set only two decimal after a number, For example: 51.36';
    }

    if (isOtherBrand) {
      if (otherBrandNameInput === '') {
        errorMsg10 = 'Other brand can not be empty';
      } else {
        errorMsg10 = '';
      }
    } else {
      if (brand.value === '') {
        errorMsg10 = 'Brand can not be empty';
      } else {
        errorMsg10 = '';
      }
    }

    if (price === '') {
      errorMsg7 = 'Price can not be empty';
    } else if (price.length >= 19) {
      errorMsg7 = 'Price should not more then 18 digit';
    } else if (price <= 0) {
      errorMsg7 = 'Price must be greater than 0';
    } else if (!regex1.test(price)) {
      errorMsg7 = 'Please enter correct value';
    }

    if (selectCategory === 'Select Category') {
      errorMsg6 = 'Category can not be empty';
    }

    if (!checkSellerAgreement) {
      errorMsg8 = 'In order to continue. Please sign agreement.';
    } else {
      errorMsg8 = '';
    }

    setError({
      ...error,
      title: errorMsg2,
      attachment: errorMsg1,
      royalties: errorMsg3,
      nftType: errorMsg4,
      nftCategory: errorMsg6,
      price: errorMsg7,
      isAgreementSignedErr: errorMsg8,
      description: errorMsg9,
      nftBrand: errorMsg10,
    });
    if (
      errorMsg1 == '' &&
      errorMsg2 == '' &&
      errorMsg3 == '' &&
      errorMsg4 == '' &&
      errorMsg5 == '' &&
      errorMsg6 == '' &&
      errorMsg7 == '' &&
      errorMsg8 == '' &&
      errorMsg9 == '' &&
      errorMsg10 == ''
    ) {
      createCollectible();
    }
  };

  useEffect(() => {
    if (selectBrand !== 'Select Brand') {
      if (brand) {
        setError({ ...error, nftType: '' });
      } else {
        setError({ ...error, nftType: 'Please select brand' });
      }

      if (isOtherBrand) {
        if (otherBrandNameInput === '') {
          setError({ ...error, nftBrand: 'Other brand can not be empty' });
        } else {
          setError({
            ...error,
            nftBrand: '',
          });
        }
      } else {
        if (brand.value === '') {
          setError({ ...error, nftBrand: 'Brand can not be empty' });
        } else {
          setError({ ...error, nftBrand: '' });
        }
      }
    }
  }, [brand, otherBrandNameInput]);

  const createCollectible = async () => {
    try {
      setIsSubmitted(true);

      const finalPropertyArr: any = [];
      const items: any =
        document.querySelectorAll('.property_field_wrp') || null;
      for (const item of items) {
        const key: any = item.getElementsByTagName('input')[0].value;
        const value: any = item.getElementsByTagName('input')[1].value;
        if (key || value) {
          finalPropertyArr.push({ key: key, value: value });
        }
      }

      const formData: any = new FormData();
      formData.append('description', description || '');
      let network: any = 1;
      if (network_id == process.env.REACT_APP_KLATYN_NETWORK_ID) {
        network = 2;
      }
      formData.append('title', title);
      formData.append('royalties', royalties || '');
      formData.append(
        'category_id',
        category && category._id ? category._id : '',
      );
      formData.append(
        'nft_type',
        category && category.name ? category.name?.toLowerCase() : '',
      );
      if (allcatimgname && allcatimgname.length > 0) {
        allcatimgname.forEach((element: any) => {
          formData.append(element.name, element.file);
        });
      }
      formData.append('isLuxuryAuthReq', 'false');
      formData.append('isOtherBrand', isOtherBrand);
      formData.append(
        'brand',
        isOtherBrand ? otherBrandNameInput : brand.value,
      );
      formData.append('attachment', attactment || '');
      formData.append('customFields', JSON.stringify(finalPropertyArr));
      formData.append('redeemable', String(!isdigitalnft));
      formData.append('redeem_type', String(redeemableType));
      formData.append('network_id', network);
      formData.append('collection_address', collectionAddress);
      formData.append('collectible_owner', wallet_address);

      window.onbeforeunload = function () {
        return 'If you reload this page, your previous action will be repeated';
      };
      setHideCursor(true);
      setIsLoaded(false);
      const result: any = await dispatch(
        createCollectiblesActionForUser(formData),
      );
      if (result) {
        SetIpfs(result.data);
        setIsSubmitted(false);
        Setitemid(result.data._id);
        setIsLoaded(true);
        setIsModalVisible(true);

        if (result && result.status) {
          setIsModalVisible(true);

          addToast('Collectible created successfully', {
            appearance: 'success',
            autoDismiss: true,
          });
          // if (isdigitalnft) {
          //   setIsModalVisible(true);
          //   setHideCursor(false);
          // } else {
          //   history.push('/pending-approval');
          // }
        }
      } else {
        setIsSubmitted(false);
        setIsLoaded(true);
        window.onbeforeunload = null;
        setHideCursor(false);
      }
    } catch (err) {
      setIsSubmitted(false);
      setIsLoaded(true);
      window.onbeforeunload = null;
      setHideCursor(false);
      addToast('Something  went wrong', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };
  useEffect(() => {
    if (!isConnected) {
      history.push('/connect-wallet');
    }
    if (localStorage.getItem('Wallet Address')) {
      getCollectionList();
    }

    window &&
      window.ethereum &&
      window.ethereum.on('accountsChanged', (accounts: any) => {
        if (accounts.length > 0) {
          return;
        } else if (accounts.length == 0) {
          dispatch({ type: SET_WALLET_AMOUNT, payload: '' });
          dispatch({ type: SET_IS_CONNECTED, payload: false });
          localStorage.removeItem('wallet_amount');
          localStorage.removeItem('Wallet Address');
          localStorage.removeItem('profile');
          localStorage.removeItem('connected_with');
          localStorage.removeItem('isConnected');
          localStorage.removeItem('token');
          localStorage.removeItem('Role');
          localStorage.removeItem('isSuperAdmin');
          localStorage.removeItem('signature');
          history.push('/home');
        }
      });

    klaytn &&
      klaytn.on('accountsChanged', function (accounts: any) {
        if (accounts.length > 0) {
          return;
        } else if (accounts.length == 0) {
          history.push('/home');
        }
      });
  }, [profileDetails]);

  async function getVideoDimensionsOf(url: any) {
    return new Promise((resolve) => {
      // create the video element
      const video = document.createElement('video');
      // place a listener on it
      video.addEventListener(
        'loadedmetadata',
        function () {
          // retrieve dimensions
          const height = this.videoHeight;
          const width = this.videoWidth;
          // send back result
          resolve({ height: height, width: width });
        },
        false,
      );

      // start download meta-datas
      video.src = url;
    });
  }

  const getCurrentDimensions = async (file: any) => {
    return new Promise(async (res, rej) => {
      if (file?.type?.startsWith('image/')) {
        let img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          res({
            height: img.height,
            width: img.width,
          });
        };
      } else if (file?.type?.startsWith('video/mp4')) {
        const videoDimension = await getVideoDimensionsOf(
          window.URL.createObjectURL(file),
        );
        res(videoDimension);
      } else {
        res({
          height: 265,
          width: 265,
        });
      }
    });
  };

  // this validation gor modal
  const inputClickHandler = async (event: any) => {
    const { name, value } = event.target;
    const regexImg = new RegExp('(.*?).(gif|jpe?g|png|webp|bmp|svg)$');
    const productRegexImg = new RegExp('(.*?).(gif|jpe?g|png|svg|mp4|mp3)$');
    switch (name) {
      case 'attachment':
        setCarouselLoading(true);
        if (value === '' || value == null || !value) {
          if (!attactment) {
            setError({ ...error, attachment: 'can not be empty' });
            setCarouselLoading(false);
          }
        } else {
          setError({ ...error, attachment: '' });
        }
        const dimensions: any = await getCurrentDimensions(
          event.target.files[0],
        );
        if (264 > dimensions?.height || 264 > dimensions?.width) {
          setError({
            ...error,
            attachment:
              'We recommended you upload a file of 264 x 264 resolution.',
          });
          addToast(
            'We recommended you upload a file of 264 x 264 resolution.',
            {
              appearance: 'error',
              autoDismiss: true,
            },
          );
          setCarouselLoading(false);
          return;
        } else {
          if (
            event.target.files &&
            event.target.files[0] &&
            !event.target.files[0]?.type?.startsWith('image/') &&
            !event.target.files[0]?.type?.startsWith('video/mp4') &&
            !event.target.files[0]?.type?.startsWith('audio/')
          ) {
            setError({
              ...error,
              attachment: 'Please select file  valid format(Image, MP3, MP4)',
            });
            addToast('Please select file valid format(Image, MP3, MP4)', {
              appearance: 'error',
              autoDismiss: true,
            });
            setCarouselLoading(false);
            return;
          }
          if (productRegexImg.test(value?.toLowerCase())) {
            setAttachment(event.target.files[0]);
            setCarouselLoading(false);
            if (isdigitalnft) {
              const imageUrlData = {
                imageurl: event.target.files[0],
                name: 'attachment',
              };
              const listData: any = [imageUrlData];
              setCollectibleImages(listData);
            } else {
              const indexAttachment = collectibleImageList.findIndex(
                (res: any) => res.name == 'attachment',
              );
              if (indexAttachment > -1) {
                const imageUrlData = {
                  imageurl: event.target.files[0],
                  name: 'attachment',
                };
                collectibleImageList[indexAttachment] = imageUrlData;
                setCollectibleImages(collectibleImageList);
              } else {
                const imageUrlData = {
                  imageurl: event.target.files[0],
                  name: 'attachment',
                };
                const listData: any = [
                  ...collectibleImageList,
                  ...[imageUrlData],
                ];
                setCollectibleImages(listData);
              }
            }
            if (event.target.files[0].size / 1024 / 1024 > 30) {
              setError({
                ...error,
                attachment: 'Please select file size not more than 30 MB',
              });
              setErrorAttach(true);
              addToast('Please select file size not more than 30 MB', {
                appearance: 'error',
                autoDismiss: true,
              });
              return;
            } else {
              setErrorAttach(false);
              setError({ ...error, attachment: '' });
            }

            if (event.target.files[0].type === 'video/mp4') {
              setIsVideo(true);
              setisAudio(false);
            } else if (event.target.files[0].type === 'audio/mpeg') {
              setisAudio(true);
              setIsVideo(false);
            } else {
              setisAudio(false);
              setIsVideo(false);
            }
          } else {
            setError({
              ...error,
              attachment: 'Please select file  valid format(Image)',
            });
            addToast('Please select file valid format(Image)', {
              appearance: 'error',
              autoDismiss: true,
            });
            setCollectionImage('');
            return;
          }
        }
        break;
      case 'title':
        if (value === '') {
          setError({ ...error, title: 'Title can not be empty' });
        } else {
          setError({ ...error, title: '' });
        }
        setTitle(value);
        break;
      case 'description':
        if (value === '') {
          setError({ ...error, description: 'Description can not be empty' });
        } else {
          setError({ ...error, description: '' });
        }

        setDescription(value);
        break;
      case 'royalties':
        const regex = /^\d+(\.\d{1,2})?$/;
        if (value === '') {
          setError({ ...error, royalties: 'Royalties can not be empty' });
        } else if (value < 0) {
          setError({
            ...error,
            royalties: 'Royalties can not set less than 0',
          });
        } else if (!regex.test(value)) {
          setError({
            ...error,
            royalties:
              'Royalties can set only two decimal after a number, For example: 51.36',
          });
        } else if (value > 90) {
          setError({
            ...error,
            royalties: 'Royalties can not set more than 90',
          });
        } else {
          setError({ ...error, royalties: '' });
        }
        setRoyalties(value);
        break;
      case 'putOnMarketplace':
        break;
      case 'displayName':
        if (value === '') {
          setError({ ...error, displayName: 'Display name can not be empty' });
        } else {
          setError({ ...error, displayName: '' });
        }
        setDisplayName(value);
        break;
      case 'symbol':
        if (value === '') {
          setError({ ...error, symbol: 'Symbol can not be empty' });
        } else {
          setError({ ...error, symbol: '' });
        }
        setSymbol(value);
        break;
      case 'collectionImage':
        if (value === '') {
          setError({ ...error, collectionImage: 'Image can not be empty' });
        } else {
          setError({ ...error, collectionImage: '' });
        }

        if (!event.target.files[0]?.type?.startsWith('image/')) {
          setError({
            ...error,
            collectionImage: 'Please select file  valid format(Image)',
          });
          addToast('Please select file valid format(Image)', {
            appearance: 'error',
            autoDismiss: true,
          });
          setCollectionImage('');
          return;
        }

        if (regexImg.test(value?.toLowerCase())) {
          setCollectionImage(event.target.files[0]);
          if (event.target.files[0].size / 1024 / 1024 > 30) {
            setError({
              ...error,
              collectionImage: 'Please select file size not more than 30 MB',
            });
            setErrorAttach(true);
            addToast('Please select file size not more than 30 MB', {
              appearance: 'error',
              autoDismiss: true,
            });
            setCollectionImage('');
            return;
          }

          if (event.target.files[0].type === 'video/mp4') {
            setIsVideo(true);
            setisAudio(false);
          } else if (event.target.files[0].type === 'audio/mpeg') {
            setisAudio(true);
            setIsVideo(false);
          } else {
            setisAudio(false);
            setIsVideo(false);
          }
        } else {
          setError({
            ...error,
            collectionImage: 'Please select file  valid format(Image)',
          });
          addToast('Please select file valid format(Image)', {
            appearance: 'error',
            autoDismiss: true,
          });
          setCollectionImage('');
          return;
        }
        break;

      case 'collectionBannerImage':
        if (!event.target.files[0]?.type?.startsWith('image/')) {
          setError({
            ...error,
            collectionBannerImage: 'Please select file  valid format(Image)',
          });
          addToast('Please select file valid format(Image)', {
            appearance: 'error',
            autoDismiss: true,
          });
          setCollectionBannerImage('');
          return;
        }

        if (!regexImg.test(value?.toLowerCase())) {
          setError({
            ...error,
            collectionBannerImage: 'Please select file  valid format(Image)',
          });
          addToast('Please select file valid format(Image)', {
            appearance: 'error',
            autoDismiss: true,
          });
          setCollectionBannerImage('');
          return;
        }
        if (value) {
          setCollectionBannerImage(event.target.files[0]);
          if (event.target.files[0].size / 1024 / 1024 > 30) {
            setError({
              ...error,
              collectionBannerImage:
                'Please select file size not more than 30 MB',
            });
            setErrorAttach(true);
            addToast('Please select file size not more than 30 MB', {
              appearance: 'error',
              autoDismiss: true,
            });
            setCollectionBannerImage('');
            return;
          }
        }
        break;

      case 'collectionDescription':
        if (value === '') {
          setError({
            ...error,
            collectionDescription: 'Description can not be empty',
          });
        } else {
          setError({ ...error, collectionDescription: '' });
        }
        setCollectionDescription(value);
        break;
      case 'shortUrl':
        var pattern = new RegExp(
          '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
          'i',
        ); // fragment locator
        if (!pattern.test(value)) {
          setError({ ...error, shortUrl: 'Invalid url' });
        } else {
          setError({ ...error, shortUrl: '' });
        }
        setShortUrl(value);
        break;
      case 'price':
        const regCheck = /^(?:\d*\.\d{1,17}|\d+)$/;
        if (value === '') {
          setUsdAmount(0);
          setPrice('');
          setError({ ...error, price: 'Price can not be empty' });
        } else if (value <= 0) {
          setUsdAmount(0);
          setPrice(value);
          setError({ ...error, price: 'Price must be greater than 0' });
        } else if (!regCheck.test(value)) {
          setPrice(value);
          setError({ ...error, price: 'Please enter correct value' });
          return false;
        } else if (value.length >= 19) {
          setError({ ...error, price: 'Price should not more then 18 digit' });
          return false;
        } else {
          setError({ ...error, price: '' });
          setPrice(value);
          if (network_id == process.env.REACT_APP_KLATYN_NETWORK_ID) {
            if (selectedCurrency == 'AGOV') {
              getUsdRate(value, 2, agov_token_address);
            } else if (selectedCurrency == 'USDT') {
              getUsdRate(value, 2, usdt_klaytn_token_address);
            } else if (selectedCurrency == 'KLAY') {
              getUsdRate(
                value,
                2,
                '0x0000000000000000000000000000000000000000',
              );
            }
          } else {
            if (selectedCurrency == 'WETH') {
              getUsdRate(value, 1, weth_token_address);
            } else if (selectedCurrency == 'MPWR') {
              getUsdRate(value, 1, mpwr_token_address);
            } else if (selectedCurrency == 'AGOV') {
              getUsdRate(value, 1, agov_eth_token_address);
            } else if (selectedCurrency == 'USDT') {
              getUsdRate(value, 1, usdt_eth_token_address);
            } else if (selectedCurrency == 'ETH') {
              getUsdRate(
                value,
                1,
                '0x0000000000000000000000000000000000000000',
              );
            }
          }
        }
        break;
      default:
        break;
    }
  };

  const newarry = [...collectibleImageList];

  const changeRedeemableTypeHandle = (type: number) => {
    setActiveRedeemBurn(!activeRedeemBurn);
    setRedeemableType(type);
    openRedeemModal(type);
  };

  const createCollection = async () => {
    try {
      let errorMsg1 = '';
      let errorMsg2 = '';
      let errorMsg3 = '';
      let errorMsg4 = '';
      let errorMsg5 = '';
      const errorMsg6 = '';

      if (displayName === '') {
        errorMsg1 = 'Display name can not be empty';
      }
      if (symbol === '') {
        errorMsg2 = 'Symbol can not be empty';
      }
      if (collectionImage === '') {
        errorMsg3 = 'Icon image can not be empty';
        setErrorAttach(true);
      } else if (collectionImage.size / 1024 / 1024 > 30) {
        errorMsg3 = 'Please select file size not more than 30 MB';
        setErrorAttach(true);
        addToast(
          'Please select file size not more than 30 MB with valid format(Image)',
          { appearance: 'error', autoDismiss: true },
        );
      }

      if (collectionBannerImage.size / 1024 / 1024 > 30) {
        errorMsg5 = 'Please select banner file size not more than 30 MB';
        setErrorAttach(true);
        addToast(
          'Please select banner file size not more than 30 MB with valid format(Image)',
          { appearance: 'error', autoDismiss: true },
        );
      }
      if (category.name === '') {
        errorMsg4 = 'Category can not be empty';
      }
      setError({
        ...error,
        displayName: errorMsg1,
        symbol: errorMsg2,
        collectionImage: errorMsg3,
        collectionBannerImage: errorMsg5,
        nftType: errorMsg4,
        nftCategory: errorMsg6,
      });

      if (
        (displayName !== '' && symbol !== '' && collectionImage !== '') ||
        collectionBannerImage !== ''
      ) {
        setCollectionButtonLoading(true);
        setDis(true);
        const formData: any = new FormData();
        formData.append('file', collectionImage || '');
        const result: any = await dispatch(getPinataForIpfsApi(formData));
        // banner image--
        let resultBanner: any = {};
        const formDataBanner: any = new FormData();
        let bannerImg = '';
        if (collectionBannerImage) {
          formDataBanner.append('file', collectionBannerImage || '');
          resultBanner = await dispatch(getPinataForIpfsApi(formDataBanner));
          bannerImg = `https://ipfs.io/ipfs/${resultBanner?.IpfsHash}`;
        }
        let resultObj: any;
        if (result) {
          formData.append('displayName', displayName || '');
          const reqObj: any = {
            displayName: displayName,
            symbol: symbol,
            wallet_address: wallet_address,
            image_id: `https://ipfs.io/ipfs/${result.IpfsHash}`,
            banner_image: bannerImg,
            description: collectionDescription,
            fee_recipient: wallet_address,
            seller_fee_basis_points:
              klatynNetworkId === network_id
                ? process.env.REACT_APP_KLYTN_BROKERAGE
                : process.env.REACT_APP_BROKERAGE,
          };

          resultObj = await dispatch(getPinataForDataApi(reqObj));
          setCollectionButtonLoading(false);
          if (resultObj) {
            let collectionFactoryContract: any = '';
            if (network_id === process.env.REACT_APP_KLATYN_NETWORK_ID) {
              const { caver }: any = await EnableKlyten();
              collectionFactoryContract = new caver.klay.Contract(
                collectionFactoryArtifacts.abi, //ABI
                klaytn_factory_address,
              );
            } else {
              const { web3 }: any = await EnableEthereum();
              collectionFactoryContract = new web3.eth.Contract(
                collectionFactoryArtifacts.abi, //ABI
                factory_address,
              );
            }
            if (collectionFactoryContract.methods) {
              const data: any = await collectionFactoryContract.methods
                .createCollection(
                  displayName,
                  symbol,
                  `https://clubrare2.mypinata.cloud/ipfs/${resultObj.IpfsHash}`, // contract URI
                  'https://clubrare2.mypinata.cloud/ipfs/', //tokenURI Prefix
                )
                .send({ from: wallet_address, gas: null });
              if (data) {
                const reqObj: any = {
                  displayName: displayName,
                  symbol: symbol,
                  description: collectionDescription,
                  image_id: `https://ipfs.io/ipfs/${result.IpfsHash}`,
                  banner_image: bannerImg,
                  network_id:
                    network_id == klatynNetworkId
                      ? '2'
                      : network_id === '4'
                      ? '1'
                      : '3',
                  collection_address:
                    data.events?.CollectionCreated?.returnValues?.collection,
                  transaction_hash: resultObj.IpfsHash,
                };
                const collection: any = dispatch(
                  createCollectionAction(reqObj),
                );
                if (collection) {
                  setDis(false);
                  Setitemid(collection._id);
                  getCollectionList();
                  addToast('Collection is created successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                  });

                  setCollectionButtonLoading(false);
                  setShowCollectionModal(false);
                  getCollectionList();
                  setActiveCollectionId(0);
                } else {
                  addToast('Internal Error', {
                    appearance: 'error',
                    autoDismiss: true,
                  });
                }
                setCollectionButtonLoading(false);
                setShowCollectionModal(false);
              }
            }
          }
        } else {
          setCollectionButtonLoading(false);
        }
      }
    } catch (error) {
      closeCollectionModal();
      setDis(false);
      setCollectionButtonLoading(false);
      return false;
    }
  };
  const getCollectionList = async () => {
    const object = { network_id: network_id == klatynNetworkId ? '2' : '1' };
    const result: any = await dispatch(getCollectionByUserAction(object));
    const obj: any = {};
    obj.displayName = 'Default Clubrare Collection';
    obj.collection_address =
      network_id === process.env.REACT_APP_KLATYN_NETWORK_ID
        ? process.env.REACT_APP_KLYTN_USER_MINTABLE_ADD
        : process.env.REACT_APP_ETH_USER_MINTABLE_ADD;
    const list: any = [obj];
    if (result?.data?.status) {
      setCollectionList([...list, ...result.data.data]);
      return;
    } else {
      setCollectionList([...list]);
      return;
    }
  };

  const renderCustomThumbs = () => {
    const thumbList = newarry?.map((product: any, i: any) => {
      return (
        <>
          {product && product?.imageurl?.size / 1024 / 1024 > 30 ? (
            ''
          ) : (
            <picture key={i}>
              {product?.imageurl?.type?.startsWith('image/') ? (
                <img
                  key={product._id}
                  src={URL.createObjectURL(product?.imageurl)}
                  alt={product.alternativeText}
                />
              ) : product?.imageurl?.type?.startsWith('video/') ? (
                <VideoThumbnail
                  videoUrl={URL.createObjectURL(product.imageurl)}
                />
              ) : product?.imageurl?.type?.startsWith('audio/') ? (
                <img
                  className=""
                  src={
                    'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/musicIcon.png'
                  }
                  alt="music-icon"
                />
              ) : null}
            </picture>
          )}
        </>
      );
    });

    return thumbList;
  };

  // Seller Agreement check
  const sellerAgreementCheckHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      if (e.target.checked) {
        setError({ ...error, isAgreementSignedErr: '' });
      } else {
        setError({
          ...error,
          isAgreementSignedErr: 'In order to continue. Please sign agreement.',
        });
      }
      const response: any = await dispatch(
        EditProfileAction({ isAgreementSigned: e.target.checked }),
      );
      if (response.status) {
        setCheckSellerAgreement(e.target.checked);
      }
    } catch (err) {
      return false;
    }
  };

  const getCollection = async (event: any) => {
    setCollections(event);
  };
  const chooseNftHandler = (status: any) => {
    Setisdigitalnft(status);
    dispatch(getEditProfileAction({ user_address: wallet_address }));
    setError({
      displayName: '',
      symbol: '',
      collectionImage: '',
      collectionBannerImage: '',
      collectionDescription: '',
      shortUrl: '',
      size: '',
      price: '',
      currencyType: '',
      title: '',
      description: '',
      royalties: '',
      properties: '',
      putOnMarketplace: '',
      attachment: '',
      category: '',
      nftType: '',
      nftCategory: '',
      startDateHandle: '',
      expiryDateHandle: '',
      dynamicimgurl: '',
      isAgreementSignedErr: '',
      nftBrand: '',
    });
  };

  const delPropertiesHandler = (e: any) => {
    const element = e.target;
    element.closest('.property_field_wrp').remove();
  };

  const addPropertiesHandler = () => {
    const countAll = document.querySelectorAll('.property_field_wrp').length;
    if (countAll <= 4) {
      const elem: any =
        document.querySelector('.property_field_wrp:last-child') || null;
      const clone: any = elem.cloneNode(true);
      propertyCounter++;
      clone.getElementsByTagName('input')[0].name = `key-${propertyCounter}`;
      clone.getElementsByTagName('input')[1].name = `value-${propertyCounter}`;
      clone.getElementsByTagName('input')[0].value = '';
      clone.getElementsByTagName('input')[1].value = '';
      var slides = document.getElementsByClassName('property_field_wrp');
      let elementArray = Array.prototype.slice.call(slides, 0);
      let a = [
        { key: 'Ex: Size', val: 'Large' },
        { key: 'Ex: Brand', val: 'Jordan' },
        { key: 'Ex: Year Made', val: '2018' },
        { key: 'Others', val: 'Others' },
        { key: 'Others1', val: 'Others1' },
      ].filter(
        (x: any) =>
          !elementArray.some(
            (y: any) => y.childNodes[0]?.childNodes[0].placeholder === x.key,
          ),
      );
      clone.getElementsByTagName('input')[0].placeholder =
        a[0]?.key !== 'Others1' ? a[0].key : 'Others';
      clone.getElementsByTagName('input')[1].placeholder =
        a[0]?.val !== 'Others1' ? a[0].val : 'Others';
      clone.classList.add('clone-elem');
      elem.after(clone);
    } else {
      addToast(`You can only add five properties`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }

    const items: any = document.querySelectorAll('.del_prop_btn') || null;
    for (const item of items) {
      item.addEventListener('click', delPropertiesHandler);
    }
  };

  return isComponentLoaded ? (
    <Spinner />
  ) : (
    <>
      {showReedemModal && (
        <ReedemModal type={redeemableType} hide={closeRedeemModal} />
      )}
      {showCollectionModal && (
        <CollectionModal
          isDis={isDis}
          hide={closeCollectionModal}
          inputClickHandler={inputClickHandler}
          displayName={displayName}
          symbol={symbol}
          collectionDescription={collectionDescription}
          shortUrl={shortUrl}
          collectionImage={collectionImage}
          collectionBannerImage={collectionBannerImage}
          createCollection={createCollection}
          collectionButtonLoading={collectionButtonLoading}
          error={error}
          isAudio={isAudio}
          isVideo={isVideo}
        />
      )}

      <Layout
        mainClassName="create_coll_main_wrp"
        displayStickySidebar
        hideCursor={hideCursor}
      >
        <div
          className="container-fluid club_createitem club_usercreatitem"
          style={{ pointerEvents: hideCursor ? 'none' : 'auto' }}
        >
          <form className="row" onSubmit={() => {}}>
            <div className="col-lg-6 create_coll_left">
              <div className=" mt-8 md:mt-0 uploadyourartworkhead mb-2">
                <h1>
                  Create an Item <span className="req_field"> * </span>
                </h1>
              </div>

              <div
                className={`border-dash mt-1 ${
                  newarry.length !== 0 && !errorAttach
                    ? 'remove-dash-border'
                    : ''
                } ${
                  newarry[0]?.imageurl?.type !== 'image/svg+xml'
                    ? 'preview_uploaded_aud_vid'
                    : ''
                }`}
              >
                {carouselLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {newarry.length !== 0 && !errorAttach && (
                      <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={true}
                        showIndicators={false}
                        swipeable={true}
                        infiniteLoop={false}
                        useKeyboardArrows={true}
                        renderThumbs={renderCustomThumbs}
                      >
                        {newarry &&
                          newarry.map((image: any, i: any) => {
                            return (
                              <div className="cmnslidewrp" key={i}>
                                <div className="">
                                  {image &&
                                  image?.imageurl?.size / 1024 / 1024 > 30 ? (
                                    ''
                                  ) : (
                                    <div>
                                      {image?.imageurl?.type?.startsWith(
                                        'image/',
                                      ) ? (
                                        <div
                                          key={i}
                                          className="clubcrt_img_wrp"
                                        >
                                          <img
                                            key={i}
                                            src={URL.createObjectURL(
                                              image.imageurl,
                                            )}
                                            alt="imageurl"
                                          />
                                        </div>
                                      ) : image?.imageurl?.type?.startsWith(
                                          'video/',
                                        ) ? (
                                        <div className="create_vid_wrp">
                                          <video
                                            style={{
                                              width: '80%',
                                            }}
                                            controls
                                          >
                                            <source
                                              key={i}
                                              src={URL.createObjectURL(
                                                image.imageurl,
                                              )}
                                              type="video/mp4"
                                            />
                                          </video>
                                        </div>
                                      ) : image?.imageurl?.type?.startsWith(
                                          'audio/',
                                        ) ? (
                                        <div>
                                          <div className="create_aud_wrp">
                                            <img
                                              className=""
                                              src={
                                                'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/musicIcon.png'
                                              }
                                              alt="music-icon"
                                            />
                                            <audio
                                              controls
                                              className="row-start-1 col-start-1 w-75 rounded-50 bg-white bg-opacity-20 h-60 ml-25 md:h-14  object-contain"
                                              style={{ marginTop: '50px' }}
                                            >
                                              <source
                                                src={window.URL.createObjectURL(
                                                  image.imageurl,
                                                )}
                                              ></source>
                                            </audio>
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </Carousel>
                    )}
                  </>
                )}

                {(newarry.length == 0 || errorAttach) && (
                  <label htmlFor="imgFileInput" className="selectInputFile">
                    <div className="file_content mx-auto clubchoose_inn">
                      <div className="grid grid-cols-1 justify-items-start items-center mt-2 choosefilebtn">
                        <input
                          className="custom-file-input text-transparent cursor-pointer row-start-1 col-start-1 w-full
                        font-semibold rounded-12 border border-solid"
                          type="file"
                          name="attachment"
                          accept="image/*,.mp4,.mp3,"
                          onChange={(event) => {
                            inputClickHandler(event);
                          }}
                          id="imgFileInput"
                        />
                        <div className="figure-uploadwrp row-start-1 col-start-1 justify-self-center button-share-gray">
                          <img
                            className=" mx-auto image-main"
                            src={imgConstants.UploadSimple}
                            alt="UploadSimple"
                          />
                          <img
                            className=" mx-auto image-hover"
                            src={imgConstants.uploadblcimg}
                            alt="uploadblcimg"
                          />
                        </div>
                        <p className="my-3 mx-auto">
                          <span>Upload Image</span>
                        </p>
                      </div>
                      <div className="choosefiletxt text-center">
                        <p className=" mr-2">
                          File types Supported:
                          <span> jpg, png, gif, svg, mp4, mp3</span>
                        </p>
                        <div className=" mr-2 text-center">
                          <p className="my-3">
                            Max file size: <span>30MB</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-red uploaderror">{error.attachment}</p>
                    </div>
                  </label>
                )}
                <>
                  <div className="chooseImgbtnhover">
                    <input
                      type="file"
                      id="changeImg"
                      name="attachment"
                      accept="image/*,.mp4,.mp3,"
                      onChange={(event) => {
                        inputClickHandler(event);
                      }}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="changeImg">Change File</label>
                  </div>
                </>
                {/* )} */}
              </div>
            </div>

            <div className="col-lg-6 create_coll_right">
              <div className="create_collright_inn">
                <h1 className="mb-3 font-weight-bold mt-2">
                  {' '}
                  Create an NFT for your physical product{' '}
                </h1>

                {!isdigitalnft ? (
                  <>
                    {!profileDetails?.isAgreementSigned && (
                      <div className="mb-4">
                        <div className="seller_agree_wrp mb-1 mr-1">
                          <label className="d-flex  justify-content-between align-items-center mb-0 ">
                            <span className="w-100">
                              <span className="d-flex  justify-content-start align-items-center">
                                <img
                                  src={sellerAgreement}
                                  alt="Seller Agreement"
                                  className="sellerAgreement"
                                />
                                <a
                                  href={creatorPdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Creator Agreement
                                </a>
                              </span>
                              <p>
                                Read and accept creator agreement to create a
                                phygital NFT
                              </p>
                            </span>
                            <input
                              type="checkbox"
                              name="saller_agree"
                              className="d-none"
                              onChange={(e) => sellerAgreementCheckHandler(e)}
                            />
                            <span className="checkmark">
                              {' '}
                              <img src={checkbox} alt="img" />
                            </span>
                          </label>
                        </div>
                        <p className="text-red justify-self-start mt-2 pl-2">
                          {error.isAgreementSignedErr}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  ''
                )}

                <div className={`row p-0 px-3 ${error.title && 'err_occ'}`}>
                  <div className="cl-lg-12 text-start"></div>
                  <div className="create_lab mb-2">
                    {t('create.Title')}{' '}
                    <span className="text-danger "> * </span>
                  </div>
                  <input
                    className="responsive-placeholder bg-transparent border-b border-solid relative_fld
                      w-full "
                    placeholder="Enter the title"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      inputClickHandler(e);
                    }}
                    maxLength={100}
                  />
                  <p className="text-red justify-self-start mt-2 pl-2">
                    {error.title}
                  </p>
                </div>
                <div>
                  <div className="choosesalemodelwrp my-4">
                    {salesModels.map((m) => (
                      <button
                        key={m.key}
                        className={` ${
                          m.key == 'fixedPrice'
                            ? 'fixedpricebox'
                            : 'timeauctbox'
                        } ${
                          m.key === activeSaleModel
                            ? 'linearGradient'
                            : 'auctionbtn'
                        }`}
                        onClick={(e) => {
                          setActiveSaleModel(m.key);
                          e.preventDefault();
                        }}
                      >
                        {m.title}
                      </button>
                    ))}
                  </div>
                  <div className="row mb-4">
                    <div className="col">
                      {activeSaleModel === 'fixedPrice' && (
                        <>
                          <div className="text-14 font-semibold mb-2">
                            {t('create.Price')}
                            <span className="text-danger mb-5"> * </span>
                          </div>
                          <div className="relative d-flex relative_fld price_inp_wrp">
                            <input
                              type="number"
                              className="responsive-placeholder bg-transparent   w-full"
                              placeholder={`0.00 ${selectedCurrency}`}
                              name="price"
                              value={price}
                              onChange={(e) => {
                                inputClickHandler(e);
                              }}
                            />
                            {network_id ==
                            process.env.REACT_APP_KLATYN_NETWORK_ID ? (
                              <Select
                                value={selectedCurrency}
                                selectValueChange={onCurrencyChange}
                                options={currencyOptions}
                                width="w-25"
                              />
                            ) : (
                              <Select
                                value={selectedCurrency}
                                selectValueChange={onCurrencyChange}
                                options={currencyMetaMaskOptions}
                                width="w-25"
                              />
                            )}
                          </div>
                          <p className="text-red justify-self-start mt-2 pl-2">
                            {error.price}
                          </p>
                          <p className=" details_bid_usd ml-1 ">
                            {usdAmount ? `$ ${usdAmount} USD` : '0 USD'}
                          </p>
                        </>
                      )}

                      {activeSaleModel === 'auction' && (
                        <div
                          className={`${
                            activeSaleModel === 'auction' ? 'mt-2' : ``
                          }`}
                        >
                          <div
                            className={`text-14 font-semibold mb-2 ${
                              error.price && 'err_occ'
                            }`}
                          >
                            {t('create.MinimumBid')}
                          </div>
                          <div className="relative d-flex relative_fld minimumbidinptwrp">
                            <input
                              className="responsive-placeholder bg-transparent  border-solid 
                        w-full"
                              placeholder={`0.00 ${selectedCurrency}`}
                              name="price"
                              value={price}
                              onChange={(e) => {
                                inputClickHandler(e);
                              }}
                            />
                            {network_id ==
                            process.env.REACT_APP_KLATYN_NETWORK_ID ? (
                              <Select
                                value={selectedCurrency}
                                selectValueChange={onCurrencyChange}
                                options={currencyOptions}
                                width="w-25"
                              />
                            ) : (
                              <Select
                                value={selectedCurrency}
                                selectValueChange={onCurrencyChange}
                                options={currencyMetaMaskOptions}
                                width="w-25"
                              />
                            )}
                          </div>

                          <p className="text-red justify-self-start mt-2 pl-2">
                            {error.price}
                          </p>
                          <p className=" details_bid_usd ml-1 ">
                            {usdAmount ? `$ ${usdAmount} USD` : '0 USD'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {activeSaleModel === 'auction' && (
                    <div className="row mb-4">
                      <div className="col-6 startingdatewrp">
                        <div className="w-full">
                          <div className="create_lab mb-2">
                            {t('create.StartingDate')}
                          </div>
                          <input
                            className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                            value={startDateHandle}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                            }}
                            min={minExpiryDate}
                            type="datetime-local"
                            id="meeting-time"
                            name="meeting-time"
                          />
                        </div>
                      </div>

                      <div
                        className={`col-6 ${
                          error.startDateHandle && 'err_occ'
                        }`}
                      >
                        <div className="w-full">
                          <div className="text-14 font-semibold mb-2">
                            {'Expiry Date'}
                          </div>
                          <input
                            className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                            value={expiryDateHandle}
                            onChange={(e) => {
                              handleExpiryDate(e.target.value);
                            }}
                            min={minExpiryDate1}
                            type="datetime-local"
                            id="meeting-time"
                            name="meeting-time"
                          />
                        </div>
                      </div>
                      <p className="text-red justify-self-start mt-2 pl-2">
                        {error.startDateHandle}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 create_lab">
                  {t('create.chooseCollection')}
                </div>
                <div className="collectionitemwrp mt-2 ">
                  {' '}
                  {profileDetails?.role === 'user' &&
                    !profileDetails?.isSuperAdmin && (
                      <div className="choosecol_dropdown_wrp d-flex">
                        <DropdownButton
                          id="dropdown-basic-button"
                          title={collections}
                          className={`choosecol_dropdown ${
                            collections !== 'Select a collection'
                              ? 'notplaceholder'
                              : ''
                          }`}
                        >
                          {collectionList &&
                            collectionList.map((collection: any, i: any) => {
                              return (
                                <Dropdown.Item
                                  onClick={() =>
                                    getCollection(collection.displayName)
                                  }
                                  key={i}
                                >
                                  {' '}
                                  <button
                                    onClick={(e) => {
                                      setCollectionAddress(
                                        collection.collection_address,
                                      );
                                      e.preventDefault();
                                    }}
                                    className={`collection-size default-team ${
                                      activeCollectionId === -1
                                        ? 'choose_collection_box_inner_active'
                                        : ''
                                    }`}
                                  >
                                    <p>{collection.displayName}</p>
                                  </button>
                                </Dropdown.Item>
                              );
                            })}
                        </DropdownButton>
                        <div className="createnewbtn_wrp">
                          <button
                            type="button"
                            onClick={(e) => {
                              openCollectionModal();
                              e.preventDefault();
                            }}
                          >
                            Create New
                          </button>
                        </div>
                      </div>
                    )}
                </div>
                <div className="mt-4 mb-2 create_lab">
                  {t('create.Description')}
                  <span className="text-danger"> * </span>
                </div>

                <textarea
                  className="col-12 relative_fld"
                  name="description"
                  value={description}
                  placeholder={t('create.Description')}
                  onChange={(e) => {
                    inputClickHandler(e);
                  }}
                ></textarea>
                <p className="text-red justify-self-start mt-2 pl-2">
                  {error.description}
                </p>
                {/* {error.description && (
                  <p className="text-red justify-self-start mt-2 pl-2">
                    {t('create.PleaseEnterDescription')}
                  </p>
                )} */}
                <div className="">
                  <div
                    className={`royalty_wrp ${error.royalties && 'err_occ'}`}
                  >
                    <div className="mt-4 mb-2 create_lab">
                      {t('create.Royalties')}{' '}
                      <span className="text-danger mb-5"> * </span>
                    </div>
                    <div className="position-relative">
                      <input
                        type="number"
                        className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                        placeholder="10"
                        name="royalties"
                        value={royalties}
                        onChange={(e) => {
                          inputClickHandler(e);
                        }}
                      />
                      <div className="absolute top-0 right-3 text-gray3">%</div>
                    </div>
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {error.royalties}
                    </p>
                  </div>

                  <div className="royalty_wrp create_property_field_wrp">
                    <div className="create_lab mt-4 mb-2">Properties</div>
                    <div className="row property_field_wrp">
                      <div className="col-4 pr-1 cproperty_field_wrpomn_site_dropdown size_cmn_site_dropdown">
                        <input
                          className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                          placeholder="Ex: Size"
                          name="key-1"
                          maxLength={10}
                        />
                      </div>
                      <div className="col-4 pl-1 pr-0 mobil_res">
                        <div className="properties_size">
                          <input
                            className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                            name="value-1"
                            placeholder="Large"
                            maxLength={50}
                          />
                        </div>
                      </div>
                      <div className="col-4 addbtn_wrp properties_size createnewbtn_wrp del_prop_img_wrp mx-0 px-1 ">
                        <button
                          type="button"
                          className="add_prop_btn"
                          onClick={addPropertiesHandler}
                        >
                          Add Properties
                        </button>
                        <button
                          type="button"
                          className="del_prop_btn del_prop_img"
                          onClick={(e) => delPropertiesHandler(e)}
                        >
                          <img
                            className="cursor-pointer "
                            src={imgConstants.deleteicon}
                            alt="deleteicon"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div
                      className={`${
                        isdigitalnft ? 'col-12' : 'col-12'
                      } cat_wrp ${error.nftCategory && 'err_occ'}`}
                    >
                      <div className="comn_site_dropdown">
                        <div className=" mt-4 mb-2 create_lab">
                          Category <span className="text-danger"> * </span>
                        </div>
                        <Dropdown onSelect={changecategory}>
                          <Dropdown.Toggle
                            variant="success"
                            className={`cmntitsel ${
                              selectCategory !== 'Select Category'
                                ? 'notplaceholder'
                                : ''
                            }`}
                            id="dropdown-basic"
                          >
                            {selectCategory}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item disabled={true} eventKey="">
                              Select Category
                            </Dropdown.Item>
                            {allcategory?.map((val: any, i: any) => {
                              return (
                                <>
                                  <Dropdown.Item
                                    key={i}
                                    onClick={() => getCategory(val.name)}
                                    eventKey={val._id}
                                  >
                                    {val.name}
                                  </Dropdown.Item>
                                </>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>

                        {error.nftCategory && (
                          <p className="text-red justify-self-start mt-2 pl-2">
                            Please select category
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* start.. */}

                  <div className="row align-items-end">
                    <div className={isOtherBrand ? 'col-md-6' : 'col-md-12'}>
                      <div
                        className={` cat_wrp ${error.nftCategory && 'err_occ'}`}
                      >
                        <div className="comn_site_dropdown">
                          <div className=" mt-4 mb-2 create_lab">
                            Select Brand{' '}
                            <span className="text-danger"> * </span>
                          </div>

                          <Dropdown onSelect={getBrand}>
                            <Dropdown.Toggle
                              variant=""
                              className={`cmntitsel ${
                                selectBrand !== 'Select Brand'
                                  ? 'notplaceholder'
                                  : ''
                              }`}
                              id="dropdown-basic"
                            >
                              {selectBrand}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {brandList?.map((data: any, i: any) => {
                                return (
                                  <>
                                    <Dropdown.Item
                                      key={i}
                                      disabled={
                                        data.name == 'Select Brand' && true
                                      }
                                      eventKey={data.value}
                                    >
                                      {data.value}
                                    </Dropdown.Item>
                                  </>
                                );
                              })}

                              <Dropdown.Item
                                // disabled={data.name == 'Select Brand' && true}
                                eventKey={'Other'}
                                disabled={
                                  selectCategory === 'Select Category'
                                    ? true
                                    : false
                                }
                              >
                                Others
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                    {isOtherBrand && (
                      <div className="col-md-6">
                        <input
                          className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                          name="value-1"
                          autoComplete="off"
                          placeholder=" Enter  Others Brand name"
                          maxLength={50}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setOtherBrandNameInput(e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-red justify-self-start mt-2 pl-2">
                    {error.nftBrand}
                  </p>

                  {/* end... */}
                </div>

                {/* {brand.value.length > 0 && !isOtherBrand ? ( */}
                  <div
                    className={`image-rule-style mt-4 ${
                      category?.imageRules?.filter((x: any) =>
                        x?.name?.startsWith('authentication_image'),
                      )?.length > 0
                        ? 'fileupload_main_sect'
                        : ''
                    }`}
                  >
                    <div className="">
                      {category?.imageRules?.filter((x: any) =>
                        x?.name?.startsWith('authentication_image'),
                      )?.length > 0 && (
                        <>
                          <span> Additional Product Images (optional)</span>
                          {/* <p>Add 3 photos to authenticate this item</p> */}
                        </>
                      )}
                    </div>

                    <div className="mt-3">
                      {category?.imageRules
                        ?.filter((x: any) =>
                          x?.name?.startsWith('authentication_image'),
                        )
                        ?.map((val: any, i: any) => {
                          return (
                            <>
                              <div
                                key={i}
                                className={`create_choosefile ${
                                  error.dynamicimgurl && 'err_occ'
                                }`}
                              >
                                <div className="create_chhosefile mt-1">
                                  {!val.isUploaded ? (
                                    <label
                                      className="fileUploadInput d-flex"
                                      htmlFor={`image-${val._id}`}
                                    >
                                      <input
                                        id={`image-${val._id}`}
                                        type="file"
                                        accept="image/*"
                                        name={val.name}
                                        onChange={(e) =>
                                          handleMyInputChange(
                                            e,
                                            val,
                                            `image-${val._id}`,
                                          )
                                        }
                                        style={{ display: 'none' }}
                                      />
                                      <span>+</span>Upload image
                                    </label>
                                  ) : (
                                    <div className="dlt_icon d-flex">
                                      <p>{val.imgName}</p>
                                      <img
                                        className="cursor-pointer"
                                        src={imgConstants.deleteicon}
                                        onClick={() =>
                                          removeImage(val.name, val)
                                        }
                                        alt="deleteicon"
                                      />
                                    </div>
                                  )}
                                </div>
                                {val.isRequired &&
                                isSubmited &&
                                !(
                                  allcatimgname.filter(
                                    (x: any) => x.name == val.name,
                                  ) &&
                                  allcatimgname.filter(
                                    (x: any) => x.name == val.name,
                                  ).length > 0 &&
                                  allcatimgname.filter(
                                    (x: any) => x.name == val.name,
                                  )[0]['file']
                                ) ? (
                                  <>
                                    {!val?.errorMsg && (
                                      <span className="text-danger">
                                        {val.description} is required
                                      </span>
                                    )}
                                  </>
                                ) : null}
                                <span className="text-danger">
                                  {val?.errorMsg}
                                </span>
                                <br />
                                <p className="text-red uploaderror">
                                  {error.dynamicimgurl}
                                </p>
                              </div>
                            </>
                          );
                        })}
                    </div>
                  </div>
                {/* ) : (
                  ''
                )} */}

                {brand?.value.length > 0 && !isOtherBrand ? (
                  <div className="image-rule-style">
                    <div
                      className={`image-rule-style mt-4 ${
                        category?.imageRules?.filter(
                          (x: any) =>
                            !x?.name?.startsWith('authentication_image'),
                        )?.length > 0
                          ? 'fileupload_main_sect'
                          : ''
                      }`}
                    >
                      <div className="">
                        {category?.imageRules?.filter(
                          (x: any) =>
                            !x?.name?.startsWith('authentication_image'),
                        )?.length > 0 && (
                          <>
                            <span> Authentication Images</span>
                            <p style={{ fontSize: '10px' }}>
                              All images marked with (*) are mandatory to
                              authenticate this item. You can also upload a
                              Certificate of Authentication (COA)
                            </p>
                          </>
                        )}
                      </div>
                      <div className="mt-4">
                        {category?.imageRules
                          ?.filter(
                            (x: any) =>
                              !x?.name?.startsWith('authentication_image'),
                          )
                          ?.map((val: any, i: any) => {
                            return (
                              <>
                                <div
                                  key={i}
                                  className={`create_choosefile ${
                                    error.dynamicimgurl && 'err_occ'
                                  }`}
                                >
                                  <h6>
                                    {' '}
                                    {val.description}{' '}
                                    {val.isRequired ? (
                                      <span className="text-danger"> * </span>
                                    ) : null}
                                  </h6>
                                  <div className="create_chhosefile mt-1">
                                    {!val.isUploaded ? (
                                      <label
                                        className="fileUploadInput d-flex"
                                        htmlFor={`image-${val._id}`}
                                      >
                                        <input
                                          id={`image-${val._id}`}
                                          type="file"
                                          accept="image/*"
                                          name={val.name}
                                          onChange={(e) =>
                                            handleMyInputChange(
                                              e,
                                              val,
                                              `image-${val._id}`,
                                            )
                                          }
                                          style={{ display: 'none' }}
                                        />
                                        <span>+</span>Upload image
                                      </label>
                                    ) : (
                                      <div className="dlt_icon d-flex">
                                        <p>{val.imgName}</p>
                                        <img
                                          className="cursor-pointer"
                                          src={imgConstants.deleteicon}
                                          onClick={() =>
                                            removeImage(val.name, val)
                                          }
                                          alt="deleteicon"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  {val.isRequired &&
                                  isSubmited &&
                                  !(
                                    allcatimgname.filter(
                                      (x: any) => x.name == val.name,
                                    ) &&
                                    allcatimgname.filter(
                                      (x: any) => x.name == val.name,
                                    ).length > 0 &&
                                    allcatimgname.filter(
                                      (x: any) => x.name == val.name,
                                    )[0]['file']
                                  ) ? (
                                    <>
                                      {!val?.errorMsg && (
                                        <span className="text-danger">
                                          {val.description} is required
                                        </span>
                                      )}
                                    </>
                                  ) : null}
                                  <span className="text-danger">
                                    {val?.errorMsg}
                                  </span>
                                  <br />
                                  <p className="text-red uploaderror">
                                    {error.dynamicimgurl}
                                  </p>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {!isdigitalnft && (
                  <div className="redeemable_new_box_wrp mt-4">
                    <div className="row">
                      <div className="col-10">
                        <span>Activate "Burn option"</span>
                        <p>
                          Destroy the digital NFT attached to the physical item
                          after redemption of the product
                        </p>
                      </div>
                      <div className="col-2 text-right">
                        <label className="switchlabel roundswitchlabel">
                          <Switch
                            checked={activeRedeemBurn}
                            onColor="#B4B4B4"
                            onHandleColor="#FCFCFD"
                            handleDiameter={20}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="unset"
                            activeBoxShadow="unset"
                            offColor="#F8F8F8"
                            height={24}
                            width={44}
                            onChange={() =>
                              changeRedeemableTypeHandle(
                                activeRedeemBurn ? 1 : 2,
                              )
                            }
                            className="redeemable_new_box_switch"
                            id="material-switch"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right createitembbtnwrp">
                <button
                  className={
                    isLoaded === false ? ` mintbtn disable` : `mintbtn`
                  }
                  onClick={handleModal}
                  disabled={isLoaded === false ? true : false}
                >
                  {isLoaded ? 'Create Item' : 'Creating Item ...'}
                </button>
              </div>
            </div>
          </form>
        </div>
        <ApproveModel
          show={isModalVisible}
          onCloseModal={handleCloseapproveModel}
          hideCursor={hideCursor}
          putOnSale={handlePutOnSale}
          onsaleloading={onsaleloading}
          cursor={hideCursor}
          itemid={itemid}
        />
      </Layout>
    </>
  );
};

const CollectionModal = (props: any) => {
  return (
    <div
      className="collection-modal create_item_modal_wrp"
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b0',
        position: 'fixed',
        zIndex: 999,
      }}
    >
      <div
        className="collection-modal-inner"
        style={{ width: '45%', minWidth: '300px', position: 'relative' }}
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
            <div className="collection_modal_inner club_create_col">
              <h2 className="text-left mb-4">Create Collection</h2>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <label htmlFor="collectionIconChooseFile">
                    <div className="text-center crt_popupimg_wrp">
                      {props.collectionImage ? (
                        <div
                          className={`adjust-header ${
                            props.isAudio ? 'adjust_header_aud' : ''
                          }`}
                        >
                          {props.collectionImage.size / 1024 / 1024 > 30
                            ? ''
                            : props.isAudio
                            ? props.collectionImage &&
                              props.collectionImage?.name &&
                              props.isAudio && (
                                <div>
                                  <img
                                    className="ml-25"
                                    src={
                                      'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/musicIcon.png'
                                    }
                                    alt="music-icon"
                                    style={{
                                      margin: '0',
                                    }}
                                  />
                                  <audio
                                    controls
                                    style={{
                                      width: '180px',
                                      margin: '0',
                                    }}
                                  >
                                    <source
                                      src={URL.createObjectURL(
                                        props.collectionImage,
                                      )}
                                    ></source>
                                  </audio>
                                </div>
                              )
                            : props.collectionImage &&
                              props.collectionImage?.name &&
                              !props.isVideo && (
                                <figure>
                                  <img
                                    style={{
                                      margin: '0',
                                    }}
                                    src={URL.createObjectURL(
                                      props.collectionImage,
                                    )}
                                    alt={props.collectionImage.name}
                                  />
                                </figure>
                              )}

                          {props.collectionImage.size / 1024 / 1024 > 30
                            ? ''
                            : props.collectionImage &&
                              props.collectionImage?.name &&
                              props.isVideo && (
                                <video
                                  controls
                                  style={{
                                    width: '220px',
                                    height: '160px',
                                    margin: '0',
                                  }}
                                >
                                  <source
                                    src={URL.createObjectURL(
                                      props.collectionImage,
                                    )}
                                    type="video/mp4"
                                  ></source>
                                </video>
                              )}
                        </div>
                      ) : (
                        <div className="adjust-header">
                          <div
                            className="col-12 mint_wrp text-center adjust-margin"
                            style={{
                              display: '',
                              alignItems: 'end',
                              flexWrap: 'wrap',
                              marginBottom: '0px',
                            }}
                          >
                            <img
                              className="mx-auto upload_img"
                              src={imgConstants.smallupload}
                              alt="smallupload"
                            />
                            <button
                              onClick={() =>
                                document
                                  .getElementById('collectionIconChooseFile')
                                  ?.click()
                              }
                              type="button"
                              className=" create_coll_btn"
                              id="choosefile"
                              style={{ marginBottom: '0px' }}
                            >
                              Upload Profile image
                            </button>
                            <p className="text_gray">
                              File types Supported:
                              <span> jpg, png, gif, svg</span>
                            </p>
                            <p className="text_gray">
                              Max file size:<span>30MB</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="upload-file"
                      name="collectionImage"
                      onChange={props.inputClickHandler}
                      id="collectionIconChooseFile"
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span
                    style={{
                      color: 'red',
                      fontSize: 12,
                      fontWeight: 'bold',
                      display: 'flex',
                    }}
                  >
                    {props.error.collectionImage}
                  </span>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12">
                  <label htmlFor="collectionBannerChooseFile">
                    <div className="text-center crt_popupimg_wrp">
                      {props.collectionBannerImage ? (
                        <div
                          className={`adjust-header ${
                            props.isAudio ? 'adjust_header_aud' : ''
                          }`}
                        >
                          {props.collectionBannerImage.size / 1024 / 1024 > 30
                            ? ''
                            : props.isAudio
                            ? props.collectionBannerImage &&
                              props.collectionBannerImage?.name &&
                              props.isAudio && (
                                <div>
                                  <img
                                    className="ml-25"
                                    src={
                                      'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/musicIcon.png'
                                    }
                                    alt="music-icon"
                                    style={{
                                      margin: '0',
                                    }}
                                  />
                                  <audio
                                    controls
                                    style={{
                                      width: '180px',
                                      margin: '0',
                                    }}
                                  >
                                    <source
                                      src={URL.createObjectURL(
                                        props.collectionBannerImage,
                                      )}
                                    ></source>
                                  </audio>
                                </div>
                              )
                            : props.collectionBannerImage &&
                              props.collectionBannerImage?.name &&
                              !props.isVideo && (
                                <figure>
                                  <img
                                    style={{
                                      margin: '0',
                                    }}
                                    src={URL.createObjectURL(
                                      props.collectionBannerImage,
                                    )}
                                    alt={props.collectionBannerImage?.name}
                                  />
                                </figure>
                              )}

                          {props.collectionBannerImage.size / 1024 / 1024 > 30
                            ? ''
                            : props.collectionBannerImage &&
                              props.collectionBannerImage?.name &&
                              props.isVideo && (
                                <video
                                  controls
                                  style={{
                                    width: '220px',
                                    height: '160px',
                                    margin: '0',
                                  }}
                                >
                                  <source
                                    src={URL.createObjectURL(
                                      props.collectionBannerImage,
                                    )}
                                    type="video/mp4"
                                  ></source>
                                </video>
                              )}
                        </div>
                      ) : (
                        <div className="adjust-header">
                          <div
                            className="col-12 mint_wrp text-center adjust-margin"
                            style={{
                              display: '',
                              alignItems: 'end',
                              flexWrap: 'wrap',
                              marginBottom: '0px',
                            }}
                          >
                            <img
                              className="mx-auto upload_img"
                              src={imgConstants.smallupload}
                              alt="smallupload"
                            />
                            <button
                              onClick={() =>
                                document
                                  .getElementById('collectionBannerChooseFile')
                                  ?.click()
                              }
                              type="button"
                              className=" create_coll_btn"
                              id="chooseBannerfile"
                              style={{ marginBottom: '0px' }}
                            >
                              Upload Banner image
                            </button>
                            <p className="text_gray">
                              File types Supported:
                              <span> jpg, png, gif, svg</span>
                            </p>
                            <p className="text_gray">
                              Max file size:<span>30MB</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*,"
                      className="upload-file"
                      name="collectionBannerImage"
                      onChange={props.inputClickHandler}
                      id="collectionBannerChooseFile"
                      style={{ display: 'none' }}
                      multiple
                    />
                  </label>
                  <span
                    style={{
                      color: 'red',
                      fontSize: 12,
                      fontWeight: 'bold',
                      display: 'flex',
                    }}
                  >
                    {props.error.collectionBannerImage}
                  </span>
                </div>
              </div>

              <form className="collection_form_wrp text-left">
                <div id="collectionform">
                  <div
                    className={`comm_input_wrp ${
                      props.error.displayName && `err_occ`
                    }`}
                  >
                    <label>
                      Display name <span className="req_field"> * </span>
                    </label>
                    <input
                      type="text"
                      className="inpt  border-b border-solid
                        w-full"
                      name="displayName"
                      onChange={props.inputClickHandler}
                      id="displayName"
                      value={props.displayName || ''}
                      placeholder="Enter display name"
                      maxLength={52}
                    />
                    {props.error.displayName ? (
                      <span
                        style={{
                          color: 'red',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        {props.error.displayName}
                      </span>
                    ) : (
                      <p className="collecton_comm_para"></p>
                    )}
                  </div>
                  <div
                    className={`comm_input_wrp ${
                      props.error.displayName && `err_occ`
                    }`}
                  >
                    <label>
                      Symbol <span className="req_field"> * </span>
                    </label>
                    <input
                      type="text"
                      className="inpt bg-transparent border-b border-solid 
                        w-full"
                      name="symbol"
                      id="symbol"
                      onChange={props.inputClickHandler}
                      value={props.symbol || ''}
                      placeholder="Enter symbol"
                      maxLength={10}
                    />
                    <span
                      style={{ color: 'red', fontSize: 12, fontWeight: 'bold' }}
                    >
                      {props.error.symbol}
                    </span>
                  </div>
                  <div
                    className={`comm_input_wrp ${
                      props.error.description && `err_occ`
                    }`}
                  >
                    <label>Description</label>
                    <textarea
                      className="inpt bg-transparent border-b border-solid
                        w-full min-height-in-textarea"
                      name="collectionDescription"
                      onChange={props.inputClickHandler}
                      id="collectionDescription"
                      value={props.collectionDescription || ''}
                      placeholder="Spreads some words about your collection"
                      maxLength={220}
                    ></textarea>
                    <span
                      style={{ color: 'red', fontSize: 12, fontWeight: 'bold' }}
                    >
                      {props.error.description}
                    </span>
                  </div>
                  <div className="create_collection_btn_wrp text-right">
                    <button
                      type="button"
                      onClick={props.hide}
                      className="button-create cancelbtn"
                    >
                      Cancel
                    </button>
                    <button
                      style={
                        props.isDis
                          ? { pointerEvents: 'none', opacity: '0.4' }
                          : {}
                      }
                      type="button"
                      className="button-create"
                      onClick={props.createCollection}
                    >
                      {props.collectionButtonLoading ? (
                        <div style={{ display: 'flex' }}>
                          <span>
                            <Loading margin={'0'} size={'16px'} />
                          </span>
                          <span style={{ marginLeft: '15px' }}>
                            Creating...
                          </span>
                        </div>
                      ) : (
                        'Create Collection'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReedemModal = (props: any) => {
  return (
    <div
      className="redeem-modal"
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
        className="redeem-modal-inner"
        style={{
          width: '35%',
          backgroundColor: 'white',
          minWidth: '300px',
          position: 'relative',
        }}
      >
        <div>
          <span aria-hidden="true" onClick={props.hide} className="close_btn">
            X
          </span>
          <h2 className="text-start">
            {props.type === 1
              ? 'Redeemable and not Burn'
              : 'Redeemable and Burn'}
          </h2>
          {props.type === 1 ? (
            <div className="modal-content">
              Please note that this item is a Redeemable item. Therefore, not
              burning an NFT will keep the asset in the blockchain. Do you wish
              to continue?
            </div>
          ) : (
            <div className="modal-content">
              Please note that this item is a Redeemable item. Therefore,
              burning an NFT destroys the asset and removes it entirely from the
              blockchain. Do you wish to continue?{' '}
            </div>
          )}
          <div className="create_collection_btn_wrp text-right">
            <button className="button-create" onClick={props.hide}>
              I understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
