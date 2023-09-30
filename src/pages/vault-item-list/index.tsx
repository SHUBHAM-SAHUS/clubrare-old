import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../admin-sells-report/admin-sells-report.scss';
import Layout from '../../layouts/main-layout/main-layout';
import caretRight from '../../assets/images/CaretRight.svg';
import caretLeft from '../../assets/images/CaretLeft.svg';
import { useDispatch } from 'react-redux';
import {
  VaultItemReportListAction,
  VaultItemOrderStatusUpdateAcion,
  getEditProfileAction,
} from '../../redux';
import { CSVLink } from 'react-csv';
import csvFileView from '../../assets/images/csvFrame.svg';
import { AdminSaleItem } from '../../types/admin-sell-types';
import EscrowListTable from './vault-item-list-table';
import { EscrowQueryType } from '../../types/escrow-params.types';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

const EscrowListReport = () => {
  const excelRef: any = useRef();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const networkId = localStorage.getItem('networkId');

  const intialState: EscrowQueryType = {
    order_status: '',
    escrow_status: '',
    delivery_type: '',
    search: '',
  };

  const [pageNumber, setPageNumber] = useState(1);
  const [isDataNull, setIsDataNull] = useState(false);
  const [currentPageRowCount, setCurrentPageRowCount] = useState<number>(10);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(0);
  const [loading, Setloading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<AdminSaleItem>>([]);
  const [csvAllData, setCsvAllData] = useState([]);
  const [isReportExport, setReportExport] = useState<boolean>(false);
  const [escrowState, setEscrowState] = useState<EscrowQueryType>(intialState);
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem('Wallet Address')) {
      history.push('/home');
    } else {
      getProfileDetails(localStorage.getItem('Wallet Address') as string);
    }
  }, []);

  const getProfileDetails = async (add: string) => {
    const data = { user_address: add };
    let res: any = await dispatch(getEditProfileAction(data));
    if (res?.data?.role !== 'admin' && !res?.data?.isSuperAdmin) {
      history.push('/home');
    }
  };

  useEffect(() => {
    getFilterData();
  }, [pageNumber, currentPageRowCount, escrowState]);

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPageRowCount(Number(e.target.value));
    setPageNumber(1);
  };

  const previousBtnClick = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }, []);

  const nextBtnClick = useCallback(() => {
    if (!isDataNull) {
      setPageNumber(pageNumber + 1);
    }
  }, []);

  const getSellList = async (query: EscrowQueryType) => {
    try {
      Setloading(true);
      const result: any = await dispatch(VaultItemReportListAction(query));

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
    }
  };

  const getCsvData = useCallback(async () => {
    const KlayNetWork = [process.env.REACT_APP_KLATYN_NETWORK_ID].includes(
      networkId?.toString(),
    );
    setReportExport(true);
    const query: EscrowQueryType = {
      page_number: pageNumber,
      page_size: currentPageRowCount,
      order_status: escrowState.order_status,
      network_id: KlayNetWork ? '2' : '1',
      search: escrowState.search,
      exports: true,
    };
    try {
      const result: any = await dispatch(VaultItemReportListAction(query));

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
  }, []);

  const getFilterData = async () => {
    const KlayNetWork = [process.env.REACT_APP_KLATYN_NETWORK_ID].includes(
      networkId?.toString(),
    );

    const query: EscrowQueryType = {
      page_number: pageNumber,
      page_size: currentPageRowCount,
      order_status: escrowState.order_status,

      search: escrowState.search,
      network_id: KlayNetWork ? '2' : '1',
      exports: false,
    };
    getSellList(query);
  };

  useEffect(() => {
    if (csvAllData.length > 0) {
      setReportExport(false);
      excelRef.current.link.click();
    }
  }, [csvAllData]);

  const handleEscrowFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEscrowState((prevalue) => ({
      ...prevalue,
      [name]: value,
    }));
  };

  const handleItemLocation = async (
    collectible_id: string,
    escrow_order_id: string,
  ) => {
    await dispatch(
      VaultItemOrderStatusUpdateAcion({
        collectible_id: collectible_id,
        escrow_order_id: escrow_order_id,
      }),
    );
    await getFilterData();
    addToast('Updated Successfully', {
      appearance: 'success',
      autoDismiss: true,
    });
  };
  return (
    <>
      <div className="sellsreport_wrp all_items_wrp">
        <Layout>
          <div className=" container-fluid">
            <div className=" sellsreport_heading">
              <h1> Vault Item List</h1>
              <div className="sellsreport_filter_wrp">
                <div className="sellsreport_filter_inner">
                  <label>
                    Order Status :
                    <select
                      className="select-dropdown-style-option"
                      name="order_status"
                      id="order_status"
                      value={escrowState.order_status}
                      onChange={(event) => handleEscrowFilter(event)}
                    >
                      <option value="">All</option>
                      <option value="pending">Pending</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="refund">Refund</option>
                    </select>
                  </label>
                </div>

                <div className="search_box_wrp">
                  <div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search Items..."
                      value={escrowState.search}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement> | any,
                      ) => handleEscrowFilter(event)}
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
                      <th scope="col"> Item ID</th>
                      <th scope="col"> Receiver Wallet </th>
                      <th scope="col"> Address </th>
                      <th scope="col"> Zip_Code </th>
                      <th scope="col"> City</th>
                      <th scope="col"> State </th>
                      <th scope="col"> Country</th>
                      <th scope="col"> Email</th>
                      <th scope="col"> Phone</th>
                      <th scope="col"> Order-Status</th>
                      <th scope="col"> Created_On</th>
                    </tr>
                  </thead>

                  <EscrowListTable
                    items={items}
                    loading={loading}
                    getFilterData={() => getFilterData()}
                    handleItemLocation={handleItemLocation}
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

export default EscrowListReport;
