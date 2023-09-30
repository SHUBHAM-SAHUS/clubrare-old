import React, { useEffect, useState } from 'react';
import './participant-information.scss';
import { useDispatch } from 'react-redux';
import { getParticipantInfoAction } from '../../redux/actions/reward-admin-action';
import { Table } from 'react-bootstrap';
import { Spinner } from '../spinner';
import { CSVLink } from 'react-csv';
const dateformat = require('dateformatter').format;

export const ParticipantInformation = () => {
  const [participantList, setParticipantList] = useState<any[]>([]);
  const [loading, setLoading] = useState<any>(false);
  const [page_number, setPageNumber] = useState<any>(1);
  const [totalPage, setTotalPage] = useState<any>(1);
  const [isDataNull, setIsDataNull] = useState<any>(false);
  const [csvData, setCsvData] = useState<any>();
  const [totalCount, setTotalCount] = useState<any>();
  const dispatch = useDispatch();

  const getParticipantInfo = async () => {
    if (page_number > totalPage) {
      return;
    }
    const query: any = {
      page_number: page_number,
      page_size: 10,
    };

    const results: any = await dispatch(getParticipantInfoAction(query));
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
      setParticipantList(results?.data.rows);
      setTotalCount(results?.data?.count);
    }
  };

  useEffect(() => {
    setLoading(true);
    getParticipantInfo();
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
        const res: any = await dispatch(getParticipantInfoAction(query));
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
      ) : participantList && participantList.length > 0 ? (
        <div className="text-center">
          <h3>Participant Information</h3>
          <Table responsive className="parti_table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Participant Time</th>
                <th>WalletAddress</th>
              </tr>
            </thead>
            <tbody>
              {participantList?.length > 0 &&
                participantList.map((participant, i) => {
                  return (
                    <tr>
                      <td>{(page_number - 1) * 10 + (i + 1)}</td>
                      <td>
                        {dateformat('d/m/Y', participant.participated_time)}
                      </td>
                      <td>{participant.wallet_address}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
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
          {totalCount && (
            <div className="totalpartcount text-right mt-3">
              Total Count: {totalCount}
            </div>
          )}
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
          <h3>Participant Information</h3>
          <p>No items</p>
        </div>
      )}
    </>
  );
};
