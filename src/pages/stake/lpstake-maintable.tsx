import React, { memo } from "react";
import { Table } from "react-bootstrap";
import EmergencywithdraModel from "../../components/modal/emergency-withdraw-model";
import moment from "moment";
import LpwithdrawModel from "../../components/modal/lp-withdraw-model";
import "./stake.scss";
import { Spinner } from "../../components";
import StackingTable from "./staking-table";
import LpstakingTable from "./lpstake-table";

const LpStakeTable = ({
  lpstakingDepositsData,
  getstackingtabledata,
  lpwithdrawmodel,
  handleClosewithdraw,
  handleOpenwithdraw,
  handleCloseEmergencymodel,
  handleOpenEmergencymodel,
  lpemergencywithdrawmodel,
  popupData,
  ReqpoolStaking,
  poolwithdrawloading,
  cursor,
  spinnerloading,
  ReqTokenStaking,
  stackingspinner,
  showDepositLoading
}: any) => {
  return (
    <>
      {
        showDepositLoading || spinnerloading || stackingspinner ? <Spinner /> :
          (lpstakingDepositsData && lpstakingDepositsData.length > 0) ||
            (getstackingtabledata && getstackingtabledata.length > 0) ? (
            <div className="lpstack_table_wrp">
              <div className="lpstack_table">
                <Table>
                  <thead>
                    <tr>
                      <th className="firstclmn">Type</th>
                      <th className="secclmn">Staked Time</th>
                      <th className="thirdclmn">Lock Period</th>
                      <th className="fourthclmn">NFT_Id</th>
                      <th className="sixthclmn">APR%</th>
                      <th className="sevenclmn">Unlock Time</th>
                      <th className="eightclmn">Rewards</th>
                      {/* <th className="nineclmn">Market Fee</th> */}
                      <th className="nineclmn">Liquidity</th>
                      <th className="tenclmn"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <LpstakingTable
                      lpstakingDepositsData={lpstakingDepositsData}
                      moment={moment}
                      handleOpenwithdraw={handleOpenwithdraw}
                      handleOpenEmergencymodel={handleOpenEmergencymodel}
                    />
                  </tbody>
                </Table>
              </div>
              <div className="lpstack_table">
                <Table>
                  <thead>
                    <tr>
                      <th className="firstclmn">Type</th>
                      <th className="secclmn">Staked Time</th>
                      <th className="thirdclmn">Lock Period</th>
                      <th className="fifthclmn">Liquidity</th>
                      <th className="sixthclmn">APR%</th>
                      <th className="sevenclmn">Unlock Time</th>
                      <th className="eightclmn">Rewards</th>
                      <th className="nineclmn">Market Fee</th>
                      <th className="tenclmn"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <StackingTable
                      dataitem={getstackingtabledata}
                      handleOpenwithdraw={handleOpenwithdraw}
                      handleOpenEmergencymodel={handleOpenEmergencymodel}
                      moment={moment}
                    />
                  </tbody>
                </Table>
              </div>
              <LpwithdrawModel
                show={lpwithdrawmodel}
                onCloseModal={handleClosewithdraw}
                ReqpoolStaking={ReqpoolStaking}
                did={popupData?.data?.depositId}
                marketfee={popupData?.data.marketfee}
                poolwithdrawloading={poolwithdrawloading}
                cursor={cursor}
                amounttoken={+popupData?.data.marketfee}
                nftid={popupData?.data.Nft_id}
                rewards={popupData?.data.calculatedRewards}
                ReqTokenStaking={ReqTokenStaking}
                stakingamount={popupData?.data.stakeInEth}
                type={popupData?.type}
                pool_id={popupData?.data?.poolId}
              />
              <EmergencywithdraModel
                show={lpemergencywithdrawmodel}
                onCloseModal={handleCloseEmergencymodel}
                ReqpoolStaking={ReqpoolStaking}
                did={popupData?.data.depositId}
                poolwithdrawloading={poolwithdrawloading}
                cursor={cursor}
                nftid={popupData?.data.Nft_id}
                rewards={Number(popupData?.data?.emergencycalculatedRewards)}
                ReqTokenStaking={ReqTokenStaking}
                type={popupData?.type}
                stakingamount={popupData?.data.stakeInEth}
              />
            </div>
          ) : (
            ""
          )}
    </>
  );
};

export default memo(LpStakeTable);