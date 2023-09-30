import { useEffect, useState, memo } from 'react';
import moment from 'moment';
import {
  CheckCurrency,
  CheckCurrencyMetaMask,
  EnableEthereum,
  EnableKlyten,
  GetCaver,
  getWeb3,
  CbrNftforEthContract,
  makeBrokerContractForKlytn,
  makeBrokerContractForEth,
  CbrNftforKlyContract,
} from '../../service/web3-service';
import './offer.scss';
import { useToasts } from 'react-toast-notifications';
import { imgConstants } from '../../assets/locales/constants';
import { eventsAction } from '../../redux';
import { useDispatch } from 'react-redux';
import Tooltip from 'react-simple-tooltip';
import { useHistory } from 'react-router-dom';
import { klaytnWallConnCheck } from '../../utils/klaytn-wallet-connection-check';
import { useCustomStableCoin } from '../../hooks';

type list = {
  collection_address: string;
  token_id: string | null;
  signature: string;
  nonce: string;
  seller: string;
  bidder: string;
  amount: string;
  time: string;
  ERC20Address: string;
  is_active: boolean;
  _id: string;
  name: string | null;
  image: string;
  currency_symbol: string;
  converted_amount: string | null;
  accept_off_loading: boolean;
  cancel_bid_loading: boolean;
};

