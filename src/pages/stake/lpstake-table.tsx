import React, { memo } from 'react';

const LpstakingTable = ({
  lpstakingDepositsData,
  moment,
  handleOpenwithdraw,
  handleOpenEmergencymodel,
}: any) => {
const contractType='lpstacking';
  function getDaysOfLpstake(d1: any, d2: any) {
    let days: any;
    const startDate = moment(d1, 'DD.MM.YYYY');
    const endDate = moment(d2, 'DD.MM.YYYY');
    days = endDate.diff(startDate, 'days');
    return days <= 0 ? 'No Locking' : ` ${days} Days`;
  }

  return (
    <>
      {lpstakingDepositsData?.map((data: any, i: any) => {
        return (
          <>
            <tr key={i}>
              <td className="firstclmn"> {data.poolId=== "2" ? "AGOV/WETH " : "MPWR/WETH "}</td>
              <td className="secclmn">
                {moment.unix(+data.lastRewardCalculated).format('MM/DD/YYYY hh:mm:ss a')}
              </td>
              <td className="thirdclmn">
                {getDaysOfLpstake(
                  new Date(data.lastRewardCalculated * 1000),
                  new Date(data.period * 1000),
                )}
              </td>
              <td className="fourthclmn"> {data.Nft_id}</td>

              <td className="sixthclmn">{(data.APR / 1000).toFixed(2)}%</td>
              <td className="sevenclmn">
                {moment.unix(+data.period).format('MM/DD/YYYY hh:mm:ss a')}
              </td>

              <td className="eightclmn">
                {/* need to update */}
                {parseFloat(data.calculatedRewards).toFixed(6)}
                {data.poolId=== "1" || data.poolId=== "2" ? " ETH " : " MPWR "}
              </td>
              {/* <td className="nineclmn">
                {parseFloat(data.marketfee).toFixed(6)}
              </td> */}
               <td className="nineclmn">
                ${Number(data?.amount_USD).toFixed(6)}
              </td>
              <td className="tenclmn">
                <div className="table_btn">
                  {new Date() >= new Date(data.period * 1000) ? (
                    <button
                      type="button"
                      className="mt-1"
                      onClick={() => handleOpenwithdraw(data, contractType)}
                    >
                      Unstake
                    </button>
                  ) : (
                    ''
                  )}

                  {new Date(data.period * 1000) > new Date() ? (
                    <button
                    style={{ display: "none" }}
                      type="button"
                      className="deposit_btn"
                      onClick={() =>
                        handleOpenEmergencymodel(data, contractType)
                      }
                    >
                      Emergency
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </td>
            </tr>
          </>
        );
      })}
    </>
  );
};
export default memo(LpstakingTable);
