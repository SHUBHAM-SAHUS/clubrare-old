import React from "react";
import "../../admin-sell-stats-report/admin-sell-stats-report.scss";
import { Spinner } from "../../../components/spinner";
import moment from "moment";
import { AdminSaleItem } from "../../../types/admin-sell-types";
import { Link } from "react-router-dom";
import Tooltip from "react-simple-tooltip";
interface propsTypes {
  loading: boolean;
  items: AdminSaleItem[];
}

const AdminSellsTable = ({ loading, items }: propsTypes) => {
  const weth_contract = process.env.REACT_APP_WETH_TOKEN_ADD?.toLowerCase();
  const agov_contract = process.env.REACT_APP_AGOV_TOKEN_ADD?.toLowerCase();
  const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
  const usdt_eth_token_address = process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();
  const usdt_klaytn_token_address = process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase();

  const checkLastCurrency = (last_buy_currency: string, networkId: string) => {
    const erctoken = "0x0000000000000000000000000000000000000000";

    let currencyName;

    if (networkId === "1") {
      if (last_buy_currency === erctoken) {
        currencyName = "ETH";
      } else if (last_buy_currency === mpwr_token_address) {
        currencyName = "MPWR";
      } else if (last_buy_currency === agov_eth_token_address) {
        currencyName = "AGOV";
      } else if (last_buy_currency === weth_contract) {
        currencyName = "WETH";
      } else if (last_buy_currency === usdt_eth_token_address) {
        currencyName = 'USDT'
      }
    } else {
      if (last_buy_currency === erctoken) {
        currencyName = "KLAY";
      } else if (last_buy_currency === agov_contract) {
        currencyName = "AGOV";
      } else if (last_buy_currency === usdt_klaytn_token_address) {
        currencyName = 'USDT'
      }
    }

    return currencyName;
  };

  return (
    <>
      {items && items?.length > 0 ? (
        <tbody>
          {items?.map((val: AdminSaleItem, index: number) => {
            return (
              <tr key={index}>
                <td>
                  <Tooltip className="cardtooltip_wrp" content={val?.seller}>
                    {val?.seller
                      ? val?.seller.toString().substring(0, 6) +
                        "..." +
                        val?.seller.toString().substring(val?.seller.length - 4)
                      : ""}
                  </Tooltip>
                </td>

                <td>
                  {" "}
                  <Link
                    to={`item/${val?.collectible_id}`}
                    className="hypr_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {val?.title?.length > 6
                      ? val?.title.toString().substring(0, 6) + "..."
                      : val?.title}
                  </Link>{" "}
                </td>
                <td>{val.type}</td>
                <td>
                  <Tooltip className="cardtooltip_wrp" content={val?.amount}>
                    {val?.amount.length > 5
                      ? val?.amount.toString().substring(0, 5) + "..."
                      : val?.amount}
                  </Tooltip>
                </td>
                <td>{checkLastCurrency(val?.erc20_address, val.network_id)}</td>

                <td>{moment(val.time).format("MM/DD/YYYY, hh:mm A")}</td>
                <td>
                  <Tooltip className="cardtooltip_wrp" content={val?.buyer}>
                    {val?.buyer
                      ? val.buyer.toString().substring(0, 4) +
                        "..." +
                        val.buyer.toString().substring(val.buyer.length - 4)
                      : ""}
                  </Tooltip>
                </td>
                <td>{"0"}</td>
                <td>{val.royalties}</td>
                <td>
                  <Tooltip
                className="cardtooltip_wrp" 
                    content={val?.userObj?.wallet_address}
                  >
                  
                    {val?.userObj?.wallet_address
                      ? val.userObj?.wallet_address.toString().substring(0, 4) +
                        "..." +
                        val?.userObj?.wallet_address
                          .toString()
                          .substring(val?.userObj?.wallet_address.length - 4)
                      : ""}
                  </Tooltip>
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
    </>
  );
};

export default AdminSellsTable;
