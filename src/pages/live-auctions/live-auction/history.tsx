import React, { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import {
  CheckCurrency,
  CheckCurrencyMetaMask,
  EnableEthereum,
  GetCaver,
} from '../../../service/web3-service';
import { imgConstants } from '../../../assets/locales/constants';
import { useCommonWalletConnection, useCustomStableCoin } from '../../../hooks';

function History({ wrapperClass, bids, network_id }: any) {
  const { customFromWei } = useCustomStableCoin();

  const itemDetails: any = useSelector(
    (state: any) => state.itemDetailsReducer.details,
  );

  const auctionEnded = false;
  const auctionNotStarted = false;
  const klytn_network_id = process.env.REACT_APP_KLATYN_NETWORK_ID;
  const [showItems, setShowItems] = useState<any>([]);

  useEffect(() => {
    const convertAmount = async () => {
      const showItems: any[] = await Promise.all(
        bids.map(async (item: any): Promise<any> => {
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
          return item;
        }),
      );
      if (showItems.length > 0) {
        setShowItems(showItems);
      }
    };
    convertAmount();
  }, [bids]);

  const getWeiPrice = async (price: any, ercAddress: string) => {
    if (network_id === process.env.REACT_APP_KLATYN_NETWORK_ID) {
      const { caver }: any = await GetCaver();
      try {
        const pr = await customFromWei(price?.toString(), caver, ercAddress);
        return pr;
      } catch (err) {}
    } else {
      const { web3 }: any = await EnableEthereum(true);
      try {
        const pr = await customFromWei(price?.toString(), web3, ercAddress);
        return pr;
      } catch (err) {}
    }
  };

  const HistoryItem = ({ wrapperClass, auctionEnded, ele }: any) => {
    const { bidder, type, buyer, seller, to, currency_symbol } = ele;

    let dataAddress = '';

    if (type === 'TRANSFER') {
      dataAddress = to;
    } else if (type === 'BID') {
      dataAddress = bidder;
    } else if (type === 'PURCHASED') {
      dataAddress = buyer;
    } else if (type === 'LISTED') {
      dataAddress = seller;
    }

    const [amount, setAmount] = useState<any>();
    const [userImage, setUserImage] = useState<any>();
    useEffect(() => {
      setAmount(ele.converted_amount);
      setUserImage(ele.image);
    }, [ele.converted_amount]);

    const history = useHistory();

    const goToProfile = () => {
      if (itemDetails?.collection_address) {
        history.push(`/${dataAddress}`);
      }
    };

    function truncateDecimals(num: any, digits: any) {
      const numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;
      return finalResult;
    }

    return (
      <>
        <div className="user_history_wrp">
          <div className="row description_row d-flex justify-content-center align-items-center">
            <div className="col-4">
              <div
                className="description_inn d-flex justify-content-center align-items-center"
                onClick={goToProfile}
              >
                <div className="img_wrp">
                  <figure>
                    <img src={userImage || imgConstants.avatar} alt="avatar" />
                  </figure>
                </div>
                <div className="text_wrp  align-center">
                  <p>
                    {type}
                    <p>
                      {dataAddress
                        ? dataAddress.toString().substring(0, 5) +
                          '...' +
                          dataAddress
                            .toString()
                            .substring(dataAddress.length - 6)
                        : ''}
                    </p>
                  </p>
                </div>
              </div>
            </div>
            <div className="history_price_wrp col-3">
              <p className="text-left new-WRAP cursor-pointer">
                {/* <span>{amount}</span> */}
                {amount && amount.length > 0 && (
                  <span
                    style={{
                      cursor: 'pointer',
                    }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={amount}
                  >
                    {truncateDecimals(amount, 2)}
                  </span>
                )}
                {amount && amount.length > 0 && (
                  <span>{` ${currency_symbol}`}</span>
                )}
              </p>
            </div>
            <div className="col-5 text-left curr_bid_col histroy d-flex">
              <p>{moment(ele?.time).format('MM/DD/YYYY, hh:mm A')}</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={wrapperClass}>
      {auctionEnded && <HistoryItem wrapperClass="mb-8.5" auctionEnded />}

      {!auctionNotStarted &&
        (showItems.length > 0 ? (
          <div className="flex flex-col space-y-8">
            {showItems?.map((ele: any, index: number) => (
              <HistoryItem ele={ele} key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">No Bids Yet</div>
        ))}
    </div>
  );
}

export default memo(History);
