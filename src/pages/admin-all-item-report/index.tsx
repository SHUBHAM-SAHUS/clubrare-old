import React, { useEffect, useRef, useState } from 'react';
import '../admin-sells-report/admin-sells-report.scss';
import Layout from '../../layouts/main-layout/main-layout';
import caretRight from '../../assets/images/CaretRight.svg';
import caretLeft from '../../assets/images/CaretLeft.svg';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { getAllItemReportListAction } from '../../redux';
import { CSVLink } from 'react-csv';
import csvFileView from '../../assets/images/csvFrame.svg';

import { AdminSaleItem } from '../../types/admin-sell-types';
import AdminAllItemsTable from './admin-all-item-table';
import { useToasts } from 'react-toast-notifications';
import { queryType } from '../../types/admin-all-params-type';

const AdminallItemReport = () => {
  const excelRef: any = useRef();
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [isDataNull, setIsDataNull] = useState(false);
  const [currentPageRowCount, setCurrentPageRowCount] = useState<number>(10);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(0);
  const [loading, Setloading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<AdminSaleItem>>([]);
  const [csvAllData, setCsvAllData] = useState([]);

  const [searchValue, setSearchValue] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [itemType, setItemType] = useState<string>('all');
  const [isReportExport, setReportExport] = useState<boolean>(false);

  useEffect(() => {
    getFilterData();
  }, [
    pageNumber,
    currentPageRowCount,
    itemType,
    toDate,
    fromDate,
    searchValue,
    itemType,
  ]);

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPageRowCount(Number(e.target.value));
    setPageNumber(1);
  };

  const handleSelectItemType = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemType(e.target.value);
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
      const result: any = await dispatch(getAllItemReportListAction(query));

      if (result?.data?.rows?.length === 0) {
        Setloading(false);
        setItems([]);
      } else {
        setIsDataNull(false);
        Setloading(false);
        setItems(result?.data?.rows);

        const totalPageCount = Math.ceil(
          result.data.count / Number(currentPageRowCount),
        );
        setTotalNumberOfPages(totalPageCount);
      }
    } catch (err) {
      Setloading(false);
      return false;
    }
  };

  const handleSearchItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getCsvData = async () => {
    setReportExport(true);
    const query: queryType = {
      page_number: pageNumber,
      page_size: currentPageRowCount,

      fromDate: fromDate
        ? moment(fromDate).format('YYYY-MM-DD').toString()
        : '',
      toDate: toDate ? moment(toDate).format('YYYY-MM-DD').toString() : '',
      item_type: itemType,

      search: searchValue,
      export: true,
    };

    try {
      const result: any = await dispatch(getAllItemReportListAction(query));

      if (result?.data?.rows?.length === 0) {
        setReportExport(false);
      } else {
        setCsvAllData(result?.data?.rows);
        setReportExport(false);
      }
    } catch (err) {
      setReportExport(false);
      return false;
    }
  };

  const getFilterData = async () => {
    if (fromDate !== '' && toDate !== '' && fromDate > toDate) {
      addToast(`End Date should be  greater than Start Date `, {
        appearance: 'error',
        autoDismiss: true,
      });
      setToDate('');
    } else {
      const query: queryType = {
        page_number: pageNumber,
        page_size: currentPageRowCount,
        fromDate: fromDate
          ? moment(fromDate).format('YYYY-MM-DD').toString()
          : '',
        toDate: toDate ? moment(toDate).format('YYYY-MM-DD').toString() : '',
        item_type: itemType,

        search: searchValue,
        export: false,
      };
      getSellList(query);
    }
  };

  useEffect(() => {
    if (csvAllData.length > 0) {
      setReportExport(false);
      excelRef.current.link.click();
    }
  }, [csvAllData]);

  return (
    <>
      <div className="sellsreport_wrp all_items_wrp">
        <Layout>
          <div className=" container-fluid">
            <div className=" sellsreport_heading">
              <h1>All Items List</h1>
              <div className="sellsreport_filter_wrp">
                <div className="sellsreport_filter_inner">
                  <label className="">
                    From Date :
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => {
                        setFromDate(e.target.value);
                      }}
                    />
                  </label>
                  <label className="">
                    To Date :
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => {
                        setToDate(e.target.value);
                      }}
                    />
                  </label>
                  <label>
                    Select item type :
                    <select
                      className="select-dropdown-style-option"
                      name="pageNo"
                      id="pageNo"
                      value={itemType}
                      onChange={(event) => handleSelectItemType(event)}
                    >
                      <option value="all">All</option>
                      <option value="digital">Digital</option>
                      <option value="physical">Physical</option>
                    </select>
                  </label>
                </div>
                <div className="search_box_wrp">
                  <div>
                    <input
                      type="text"
                      placeholder="Search Items..."
                      value={searchValue}
                      onChange={handleSearchItem}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="sells_repost_sec">
              <div className="table_striped_wrp">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Created Date</th>
                      <th scope="col"> Token ID</th>
                      <th scope="col"> Item Name </th>
                      <th scope="col"> Creater Address</th>
                      <th scope="col"> Current Owner</th>
                      <th scope="col"> Collection Address</th>
                      <th scope="col">On Sale Status</th>
                      <th scope="col"> Last Sale Type </th>
                      <th scope="col"> Last Sale Currency</th>
                      <th scope="col">Is_Hide</th>
                      <th scope="col"> Action </th>
                    </tr>
                  </thead>

                  <AdminAllItemsTable
                    items={items}
                    loading={loading}
                    getFilterData={() => getFilterData()}
                  />
                </table>
              </div>
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

                  {
                    <span>
                      <button
                        // className="csvbtn mt-2"
                        onClick={() => getCsvData()}
                      >
                        {isReportExport ? (
                          'Please Wait...'
                        ) : (
                          <img src={csvFileView} alt="csv" />
                        )}
                      </button>

                      <CSVLink
                        filename={`${new Date().getTime()}.csv`}
                        data={csvAllData}
                        target="_blank"
                        ref={excelRef}
                      ></CSVLink>
                    </span>
                  }
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
              ''
            )}
          </div>
        </Layout>
      </div>
    </>
  );
};

export default AdminallItemReport;
