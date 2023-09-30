import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Select } from '../../../components';
import { LazylistingPutOnSaleAPiAction } from '../../../redux';
import { useCustomStableCoin } from '../../../hooks';
import {
  CbrNftforKlyContract,
  makeBrokerContractForKlytn,
  makeBrokerContractForEth,
  CbrNftforEthContract,
  getWeb3,
  GetCaver,
} from '../../../service/web3-service';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';
import { Modal } from 'react-bootstrap';
import { imgConstants } from '../../../assets/locales/constants';
import { klaytnWallConnCheck } from '../../../utils/klaytn-wallet-connection-check';

function PutOnSale(props: any) {
  const { customToWei } = useCustomStableCoin();
  const { t } = useTranslation();
  const history = useHistory();
  const [activeSaleModel, setActiveSaleModel] = useState('fixedPrice');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isPuttingOnSale, setIsPuttingOnSale] = useState(false);
  const [priceType, setPriceType] = useState('fixedPrice');
  const [expiryDateHandle, setExpiryDateHandle] = useState<any>('');
  const [startDateHandle, setStartDateHandle] = useState('');
  const [minExpiryDate, setMinExpirationDate] = useState<any>('');
  const [minExpiryDate1, setMinExpirationDate1] = useState<any>('');
  const [selectedCurrency, setSelectedCurrency] = useState('KLAY');
  const [isTokenGatedValue, setIsTokenGatedValue] = useState<boolean>(false);

  const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const agov_token_address = process.env.REACT_APP_AGOV_TOKEN_ADD;
  const weth_token_address = process.env.REACT_APP_WETH_TOKEN_ADD;
  const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
  const usdt_eth_token_address = process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();
  const usdt_klaytn_token_address = process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase();
  const brokerContractAddress =
    process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase();
  const klaytnbrokerAddress =
    process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase();
  const [hideCursor, setHideCursor] = useState(false);
  const profileDetails = useSelector(
    (state: any) => state.profileReducers.profile_details,
  );

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
  const [networkId, setNetworkId]: any = useState('');
  const [currencyOptions, setCurrencyOptions]: any = useState([
    { name: 'ETH', value: 'ETH' },
    { name: 'WETH', value: 'WETH' },
    { name: 'MPWR', value: 'MPWR' },
    { name: 'AGOV', value: 'AGOV' },
    { name: 'USDT', value: 'USDT' },
  ]);

  const wallet_address: any = localStorage.getItem('Wallet Address');
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  useEffect(() => {
    if (props?.network_id) {
      const network =
        Number(props?.network_id) == 1
          ? process.env.REACT_APP_NFT_NETWORK_ID
          : process.env.REACT_APP_KLATYN_NETWORK_ID;
      setNetworkId(network);
      if (network == klatynNetworkId) {
        setCurrencyOptions([
          { name: 'KLAY', value: 'KLAY' },
          { name: 'AGOV', value: 'AGOV' },
          { name: 'USDT', value: 'USDT' },
        ]);
        setSelectedCurrency('KLAY');
      } else {
        setCurrencyOptions([
          { name: 'ETH', value: 'ETH' },
          { name: 'WETH', value: 'WETH' },
          { name: 'MPWR', value: 'MPWR' },
          { name: 'AGOV', value: 'AGOV' },
          { name: 'USDT', value: 'USDT' },
        ]);
        setSelectedCurrency('ETH');
      }
    }
  }, [props?.network_id]);

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
  }, [props.show]);

  const onCurrencyChange = (selected: any) => {
    setSelectedCurrency(selected?.value);
  };

  const handleModal = () => {
    let errorMsg1 = '';
    let errorMsg5 = '';
    let errorMsg6 = '';
    const regex1 = /^[0-9][.\d]{0,17}$/;

    if (price === '') {
      errorMsg1 = 'cannot be empty';
    } else if (+price <= 0) {
      errorMsg1 = 'Price must be greater than 0';
    } else if (price.length >= 19) {
      errorMsg1 = 'Price should not more then 18 digit';
    } else if (!regex1.test(price)) {
      errorMsg1 = 'Please enter correct value';
    } else if (startDateHandle === '') {
      errorMsg5 = 'Cannot be empty. Please Select Start Date ';
    } else if (expiryDateHandle === '') {
      errorMsg6 = 'Cannot be empty. Please Select End Date';
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
      handlePutOnSale();
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
          setError({ ...error, title: 'cannot be empty' });
        } else {
          setError({ ...error, title: '' });
        }
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;

      case 'priceType':
        setPriceType(value);
        break;
      case 'price':
        const regex1 = /^[0-9][.\d]{0,17}$/;
        if (value === '') {
          setError({ ...error, price: 'cannot be empty' });
        } else if (value <= 0) {
          setError({ ...error, price: 'Price must be greater than 0' });
        } else if (value.length >= 19) {
          setError({ ...error, price: 'Price should not more then 18 digit' });
        } else if (!regex1.test(value)) {
          setError({ ...error, price: 'Please enter correct value' });
        } else {
          setError({ ...error, price: '' });
        }
        setPrice(value);
        break;

      default:
        break;
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
  const getSignatureForLazyListing = async (noncedata: any) => {
    const startTime = await getStartTime();
    const endTime = priceType === 'fixedPrice' ? 0 : await geteEndTime();
    const auctionTypeval = priceType === 'fixedPrice' ? '1' : '2';
    const ordertype = props.itemDetails?.redeemable ? 1 : 0;
    if (
      localStorage.getItem('networkId') ===
      process.env.REACT_APP_KLATYN_NETWORK_ID
    ) {
      const paymenttype =
        selectedCurrency === 'AGOV'
          ? agov_token_address
          : selectedCurrency === 'USDT'
            ? usdt_klaytn_token_address
            : '0x0000000000000000000000000000000000000000';
      await klaytnWallConnCheck();
      const { caver }: any = await GetCaver();

      const amount1 = await customToWei(price, caver, paymenttype);
      const sign_signature =
        '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const hashdata = {
        seller: props.itemDetails?.collectible_owner,
        contractAddress: props.itemDetails?.collection_address,
        royaltyFee: props.itemDetails.royalties * 100,
        royaltyReceiver: props.itemDetails?.userObj?.wallet_address,
        paymentToken: paymenttype,
        basePrice: amount1.toString(),
        listingTime: startTime,
        expirationTime: endTime,
        nonce: noncedata,
        tokenId: props.itemDetails?.token_id ? props.itemDetails?.token_id : 0,
        orderType: ordertype,
        signature1: sign_signature,
        uri: props.itemDetails?.ipfs_hash,
        objId: props.itemDetails?._id.toString(),
        isTokenGated: isTokenGatedValue,
        tokenGateAddress: isTokenGatedValue
          ? process.env.REACT_APP_KLAYTN_TOKEN_BASED_SALE_ADD
          : '0x0000000000000000000000000000000000000000',
        // isEscrow: false,
        // isMetamask: false,
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
        // hashdata.isEscrow,
        // hashdata.isMetamask,
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
              setIsPuttingOnSale(false);
              props.disableCursor(false);
              setHideCursor(false);
              props.onHide();
              setPrice('');
              return;
            }
            const signature = result.result;
            callPutOnSaleApi(
              signature,
              amount1.toString(),
              auctionTypeval,
              paymenttype,
              noncedata,
              startTime,
              endTime,
              hashdata.tokenGateAddress,
            );
          },
        );
      } catch (err) {
        setIsPuttingOnSale(false);
        props.disableCursor(false);
        setHideCursor(false);
        props.onHide();
        setPrice('');
      }
    } else {
      const { web3 }: any = await getWeb3();
      const paymenttype =
        selectedCurrency === 'WETH'
          ? weth_token_address
          : selectedCurrency === 'MPWR'
            ? mpwr_token_address
            : selectedCurrency === 'AGOV'
              ? agov_eth_token_address
              : selectedCurrency === 'USDT'
                ? usdt_eth_token_address
                : '0x0000000000000000000000000000000000000000';

      const amount1 = await customToWei(price, web3, paymenttype);

      const tokenGateAddress: any = isTokenGatedValue
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
        primaryType: 'Order',
        domain: {
          name: 'Clubrare Marketplace',
          version: '1.0.1',
          chainId: process.env.REACT_APP_NFT_NETWORK_ID,
          verifyingContract: process.env.REACT_APP_ETH_BROKER_VALIDATOR,
        },
        message: {
          seller: props.itemDetails?.collectible_owner,
          contractAddress: props.itemDetails?.collection_address,
          royaltyFee: props.itemDetails.royalties * 100,
          royaltyReceiver: props.itemDetails?.userObj?.wallet_address,
          paymentToken: paymenttype,
          basePrice: amount1.toString(),
          listingTime: startTime,
          expirationTime: endTime,
          nonce: noncedata,
          tokenId: props.itemDetails?.token_id
            ? props.itemDetails?.token_id
            : 0,
          orderType: ordertype,
          uri: props.itemDetails?.ipfs_hash,
          objId: props.itemDetails?._id.toString(),
          isTokenGated: isTokenGatedValue,
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
            setIsPuttingOnSale(false);
            props.disableCursor(false);
            setHideCursor(false);
            props.onHide();
            setPrice('');
            return;
          }
          const signature = result.result;
          callPutOnSaleApi(
            signature,
            amount1.toString(),
            auctionTypeval,
            paymenttype,
            noncedata,
            startTime,
            endTime,
            tokenGateAddress,
          );
        },
      );
    }
    window.onbeforeunload = function () {
      return 'If you reload this page, your previous action will be repeated';
    };
  };
  const callPutOnSaleApi = async (
    signature: string,
    amount: string,
    auctionType: string,
    ercToken: any,
    nonce: any,
    startTime: any,
    endTime: any,
    tokenGateAddressValue: any,
  ) => {
    setIsPuttingOnSale(false);
    props.disableCursor(false);
    setHideCursor(false);

    const apiquery = {
      _id: props.itemDetails?._id,
      auctionType: auctionType,
      amount: amount,
      erc20_address: ercToken,
      nonce: nonce,
      signature: signature,
      startingTime: startTime,
      closingTime: endTime,
      isTokenGated: isTokenGatedValue,
      tokenGateAddress: tokenGateAddressValue,
    };
    if (signature) {
      await dispatch(LazylistingPutOnSaleAPiAction(apiquery));
      props.getItemDetails();
      props.onHide();
      setPrice('');
    }
  };
  //  new function
  const handlePutOnSale = async () => {
    setIsPuttingOnSale(true);
    props.disableCursor(true);
    setHideCursor(true);
    if (
      localStorage.getItem('networkId') ===
      process.env.REACT_APP_KLATYN_NETWORK_ID
    ) {
      await klaytnWallConnCheck();
      const { CbrforKlyContr }: any = await CbrNftforKlyContract(
        props.itemDetails?.collection_address,
        true,
      );
      const { brokerContract }: any = await makeBrokerContractForKlytn(
        klaytnbrokerAddress,
        true,
      );
      try {
        if (profileDetails?.role === 'user' && !profileDetails?.isSuperAdmin) {
          if (props.itemDetails?.token_id) {
            let approvedAddress = await CbrforKlyContr.methods
              .getApproved(props.itemDetails?.token_id)
              .call();
            if (
              approvedAddress?.toLowerCase() !==
              klaytnbrokerAddress?.toLowerCase()
            ) {
              await CbrforKlyContr.methods
                .approve(klaytnbrokerAddress, props.itemDetails?.token_id)
                .send({ from: wallet_address, gas: null });
              addToast(`Approved successfully`, {
                appearance: 'success',
                autoDismiss: true,
              });
            }
          }
          const nonceRes = await brokerContract.methods
            .getCurrentOrderNonce(wallet_address)
            .call();

          if (nonceRes) {
            getSignatureForLazyListing(nonceRes);
          }
        } else {
          let nonceRes = await brokerContract.methods
            .getCurrentOrderNonce(brokerContract._address)
            .call();
          if (nonceRes) {
            getSignatureForLazyListing(nonceRes);
          }
        }
      } catch (error) {        
        props.onHide();
        setIsPuttingOnSale(false);
        props.disableCursor(false);
        setHideCursor(false);
        setPrice('');
      }
    } else {
      const { CbrforEthContr }: any = await CbrNftforEthContract(
        props.itemDetails?.collection_address,
      );
      const { brokerContract }: any = await makeBrokerContractForEth(
        brokerContractAddress,
        true,
      );
      try {
        if (profileDetails?.role === 'user' && !profileDetails?.isSuperAdmin) {
          if (props.itemDetails?.token_id) {
            let approvedAddress = await CbrforEthContr.methods
              .getApproved(props.itemDetails?.token_id)
              .call();
            if (
              approvedAddress?.toLowerCase() !==
              brokerContractAddress?.toLowerCase()
            ) {
              await CbrforEthContr.methods
                .approve(brokerContractAddress, props.itemDetails?.token_id)
                .send({ from: wallet_address });
              addToast(`Approved successfully`, {
                appearance: 'success',
                autoDismiss: true,
              });
            }
          }
          const nonceRes = await brokerContract.methods
            .getCurrentOrderNonce(wallet_address)
            .call();

          if (nonceRes) {
            getSignatureForLazyListing(nonceRes);
          }
        } else {
          let nonceRes = await brokerContract.methods
            .getCurrentOrderNonce(brokerContract._address)
            .call();

          if (nonceRes) {
            getSignatureForLazyListing(nonceRes);
          }
        }
      } catch (error) {
        props.onHide();
        setIsPuttingOnSale(false);
        props.disableCursor(false);
        setHideCursor(false);
        setPrice('');
      }
    }
  };

  const salesModels = [
    {
      key: 'fixedPrice',
      title: t('create.FixedPrice'),
      priceType: 'fixedPrice',
    },
    { key: 'auction', title: t('create.Auction'), priceType: 'auction' },
  ];

  const handleStartDate = (e: any) => {
    const dateValue = e.target.value;
    const id = e.target.id;

    const endDateAndTime = moment(dateValue).format('YYYY-MM-DDTHH:mm');
    const currentDateAndTime = moment().format('YYYY-MM-DDTHH:mm');
    //new Date(dateValue) <= new Date()
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
            style={{ pointerEvents: hideCursor ? 'none' : 'auto' }}
          >
            <div>
              <div className="mt-9 md:mt-0 mb-4">
                {/* {t("productPage.PutOnSale.ChooseYourSalesModel")} */}
                {t('Put On Sale')}
              </div>
            </div>
            <button
              className="put_sale_close_wrp"
              onClick={(e) => {
                props.onHide();
                setPrice('');
                setError({ ...error, price: '' });
              }}
            >
              <img src={imgConstants.hamburgerClose} alt="hamburgerClose" />
            </button>
            <form className="mt-5 w-full flex flex-col fixed_price_form">
              <div className="auction_btn_wrp text-center form_input_wrp">
                <div>
                  {salesModels?.map((m) => (
                    <button
                      key={m.key}
                      className={`button-connect  ${m.key === activeSaleModel
                          ? 'fixed_price_btn'
                          : 'auction_btn'
                        }`}
                      onClick={(e) => {
                        setActiveSaleModel(m.key);
                        e.preventDefault();
                        inputClickHandler({
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
              {profileDetails?.role === 'admin' ||
                profileDetails?.isSuperAdmin ? (
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
                        onClick={() => setIsTokenGatedValue(true)}
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
                        onClick={() => setIsTokenGatedValue(false)}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
              ) : null}
              {activeSaleModel === 'fixedPrice' && (
                <>
                  <div className="form_input_wrp">
                    <label className="text-18 text-blue font-semibold">
                      {t('productPage.PutOnSale.Price')}{' '}
                      <span className="req_field"> * </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="responsive-placeholder bg-transparent border-b-2 border-solid border-white py-1.5 w-full"
                        placeholder={`0.00 ${selectedCurrency}`}
                        value={price}
                        name="price"
                        onChange={inputClickHandler}
                      />
                      <div className="absolute top-0 right-0 flex items-center space-x-2">
                        {
                          <Select
                            value={selectedCurrency}
                            selectValueChange={onCurrencyChange}
                            options={currencyOptions}
                            width="w-24"
                          />
                        }
                      </div>
                    </div>
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {error.price}
                    </p>
                  </div>
                </>
              )}
              {activeSaleModel === 'auction' && (
                <div className="flex flex-col space-y-5 w-full">
                  <div className="fixed_price_wrp form_input_wrp">
                    <label className="text-18 text-blue font-semibold mb-2">
                      {t('productPage.PutOnSale.MinimumBid')}{' '}
                      <span className="req_field"> * </span>
                    </label>
                    <div className="flex items-center justify-between minimum_bid_wrp">
                      <div className="w-full">
                        <input
                          type="number"
                          className="responsive-placeholder bg-transparent border-b-2 border-solid border-white w-full minimumbid"
                          placeholder={`0.00 ${selectedCurrency}`}
                          value={price}
                          name="price"
                          onChange={inputClickHandler}
                        />
                      </div>
                      <div className="top-0 right-0 flex items-center space-x-2">
                        <Select
                          value={selectedCurrency}
                          selectValueChange={onCurrencyChange}
                          options={currencyOptions}
                          width="w-24"
                        />
                      </div>
                    </div>
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {error.price}
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
                        value={startDateHandle}
                        onChange={(e) => {
                          handleStartDate(e);
                        }}
                        min={minExpiryDate}
                        type="datetime-local"
                        id="meeting-time-start"
                        name="meeting-time"
                      />
                      <p className="text-red justify-self-start mt-2 pl-2">
                        {error.startDateHandle}
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
                        value={expiryDateHandle}
                        onChange={(e) => {
                          handleExpiry(e.target.value);
                        }}
                        min={'2022-02-28T12:20'}
                        type="datetime-local"
                        id="meeting-time-end"
                        name="meeting-time"
                      />
                      <p className="text-red justify-self-start mt-2 pl-2">
                        {error.expiryDateHandle}
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
                    setPrice('');
                    setError({ ...error, price: '' });
                  }}
                >
                  cancel
                </button>

                <div
                  className=""
                  style={
                    isPuttingOnSale
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
                      handleModal();
                    }}
                    disabled={isPuttingOnSale}
                  >
                    {isPuttingOnSale
                      ? 'Loading...'
                      : t('productPage.PutOnSale.PutOnSale')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PutOnSale;
