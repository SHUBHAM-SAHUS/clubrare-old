import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getStakeUserInfoAction } from '../../redux/actions/stake-user-info-action';
import { Table } from 'react-bootstrap';
import { Spinner } from '../spinner';
import { CSVLink } from 'react-csv';
import './stake-user-information.scss';
const dateformat = require('dateformatter').format;

export const StakeUserInformation = () => {
  const [stakeUserList, setStakeUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState<any>(false);
  const [page_number, setPageNumber] = useState<any>(1);
  const [totalPage, setTotalPage] = useState<any>(1);
  const [isDataNull, setIsDataNull] = useState<any>(false);
  const [csvData, setCsvData] = useState<any>();
  const [totalCount, setTotalCount] = useState<any>(0);
  const [totalStakeAmnt, setTotalStakeAmnt] = useState<any>(0);
  const dispatch = useDispatch();

  const getStakeUserInfo = async () => {
    if (page_number > totalPage) {
      return;
    }
    const query: any = {
      page_number: page_number,
      page_size: 10,
    };

    try {
      const results: any = await dispatch(getStakeUserInfoAction(query));
      setLoading(false);
      if (results?.data == null) {
        setIsDataNull(true);
      } else {
        setTotalPage(
          results?.data?.count % 10 == 0
            ? Math.floor(results?.data.count / 10)
            : Math.floor(results?.data.count / 10) + 1,
        );
        setIsDataNull(false);
        setStakeUserList(results?.data.rows);
        setTotalCount(results?.data?.count);
        setTotalStakeAmnt(results?.data?.totalAmount);
      }
    } catch (err: any) {
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    setLoading(true);
    getStakeUserInfo();
  }, [page_number]);

  const previousBtnClick = () => {
    if (page_number > 1) {
      setPageNumber(page_number - 1);
    }
  };

  const nextBtnClick = () => {
    if (!isDataNull) {
      setPageNumber(page_number + 1);
    }
  };

  useEffect(() => {
    const Data = async () => {
      try {
        const query: any = {
          export: true,
        };
        const res: any = await dispatch(getStakeUserInfoAction(query));
        if (res) {
          setCsvData(res.data.rows);
        }
      } catch (err: any) {
        return false;
      }
    };
    Data();
  }, []);

  return (
    <>
      {loading ? (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
          <Spinner />
        </div>
      ) : stakeUserList && stakeUserList.length > 0 ? (
        <div className="text-center">
          <h3>Stake User Information</h3>
          <div className="stake-user-list-table">
            <Table className="parti_table">
              <thead>
                <tr>
                  <th className="firstclmn">S.No</th>
                  <th className="secnclmn">Wallet Address</th>
                  <th className="thirdclmn">Type</th>
                  <th className="fourthclmn">APR</th>
                  <th className="fifthclmn">Stake Time</th>
                  <th className="sixthclmn">Amount</th>
                  <th className="seventhclmn">Lock Period</th>
                  <th className="eightclmn">NFT Id</th>
                  <th className="ninthclmn">Unlock Time</th>
                </tr>
              </thead>
              <tbody>
                {stakeUserList?.length > 0 &&
                  stakeUserList.map((stakeUser, i) => {
                    return (
                      <tr key={i}>
                        <td className="firstclmn">
                          {(page_number - 1) * 10 + (i + 1)}
                        </td>
                        <td className="secnclmn">{stakeUser.user_address}</td>
                        <td className="thirdclmn">{stakeUser.type}</td>
                        <td className="fourthclmn">{stakeUser.apr / 1000}</td>
                        <td className="fifthclmn">
                          {dateformat('d/m/Y', stakeUser.staked_time)}
                        </td>
                        <td className="sixthclmn">
                          {Number(parseFloat(stakeUser.liquidity).toFixed(6))}
                        </td>
                        <td className="seventhclmn">{stakeUser.lock_period}</td>
                        <td className="eightclmn">{stakeUser.nft_id}</td>
                        <td className="ninthclmn">
                          {dateformat('d/m/Y', stakeUser.unlock_time)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
          <div className="row totalstakeusercount_wrp mb-3">
            <div className="col-4 mt-3">
              <div className="totalpartcount text-left">
                <strong>Total NFT:</strong> {}
              </div>
            </div>
            <div className="col-4 mt-3">
              {totalStakeAmnt && (
                <div className="totalpartcount text-center">
                  <strong>Total Stake Amount:</strong>{' '}
                  {Number(totalStakeAmnt).toFixed(6)}
                </div>
              )}
            </div>
            <div className="col-4 mt-3">
              {totalCount && (
                <div className="totalpartcount text-right">
                  <strong>Total Count:</strong> {totalCount}
                </div>
              )}
            </div>
          </div>
          <div className="button-container-part text-right">
            <span>
              Showing page {page_number} of {totalPage}
            </span>
            {totalPage !== 1 && (
              <>
                <button
                  className="pagi-btn"
                  disabled={page_number === 1}
                  onClick={previousBtnClick}
                >
                  Back
                </button>
                <button
                  className="pagi-btn"
                  disabled={page_number == totalPage}
                  onClick={nextBtnClick}
                >
                  Next
                </button>
              </>
            )}
          </div>
          {csvData && (
            <div className="uploaded_csv_wrp text-right mt-3">
              <CSVLink filename={`${new Date().getTime()}.csv`} data={csvData}>
                <button type="button">Export CSV</button>
              </CSVLink>
            </div>
          )}
        </div>
      ) : (
        <div className="no_item_wrp text-center">
          <h3>Stake User Information</h3>
          <p>No items</p>
        </div>
      )}
    </>
  );
};
