import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Footer from '../../../components/footer/footer';
import MainLayout from '../../../layouts/main-layout/main-layout';
import { getColorAction } from '../../../redux/actions/background-action/color-action'
import { Spinner } from '../../../components/spinner';
import caretLeft from '../../../assets/images/CaretLeft.svg';
import caretRight from '../../../assets/images/CaretRight.svg';
import { ColorModal } from '../../../components/background/color';
import { DeleteColorModal } from '../../../components/background/color/model/delete-model';
import { useHistory } from 'react-router-dom';
import { getEditProfileAction } from '../../../redux';

export const BackgroundColor = () => {
  const dispatch = useDispatch();

  const [colorData, setColorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [perPageCount, setPerPageCount] = useState<any>(12);
  const [pageRow, setPageRow] = useState(false);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);
  const [currCatInfo, setCurrCatInfo] = useState<any>([]);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] =
    useState<boolean>(false);
  const [showDeleteColorModal, setShowDeleteColorModal] =
    useState<boolean>(false);

  let [pageNumber, setPageNumber] = useState(1);

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

  const getColorData= async (page: any) => {
    const object = {
      page_number: page,
      page_size: perPageCount,
    };
    setLoading(true);
    try {
      const data: any = await dispatch(getColorAction(object));
      if (!data || data?.length === 0) {
        setColorData([]);
      }
      if (data && data.length > 0) {
        setLoading(false);
        setPageRow(false);
        setColorData([...data]);
        const totalPageCount = Math.ceil(
          data.length / Number(perPageCount),
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
    getColorData(pageNumber);
  }, [perPageCount, pageRow]);

  useEffect(() => {
    if (pageRow) {
      getColorData(pageNumber);
    }
  }, [pageRow]);

  const onClickBack = () => {
    if (pageNumber > 1) {
      pageNumber -= 1;
      setPageNumber(pageNumber);
      getColorData(pageNumber);
    }
  };

  const onClickNext = () => {
    pageNumber += 1;
    setPageNumber(pageNumber);
    getColorData(pageNumber);
  };

  const handleSelect = async (e: any) => {
    setPageRow(true);
    setPerPageCount(Number(e.target.value));
    setPageNumber(1);
  };

  const ColorModalHandler = () => {
    setShowCategoryModal(true);
  };

  const updateCategoryModalHandler = (data: any) => {
    setShowUpdateCategoryModal(true);
    setCurrCatInfo([data.color, data._id]);
  };

  const DeleteColorModalHandler = (data: any) => {
    setShowDeleteColorModal(true);
    setCurrCatInfo([data.name, data._id]);
  };

  return (
    <div className="category_detail_page_wrp">
      <MainLayout>
        <div className="container">
          <div className="category_detail_inn">
            <h1>Background Color</h1>
            <div className="text-right">
              <button
                type="button"
                className="addcatbtn"
                onClick={ColorModalHandler}
              >
                Add new background Color
              </button>
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <div className="category_table">
                {colorData && colorData.length > 0 ? (
                  <>
                    <div className="category_table_inner">
                      <table>
                        <thead>
                          <tr>
                            <th className="firstclmn">Color</th>
                            <th className="fourthclmn">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {colorData?.map((elm: any, key: number) => (
                            <tr key={key}>
                              <td className="firstclmn">
                              <input type="color" disabled value={elm?.color}/>
                              </td>
                              <td className="fourthclmn">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCategoryModalHandler(elm)
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    DeleteColorModalHandler(elm)
                                  }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="row whitelist_pagination_wrp">
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
                          <h4 className="h-page-style noofpageelm">
                            {pageNumber}/{totalNumberOfPages}
                          </h4>
                          <button
                            className={`${pageNumber === totalNumberOfPages &&
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
      <ColorModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        getColorData={getColorData}
        pageSet={() => setPageNumber(1)}
        title="Add color"
      />
      <ColorModal
        show={showUpdateCategoryModal}
        onHide={() => setShowUpdateCategoryModal(false)}
        getColorData={() => getColorData(pageNumber)}
        currCatInfo={currCatInfo}
        title="Updates color"
      />
      <DeleteColorModal
        show={showDeleteColorModal}
        onHide={() => setShowDeleteColorModal(false)}
        getColorData={() => getColorData(pageNumber)}
        currCatInfo={currCatInfo}
      />
    
    </div>
  );
};

