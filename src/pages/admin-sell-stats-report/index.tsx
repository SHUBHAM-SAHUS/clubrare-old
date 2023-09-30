import React, { useEffect, useState } from "react";
import "./admin-sell-stats-report.scss";
import Layout from "../../layouts/main-layout/main-layout";
import caretRight from "../../assets/images/CaretRight.svg";
import { CSVLink } from "react-csv";
import csvFileView from "../../assets/images/csvFrame.svg";
import caretLeft from "../../assets/images/CaretLeft.svg";
import moment from "moment";
import { useDispatch } from "react-redux";
import { getSellsStatsForAdminAction } from "../../redux";
import { Spinner } from "../../components";
import { GetStakeHistoryTableData } from "./get-stake-reward-history";
import { useToasts } from "react-toast-notifications";

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

interface queryType {
  page_number: number;
  page_size: number;
  export: boolean;
  fromDate: string;
  toDate: string;
}

const AdminSalesStatsReport = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isDataNull, setIsDataNull] = useState(false);
  const [currentPageRowCount, setCurrentPageRowCount] = useState<number>(10);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(0);
  const [loading, Setloading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<Item>>([]);
  const [csvAllData, setCsvAllData] = useState([]);
  const [startDateHandle, setStartDateHandle] = useState<string>("");
  const [EndDateHandle, setEndDateHandle] = useState<string>("");
 
  // const csvInstance = useRef();
   

  useEffect(() => {
    getFilterData();
    getAllSaleCsvData();
  }, [pageNumber, currentPageRowCount, startDateHandle, EndDateHandle]);

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPageRowCount(Number(e.target.value));
    setPageNumber(1);
  };


  

  const previousBtnClick = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const nextBtnClick = () => {
    if (!isDataNull) {
      setPageNumber(pageNumber + 1);
    }
  };

  const getSellList = async (query: queryType) => {
    try {
      Setloading(true);
      const result: any = await dispatch(getSellsStatsForAdminAction(query));
      if (result?.rows?.length === 0) {
        Setloading(false);
      } else {
        setIsDataNull(false);
        Setloading(false);
        setItems(result?.rows);
        setCsvAllData(result?.rows);
        const totalPageCount = Math.ceil(
          result?.count / Number(currentPageRowCount)
        );
        setTotalNumberOfPages(totalPageCount);
      }
    } catch (err) {
      Setloading(false);
      return false;
    }
  };

  const getAllSaleCsvData = async () => {
    const query: queryType = {
      page_number: pageNumber,
      page_size: currentPageRowCount,
      export: true,
      fromDate: "",
      toDate: "",
    };
    try {
      const data: any = await dispatch(getSellsStatsForAdminAction(query));
      if (data.rows && data?.rows.length > 0) {
        setCsvAllData(data.rows);
      }
    } catch (err) {
      return false;
    }
  };

  const getFilterData = async () => {
    if (
      startDateHandle !== "" &&
      EndDateHandle !== "" &&
      startDateHandle > EndDateHandle
    ) {
      addToast(`End Date should be  greater than Start Date `, {
        appearance: "error",
        autoDismiss: true,
      });
      setEndDateHandle("");
    } else {
      const query: queryType = {
        page_number: pageNumber,
        page_size: currentPageRowCount,
        export: false,
        fromDate: startDateHandle
          ? moment(startDateHandle).format("YYYY-MM-DD").toString()
          : "",
        toDate: EndDateHandle
          ? moment(EndDateHandle).format("YYYY-MM-DD").toString()
          : "",
      };
      getSellList(query);
    }
  };

  return (
    <>
      <div className="admin_stats_wrp">
        <Layout>
          <div className=" container-fluid">
            <div className=" admin_stats__heading ">
              <h1>Daily Stats Report</h1>
            </div>
             <div className=" starting_date_wrp" >
              <div className=" starting_date_lft_wrp">
                  <div className="create_lab mb-2">From Date : </div>
                  <input
                    className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                    value={startDateHandle}
                    onChange={(e) => {
                      setStartDateHandle(e.target.value);
                    }}
          
                    type="date"
        
                  />
              </div>
              <div className="starting_date_rignt_wrp">
                <div className="create_lab mb-2">To Date : </div>
                <input
                  className="responsive-placeholder bg-transparent border-b border-solid relative_fld w-full"
                  value={EndDateHandle}
                  onChange={(e) => {
                    setEndDateHandle(e.target.value);
                  }}
              
                  type="date"
              
                />
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="admin_list_sec">
              <div className="table_striped_wrp ">
                <table className="table table-striped text-center">
                  <thead>
                    <tr>
                      <th scope="col"> Date </th>
                      <th scope="col"> LP Staking Users</th>
                      <th scope="col"> LP Stake Amount </th>
                      <th scope="col"> MPWR Staking Users</th>
                      <th scope="col"> MPWR Stake Amount</th>
                      <th scope="col"> Listing Reward Limit</th>
                      <th scope="col"> Trading Reward Limit</th>
                      <th scope="col"> Unclaimed Listing Reward</th>
                      <th scope="col"> Listed NFT</th>
                      <th scope="col">Listed Collection</th>
                      <th scope="col"> Unclaimed Trading Reward</th>
                      <th scope="col"> Trading Volume</th>
                      <th scope="col"> Total Users</th>
                    
                    </tr>
                  </thead>

                  <GetStakeHistoryTableData items={items} loading={loading} />
                </table>
              </div>
              {items?.length > 0 ? (
                <div className="row mt-7">
                  <div className="col-6">
                    <div>
                      Rows per page
                      <select
                        className="select-dropdown-style-option"
                        name="pageNo"
                        id="pageNo"
                        value={currentPageRowCount}
                        onChange={(event) => handleSelect(event)}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>

                    {csvAllData && (
                      <div>
                        <CSVLink
                          filename={`${new Date().getTime()}.csv`}
                          data={csvAllData}
                        >
                          <img src={csvFileView} alt="csv" />
                        </CSVLink>
                      </div>
                    )}
                  </div>
                  <div className="col-6 text-left">
                    <div className="d-flex justify-content-end">
                      <button
                        className={`next-btn-style ${
                          pageNumber === 1 && `next-back-btn-style`
                        } `}
                        disabled={pageNumber === 1}
                        onClick={() => previousBtnClick()}
                      >
                        <img src={caretLeft} alt="back" />
                      </button>
                      <h4 className="h-page-style">
                        {pageNumber}/{totalNumberOfPages}
                      </h4>
                      <button
                        className={`${
                          pageNumber === totalNumberOfPages &&
                          `next-back-btn-style`
                        } `}
                        disabled={
                          pageNumber === totalNumberOfPages ||
                          items?.length % currentPageRowCount !== 0
                        }
                        onClick={() => nextBtnClick()}
                      >
                        <img src={caretRight} alt="next" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default AdminSalesStatsReport;
