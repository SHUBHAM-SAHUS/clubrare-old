import moment from 'moment';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useDispatch } from 'react-redux';
import Footer from '../../components/footer/footer';
import { WhitelistSellerModal } from '../../components/whitelist-seller-modal';
import MainLayout from '../../layouts/main-layout/main-layout';
import {
  getWhitelistSellerAction,
} from '../../redux/actions/whitelist-seller-action';
import './whitelist-seller.scss';
import csvFileView from '../../assets/images/csvFrame.svg';
import caretLeft from '../../assets/images/CaretLeft.svg';
import caretRight from '../../assets/images/CaretRight.svg';
import { Spinner } from '../../components/spinner';
import { useToasts } from 'react-toast-notifications';
import { DeleteWhitelistSeller } from '../../components/delete-whitelist-seller';
import { useHistory } from 'react-router-dom';
import { getEditProfileAction } from '../../redux';

const WhitelistSeller = () => {
  const history = useHistory();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
  const [sellerId, setSellerId] = useState<any>();
  const [whitelistSeller, setWhitelistSeller] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [perPageCount, setPerPageCount] = useState<any>(10);
  const [nextBtnDisable, setNextBtnDisable] = useState(false);
  const [pageRow, setPageRow] = useState(false);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);
  const [csvDataList, setCsvDataList] = useState<any[]>([]);
  let [pageNumber, setPageNumber] = useState(1);

  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const getWhitelistSellerData = async (page: any) => {
    const object = {
      page_number: page,
      page_size: perPageCount,
      export: false,
    };
    setLoading(true);
    try {
      const data: any = await dispatch(getWhitelistSellerAction(object));
      if (!data || data?.rows.length === 0) {
        setWhitelistSeller([]);
      }
      if (data && data.rows && data.rows.length > 0) {
        setNextBtnDisable(true);
        setLoading(false);
        setPageRow(false);
        setWhitelistSeller([...data.rows]);
        const totalPageCount = Math.ceil(data.count / Number(perPageCount));
        setTotalNumberofPages(totalPageCount);
      } else {
        setLoading(false);
        setPageRow(false);
      }
    } catch (err: any) {
      setLoading(false);
      setPageRow(false);
    }
  };

  const getWhitelistCsvData = async (page: any) => {
    const object = {
      page_number: page,
      page_size: perPageCount,
      export: true,
    };
    try {
      const data: any = await dispatch(getWhitelistSellerAction(object));
      if (data && data.rows && data.rows.length > 0) {
        setCsvDataList(data.rows);
      }
    } catch (err: any) {
      return false;
    }
  };

  useEffect(() => {
    getWhitelistSellerData(pageNumber);
    getWhitelistCsvData(pageNumber);
  }, [perPageCount, pageRow]);

  useEffect(() => {
    if (pageRow) {
      getWhitelistSellerData(pageNumber);
    }
  }, [pageRow]);

  const onClickBack = () => {
    if (pageNumber > 1) {
      pageNumber -= 1;
      setPageNumber(pageNumber);
      getWhitelistSellerData(pageNumber);
    }
  };

  const onClickNext = () => {
    pageNumber += 1;
    setPageNumber(pageNumber);
    getWhitelistSellerData(pageNumber);
  };

  const handleSelect = async (e: any) => {
    setPageRow(true);
    setPerPageCount(Number(e.target.value));
    setPageNumber(1);
  };


  const resetAfterWhitelist = () => {
    getWhitelistSellerData(1);
    setPageNumber(1);
  };

  const deleteModalHandler = (sellerId: any) => {
    setDeleteModalShow(true);
    setSellerId(sellerId);
  };

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

  return (
    <>
      <MainLayout>
        <div className="whitelist-seller-wrp">
          <div className="container">
            <div className="whitelist-seller-inn text-center">
              <h1>Whitelist Seller</h1>
              <button
                type="button"
                className="sellmodalshowbtn"
                onClick={() => setModalShow(true)}
              >
                Import Whitelist User
              </button>
              {loading ? (
                <Spinner />
              ) : (
                <div className="whitelist-sell-table">
                  {whitelistSeller && whitelistSeller.length > 0 ? (
                    <>
                      <div className="wh_table_wrp">
                        <table>
                          <thead>
                            <tr>
                              <th className="firstclmn">Address</th>
                              <th className="secndclmn">Date</th>
                              <th className="fourthclmn">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {whitelistSeller.map((item: any, i: any) => {
                              return (
                                <tr key={i}>
                                  <td className="firstclmn">
                                    {item.wallet_address}
                                  </td>
                                  <td className="secndclmn">
                                    {moment(item.created_on).format(
                                      'MM/DD/YYYY',
                                    )}
                                  </td>
                                  <td className="fourthclmn">
                                    <button
                                      type="button"
                                      className="deletebtn"
                                      onClick={() =>
                                        deleteModalHandler(item._id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="row whitelist_pagination_wrp">
                        <div className="col-6 text-left">
                          <div className="">
                            <span>Rows per page</span>
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
                              className={`next-btn-style ${
                                pageNumber === 1 && `next-back-btn-style`
                              } `}
                              disabled={pageNumber === 1}
                              onClick={() => onClickBack()}
                            >
                              <img src={caretLeft} alt="back" />
                            </button>
                            <h4 className="h-page-style noofpageelm">
                              {pageNumber}/{totalNumberOfPages}
                            </h4>
                            <button
                              className={`${
                                pageNumber === totalNumberOfPages &&
                                `next-back-btn-style`
                              } `}
                              disabled={pageNumber === totalNumberOfPages}
                              onClick={() => onClickNext()}
                            >
                              <img src={caretRight} alt="next" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <h2> No items </h2>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <WhitelistSellerModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            getWhiteListData={() => resetAfterWhitelist()}
          />
          <DeleteWhitelistSeller
            show={deleteModalShow}
            onHide={() => setDeleteModalShow(false)}
            sellerId={sellerId}
            getWhiteListData={() => getWhitelistSellerData(pageNumber)}
          />
        </div>
      </MainLayout>
      <Footer />
    </>
  );
};

export default WhitelistSeller;
