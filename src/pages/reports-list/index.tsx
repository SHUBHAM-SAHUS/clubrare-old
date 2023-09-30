import React, { useEffect, useState } from 'react';
import './reports-list.css';
import Layout from '../../layouts/main-layout/main-layout';
import { useDispatch } from 'react-redux';
import { getReportsAction, getEditProfileAction } from '../../redux';
import { useHistory } from 'react-router-dom';
import '../Item-approval/item-approval.css';
import '../../pages/redeem-list/redeem-list.css';
import { imgConstants } from '../../assets/locales/constants';
import UserReportModal from '../../components/modal/reason-report-modal/index';
import caretLeft from '../../assets/images/CaretLeft.svg';
import caretRight from '../../assets/images/CaretRight.svg';
const ReportsList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setreason] = useState();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);
  const [cursor, setCursor] = useState(false);
  const [isDataNull, setIsDataNull] = useState(false);

  const getReportsData = async () => {
    try {
      let requestParams = {
        page_number: pageNumber,
        page_size: pageSize,
      };
      setLoading(true);
      const data: any = await dispatch(getReportsAction(requestParams));
      if (data && data?.row?.length === 0) {
        setLoading(false);
      } else {
        setIsDataNull(false);
        const totalPageCount = Math.ceil(
          data.data.count[0].count / Number(pageSize),
        );
        setTotalNumberofPages(totalPageCount);
        setReports(data?.data?.rows);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('Wallet Address')) {
      history.push('/home');
    } else {
      getProfileDetails(localStorage.getItem('Wallet Address'));
    }
  }, []);

  useEffect(() => {
    getReportsData();
  }, [pageNumber,pageSize]);

  const getProfileDetails = async (add: any) => {
    const data = { user_address: add };
    let res: any = await dispatch(getEditProfileAction(data));
    if (res?.data?.role !== 'admin' && !res?.data?.isSuperAdmin) {
      history.push('/home');
    } else {
      setLoading(true);
      await getReportsData();
      setLoading(false);
    }
  };

  const openReportsModal = (h: any) => {
    setreason(h);
    setShowReportModal(true);
    setCursor(true);
  };

  const closeReportsModal = () => {
    setCursor(false);
    setShowReportModal(false);
  };

  const handleViewProductDetail = (collectible_id: string) => {
    window.open(`/item/${collectible_id}`, '_blank');
  };

  const handlePageSelect = async (e: any) => {
    setPageSize(Number(e.target.value));
    setPageNumber(1);
  };

  const handlePreviousBtnClick = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextBtnClick = () => {
    if (!isDataNull) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <>
      <Layout
        mainClassName="redeem_list_cmn_wrp report_list_page_wrp"
        loading={loading}
      >
        <div className="container-fluid">
          <h1 className="table-heading-style">User Reported Item List</h1>
          {reports && reports.length > 0 ? (
            <>
              <div className="user_list_sec">
                <table className="table-fixed user_list_tabel">
                  <thead>
                    <tr>
                      <th scope="col">Reported By</th>
                      <th scope="col">Reported By</th>
                      <th scope="col">Reported To</th>
                      <th scope="col">Reported To</th>
                      <th scope="col">Reported to Item Name</th>
                      <th scope="col">Reason</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports?.map(
                      (
                        { reason, reportByObj, reportToObj, collectible_id },
                        i,
                      ) => {
                        return (
                          <tr>
                            <td>
                              <figure>
                                {' '}
                                <img
                                  className="profile_img"
                                  src={
                                    reportToObj.image
                                      ? reportToObj.image
                                      : imgConstants.avatar_1
                                  }
                                  alt="avator"
                                  height="29px"
                                />
                              </figure>
                            </td>
                            <td>
                              {reportToObj.name ? reportToObj.name : 'NA'}
                            </td>
                            <td>
                              <figure>
                                {' '}
                                <img
                                  className="profile_img"
                                  src={
                                    reportByObj.image
                                      ? reportByObj.image
                                      : imgConstants.avatar_1
                                  }
                                  alt="avatar"
                                />
                              </figure>
                            </td>
                            <td>
                              {reportByObj.name ? reportByObj.name : 'NA'}
                            </td>
                            <td className="coleleven nft-title-style">
                              <span
                                onClick={() =>
                                  handleViewProductDetail(collectible_id)
                                }
                              >
                                nft name
                              </span>
                            </td>
                            <td>{reason} </td>
                            <td className="text-center dotImg">
                              <img
                                width="5"
                                src={imgConstants.dott}
                                onClick={() => openReportsModal(reason)}
                                alt="dott"
                                style={{ height: '25px' }}
                              />
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
              <div className="row m-6">
                <div className="col-6">
                  <div className="">
                    Rows per page
                    <select
                      className="select-dropdown-style-option"
                      name="pageNo"
                      id="pageNo"
                      value={pageSize}
                      onChange={(event) => handlePageSelect(event)}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <div className="col-6 text-right">
                  <div className="d-flex justify-content-end">
                    <button
                      className={`next-btn-style ${
                        pageNumber === 1 && `next-back-btn-style`
                      } `}
                      disabled={pageNumber === 1}
                      onClick={() => handlePreviousBtnClick()}
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
                      disabled={reports?.length % pageSize !== 0}
                      onClick={() => handleNextBtnClick()}
                    >
                      <img src={caretRight} alt="next" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
          <div style={{ textAlign: 'center' }}>
          <h2> No Items Available </h2>
          </div> 
          )}
        </div>

       
        {showReportModal && (
          <UserReportModal
            show={showReportModal}
            closeModal={closeReportsModal}
            reason={reason}
            cursor={cursor}
          />
        )}
      </Layout>
    </>
  );
};

const ReportsModal = (props: any) => {
  return (
    <div
      className="reports-modal reasonreportmodal"
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
          <h2 className="text-center">Reason of Reporting</h2>
          <button className="cross_btn" onClick={props.closeModal}>
            X
          </button>
          <div className="modal-content text-center  border-none">
            {props.reason}
          </div>
          <button className="button-black" onClick={props.closeModal}>
            Block
          </button>
          <button className="button-white" onClick={props.closeModal}>
            Warning
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReportsList;
