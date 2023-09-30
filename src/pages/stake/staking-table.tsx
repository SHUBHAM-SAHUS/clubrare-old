import React, { memo } from "react";
const StackingTable = ({
  dataitem,
  handleOpenwithdraw,
  handleOpenEmergencymodel,
  moment,
}: any) => {
const contractType='stacking';
  function getDaysOfLpstake(d1: any, d2: any) {    
    var days:any;
    var startDate = moment(d1, "DD.MM.YYYY");
    var endDate = moment(d2, "DD.MM.YYYY");
     days = endDate.diff(startDate, 'days');
    return days <= 0 ? "No Locking" : ` ${days} Days`;
  }

  return (
    <>
      {dataitem?.map((data: any, i: any) => (
        <tr key={i}>
          <td className="firstclmn">MPWR Staking</td>
          <td className="secclmn">
            {moment.unix(+data.lastRewardCalculated).format("MM/DD/YYYY")}
          </td>
          <td className="thirdclmn">
          {
            getDaysOfLpstake(new Date(data.lastRewardCalculated * 1000), 
            new Date(data.period * 1000))
          }
          </td>
          <td className="fifthclmn">
            {parseFloat(data.stakeInEth).toFixed(6)}
          </td>

          <td className="sixthclmn">{data.APR / 1000}%</td>
          <td className="sevenclmn">
            {moment.unix(+data.period).format("MM/DD/YYYY")}
          </td>

          <td className="eightclmn">
            {parseFloat(data.calculatedRewards).toFixed(6)}
          </td>
          <td className="nineclmn">
            {" "}
            {parseFloat(data.marketfee).toFixed(6)}
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
                ""
              )}

              {new Date(data.period * 1000) > new Date() ? (
                <button
                  style={{ display: "none" }}
                  type="button"
                  className="deposit_btn"
                  onClick={() => handleOpenEmergencymodel(data, contractType)}
                >
                  Emergency
                </button>
              ) : (
                ""
              )}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default memo(StackingTable);