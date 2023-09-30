import React, { useEffect, useState } from 'react';
import './redeem-list.css';
import Layout from '../../layouts/main-layout/main-layout';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import {
  getRedeemListAction,
  postUpdateRedeemItemAction,
  getEditProfileAction,
} from '../../redux';
import { useHistory } from 'react-router-dom';
import view from '../../assets/images/View.svg';
import notSuccess from '../../assets/images/NotSuccess.svg';
import success from '../../assets/images/Success.svg';
import caretLeft from '../../assets/images/CaretLeft.svg';
import caretRight from '../../assets/images/CaretRight.svg';
import csvFileView from '../../assets/images/csvFrame.svg';
import '../Item-approval/item-approval.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Tooltip from 'react-simple-tooltip';

import moment from 'moment';
import { CSVLink } from 'react-csv';
import { Spinner } from '../../components';
const RedeemList = () => {
  const dispatch = useDispatch();
  const [page_number, setPageNumber] = useState(1);
  const { addToast } = useToasts();
  const [isDataNull, setIsDataNull] = useState(false);
  const [currentPageRowCount, setCurrentPageRowCount] = useState<any>(10);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);
  const [isPageRow, setIsPageRow] = useState(false);
  const [loading, Setloading] = useState<boolean>(false);
  const history = useHistory();
  const [items, setItems] = useState([]);

  const [csvAllData, setCsvAllData] = useState([]);
  const getItems = async () => {
    const tamp: any = [];
    const query: any = {
      page_number: page_number,
      page_size: currentPageRowCount,
    };
    try {
      Setloading(true);
      const results: any = await dispatch(getRedeemListAction(query));
      if (results == null) {
        Setloading(true);
      } else {
        setIsDataNull(false);
        Setloading(false);
        setItems(results.redeemList);
        results.redeemList.map((items: any) => {
          tamp.push({
            Name: items.name,
            Address: items.address,
            ZipCode: items.zip,
            Date: moment(items.created_on).format('MM/DD/YYYY'),
            Country: items.country,
            Email: items.createdByUser.email,
            Auth: items.collectible.isLuxuryAuthReq ? 'Yes' : 'No',
            Status: items.status,
            VIN: items._id,
          });
        });
        setCsvAllData(tamp);
        const totalPageCount = Math.ceil(
          results.totalCount / Number(currentPageRowCount),
        );
        setTotalNumberofPages(totalPageCount);
      }
    } catch (err: any) {
      Setloading(false);
      return false;
    }
  };
  useEffect(() => {
    getItems();
  }, [page_number, totalNumberOfPages]);

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
    if (!localStorage.getItem('Wallet Address')) {
      history.push('/home');
    } else {
      getProfileDetails(localStorage.getItem('Wallet Address'));
    }
  }, []);

  const getProfileDetails = async (add: any) => {
    const data = { user_address: add };
    let res: any = await dispatch(getEditProfileAction(data));
    if (res?.data?.role !== 'admin' && !res?.data?.isSuperAdmin) {
      history.push('/home');
    }
  };

  const handleStatusChange = async (event: any, item: any) => {
    const { target } = event;
    const body = {
      _id: item._id,
      status: target.value,
    };
    try {
      await dispatch(postUpdateRedeemItemAction(body));
      getItems();
    } catch (err: any) {
      return false;
    }
  };

  const onClickViewItem = (item: any) => {
    window.open(`/item/${item?.collectible_id}`, '_blank');
  };

  useEffect(() => {
    if (isPageRow) {
      getItems();
    }
  }, [isPageRow]);

  const handleSelect = async (e: any) => {
    setIsPageRow(true);
    setCurrentPageRowCount(Number(e.target.value));
    setPageNumber(1);
  };

  return (
    <Layout mainClassName="redeem_list_page_wrp redeem_list_cmn_wrp">
      <div className="container-fluid">
        <div className="user_list_sec">
          <div>
            <table className="table-fixed user_list_tabel item-approve-table-style">
              <thead>
                <tr>
                  <th className="colone pl-2" scope="col">
                    Name
                  </th>
                  <th className="coltwo" scope="col">
                    Address
                  </th>
                  <th className="colthree" scope="col">
                    Zip Code
                  </th>
                  <th className="colfour" scope="col">
                    Date
                  </th>
                  <th className="colfive" scope="col">
                    Country
                  </th>
                  <th className="colsix" scope="col">
                    Email
                  </th>
                  <th className="colseven" scope="col">
                    Auth.
                  </th>
                  <th className="coleight" scope="col">
                    Status
                  </th>
                  <th className="colnine" scope="col">
                    #VIN
                  </th>
                  <th className="colten" scope="col">
                    Tracking Number
                  </th>
                  <th className="coleleven" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <RedeemTabledata
                items={items}
                handleStatusChange={handleStatusChange}
                addToast={addToast}
                onClickViewItem={onClickViewItem}
                loading={loading}
                isDataNull={isDataNull}
              />
            </table>
            {items.length > 0 ? (
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
                        className="csv_style_redeem"
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
                        page_number === 1 && `next-back-btn-style`
                      } `}
                      disabled={page_number === 1}
                      onClick={() => previousBtnClick()}
                    >
                      <img src={caretLeft} alt="back" />
                    </button>
                    <h4 className="h-page-style">
                      {page_number}/{totalNumberOfPages}
                    </h4>
                    <button
                      className={`${
                        page_number === totalNumberOfPages &&
                        `next-back-btn-style`
                      } `}
                      disabled={
                        page_number === totalNumberOfPages ||
                        items.length % currentPageRowCount !== 0
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
        </div>
      </div>
    </Layout>
  );
};
export default RedeemList;

export const RedeemTabledata = ({
  items,
  handleStatusChange,
  addToast,
  onClickViewItem,
  loading,
  isDataNull,
}: any) => {
  return (
    <>
      {items && items?.length > 0 ? (
        <tbody>
          {items?.map((item: any, i: number) => {
            return (
              <tr key={i}>
                <td className="colone">{item.name}</td>
                <td className="coltwo">{item.address}</td>
                <td className="colthree">{item.zip}</td>
                <td className="colfour">
                  {' '}
                  {moment(item.created_on).format('MM/DD/YYYY')}
                </td>
                <td className="colfive">{item.country}</td>
                <td className="colsix">{item.createdByUser.email}</td>
                <td className="colseven">
                  {item.collectible.isLuxuryAuthReq ? (
                    <img
                      className="item-approve-table-style-img"
                      src={success}
                      alt="success"
                    />
                  ) : (
                    <img
                      className="item-approve-table-style-img"
                      src={notSuccess}
                      alt="notSuccess"
                    />
                  )}
                </td>
                <td className="status_dropdown coleight">
                  <select
                    className={`status-dwn select-dropdown-style ${
                      (item.status === 'pending' && `pending-style`) ||
                      (item.status === 'dispatched' && `refund-style`) ||
                      (item.status === 'delivered' && `fullfill-style`)
                    } `}
                    name=""
                    id=""
                    value={item.status}
                    onChange={(event) => handleStatusChange(event, item)}
                  >
                    <option value="pending">Pending</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="club_card_price_wrp colnine ">
                  <Tooltip className="cardtooltip_wrp" content={item._id}>
                    <CopyToClipboard
                      text={item._id}
                      onCopy={() =>
                        addToast('Id Copied', {
                          appearance: 'success',
                          autoDismiss: true,
                        })
                      }
                    >
                      <span className="cardtooltip">{item._id}</span>
                    </CopyToClipboard>
                  </Tooltip>
                </td>
                <td className="colten">
                  {item?.tracking_number ? item?.tracking_number : '-'}
                </td>
                <td className="coleleven eye-img-rep-wrp">
                  <img
                    src={view}
                    alt="view"
                    onClick={() => onClickViewItem(item)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      ) : (
        <tbody className="redeem_notfound_wrp ">
          {!loading ? (
            <p> Not Found</p>
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
