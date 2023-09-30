import React, { useEffect, useState } from 'react';
import './item-approval.css';
import Layout from '../../layouts/main-layout/main-layout';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  getApprovalListAction,
  setApprovalStatusAction,
  setRejectStatusAction,
} from '../../redux/actions/approval-list';
import { useToasts } from 'react-toast-notifications';
import '../../pages/reports-list/reports-list.css';
import '../redeem-list/redeem-list.css';
import view from '../../assets/images/View.svg';
import notSuccess from '../../assets/images/Property 1=False.png';
import success from '../../assets/images/Success.svg';
import caretLeft from '../../assets/images/CaretLeft.svg';
import caretRight from '../../assets/images/CaretRight.svg';
import csvFileView from '../../assets/images/csvFrame.svg';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import { generateWhitelistSellerAction } from '../../redux/actions/whitelist-seller-action';
const ViewPendingCollectible = React.lazy(
  () => import('../profile/view-profile/view-pending-collectible'),
);

const ApprovalList = (props: any) => {
  const dispatch = useDispatch();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  let [pageNumber, setPageNumber] = useState(1);
  const [isMoreData, setMoreData] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [nextBtnDisable, setNextBtnDisable] = useState(false);
  const history = useHistory();
  const [btnClick, setBtnClick] = useState('');
  const [perPageCount, setPerPageCount] = useState<any>(10);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);
  const [pageRow, setPageRow] = useState(false);
  const [csvDataList, setCsvDataList] = useState<any[]>([]);

  const { addToast } = useToasts();

  const goToProfile = (item: any) => {
    const creator = item;
    if (creator) {
      history.push(`/${creator}`);
    }
  };

  const getApprovalsData = async (page: any) => {
    const tamp: any = [];
    if (isMoreData) {
      setLoading(false);
      const object = {
        page_number: page,
        page_size: perPageCount,
      };
      setLoading(true);
      const data: any = await dispatch(getApprovalListAction(object));
      if (!data || data?.collectibleList?.length === 0) {
        setMoreData(false);
      }
      if (data && data?.collectibleList && data?.collectibleList?.length > 0) {
        setNextBtnDisable(true);
        setLoading(false);
        setMoreData(true);
        setPageRow(false);
        setReports([...data.collectibleList]);
        data.collectibleList.map((item: any) =>
          tamp.push({
            Address: item.userObj?.wallet_address,
            Item: item.title,
            Date: moment(item?.created_on).format('MM/DD/YYYY'),
            Royalties: item.royalties,
            Redeemable: item.redeemable ? 'Yes' : 'No',
            Status: item.admin_approve_status,
          }),
        );
        // tamp
        setCsvDataList(tamp);
        // totalPage = totalRecord / pageSize
        const totalPageCount = Math.ceil(
          data.totalCount / Number(perPageCount),
        );
        setTotalNumberofPages(totalPageCount);
      } else {
        setMoreData(false);
        setLoading(false);
        setPageRow(false);
      }
    }
  };

  const makeUserAsWhitelist = async (address: string) => {
    const res: any = await dispatch(generateWhitelistSellerAction({ whiteListAddresses: [address] }));
    if (res && res.status) {
      getApprovalsData(pageNumber)
    }
  }

  useEffect(() => {
    getApprovalsData(pageNumber);
  }, []);

  const onClickBack = () => {
    setMoreData(true);
    if (pageNumber > 1) {
      pageNumber -= 1;
      setPageNumber(pageNumber);
      getApprovalsData(pageNumber);
    }
  };
  const onClickNext = () => {
    if (isMoreData) {
      pageNumber += 1;
      setPageNumber(pageNumber);
      getApprovalsData(pageNumber);
    }
  };
  const openReportsModal = (id: any, typeOfClick: any) => {
    let itemCheck = reports.find((x:any) => x._id === id);
    if(!itemCheck?.userObj?.isWhiteListedSeller && typeOfClick === 'Approve') {
      addToast('Please white list user first before approve.', {
        appearance: 'error',
        autoDismiss: true,
      });
      return
    } else {
      setId(id);
      setBtnClick(typeOfClick);
      setShowReportModal(true);
    }
  };

  const closeReportsModal = () => {
    setShowReportModal(false);
  };

  const afterNftApproved = () => {
    getApprovalsData(pageNumber);
    setShowReportModal(false);
  };

  const afterNftReject = () => {
    getApprovalsData(pageNumber);
    setShowReportModal(false);
  };

  const viewCollectibles = (item: any, index: number) => {
    setSelectedItem(item);
    setShowCollectionModal(true);
  };
  const closeViewCollectibleModal = () => {
    setShowCollectionModal(false);
    setSelectedItem({});
  };

  useEffect(() => {
    if (pageRow) {
      getApprovalsData(pageNumber);
    }
  }, [pageRow]);

  const handleSelect = async (e: any) => {
    setPageRow(true);
    setPerPageCount(Number(e.target.value));
    setPageNumber(1);
  };

  return (
    <>
      {showReportModal && (
        <ReportsModal
          closeModal={closeReportsModal}
          approve={afterNftApproved}
          reject={afterNftReject}
          id={id}
          type={btnClick}
          getReportsData={getApprovalsData}
        />
      )}

      {showCollectionModal && (
        <ViewPendingCollectible
          item={selectedItem}
          hide={closeViewCollectibleModal}
          showCollectionModal={showCollectionModal}
        />
      )}

      <Layout
        mainClassName="redeem_list_cmn_wrp item_approval_page_wrp"
        loading={loading}
      >
        <div className="container-fluid">
          <div className="user_list_sec">
            {reports?.length > 0 ? (
              <div>
                <table className="table-fixed user_list_tabel item-approve-table-style">
                  <thead>
                    <tr>
                      <th scope="col">Address</th>
                      <th scope="col">Item</th>
                      <th scope="col">Date</th>
                      <th scope="col">Royalties</th>
                      <th scope="col">Redeemable</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="Action">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((item, i) => {
                      const creator_address = item?.userObj?.wallet_address;
                      return (
                        <tr key={i}>
                          <td
                            onClick={() => goToProfile(creator_address)}
                            className="cursor-pointer text-style"
                          >
                            <div style={{ color: item?.userObj?.isWhiteListedSeller ? '' : 'red' }}>
                              {item.userObj &&
                                item.userObj.name &&
                                item.userObj.name != 'undefined'
                                ? item.userObj.name
                                : item.userObj?.wallet_address
                                  .toString()
                                  .substring(0, 5) +
                                '.....' +
                                item.userObj?.wallet_address
                                  .toString()
                                  .substr(
                                    item.userObj?.wallet_address?.length - 4,
                                  )}
                            </div>
                          </td>
                          <td className="text-style">{item.title}</td>
                          <td className="text-style">
                            {moment(item.created_on).format('MM/DD/YYYY')}
                          </td>
                          <td className="text-style">{item.royalties}</td>

                          <td>
                            {item.redeemable ? (
                              <img
                                className="item-approve-table-style-img"
                                src={success}
                                alt="img"
                              />
                            ) : (
                              <img
                                className="item-approve-table-style-img"
                                src={notSuccess}
                                alt="img"
                              />
                            )}
                          </td>
                          <td className="Status">
                            <button
                              className={`approve_btn ${item.admin_approve_status === 'Rejected' &&
                                `reject-style-status`
                                } `}
                            >
                              {item.admin_approve_status}
                            </button>
                          </td>
                          <td className="Action">
                            <img
                              src={view}
                              alt="view"
                              onClick={() => viewCollectibles(item, i)}
                            />
                            <button
                              className={`reject_btn reject-btn-disply ${item.admin_approve_status === 'Rejected' &&
                                `reject-disablebtn-style`
                                } `}
                              onClick={() =>
                                openReportsModal(item._id, 'Reject')
                              }
                              disabled={
                                item.admin_approve_status === 'Rejected'
                              }
                            >
                              Reject
                            </button>
                            <button
                              className="button-black-btn apprpve_btn approve"
                              onClick={() =>
                                openReportsModal(item._id, 'Approve')
                              }
                            >
                              Approve
                            </button>
                            <div className='make_user_whit_btn'>
                            {!item?.userObj?.isWhiteListedSeller &&
                              <button
                                className="button-black-btn apprpve_btn"
                                onClick={() =>
                                  makeUserAsWhitelist(item.userObj.wallet_address)
                                }
                              >
                                Whitelist address
                              </button>
                            }
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="row m-6">
                  <div className="col-6">
                    <div className="">
                      Rows per page
                      <select
                        className="select-dropdown-style-option"
                        name="pageNo"
                        id="pageNo"
                        value={perPageCount}
                        onChange={(event) => handleSelect(event)}
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    {csvDataList && (
                      <div>
                        <CSVLink
                          className="csv_style_approve"
                          filename={`${new Date().getTime()}.csv`}
                          data={csvDataList}
                        >
                          <img src={csvFileView} alt="csv" />
                        </CSVLink>
                      </div>
                    )}
                  </div>
                  <div className="col-6 text-right">
                    <div className="d-flex justify-content-end">
                      <button
                        className={`next-btn-style ${pageNumber === 1 && `next-back-btn-style`
                          } `}
                        disabled={pageNumber === 1}
                        onClick={() => onClickBack()}
                      >
                        <img src={caretLeft} alt="back" />
                      </button>
                      <h4 className="h-page-style">
                        {pageNumber}/{totalNumberOfPages}
                      </h4>
                      <button
                        className={`${pageNumber === totalNumberOfPages &&
                          `next-back-btn-style`
                          } `}
                        disabled={
                          !isMoreData || reports?.length % perPageCount !== 0
                        }
                        onClick={() => onClickNext()}
                      >
                        <img src={caretRight} alt="next" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                {' '}
                <h2> No items </h2>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

const ReportsModal = (props: any) => {
  const dispatch = useDispatch();
  const [isApproveloading, setIsApproveLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [desciption, setDescription] = useState('');
  const [descIsRequired, setDescriptionIsRequired] = useState(false);

  const { addToast } = useToasts();

  const setApproval = async () => {
    setIsApproveLoading(true);
    setDescriptionIsRequired(false);
    setDisabled(true);
    const object = {
      _id: props.id,
      approval_description: desciption,
    };
    const data: any = await dispatch(setApprovalStatusAction(object));
    if (data && data?.status) {
      setIsApproveLoading(false);
      setDisabled(false);
      props.approve();
    } else {
      addToast('Collectible not approved Please try after some time', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };
  const setReject = async () => {
    if (!desciption) {
      return setDescriptionIsRequired(true);
    } else {
      setDescriptionIsRequired(false);
    }
    setIsRejectLoading(true);
    setDisabled(true);
    const object = {
      _id: props.id,
      approval_description: desciption,
    };
    const data: any = await dispatch(setRejectStatusAction(object));
    if (data.status) {
      setIsRejectLoading(false);
      setDisabled(false);
      props.reject();
    }
  };

  const handleAdminConfirmation = () => {
    if (props.type === 'Reject') {
      setReject();
    } else if (props.type === 'Approve') {
      setApproval();
    }
  };

  return (
    <div
      className="reports-modal itemapproval_modal"
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b0',
        position: 'fixed',
        zIndex: 99999,
      }}
    >
      <div
        className="redeem-modal-inner"
        style={{
          width: '35%',
          backgroundColor: 'white',
          minWidth: '300px',
          position: 'relative',
        }}
      >
        <div className="text-center">
          <div
            onClick={props.closeModal}
            className="close_btn close-btn-approve"
          >
            X
          </div>
          <h2 className="text-center">{props.type} item</h2>
          <div className="modal-content text-center border-none">
            {/* Collectibles item approval ? */}
            Are you sure want to {props.type.toLowerCase()} ?
          </div>
          <div>
            <textarea
              className="inpt bg-transparent border-b border-solid
                        w-full popup-textarea"
              name="collectionDescription"
              onChange={(e) => setDescription(e.target.value)}
              value={desciption}
              // placeholder="Enter description (optional)"
              placeholder={
                props.type === 'Approve'
                  ? 'Enter description (optional)'
                  : 'Enter description'
              }
            ></textarea>
          </div>
          {descIsRequired && (
            <span
              className="text-danger"
              style={{ display: 'flex', marginLeft: '5%' }}
            >
              Description is required.
            </span>
          )}
          <div
            className="mt-4"
            style={isDisabled ? { pointerEvents: 'none', opacity: '0.4' } : {}}
          >
            {props.type === 'Reject' ? (
              <button
                className="nft-reject-btn-style"
                onClick={() => handleAdminConfirmation()}
                disabled={isApproveloading ? true : false}
              >
                {isApproveloading ? 'Loading...' : 'Reject'}
              </button>
            ) : (
              <button
                className="nft-approve-btn-style"
                onClick={() => handleAdminConfirmation()}
                disabled={isApproveloading ? true : false}
              >
                {isApproveloading ? 'Loading...' : 'Approve'}
              </button>
            )}

            <button className="card_approve_btn" onClick={props.closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApprovalList;
