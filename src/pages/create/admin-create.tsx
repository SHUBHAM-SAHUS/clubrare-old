import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../layouts/main-layout/main-layout';
import { Select, Spinner } from '../../components';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import physicalNft from '../../assets/images/physicalNft.svg';
import digitalNft from '../../assets/images/digitalNft.svg';
import info from './../../assets/images/Info.svg';

import {
  createCollectiblesAction,
  AllcollectionCategory,
  LazylistingPutOnSaleAPiAction,
} from '../../redux';
import {
  GetCaver,
  getWeb3,
  makeBrokerContractForEth,
  makeBrokerContractForKlytn,
} from '../../service/web3-service';

import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';

import './create.css';
import { SET_WALLET_AMOUNT } from '../../redux/types/connect-wallet-types';
import { SET_IS_CONNECTED } from '../../redux/types';
import moment from 'moment';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import VideoThumbnail from 'react-video-thumbnail';
import { imgConstants } from '../../assets/locales/constants';
import ApproveModel from './approve-model';
import { klaytnWallConnCheck } from '../../utils/klaytn-wallet-connection-check';
import Switch from 'react-switch';
import { useCustomStableCoin } from '../../hooks';

const brokerContractAddress =
  process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase();

const klaytnbrokerAddress =
  process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase();

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

