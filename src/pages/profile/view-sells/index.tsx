import React, { useEffect, useState } from 'react';
import './viewsells.scss';
import Layout from '../../../layouts/main-layout/main-layout';
import { getViewSellsListAction } from '../../../redux';
import caretRight from '../../../assets/images/CaretRight.svg';
import { CSVLink } from 'react-csv';
import csvFileView from '../../../assets/images/csvFrame.svg';
import caretLeft from '../../../assets/images/CaretLeft.svg';
import moment from 'moment';
import { useDispatch } from 'react-redux';

const Viewcells = () => {
  const dispatch = useDispatch();
  const [page_number, setPageNumber] = useState(1);
  const [isDataNull, setIsDataNull] = useState(false);
  const [currentPageRowCount, setCurrentPageRowCount] = useState<any>(10);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);
  const [loading, Setloading] = useState<boolean>(false);
  const [items, setItems] = useState([]);
  const [csvAllData, setCsvAllData] = useState([]);

  const handleSelect = async (e: any) => {
    setCurrentPageRowCount(Number(e.target.value));
    setPageNumber(1);
  };

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

  const getItems = async () => {
    const tamp: any = [];
    const queryexport: any = {
      page_number: page_number,
      page_size: currentPageRowCount,
      export: true,
    };
    const query: any = {
      page_number: page_number,
      page_size: currentPageRowCount,
      export: false,
    };
    try {
      const exportresponse: any = await dispatch(getViewSellsListAction(query));
      const results: any = await dispatch(getViewSellsListAction(queryexport));
      if (results == null) {
        Setloading(true);
      } else {
        setIsDataNull(false);
        Setloading(false);
        setItems(exportresponse.rows);
        results?.rows?.map((items: any) => {
          tamp.push({
            Address: items.collection_address,
            Item: items.collectible_name,
            Date: moment(items.time).format('MM/DD/YYYY'),
            Amount: items.eth_price,
          });
        });
        setCsvAllData(tamp);
        const totalPageCount = Math.ceil(
          exportresponse.count / Number(currentPageRowCount),
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
  }, [page_number, currentPageRowCount]);

  return (
    <>
      <Layout>
        <div className="container-fluid">
          <div className="user_list_sec">
            <div className="table_striped_wrp" >
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Address</th>
                  <th scope="col">Item</th>
                  <th scope="col">Date</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>

              <Sellsdata item={items} loading={loading} />
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
                  {/* <img src={csvFileView} alt="csv" /> */}

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
        </div>
      </Layout>
    </>
  );
};

export default Viewcells;

const Sellsdata = ({ item, loading }: any) => {
  return (
    <>
      {item?.length > 0 ? (
        <tbody>
          {item?.map((val: any, index: number) => {
            return (
              <>
                <tr key={index}>
                  <td>{val.collection_address}</td>
                  <td>{val.collectible_name}</td>
                  <td>{moment(val?.time).format('MM/DD/YYYY')}</td>
                  <td>{val.eth_price}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      ) : (
        <tbody className="redeem_notfound_wrp">
          {loading ? <p> Not Found</p> : ''}
        </tbody>
      )}
    </>
  );
};
