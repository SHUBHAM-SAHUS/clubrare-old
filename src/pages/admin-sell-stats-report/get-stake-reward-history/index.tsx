import React, { memo } from "react";
import { Spinner } from "../../../components/spinner";

import moment from "moment";

interface Item {
  created_on: string;
  listing_reward_limit: string;
  no_of_listed_collection: number;
  no_of_listed_nft: number;
  total_lp_stake_amount: string;
  total_lp_staking_users: number;
  total_mpwr_stake_amount: string;
  total_mpwr_staking_users: number;
  total_trading_volume: string;
  total_unclaimed_listing_reward: string;
  total_unclaimed_trading_reward: string;
  total_users: number;
  trading_reward_limit: string;
}

export const GetStakeHistoryTableData = memo(({ items, loading }: any) => {
  return (
    <>
      {items && items?.length > 0 ? (
        <tbody>
          {items?.map((val: Item, index: number) => {
            return (
              <tr key={index}>
                  <td>{moment(val?.created_on).format("MM/DD/YYYY")}</td>
                <td>{val?.total_lp_staking_users}</td>
                <td>{val?.total_lp_stake_amount} ETH-MPWR</td>
                <td>{val?.total_mpwr_staking_users}</td>
                <td>{val?.total_mpwr_stake_amount} MPWR</td>
                <td>{val?.listing_reward_limit} MPWR</td>
                <td>{val?.trading_reward_limit} MPWR</td>
                <td>{val?.total_unclaimed_listing_reward} MPWR</td>
                <td>{val?.no_of_listed_nft}</td>
                <td>{val?.no_of_listed_collection}</td>
                <td>{val?.total_unclaimed_trading_reward} MPWR</td>

                <td>{val?.total_trading_volume} ETH</td>

                <td>{val?.total_users}</td>

              
              </tr>
            );
          })}
        </tbody>
      ) : (
        <tbody className="redeem_notfound_wrp ">
          {!loading ? (
            <p className="Data_not_found"> Data Not Available
            </p>
          ) : (
            <div className="spinner-style-table-redeem">
              <Spinner />
            </div>
          )}
        </tbody>
      )}
    </>
  );
});