const AdminCreate = () => {
  const { customToWei } = useCustomStableCoin();
  const allcategory = useSelector(
    (state: any) => state.categoryReducer.allcategoryitem,
  );
  const { t } = useTranslation();
  const [activeSaleModel, setActiveSaleModel] = useState('fixedPrice');
  const [showReedemModal, setShowRedeemModal] = useState(false);

  const [collections, setCollections] = useState('Clubrare Drop');
  const [selectCategory, setSelectCategory] = useState('Select Category');
  const [isSubmited, setIsSubmitted] = useState(false);
  const [usdAmount, setUsdAmount] = useState(0);
  const [Ipfs, SetIpfs] = useState<string>('');
  const [tokenBasedSale, setTokenbasedSale] = useState<boolean>(false);
  const salesModels = [
    { key: 'fixedPrice', title: t('create.FixedPrice') },
    { key: 'auction', title: 'Timed Auction' },
  ];

  const { addToast } = useToasts();
  const history = useHistory();
  const wallet_address: any = localStorage.getItem('Wallet Address');
  const network_id: any = localStorage.getItem('networkId');
  const dispatch = useDispatch();
  const [attactment, setAttachment] = useState<any>('');
  const [price, setPrice] = useState<any>('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('KLAY');
  const [description, setDescription] = useState('');
  const [royalties, setRoyalties] = useState<any>('');
  const [activeRedeemBurn, setActiveRedeemBurn] = useState<boolean>(false);

  const [category, setCategory] = useState({
    luxury_name: '',
    brands: [],
    category_id: null,
    created_on: null,
    imageRules: [],
    name: '',
    _id: '',
    errorMsg: '',
  });
  const [expiryDateHandle, setExpiryDateHandle] = useState<any>('');
  const [startDateHandle, setStartDateHandle] = useState('');
  const [activeCollectionId, setActiveCollectionId] = useState(-1);
  const [collectionAddress, setCollectionAddress] = useState<any>('');
  const [redeemable, setRedeemable] = useState<boolean>(true);
  const [error, setError] = useState({
    size: '',
    price: '',
    title: '',
    description: '',
    royalties: '',
    properties: '',
    putOnMarketplace: '',
    attachment: '',
    category: '',
    nftType: '',
    startDateHandle: '',
    expiryDateHandle: '',
    dynamicimgurl: '',
    nftCategory: '',
  });

  const [errorAttach, setErrorAttach] = useState(false);

  const [createArtState, setCreateArtState] = useState('mint');

  const [minExpiryDate, setMinExpirationDate] = useState<any>('');
  const [minExpiryDate1, setMinExpirationDate1] = useState<any>('');
  const isConnected = useSelector(
    (state: any) => state.headerReducer.isConnected,
  );
  const [redeemableType, setRedeemableType] = useState<number>(1);
  const startDatePopRef: any = useRef(null);
  const expiryDatePopRef: any = useRef(null);
  const agov_token_address = process.env.REACT_APP_AGOV_TOKEN_ADD;
  const weth_token_address = process.env.REACT_APP_WETH_TOKEN_ADD;
  const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
  const usdt_eth_token_address = process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();
  const usdt_klaytn_token_address = process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase();
  const profileDetails = useSelector((state: any) => {
    return state.profileReducers.profile_details;
  });

  const [hideCursor, setHideCursor] = useState(false);

  const [collectibleImageList, setCollectibleImages] = useState<any>([]);
  const [allcatimgname, Setallcatimgname] = useState<any>([]);
  const [carouselLoading, setCarouselLoading] = useState(false);

  const newarry = [...collectibleImageList];
  useEffect(() => {
    dispatch(AllcollectionCategory());
  }, []);

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
      if (erc20_address?.toLowerCase() === mpwr_token_address) {
        usdAmount = price * mpwrRate;
      } else if (erc20_address?.toLowerCase() === agov_eth_token_address) {
        usdAmount = price * agovEthRate;
      } else if (erc20_address?.toLowerCase() === usdt_eth_token_address) {
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

  const outsideClickHandler = (event: any) => {
    if (
      startDatePopRef &&
      startDatePopRef.current &&
      !startDatePopRef.current.contains(event.target)
    ) {
    }
    if (
      expiryDatePopRef &&
      expiryDatePopRef.current &&
      !expiryDatePopRef.current.contains(event.target)
    ) {
    }
  };

  const openRedeemModal = (type: number) => {
    if (type === 2) {
      setShowRedeemModal(true);
    }
  };
  const handleMyInputChange = (e: any, imageRule: any, id: string) => {
    const { name } = imageRule;
    const img = e.target.files[0];
    let value = e.target.value
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
      }
      // img && img?.size / 1024 / 1024 > 30
      else if ((img && img?.size / (1024 * 1024)).toFixed(2) > 3) {
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

  const closeRedeemModal = () => {
    setShowRedeemModal(false);
  };

  const [signatureloading, Setsignatureloading] = useState<boolean>(false);
  const [itemid, Setitemid] = useState<string>('');

  const handleModal = (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    let errorMsg1 = '';
    let errorMsg2 = '';
    let errorMsg3 = '';
    let errorMsg4 = '';
    let errorMsg5 = '';
    let errorMsg6 = '';
    let errorMsg7 = '';
    let errorMsg9 = '';
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
    const regex1 = /^(?:\d*\.\d{1,17}|\d+)$/;
    if (price === '') {
      errorMsg7 = 'Price can not be empty';
    } else if (price <= 0) {
      errorMsg7 = 'Price must be greater than 0';
    } else if (price.length >= 19) {
      errorMsg7 = 'Price should not more then 18 digit';
    } else if (!regex1.test(price)) {
      errorMsg7 = 'Please enter correct value';
    }
    const regex = /^\d+(\.\d{1,2})?$/;

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
    if (startDateHandle === '') {
      errorMsg5 = 'Cannot be empty. Please Select Start Date ';
    }
    if (expiryDateHandle === '') {
      errorMsg6 = 'Cannot be empty. Please Select End Date';
    }
    if (selectCategory === 'Select Category') {
      errorMsg9 = 'Category can not be empty';
    }
    setError({
      ...error,
      title: errorMsg2,
      attachment: errorMsg1,
      royalties: errorMsg3,
      nftType: errorMsg4,
      nftCategory: errorMsg9,
      startDateHandle: errorMsg5,
      expiryDateHandle: errorMsg6,
      price: errorMsg7,
    });
    if (redeemable) {
      let errorExist = false;
      category?.imageRules.forEach((element: any) => {
        if (
          element &&
          element.isRequired &&
          !(
            allcatimgname.filter((x: any) => x.name == element.name) &&
            allcatimgname.filter((x: any) => x.name == element.name).length >
            0 &&
            allcatimgname.filter((x: any) => x.name == element.name)[0]['file']
          ) &&
          !errorExist
        ) {
          errorExist = true;
        }
      });
      if (errorExist) {
        return;
      }
    }

    if (
      errorMsg1 == '' &&
      errorMsg2 == '' &&
      errorMsg3 == '' &&
      errorMsg4 == '' &&
      errorMsg4 == '' &&
      errorMsg5 == '' &&
      errorMsg6 == '' &&
      errorMsg7 == '' &&
      errorMsg9 == ''
    ) {
      createTeamHandler();
    }
  };

  const createTeamHandler = async () => {
    setIsSubmitted(true);
    try {
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

      setCreateArtState('minting');
      const formData = new FormData();
      formData.append('description', description || '');

      let network: any = 1;
      if (network_id == process.env.REACT_APP_KLATYN_NETWORK_ID) {
        network = 2;
      }
      formData.append('title', title || '');
      formData.append('royalties', royalties || '');

      formData.append(
        'nft_type',
        category && category.name ? category.name.toLowerCase() : '',
      );
      formData.append(
        'category_id',
        category && category._id ? category._id : '',
      );
      if (allcatimgname && allcatimgname.length > 0) {
        allcatimgname.forEach((element: any) => {
          formData.append(element.name, element.file);
        });
      }
      formData.append('brand', '');
      formData.append('attachment', attactment || '');
      formData.append('customFields', JSON.stringify(finalPropertyArr));
      formData.append('redeemable', String(redeemable));
      formData.append('redeem_type', String(redeemableType));
      formData.append('network_id', network);
      formData.append('collection_address', collectionAddress);

      window.onbeforeunload = function () {
        return 'If you reload this page, your previous action will be repeated';
      };
      setHideCursor(true);
      const result: any = await dispatch(createCollectiblesAction(formData));
      if (result) {
        setCreateArtState('mint');
        setIsSubmitted(false);
        Setitemid(result?._id);
        SetIpfs(result?.IpfsHash);
        setIsModalVisible(true);
        setHideCursor(false);
        addToast('Collectible created successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        window.onbeforeunload = null;
        setIsSubmitted(false);
        setHideCursor(false);

        setCreateArtState('mint');
        setIsModalVisible(false);
      }
    } catch (err) {
      setIsModalVisible(false);
      window.onbeforeunload = null;
      setHideCursor(false);
      setCreateArtState('mint');
      setIsSubmitted(false);
    }
  };

  const getCollection = async (event: any) => {
    setCollections(event);
  };

  useEffect(() => {
    if (!isConnected) {
      history.push('/connect-wallet');
    }
    document.addEventListener('mousedown', outsideClickHandler);

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

    klaytn?.on('accountsChanged', function (accounts: any) {
      if (accounts.length > 0) {
        return;
      } else if (accounts.length == 0) {
        history.push('/home');
      }
    });

    if (profileDetails?.role === 'admin' || profileDetails?.isSuperAdmin) {
      const clubrare_drop =
        localStorage.getItem('networkId') ===
          process.env.REACT_APP_KLATYN_NETWORK_ID
          ? process.env.REACT_APP_KLAYTN_ADMIN_MINTABLE_ADD
          : process.env.REACT_APP_ETH_ADMIN_MINTABLE_ADDRESS;
      setCollectionAddress(clubrare_drop);
    }
  }, [profileDetails]);

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

  const changecategory = (_id: any) => {
    const findCategoryRes = allcategory.filter((flt: any) => flt._id === _id);
    setCategory(findCategoryRes[0]);
    if (_id) {
      setError({ ...error, nftCategory: '' });
    }
  };
  const getCategory = (event: any) => {
    setSelectCategory(event);
    Setallcatimgname([])
    let filteredArray=collectibleImageList?.filter((item:any) => item.name === 'attachment');
    setCollectibleImages(filteredArray)

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

async function getVideoDimensionsOf(url:any){
    return new Promise(resolve => {
        // create the video element
        const video = document.createElement('video');
        // place a listener on it
        video.addEventListener( "loadedmetadata", function () {
            // retrieve dimensions
            const height = this.videoHeight;
            const width = this.videoWidth;
            // send back result
            resolve({height:height, width:width});
        }, false);

        // start download meta-datas
        video.src = url;
    });
}

const getCurrentDimensions=async(file:any)=>{
    return new Promise(async(res,rej)=>{
      if (file?.type?.startsWith('image/')) {
        let img = new Image()
        img.src = window.URL.createObjectURL(file)
        img.onload = () => {
          res(
            {
            height:img.height,
            width:img.width
    
          })
        } 
      } else if(file?.type?.startsWith('video/mp4')){
      const videoDimension=await getVideoDimensionsOf(window.URL.createObjectURL(file))
        res(videoDimension)
      }else{
        res(
          {
          height:265,
          width:265
  
        })
      }
    })
}

  const inputClickHandler = async(event: any) => {
    const { name, value } = event.target;
    const productRegexImg = new RegExp('(.*?).(gif|jpe?g|png|svg|mp4|mp3)$');

    switch (name) {
      case 'attachment':
        setCarouselLoading(true);
        if (value === '' || value == null || !value) {
          if (!attactment) {
            setError({ ...error, attachment: 'cannot be empty' });
            setCarouselLoading(false);
          }
        } else {
          setError({ ...error, attachment: '' });
        }
        const dimensions:any= await getCurrentDimensions(event.target.files[0]);
        if ((264 > dimensions?.height) || (264 > dimensions?.width)) {
          setError({
            ...error,
            attachment: 'We recommended you upload a file of 264 x 264 resolution.',
          });
          addToast('We recommended you upload a file of 264 x 264 resolution.', {
            appearance: 'error',
            autoDismiss: true,
          });
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
          if (!redeemable) {
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
          } else if (event.target.files[0].type === 'audio/mpeg') {
          } else {
          }
        } else {
          addToast('Please select file valid format(Image)', {
            appearance: 'error',
            autoDismiss: true,
          });
          setAttachment('');
          return;
        }
       }
        break;
      case 'category':
        if (value === '') {
          setError({ ...error, nftCategory: 'Category can not be empty' });
        } else {
          setError({ ...error, nftCategory: '' });
        }
        setCategory(event.target.value);
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
                  src={imgConstants.musicIcon}
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

  const changeRedeemableTypeHandle = (type: number) => {
    setActiveRedeemBurn(!activeRedeemBurn);
    setRedeemableType(type);
    openRedeemModal(type);
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

  const closeStepsModal = () => {
    setIsModalVisible(false);
    history.push(`/${wallet_address}`);
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

  const selectNftHandler = (status: any) => {
    setRedeemable(status);
    setIsSubmitted(false);
    setError({
      size: '',
      price: '',
      title: '',
      description: '',
      royalties: '',
      properties: '',
      putOnMarketplace: '',
      attachment: '',
      category: '',
      nftType: '',
      startDateHandle: '',
      expiryDateHandle: '',
      dynamicimgurl: '',
      nftCategory: '',
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

  const getSignatureForLazyListing = async (noncedata: any) => {
    const startTime = await getStartTime();
    const endTime = activeSaleModel === 'fixedPrice' ? 0 : await geteEndTime();
    const auctionTypeval = activeSaleModel === 'fixedPrice' ? '1' : '2';
    const ordertype = redeemable ? 1 : 0;
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
      const tokenGateAddress: any = tokenBasedSale
        ? process.env.REACT_APP_KLAYTN_TOKEN_BASED_SALE_ADD
        : '0x0000000000000000000000000000000000000000';
      await klaytnWallConnCheck();
      const { caver }: any = await GetCaver();

      const amount1 = await customToWei(price.toString(), caver, paymenttype);

      const sign_signature =
        '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const hashdata = {
        seller: klaytnbrokerAddress,
        contractAddress: collectionAddress.toLowerCase(),
        royaltyFee: royalties * 100,
        royaltyReceiver: klaytnbrokerAddress,
        paymentToken: paymenttype,
        basePrice: amount1.toString(),
        listingTime: startTime,
        expirationTime: endTime,
        nonce: +noncedata,
        tokenId: 0,
        orderType: ordertype,
        signature1: sign_signature,
        uri: Ipfs,
        objId: itemid,
        isTokenGated: tokenBasedSale,
        tokenGateAddress: tokenGateAddress,
      };
      const hasharray = [
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
          .hashOrder(hasharray)
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
              Setsignatureloading(false);
              setIsModalVisible(false);
              history.push(`/item/${itemid}`);
            }
            const signature = result.result;
            callPutOnSaleApi(signature, amount1, hashdata.tokenGateAddress);
          },
        );
      } catch (err) {
        setHideCursor(false);
        Setsignatureloading(false);
        setIsModalVisible(false);
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


      const amount1 = await customToWei(price.toString(), web3, paymenttype);
      const tokenGateAddress: any = tokenBasedSale
        ? process.env.REACT_APP_ETH_TOKEN_BASED_SALE_ADD
        : '0x0000000000000000000000000000000000000000';
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
        //make sure to replace verifyingContract with address of deployed contract
        primaryType: 'Order',
        domain: {
          name: 'Clubrare Marketplace',
          version: '1.0.1',
          chainId: process.env.REACT_APP_NFT_NETWORK_ID,
          verifyingContract: process.env.REACT_APP_ETH_BROKER_VALIDATOR,
        },
        message: {
          seller: brokerContractAddress,
          contractAddress: collectionAddress.toString().toLowerCase(),
          royaltyFee: (royalties * 100).toString(),
          royaltyReceiver: brokerContractAddress,
          paymentToken: paymenttype,
          basePrice: amount1.toString(),
          listingTime: startTime,
          expirationTime: endTime,
          nonce: noncedata,
          tokenId: 0,
          orderType: ordertype,
          uri: Ipfs,
          objId: itemid.toLowerCase(),
          isTokenGated: tokenBasedSale,
          tokenGateAddress: tokenGateAddress,
        },
      });
      const fromAddress = (await web3.eth.getAccounts())[0];
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
            Setsignatureloading(false);
            setIsModalVisible(false);
            history.push(`/item/${itemid}`);
          }
          const signature = result.result;
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
      Setsignatureloading(false);
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
        isTokenGated: tokenBasedSale,
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
    Setsignatureloading(true);
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
        let nonceRes = await brokerContract.methods
          .getCurrentOrderNonce(brokerContract._address)
          .call();

        if (nonceRes) {
          getSignatureForLazyListing(nonceRes);
        }
      } catch (error) {
        setHideCursor(false);
        Setsignatureloading(false);
        setIsModalVisible(false);
        history.push(`/item/${itemid}`);
      }
    } else {
      const { brokerContract }: any = await makeBrokerContractForEth(
        brokerContractAddress,
        true,
      );
      try {
        let nonceRes = await brokerContract.methods
          .getCurrentOrderNonce(brokerContract._address)
          .call();

        if (nonceRes) {
          getSignatureForLazyListing(nonceRes);
        }
      } catch {
        setHideCursor(false);
        Setsignatureloading(false);
        setIsModalVisible(false);
        history.push(`/item/${itemid}`);
      }
    }
  };

  return (
    <>
      {isModalVisible ? (
        <ApproveModel
          show={isModalVisible}
          putOnSale={handlePutOnSale}
          onsaleloading={signatureloading}
          cursor={hideCursor}
          itemid={itemid}
        />
      ) : null}

      {showReedemModal && (
        <ReedemModal type={redeemableType} hide={closeRedeemModal} />
      )}
      <Layout
        mainClassName="create_coll_main_wrp"
        displayStickySidebar
        hideCursor={hideCursor}
      >
        <div
          className="container-fluid club_createitem"
          style={{ pointerEvents: hideCursor ? 'none' : 'auto' }}
        >
          <form className="row" onSubmit={() => {}}>
            <div className="col-lg-6 create_coll_left admin_create_col_left">
              <div className=" mt-8 md:mt-0 uploadyourartworkhead mb-2">
                <h1>
                  Create an Item <span className="req_field"> * </span>
                </h1>
              </div>

              <div
                className={`border-dash mt-1 ${newarry.length !== 0 && !errorAttach
                  ? 'remove-dash-border'
                  : ''
                  } ${newarry[0]?.imageurl.type !== 'image/svg+xml'
                    ? 'preview_uploaded_aud_vid'
                    : ''
                  }`}
              >
                {carouselLoading ? (
                  <Spinner />
                ) : (
                  <>
                    {newarry[0]?.imageurl !== '' && !errorAttach && (
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
                                              src={imgConstants.musicIcon}
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
                          // accept="image/*, .mp4"
                          accept="image/*,.mp4,.mp3,"
                          onChange={(event) => {
                            inputClickHandler(event);
                          }}
                          id="imgFileInput"
                        />
                        <div className="figure-uploadwrp row-start-1 col-start-1 justify-self-center button-share-gray">
                          {/* {t("create.ChooseFile")} */}
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
                {/* {attactment && ( */}
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
            <div className="col-lg-6 create_coll_right admin_create_col_right">
              <div className="create_collright_inn">
                {(profileDetails?.role === 'admin' ||
                  profileDetails?.isSuperAdmin) && (
                    <div className="">
                      {/* <div className="create_lab">
                        Choose type of NFT to Create
                      </div> */}
                      <div className="mb-4 mt-8">
                        <div
                          onClick={() => selectNftHandler(true)}
                          className={
                            redeemable
                              ? 'redeem-box new-redeem-box active'
                              : 'redeem-box new-redeem-box'
                          }
                        >
                          <div className='cmn_create_main_tooltip_wrp' >
                            <img src={info} alt='Info' />
                            <div className='cmn_create_tooltip_wrp' >
                              <h6>Phygital NFT</h6>
                              <p>A physical item paired with a digital NFT</p>
                            </div>
                          </div>
                          <img src={physicalNft} alt="Phygital NFT" />
                          <span>Phygital NFT</span>
                        </div>
                        {/* <div
                          onClick={() => selectNftHandler(false)}
                          className={
                            !redeemable
                              ? 'redeem-box new-redeem-box active'
                              : 'redeem-box new-redeem-box'
                          }
                        >
                          <div className='cmn_create_main_tooltip_wrp ' >
                            <img src={info} alt='Info' />
                            <div className='cmn_create_tooltip_wrp' >
                              <h6>Digital NFT</h6>
                              <p>A digital NFT only. Not attached to any physical item</p>
                            </div>
                          </div>
                          <img src={digitalNft} alt="Digital NFT" />
                          <span>Digital NFT</span>
                        </div> */}
                      </div>
                    </div>
                  )}

                <div
                  className={`${profileDetails?.role === 'admin' ||
                    profileDetails?.isSuperAdmin
                    ? ``
                    : ``
                    } ${activeSaleModel === 'auction' ? 'mt-2' : ``} ${error.title && 'err_occ'
                    }`}
                >
                  <div className="create_lab mb-2 mt-4">
                    {t('create.Title')}
                    <span className="text-danger"> * </span>
                  </div>
                  <input
                    className={`responsive-placeholder bg-transparent border-b border-solid relative_fld
                    w-full `}
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
                <div className="authencheck_wrp">
                  <div className="">
                    <h6> Do you want token based item ?</h6>
                  </div>
                  <div className="mt-2">
                    <label className="usercrect_radio">
                      Yes
                      <input
                        type="radio"
                        name="authenticate"
                        value="true"
                        onClick={() => setTokenbasedSale(true)}
                      />
                      <span className="checkmark" />
                    </label>
                    <label className="usercrect_radio">
                      No
                      <input
                        type="radio"
                        name="authenticate"
                        defaultChecked
                        value="false"
                        onClick={() => setTokenbasedSale(false)}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
                {(profileDetails?.role === 'admin' ||
                  profileDetails?.isSuperAdmin === true) && (
                    <>
                      <div className="choosesalemodelwrp my-4">
                        {salesModels.map((m) => (
                          <button
                            key={m.key}
                            className={` ${m.key == 'fixedPrice'
                              ? 'fixedpricebox'
                              : 'timeauctbox'
                              } ${m.key === activeSaleModel
                                ? 'linearGradient'
                                : 'auctionbtn'
                              }`}
                            onClick={(e) => {
                              setSelectedCurrency('KLAY');
                              setActiveSaleModel(m.key);
                              e.preventDefault();
                            }}
                          >
                            {m.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                {(profileDetails?.role === 'admin' ||
                  profileDetails?.isSuperAdmin === true) &&
                  activeSaleModel === 'auction' && (
                    <div
                      className={`${activeSaleModel === 'auction' ? 'mt-2' : ``
                        }`}
                    >
                      <div
                        className={`text-14 font-semibold mb-2 ${error.price && 'err_occ'
                          }`}
                      >
                        {t('create.MinimumBid')}
                      </div>
                      <div className="relative d-flex relative_fld">
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

                {(profileDetails?.role === 'admin' ||
                  profileDetails?.isSuperAdmin === true) &&
                  activeSaleModel === 'auction' && (
                    <div className="row mt-4">
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
                        className={`col-6 ${error.startDateHandle && 'err_occ'
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

                <div className="row mb-4">
                  <div className="col">
                    {(profileDetails?.role === 'admin' ||
                      profileDetails?.isSuperAdmin === true) &&
                      activeSaleModel === 'fixedPrice' && (
                        <>
                          <div className="text-14 font-semibold mb-2">
                            {t('create.Price')}
                            <span className="text-danger"> * </span>
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
                  </div>
                </div>

                <div className="create_lab mt-2">
                  {t('create.chooseCollection')}
                </div>
                <div className="collectionitemwrp mt-2">
                  {(profileDetails?.role === 'admin' ||
                    profileDetails?.isSuperAdmin) && (
                      <>
                        {' '}
                        <div className="choosecol_dropdown_wrp">
                          <DropdownButton
                            id="dropdown-basic-button"
                            title={collections}
                            className={`choosecol_dropdown ${collections !== 'Select a collection'
                              ? 'notplaceholder'
                              : ''
                              }`}
                          >
                            <Dropdown.Item
                              onClick={() => getCollection('Clubrare Drop')}
                            >
                              {' '}
                              <button
                                key={0}
                                onClick={(e) => {
                                  setActiveCollectionId(-2);
                                  setCollectionAddress(
                                    localStorage.getItem('networkId') ===
                                      process.env.REACT_APP_KLATYN_NETWORK_ID
                                      ? process.env
                                        .REACT_APP_KLAYTN_ADMIN_MINTABLE_ADD
                                      : process.env
                                        .REACT_APP_ETH_ADMIN_MINTABLE_ADDRESS,
                                  );
                                  e.preventDefault();
                                }}
                                className={`collection-size ${-2 == activeCollectionId
                                  ? 'choose_collection_box_inner_active'
                                  : ''
                                  }`}
                              >
                                <p>Clubrare Drop</p>
                              </button>
                            </Dropdown.Item>
                          </DropdownButton>
                        </div>
                      </>
                    )}
                </div>
                <div className="create_lab mt-3 mb-2">
                  {t('create.Description')}
                </div>
                <textarea
                  className="col-12 relative_fld"
                  name="description"
                  value={description}
                  placeholder="Add a description"
                  onChange={(e) => {
                    inputClickHandler(e);
                  }}
                ></textarea>
                <p className="text-red justify-self-start mt-2 pl-2">
                  {error.description}
                </p>
                {error.description && (
                  <p className="text-red justify-self-start mt-2 pl-2">
                    {t('create.PleaseEnterDescription')}
                  </p>
                )}

                <div className="">
                  <div
                    className={`royalty_wrp ${error.royalties && 'err_occ'}`}
                  >
                    <div className="create_lab mt-3 mb-2">
                      {t('create.Royalties')}
                      <span className="text-danger"> * </span>
                    </div>
                    <div className="relative">
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
                      <div className="absolute top-0 right-0 text-gray3">%</div>
                    </div>
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {error.royalties}
                    </p>
                  </div>

                  <div className="row">
                    <div
                      className={`${!redeemable ? 'col-12' : 'col-12'} cat_wrp ${error.nftCategory && 'err_occ'
                        }`}
                    >
                      <div className="comn_site_dropdown">
                        <div className=" mt-4 mb-2 create_lab">
                          Category <span className="text-danger"> * </span>
                        </div>
                        <Dropdown onSelect={changecategory}>
                          <Dropdown.Toggle
                            variant="success"
                            className={`cmntitsel ${selectCategory !== 'Select Category'
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
                  <div className="">
                    <div className="w-full create_property_field_wrp">
                      <div className="mt-3 mb-2">
                        <span className="create_lab mt-4 mb-2">
                          {t('create.Properties')}
                        </span>
                      </div>
                      <div className="row property_field_wrp">
                        <div className="col-6 comn_site_dropdown size_cmn_site_dropdown">
                          <input
                            className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                            placeholder="Ex: Size"
                            name="key-1"
                            maxLength={10}
                          />
                        </div>

                        <div className="col-3 pr-0 mobil_res">
                          <div className="properties_size">
                            <input
                              className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                              name="value-1"
                              placeholder="Large"
                              maxLength={50}
                            />
                          </div>
                        </div>
                        <div className="col-3 addbtn_wrp properties_size createnewbtn_wrp mx-0 px-1 ">
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
                  </div>
                </div>

                {!redeemable ? (
                  ''
                ) : (
                  <div className='image-rule-style mt-6'>
                    <div className={`image-rule-style mt-4 ${category?.imageRules?.filter((x: any) => !x?.name?.startsWith('authentication_image'))?.length > 0 ? 'fileupload_main_sect' : ''}`}>
                      <div className=''>
                        {category?.imageRules?.filter((x: any) => !x?.name?.startsWith('authentication_image'))?.length > 0 && (
                          <>
                            <span>Product Photos</span>
                            <p>Showcase your item by uploading various photos</p>
                          </>
                        )
                        }
                      </div>
                      <div className='mt-4'>
                        {category?.imageRules?.filter((x: any) => !x?.name?.startsWith('authentication_image'))?.map((val: any, i: any) => {
                          return (
                            <>
                              <div
                                key={i}
                                className={`create_choosefile ${error.dynamicimgurl && 'err_occ'
                                  }`}
                              >
                                <h6>
                                  {' '}
                                  {val.description}
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
                                        onClick={() => removeImage(val.name, val)}
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

                    <div className={`image-rule-style mt-4 ${category?.imageRules?.filter((x: any) => x?.name?.startsWith('authentication_image'))?.length > 0 ? 'fileupload_main_sect' : ''}`}>
                      <div className=''>
                        {
                          category?.imageRules?.filter((x: any) => x?.name?.startsWith('authentication_image'))?.length > 0 && (
                            <>
                              <span>Authentication Photos</span>
                              <p>Add 3 photos to authenticate this item</p>
                            </>
                          )
                        }

                      </div>
                      <div className='mt-3'>
                        {category?.imageRules?.filter((x: any) => x?.name?.startsWith('authentication_image'))?.map((val: any, i: any) => {
                          return (
                            <>
                              <div
                                key={i}
                                className={`create_choosefile ${error.dynamicimgurl && 'err_occ'
                                  }`}
                              >
                                <h6>
                                  {/* {val.name} */}
                                  {/* {val.isRequired ? (
                                  <span className="text-danger"> * </span>
                                ) : null} */}
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
                                        onClick={() => removeImage(val.name, val)}
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
                )}

                {redeemable &&
                  <div className='redeemable_new_box_wrp mt-4'>
                    <div className='row mt-4'>
                      <div className='col-10'>
                        <span>Activate "Burn option"</span>
                        <p>
                          Destroy the digital NFT attached to the physical item
                          after redemption of the product
                        </p>
                      </div>
                      <div className='col-2 text-right'>
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
                            onChange={() => changeRedeemableTypeHandle(activeRedeemBurn ? 1 : 2)}
                            className='redeemable_new_box_switch'
                            id="material-switch"
                          />
                        </label>
                      </div>
                    </div>
                  </div >
                }
              </div >

              {/* admin section brand show */}
              < div className="text-right createitembbtnwrp" >
                <button
                  className={
                    createArtState !== `mint` ? `mintbtn disable` : `mintbtn`
                  }
                  onClick={handleModal}
                  disabled={createArtState !== 'mint'}
                >
                  {createArtState == 'minting' ? (
                    <div style={{ display: 'flex' }}>
                      <span style={{ marginLeft: '15px' }}>Creating...</span>
                    </div>
                  ) : (
                    'Create Item'
                  )}
                </button>
              </div >
            </div >
          </form >
        </div >
      </Layout >
    </>
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
          <h2>
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

export default AdminCreate;