const OfferDetail = ({
  data,
  itemDetails,
  network_id,
  setHideCursorReset,
  offerItemChanges,
  itemDetailChanges,
  descriptionSwitch,
  profileDetailsCheck,
}: any) => {
  const { customFromWei } = useCustomStableCoin();
  const wallet_address = localStorage.getItem('Wallet Address')?.toLowerCase();
  const klytn_network_id = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const broker_address = process.env.REACT_APP_BROKER_ADDRESS;
  const klaytnbrokerAddress =
    process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase();

  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [showItems, setShowItems] = useState<Array<list>>([]);

  const { addToast } = useToasts();

  // Wei price converter function for klaytn and eth case
  const getWeiPrice = async (price: any, ERC20Address: any) => {
    if (network_id === process.env.REACT_APP_KLATYN_NETWORK_ID) {
      const { caver }: any = await GetCaver();
      try {
        const pr = await customFromWei(price?.toString(), caver, ERC20Address);
        return pr;
      } catch (err) {}
    } else {
      const { web3 }: any = await EnableEthereum(true);
      try {
        const pr = await customFromWei(price?.toString(), web3, ERC20Address);
        return pr;
      } catch (err) {}
    }
  };

  // useEffect to add converted_amount, accept_off_loading and cancel_bid_loading key in existing offer item array
  useEffect(() => {
    const convertAmount = async () => {
      const showItems: list[] = await Promise.all(
        data.map(async (item: list): Promise<list> => {
          if (item?.amount) {
            const result = await getWeiPrice(item?.amount, item?.ERC20Address);
            if (network_id == klytn_network_id) {
              const res: any = await CheckCurrency(item?.ERC20Address);
              item['currency_symbol'] = res?.name;
            } else {
              const res: any = await CheckCurrencyMetaMask(item?.ERC20Address);
              item['currency_symbol'] = res?.name;
            }
            item['converted_amount'] = result;
          } else {
            item['converted_amount'] = null;
          }
          item['accept_off_loading'] = false;
          item['cancel_bid_loading'] = false;
          return item;
        }),
      );
      if (showItems.length > 0) {
        setShowItems(showItems);
      }
    };
    convertAmount();
  }, [data]);

  // Broker validation contract handler
  const brokerValidatorHandler = async (
    validatorContranct: any,
    brokerContract: any,
    bidTuple: any,
  ) => {
    const brokerValidRes = await validatorContranct.methods
      ._verifyBidSig(bidTuple)
      .call();
    if (brokerValidRes && brokerValidRes[0]) {
      const isSigInvalid = await brokerContract.methods
        .cancelledOrFinalized(brokerValidRes[0])
        .call();
      return isSigInvalid;
    } else {
      return true;
    }
  };

  // Inner accept offer handler for contract method call
  const offerMethodHandler = async (
    currElm: any,
    brokerContract: any,
    orderTuple: any,
    bidTuple: any,
  ) => {
    let currIndex: any;
    for (let i = 0; i < showItems.length; i++) {
      if (showItems[i]._id === currElm?._id) {
        currIndex = i;
        showItems[i].accept_off_loading = true;
      }
    }
    let sendObj: any = { from: wallet_address };
    let isSigInvalid = false;
    if (
      localStorage.getItem('networkId') ===
      process.env.REACT_APP_KLATYN_NETWORK_ID
    ) {
      sendObj = { from: wallet_address, gas: null };
      // send_obj = JSON.stringify({ from: wallet_address, gas: null });
      const { brokerValidatorContract }: any = await EnableKlyten();
      isSigInvalid = await brokerValidatorHandler(
        brokerValidatorContract,
        brokerContract,
        bidTuple,
      );
    } else {
      const { brokerValidatorContract }: any = await EnableEthereum();
      isSigInvalid = await brokerValidatorHandler(
        brokerValidatorContract,
        brokerContract,
        bidTuple,
      );
    }
    if (isSigInvalid) {
      addToast('There is some issue, Please try again later', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
    try {
      setHideCursorReset(true);
      const res: any = await brokerContract.methods
        .acceptOffer(
          orderTuple,
          bidTuple,
          currElm?.bidder,
          currElm?.amount.toString(),
        )
        .send(sendObj);
      if (res) {
        const req = {
          transaction_hash: res.transactionHash,
          contract_address: brokerContract._address,
          network_id: itemDetails?.network_id,
        };
        await dispatch(eventsAction(req));
        showItems[currIndex].accept_off_loading = false;
        setHideCursorReset(false);
        addToast('Accept offer successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
        itemDetailChanges();
        descriptionSwitch();
      } else {
        showItems[currIndex].accept_off_loading = false;
        setHideCursorReset(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
        setShowLoading(false);
      }
    } catch (error: any) {
      showItems[currIndex].accept_off_loading = false;
      setHideCursorReset(false);
      setShowLoading(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };
  // Inner cancel bid handler for contract method call
  const offerCancelMethodHandler = async (
    currElm: any,
    brokerContract: any,
    bidTuple: any,
  ) => {
    let currIndex: any;
    for (let i = 0; i < showItems.length; i++) {
      if (showItems[i]._id === currElm?._id) {
        currIndex = i;
        showItems[i].cancel_bid_loading = true;
      }
    }

    try {
      let res: any;
      if (
        localStorage.getItem('networkId') ===
        process.env.REACT_APP_KLATYN_NETWORK_ID
      ) {
        const sendObj = { from: wallet_address, gas: null };
        res = await brokerContract.methods
          .invalidateSignedBid(bidTuple)
          .send(sendObj);
      } else {
        const sendObj: any = { from: wallet_address };
        res = await brokerContract.methods
          .invalidateSignedBid(bidTuple)
          .send(sendObj);
      }
      setHideCursorReset(true);

      if (res) {
        const req = {
          transaction_hash: res.transactionHash,
          contract_address: brokerContract._address,
          network_id: itemDetails?.network_id,
        };
        await dispatch(eventsAction(req));
        showItems[currIndex].cancel_bid_loading = false;
        setHideCursorReset(false);
        addToast(' Offer cancel successfully', {
          appearance: 'error',
          autoDismiss: true,
        });
        offerItemChanges();
        itemDetailChanges();
      } else {
        showItems[currIndex].cancel_bid_loading = false;
        setHideCursorReset(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (error: any) {
      showItems[currIndex].cancel_bid_loading = false;
      setHideCursorReset(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const showValue = (amount: string) => {
    let finalValue = '';
    if (amount.includes('.')) {
      const findValIndex = amount.indexOf('.');
      const replaceDot = amount.replace('.', '');
      if (replaceDot.length >= 4) {
        const isFormatedValue = replaceDot.toString().substring(0, 3) + '...';
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
      if (amount.length >= 4) {
        finalValue = amount.toString().substring(0, 3) + '...';
      } else {
        finalValue = amount ? amount : '';
      }
    }
    return finalValue;
  };

  const OfferItem = ({ ele, index }: any) => {
    const history = useHistory();
    const [showLoading, setShowLoading] = useState<boolean>(false);
    const bidTimeConvt: any = Math.round(new Date(ele?.time).getTime() / 1000);
    const ordertype = itemDetails?.redeemable ? 1 : 0;
    const tokenIdCheck = itemDetails?.token_id ? itemDetails?.token_id : 0;
    const noncedata = Number(ele?.nonce);
    const expirationTime = 0;

    const getApprovalForAcceptOffer = async () => {
      showItems[index].accept_off_loading = true;
      setHideCursorReset(true);
      setShowLoading(true);

      if (
        localStorage.getItem('networkId') ===
        process.env.REACT_APP_KLATYN_NETWORK_ID
      ) {
        await klaytnWallConnCheck();
        const { brokerContract }: any = await makeBrokerContractForKlytn(
          klaytnbrokerAddress,
          true,
        );
        const { CbrforKlyContr }: any = await CbrNftforKlyContract(
          itemDetails?.collection_address,
          true,
        );

        try {
          if (
            profileDetailsCheck?.role === 'user' &&
            !profileDetailsCheck.isSuperAdmin
          ) {
            if (itemDetails?.token_id) {
              let approvedAddress = await CbrforKlyContr.methods
                .getApproved(itemDetails?.token_id)
                .call();
              if (
                approvedAddress.toLowerCase() !==
                klaytnbrokerAddress?.toLowerCase()
              ) {
                await CbrforKlyContr.methods
                  .approve(klaytnbrokerAddress, itemDetails?.token_id)
                  .send({ from: wallet_address, gas: null });
                addToast(`Approved successfully`, {
                  appearance: 'success',
                  autoDismiss: true,
                });
              }
            }
            let nonceRes = await brokerContract.methods
              .getCurrentOrderNonce(wallet_address)
              .call();
            if (nonceRes) {
              getSignatureforAcceptOffer(nonceRes);
            }
          } else {
            let nonceRes = await brokerContract.methods
              .getCurrentOrderNonce(brokerContract._address)
              .call();

            if (nonceRes) {
              getSignatureforAcceptOffer(nonceRes);
            }
          }
        } catch (err) {
          showItems[index].accept_off_loading = false;
          setHideCursorReset(false);
          setShowLoading(false);
          return false;
        }
      } else {
        try {
          const { CbrforEthContr }: any = await CbrNftforEthContract(
            itemDetails?.collection_address,
          );

          const { brokerContract }: any = await makeBrokerContractForEth(
            broker_address,
            true,
          );
          if (
            profileDetailsCheck?.role === 'user' &&
            !profileDetailsCheck.isSuperAdmin
          ) {
            if (itemDetails?.token_id) {
              let approvedAddress = await CbrforEthContr.methods
                .getApproved(itemDetails?.token_id)
                .call();
              if (
                approvedAddress?.toLowerCase() !== broker_address?.toLowerCase()
              ) {
                await CbrforEthContr.methods
                  .approve(broker_address, itemDetails?.token_id)
                  .send({ from: wallet_address });
                addToast(`Approved successfully`, {
                  appearance: 'success',
                  autoDismiss: true,
                });
              }
            }
            let nonceRes = await brokerContract.methods
              .getCurrentOrderNonce(wallet_address)
              .call();

            if (nonceRes) {
              getSignatureforAcceptOffer(nonceRes);
            }
          } else {
            let nonceRes = await brokerContract.methods
              .getCurrentOrderNonce(brokerContract._address)
              .call();

            if (nonceRes) {
              getSignatureforAcceptOffer(nonceRes);
            }
          }
        } catch (err) {
          showItems[index].accept_off_loading = false;
          setHideCursorReset(false);
          setShowLoading(false);
          return false;
        }
      }
    };

    // work on order signature
    const getSignatureforAcceptOffer = async (nonce: string) => {
      setShowLoading(true);
      if (
        localStorage.getItem('networkId') ===
        process.env.REACT_APP_KLATYN_NETWORK_ID
      ) {
        await klaytnWallConnCheck();
        const { caver }: any = await GetCaver();
        const sign_signature =
          '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
        const hashdata = {
          seller: ele?.seller?.toString(),
          contractAddress: ele?.collection_address.toString(),
          royaltyFee: itemDetails?.royalties ? itemDetails?.royalties * 100 : 0,
          royaltyReceiver: itemDetails?.userObj?.wallet_address?.toString(),
          paymentToken: ele?.ERC20Address,
          basePrice: ele?.amount.toString(),
          listingTime: 0,
          expirationTime: expirationTime,
          nonce: noncedata,
          tokenId: tokenIdCheck,
          orderType: ordertype,
          signature1: sign_signature,
          uri: itemDetails?.ipfs_hash,
          objId: itemDetails?._id,
          isTokenGated: false,
          tokenGateAddress: '0x0000000000000000000000000000000000000000',
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
                showItems[index].accept_off_loading = false;
                setHideCursorReset(false);
                setShowLoading(false);
                return;
              }
              const signature = result.result;
              acceptOfferHandler(signature);
            },
          );
        } catch (err) {
          showItems[index].accept_off_loading = false;
          setHideCursorReset(false);
          setShowLoading(false);
          return false;
        }
      } else {
        const { web3 }: any = await getWeb3();
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
            seller: ele?.seller?.toString(),
            contractAddress: ele?.collection_address.toString(),
            royaltyFee: itemDetails?.royalties
              ? itemDetails?.royalties * 100
              : 0,
            royaltyReceiver: itemDetails?.userObj?.wallet_address?.toString(),
            paymentToken: ele?.ERC20Address,
            basePrice: ele?.amount,
            listingTime: 0,
            expirationTime: expirationTime,
            nonce: noncedata,
            tokenId: tokenIdCheck,
            orderType: ordertype,
            uri: itemDetails?.ipfs_hash,
            objId: itemDetails?._id,
            isTokenGated: false,
            tokenGateAddress: '0x0000000000000000000000000000000000000000',
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
              showItems[index].accept_off_loading = false;
              setHideCursorReset(false);
              setShowLoading(false);
              return false;
            }
            const signature = result.result;
            acceptOfferHandler(signature);
          },
        );
      }
    };
    // end order tupple signture
    // Accept offer main handler for klaytn and Eth case
    const acceptOfferHandler = async (signature: string) => {
      // Bid Tuple
      const bidTuppleArray = [
        ele?.seller.toString(),
        ele?.bidder.toString(),
        ele?.collection_address,
        ele?.ERC20Address,
        ele?.amount.toString(),
        bidTimeConvt ? bidTimeConvt : 0,
        expirationTime,
        noncedata,
        tokenIdCheck,
        ele?.signature,
        itemDetails?._id,
        ele?._id,
      ];
      // Order Tuple
      const orderTuppleArray = [
        ele?.seller?.toString(),
        ele?.collection_address,
        itemDetails?.royalties ? itemDetails?.royalties * 100 : 0,
        itemDetails?.userObj?.wallet_address?.toString(),
        ele?.ERC20Address,
        ele?.amount.toString(),
        0,
        0,
        noncedata,
        tokenIdCheck,
        ordertype,
        signature,
        itemDetails?.ipfs_hash,
        itemDetails?._id,
        false,
        '0x0000000000000000000000000000000000000000',
        false,
        false
      ];

      try {
        if (
          localStorage.getItem('networkId') ===
          process.env.REACT_APP_KLATYN_NETWORK_ID
        ) {
          const { brokerContract }: any = await EnableKlyten(true);
          await offerMethodHandler(
            ele,
            brokerContract,
            orderTuppleArray,
            bidTuppleArray,
          );
        } else {
          const { brokerContract }: any = await EnableEthereum(true);
          await offerMethodHandler(
            ele,
            brokerContract,
            orderTuppleArray,
            bidTuppleArray,
          );
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        showItems[index].accept_off_loading = false;
        setHideCursorReset(false);
        setShowLoading(false);

        return false;
      }
    };

    // Cancel bid main handler for klaytn and Eth case
    const cancelBidHandler = async () => {
      
      
   showItems[index].accept_off_loading = true;
   setHideCursorReset(true);
   setShowLoading(true);



      const bidArray = [
        ele?.seller.toString(),
        ele?.bidder.toString(),
        ele?.collection_address,
        ele?.ERC20Address,
        ele?.amount.toString(),
        bidTimeConvt ? bidTimeConvt : 0,
        expirationTime,
        noncedata,
        tokenIdCheck,
        ele?.signature,
        itemDetails?._id,
        ele?._id,
      ];
      try {
        if (
          localStorage.getItem('networkId') ===
          process.env.REACT_APP_KLATYN_NETWORK_ID
        ) {
          const { brokerContract }: any = await EnableKlyten(true);
          await offerCancelMethodHandler(ele, brokerContract, bidArray);
        } else {
          const { brokerContract }: any = await EnableEthereum(true);
          await offerCancelMethodHandler(ele, brokerContract, bidArray);
        }
      } catch (err: any) {
        setShowLoading(false);
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
           showItems[index].accept_off_loading = false;
           setHideCursorReset(false);
           setShowLoading(false);

         
        return false;
      }
    };

    const goToProfile = () => {
      if (itemDetails?.collection_address) {
        history.push(`/${ele?.bidder}`);
      }
    };

    return (
      <tr>
        <td className="firstclmn">
          <div className="description_inn d-flex justify-content-center align-items-center">
            <div className="img_wrp">
              <figure>
                <img src={ele?.image || imgConstants.avatar} alt="avatar" />
              </figure>
            </div>
            <div className="text_wrp  align-center" onClick={goToProfile}>
              <p>
                {ele?.name}
                <p>
                  {ele?.bidder
                    ? ele?.bidder.toString().substring(0, 5) +
                      '...' +
                      ele?.bidder.toString().substring(ele?.bidder.length - 6)
                    : ''}
                </p>
              </p>
            </div>
          </div>
        </td>
        <td className="secnclmn">
          <div className="history_price_wrp">
            <p className="text-left">
              <Tooltip
                className="cardtooltip_wrp"
                content={ele?.converted_amount}
              >
                <span>
                  {ele?.converted_amount
                    ? showValue(ele?.converted_amount)
                    : ''}
                </span>
              </Tooltip>
              {ele?.converted_amount && ele?.converted_amount.length > 0 && (
                <span>{` ${ele?.currency_symbol}`}</span>
              )}
            </p>
          </div>
        </td>
        <td className="thirdclmn">
          <p>{moment(ele?.time).format('MM/DD/YYYY, hh:mm A')}</p>
        </td>
        <td className="fourthclmn">
          {(((profileDetailsCheck?.role === 'admin' ||
            profileDetailsCheck?.isSuperAdmin) &&
            (itemDetails?.collectible_owner?.toLowerCase() ===
              process.env.REACT_APP_BROKER_ADDRESS?.toLowerCase() ||
              itemDetails?.collectible_owner?.toLowerCase() ===
                process.env.REACT_APP_KLYTN_BROKER_ACCOUNT?.toLowerCase())) ||
            (profileDetailsCheck?.role === 'user' &&
              wallet_address &&
              wallet_address === ele?.seller?.toLowerCase())) && (
            <button
              type="button"
              onClick={() => getApprovalForAcceptOffer()}
              className={`${
                showLoading || ele?.accept_off_loading ? 'disablebtn' : ''
              }`}
              disabled={showLoading || ele?.accept_off_loading}
            >
              {showLoading || ele?.accept_off_loading
                ? 'Loading...'
                : 'Accept Offer'}
            </button>
          )}
          {/* itemDetails?.on_sale &&  */}
          {wallet_address && wallet_address === ele?.bidder?.toLowerCase() && (
            <button
              type="button"
              onClick={cancelBidHandler}
              className={`${
                showLoading || ele?.cancel_bid_loading ? 'disablebtn' : ''
              }`}
              disabled={showLoading || ele?.cancel_bid_loading}
            >
              {showLoading || ele?.cancel_bid_loading
                ? 'Loading...'
                : 'Cancel Offer'}
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <table>
      <thead>
        <tr>
          <th className="firstclmn">Bidder</th>
          <th className="secnclmn">Offer Amount</th>
          <th className="thirdclmn">Time</th>
          <th className="fourthclmn">Action</th>
        </tr>
      </thead>
      <tbody>
        {showItems
          ?.sort((a: any, b: any) => (a.time < b.time ? 1 : -1))
          .map((ele: any, index: number) => (
            <>
              <OfferItem ele={ele} index={index} />
            </>
          ))}
      </tbody>
    </table>
  );
};

export default memo(OfferDetail);
