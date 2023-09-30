import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Footer from '../../components/footer/footer';
import MainLayout from '../../layouts/main-layout/main-layout';
import { getAdminWareHouseListAction } from '../../redux/actions';
import { Spinner } from '../../components/spinner';
import caretLeft from '../../assets/images/CaretLeft.svg';
import caretRight from '../../assets/images/CaretRight.svg';
import csvFileView from '../../assets/images/csvFrame.svg';
import './admin-ware-house.scss';
import { CSVLink } from 'react-csv';

const AdminWarehouse = () => {
  const dispatch = useDispatch();
  const [adminWarehouseData, setAdminWarehouseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [perPageCount, setPerPageCount] = useState<any>(10);
  const [pageRow, setPageRow] = useState(false);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);

  let [pageNumber, setPageNumber] = useState(1);

  const getAdminWarehouseData = async (page: any) => {
    const object = {
      page_number: page,
      page_size: perPageCount,
    };
    setLoading(true);
    try {
      const data: any = await dispatch(getAdminWareHouseListAction(object));
      if (!data?.adminWareHouseRs || data?.adminWareHouseRs?.length === 0) {
        setAdminWarehouseData([]);
      }
      if (data?.adminWareHouseRs && data?.adminWareHouseRs.length > 0) {
        setLoading(false);
        setPageRow(false);
        setAdminWarehouseData([...data?.adminWareHouseRs]);
        const totalPageCount = Math.ceil(
          data.totalCount / Number(perPageCount),
        );
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

  useEffect(() => {
    getAdminWarehouseData(pageNumber);
  }, [perPageCount, pageRow]);

  useEffect(() => {
    if (pageRow) {
      getAdminWarehouseData(pageNumber);
    }
  }, [pageRow]);

  const onClickBack = () => {
    if (pageNumber > 1) {
      pageNumber -= 1;
      setPageNumber(pageNumber);
      getAdminWarehouseData(pageNumber);
    }
  };

  const onClickNext = () => {
    pageNumber += 1;
    setPageNumber(pageNumber);
    getAdminWarehouseData(pageNumber);
  };

  const handleSelect = async (e: any) => {
    setPageRow(true);
    setPerPageCount(Number(e.target.value));
    setPageNumber(1);
  };

  return (
    <div className="admin_warehouse_page_wrp">
      <MainLayout>
        <div className="container">
          <div className="admin_warehouse_detail_inn">
            {loading ? (
              <Spinner />
            ) : (
              <div className="admin_warehouse_table">
                {adminWarehouseData && adminWarehouseData.length > 0 ? (
                  <>
                    <div className="admin_warehouse_table_inner">
                      <table>
                        <thead>
                          <tr>
                            <th className="firstclmn">#VIN</th>
                            <th className="secndclmln">Warehouse Location</th>
                            <th className="thirdclmn">Inventory Location</th>
                            <th className="fourthclmn">Rack</th>
                            <th className="fifthclmn">Shelf</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminWarehouseData?.map((elm: any, key: number) => (
                            <tr key={key}>
                              <td className="firstclmn">{elm?.VIN}</td>
                              <td className="secndclmln">
                                <select
                                  className="cmnselect noplaceholder"
                                  value={elm?.WarehouseLocation}
                                >
                                  {/* <option>Select location</option> */}
                                  <option>LUX-1001-051822</option>
                                </select>
                              </td>
                              <td className="thirdclmn">
                                <select
                                  className="cmnselect noplaceholder"
                                  value={elm?.countryinventoryLocation}
                                >
                                  {/* <option>Select location</option> */}
                                  <option>New York, NY</option>
                                  <option>Baltimore, MD</option>
                                </select>
                              </td>
                              <td className="fourthclmn">{elm?.Rack}</td>
                              <td className="fifthclmn">{elm?.Shelf}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="row admin_warehouse_pagination_wrp">
                      <div className="col-6 text-left">
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
                        {adminWarehouseData && (
                          <div>
                            <CSVLink
                              className="csv_style"
                              filename={`${new Date().getTime()}.csv`}
                              data={adminWarehouseData}
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
      </MainLayout>
      <Footer />
    </div>
  );
};

export default AdminWarehouse;
