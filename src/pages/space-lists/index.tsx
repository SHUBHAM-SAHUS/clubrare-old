/* eslint-disable no-debugger */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../admin-sells-report/admin-sells-report.scss';
import './space-lists.scss';
import Layout from '../../layouts/main-layout/main-layout';
import csvFileView from '../../assets/images/csvFrame.svg';
import caretRight from '../../assets/images/CaretRight.svg';
import caretLeft from '../../assets/images/CaretLeft.svg';

import { useDispatch } from 'react-redux';
import {
  addHomeSpaceAction,
  deleteSpaceAction,
  getEditProfileAction,
  getSpaceListAction,
  removeHomeSpaceAction,
} from '../../redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { CSVLink } from 'react-csv';
import ImageViewer from 'react-simple-image-viewer';
import { spaceListsObject, spaceListsRequest } from '../../types/space-types';
import { Spinner } from '../../components/spinner';

const SpaceLists = () => {
  const excelRef: any = useRef();
  const initialState: spaceListsRequest = {
    is_on_home_page: '',
    search: '',
  };
  const [currentPageRowCount, setCurrentPageRowCount] = useState<number>(10);
  const { addToast } = useToasts();
  const [spaceList, setSpaceList] = useState<spaceListsObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(0);
  const dispatch = useDispatch();
  const [totalPage, setTotalPage] = useState(1);
  const [isDataNull, setIsDataNull] = useState(false);
  const history = useHistory();
  const [queryState, setQueryState] = useState<spaceListsRequest>(initialState);
  const [isReportExport, setReportExport] = useState<boolean>(false);
  const [csvAllData, setCsvAllData] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const V2_URL = process.env.REACT_APP_V2_URL;

  const openImageViewer = useCallback((src) => {
    setCurrentImage(src);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage('');
    setIsViewerOpen(false);
  };

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPageRowCount(Number(e.target.value));
    setPageNumber(1);
  };

  const getLists = async () => {
    if (pageNumber > totalPage) {
      return;
    }
    const query: spaceListsRequest = {
      page_number: pageNumber,
      page_size: 10,
      search: queryState.search,
      exports: false,
      is_on_home_page: queryState.is_on_home_page,
    };

    const results: any = await dispatch(getSpaceListAction(query));
    setLoading(false);
    if (results?.data?.count == 0) {
      setIsDataNull(true);
    } else {
      setTotalPage(
        results?.data?.count % 10 == 0
          ? Math.floor(results?.data?.count / 10)
          : Math.floor(results?.data?.count / 10) + 1,
      );
      setIsDataNull(false);
      setSpaceList(results?.data?.rows);
      const totalPageCount = Math.ceil(
        results?.data?.count / Number(currentPageRowCount),
      );
      setTotalNumberOfPages(totalPageCount);
    }
  };

  
  useEffect(() => {
    setLoading(true);
    getLists();
  }, [pageNumber, queryState, currentPageRowCount]);

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
    if (csvAllData.length > 0) {
      setReportExport(false);
      excelRef.current.link.click();
    }
  }, [csvAllData]);

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
  
  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setQueryState((prevalue) => ({
      ...prevalue,
      [name]: value,
    }));
  };

  const AddRemoveHomePage = async (id: string, is_on_home_page: boolean) => {
    const data = {
      _id: id,
    };
    if(is_on_home_page) {
      await dispatch(removeHomeSpaceAction(data));
    } else {
      await dispatch(addHomeSpaceAction(data));
    }
    addToast(`Data successfully updated`, {
      appearance: 'success',
      autoDismiss: true,
    });
    getLists();
  };
  
  const deleteSpace = async (id: string) => {
    if(window.confirm("Are sure that you want to delete this space?")) {
    const data = {
      _id: id,
    };
    
    await dispatch(deleteSpaceAction(data));
    
    addToast(`Space deleted successfully update`, {
      appearance: 'success',
      autoDismiss: true,
    });
    getLists();
  }
  };

  const getCsvData = useCallback(async () => {    
    setReportExport(true);
    const query: spaceListsRequest = {
      page_number: pageNumber,
      page_size: currentPageRowCount,
      is_on_home_page: queryState.is_on_home_page,
      search: queryState.search,
      exports: true,
    };
    try {
      const result: any = await dispatch(getSpaceListAction(query));

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

  return (
    <div className="space-wrapper all_items_wrp">
        <Layout>
          <div className=" container-fluid">
            <div className=" sellsreport_heading">
              <h1> Space Lists</h1>
              <div className="sellsreport_filter_wrp">
                <div className="sellsreport_filter_inner">
                  <label>
                    Home Page :
                    <select
                      className="select-dropdown-style-option"
                      name="is_on_home_page"
                      id="is_on_home_page"
                      value={queryState.is_on_home_page}
                      onChange={(event) => handleFilter(event)}
                    >
                      <option value="">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>                      
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
                      value={queryState.search}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement> | any,
                      ) => handleFilter(event)}
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
                      <th scope="col"> Space Image</th>
                      <th scope="col"> Wallet Address</th>
                      <th scope="col"> Action </th>                      
                    </tr>
                  </thead>
                  {spaceList?.length > 0 ?
                    spaceList.map((obj, i) => {
                      return (
                        <tbody>
                        <tr>
                          <td><img className='cursor-pointer' src={obj.space_image} alt='space image' width={100} height={100} onClick={ () => openImageViewer(obj.space_image) }/></td>
                          <td>
                            <a href={`${V2_URL}/profile/${obj.wallet_address}`} rel='noreferrer' target='_blank'>{obj.wallet_address}</a></td>
                          <td>
                            <Button
                              className="delete_btn"
                              onClick={() => AddRemoveHomePage(obj._id, obj?.is_on_home_page ?? false)}
                            >
                              {' '}
                              {obj?.is_on_home_page ? 'Remove From Home Page' :  'Add to Home Page'}
                            </Button>
                            <a
                              className="btn btn-primary btn-danger ml-3"
                              onClick={() => {                                
                                deleteSpace(obj._id)
                              }}
                            >
                              {' '}
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
</svg>
                            </a>
                          </td>
                        </tr>
                        </tbody>
                      );
                    }) : (
                      <tbody className="redeem_notfound_wrp ">
                        <tr>
                      {!loading ? (
                        
                          <td colSpan={3}> No Items Available</td>
                          
                      ) : (
                        <td colSpan={3}>
                        <div className="spinner-style-table-redeem">
                          <Spinner />
                        </div>
                        </td>
                      )}
                      </tr>
                    </tbody>
                    )}
                </table>
              </div>
            </div>
            {spaceList?.length > 0 ? (
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
                        spaceList?.length % currentPageRowCount !== 0
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
          {isViewerOpen && (
            <ImageViewer
              src={ [currentImage] }
              disableScroll={ false }
              closeOnClickOutside={ true }
              onClose={ closeImageViewer }
            />
          )}
        </Layout>
      </div>
  );
};

export default SpaceLists;
