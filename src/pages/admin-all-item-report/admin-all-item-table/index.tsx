import React, { memo, useState } from 'react';
import '../../admin-sell-stats-report/admin-sell-stats-report.scss';
import './admin-all-item-table.scss';
import { Spinner } from '../../../components/spinner';
import moment from 'moment';
import { getdataTypes } from '../../../types/admin-all-data-get-type';
import { Link } from 'react-router-dom';
import Tooltip from 'react-simple-tooltip';

import EditDetailModel from '../models/edit-details-model';

interface querydataType {
  _id: number;
  title: string;
  description: string;
  is_hide: boolean;
}

interface propsTypes {
  loading: boolean;
  getFilterData: () => void;
  items: any;
}

const AdminAllItemsTable = ({ loading, items, getFilterData }: propsTypes) => {
  const [IsEditModel, SetEditModel] = useState<boolean>(false);
  const [querydata, Setquerydata] = useState<querydataType>();

  const weth_contract = process.env.REACT_APP_WETH_TOKEN_ADD?.toLowerCase();
  const agov_contract = process.env.REACT_APP_AGOV_TOKEN_ADD?.toLowerCase();
  const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
  const usdt_eth_token_address = process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();
  const usdt_klaytn_token_address = process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase();

  const checkLastCurrency = (last_buy_currency: string, networkId: string) => {
    const erctoken = '0x0000000000000000000000000000000000000000';

    let currencyName;

    if (networkId === '1') {
      if (last_buy_currency === erctoken) {
        currencyName = 'ETH';
      } else if (last_buy_currency === mpwr_token_address) {
        currencyName = 'MPWR';
      } else if (last_buy_currency === agov_eth_token_address) {
        currencyName = 'AGOV';
      } else if (last_buy_currency === weth_contract) {
        currencyName = 'WETH';
      } else if (last_buy_currency === usdt_eth_token_address) {
        currencyName = 'USDT'
      }
    } else {
      if (last_buy_currency === erctoken) {
        currencyName = 'KLAY';
      } else if (last_buy_currency === agov_contract) {
        currencyName = 'AGOV';
      } else if (last_buy_currency === usdt_klaytn_token_address) {
        currencyName = 'USDT'
      }
    }

    return currencyName;
  };

  const handleCloseMdal = () => {
    SetEditModel(false);
  };

  const getItemDetailsForModel = (data: getdataTypes) => {
    const apiQuery: querydataType = {
      _id: data?._id,
      title: data?.title,
      description: data?.description,
      is_hide: data?.is_hide,
    };
    Setquerydata(apiQuery);
    SetEditModel(true);
  };
  return (
    <>
      {items && items?.length > 0 ? (
        <tbody>
          {items?.map((val: getdataTypes, index: number) => {
            return (
              <tr key={index}>
                <td>{moment(val.created_on).format('MM/DD/YYYY, hh:mm A')}</td>
                <td>{val?.token_id?.length > 0 ? val?.token_id : '-'} </td>

                <td>
                  {' '}
                  <Link
                    to={`item/${val?._id}`}
                    className="hypr_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {' '}
                    {val?.title?.length > 6
                      ? val?.title.toString().substring(0, 6) + '...'
                      : val?.title}
                  </Link>{' '}
                </td>

                <td>
                  <Tooltip
                    className="cardtooltip_wrp"
                    content={val?.userObj?.wallet_address}
                  >
                    {val?.userObj?.wallet_address
                      ? val?.userObj?.wallet_address
                          .toString()
                          .substring(0, 4) +
                        '...' +
                        val?.userObj?.wallet_address
                          .toString()
                          .substring(val?.userObj?.wallet_address.length - 2)
                      : ''}
                  </Tooltip>
                </td>

                <td>
                  <Tooltip
                    className="cardtooltip_wrp"
                    content={val?.collectible_owner}
                  >
                    {val?.collectible_owner
                      ? val?.collectible_owner.toString().substring(0, 4) +
                        '...' +
                        val?.collectible_owner
                          .toString()
                          .substring(val?.collectible_owner.length - 2)
                      : ''}
                  </Tooltip>
                </td>

                <td>
                  <Tooltip
                    className="cardtooltip_wrp"
                    content={val?.collection_address}
                  >
                    {val?.collection_address
                      ? val?.collection_address.toString().substring(0, 6) +
                        '...' +
                        val?.collection_address
                          .toString()
                          .substring(val?.collection_address.length - 4)
                      : ''}
                  </Tooltip>
                </td>

                <td>{val?.on_sale ? 'true' : 'false'}</td>
                <td>{val.last_auction_type === '2' ? 'Auction' : 'Fixed'}</td>

                <td>
                  {val?.last_buy_currency?.length > 0
                    ? checkLastCurrency(val?.last_buy_currency, val?.network_id)
                    : '-'}
                </td>

                <td>{val?.is_hide ? 'true' : 'false'}</td>

                <td>
                  {' '}
                  <h1
                    className="item_edit"
                    onClick={() => getItemDetailsForModel(val)}
                  >
                    &#9997;
                  </h1>
                </td>
              </tr>
            );
          })}
        </tbody>
      ) : (
        <tbody className="redeem_notfound_wrp ">
          {!loading ? (
            <p className="Data_not_found"> No Items Available</p>
          ) : (
            <div className="spinner-style-table-redeem">
              <Spinner />
            </div>
          )}
        </tbody>
      )}

      <EditDetailModel
        show={IsEditModel}
        onCloseModal={handleCloseMdal}
        onHide={() => SetEditModel(false)}
        querydata={querydata}
        getFilterData={getFilterData}
      />
    </>
  );
};

export default memo(AdminAllItemsTable);
