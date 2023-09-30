import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Footer from '../../components/footer/footer';
import MainLayout from '../../layouts/main-layout/main-layout';
import { getCategoryAction } from '../../redux/actions/category-detail-action';
import { Spinner } from '../../components/spinner';
import caretLeft from '../../assets/images/CaretLeft.svg';
import caretRight from '../../assets/images/CaretRight.svg';
import view from '../../assets/images/View.svg';
import './category-detail.scss';
import { AddCategoryModal } from '../../components/add-category';
import { UpdateCategoryModal } from '../../components/edit-category';
import { DeleteCategoryModal } from '../../components/delete-category';
import { ViewImageRulesModal } from '../../components/view-image-rules';

const CategoryDetail = () => {
  const dispatch = useDispatch();

  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [perPageCount, setPerPageCount] = useState<any>(10);
  const [pageRow, setPageRow] = useState(false);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);
  const [currCatInfo, setCurrCatInfo] = useState<any>([]);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] =
    useState<boolean>(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] =
    useState<boolean>(false);
  const [showViewImageRulesModal, setShowImageRulesModal] =
    useState<boolean>(false);

  let [pageNumber, setPageNumber] = useState(1);

  const getCategoryData = async (page: any) => {
    const object = {
      page_number: page,
      page_size: perPageCount,
    };
    setLoading(true);
    try {
      const data: any = await dispatch(getCategoryAction(object));
      if (!data?.getallCategory || data?.getallCategory?.length === 0) {
        setCategoryData([]);
      }
      if (data?.getallCategory && data?.getallCategory.length > 0) {
        setLoading(false);
        setPageRow(false);
        setCategoryData([...data?.getallCategory]);
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
    getCategoryData(pageNumber);
  }, [perPageCount, pageRow]);

  useEffect(() => {
    if (pageRow) {
      getCategoryData(pageNumber);
    }
  }, [pageRow]);

  const onClickBack = () => {
    if (pageNumber > 1) {
      pageNumber -= 1;
      setPageNumber(pageNumber);
      getCategoryData(pageNumber);
    }
  };

  const onClickNext = () => {
    pageNumber += 1;
    setPageNumber(pageNumber);
    getCategoryData(pageNumber);
  };

  const handleSelect = async (e: any) => {
    setPageRow(true);
    setPerPageCount(Number(e.target.value));
    setPageNumber(1);
  };

  const addCategoryModalHandler = () => {
    setShowCategoryModal(true);
  };

  const updateCategoryModalHandler = (data: any) => {
    setShowUpdateCategoryModal(true);
    setCurrCatInfo([data.name, data._id]);
  };

  const deleteCategoryModalHandler = (data: any) => {
    setShowDeleteCategoryModal(true);
    setCurrCatInfo([data.name, data._id]);
  };


  const viewImageRulesModalHandler = (data: any) => {
    setShowImageRulesModal(true);
    setCurrCatInfo([data.name, data._id]);
  };

  return (
    <div className="category_detail_page_wrp">
      <MainLayout>
        <div className="container">
          <div className="category_detail_inn">
            <h1>Category Details</h1>
            <div className="text-right">
              <button
                type="button"
                className="addcatbtn"
                onClick={addCategoryModalHandler}
              >
                Add new category
              </button>
            </div>
            {loading ? (
              <Spinner />
            ) : (
              <div className="category_table">
                {categoryData && categoryData.length > 0 ? (
                  <>
                    <div className="category_table_inner">
                      <table>
                        <thead>
                          <tr>
                            <th className="firstclmn">Name</th>
                            <th className="thirdclmn">View Image Rules</th>
                            <th className="fourthclmn">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryData?.map((elm: any, key: number) => (
                            <tr key={key}>
                              <td className="firstclmn">{elm.name}</td>
                              <td className="thirdclmn">
                                <div
                                  onClick={() =>
                                    viewImageRulesModalHandler(elm)
                                  }
                                >
                                  <img src={view} alt="view" />
                                </div>
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
                                    deleteCategoryModalHandler(elm)
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
      <AddCategoryModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        getCategoryData={getCategoryData}
        pageSet={() => setPageNumber(1)}
      />
      <UpdateCategoryModal
        show={showUpdateCategoryModal}
        onHide={() => setShowUpdateCategoryModal(false)}
        getCategoryData={() => getCategoryData(pageNumber)}
        currCatInfo={currCatInfo}
      />
      <DeleteCategoryModal
        show={showDeleteCategoryModal}
        onHide={() => setShowDeleteCategoryModal(false)}
        getCategoryData={() => getCategoryData(pageNumber)}
        currCatInfo={currCatInfo}
      />
      {showViewImageRulesModal && (
        <ViewImageRulesModal
          show={showViewImageRulesModal}
          onHide={() => setShowImageRulesModal(false)}
          currCatInfo={currCatInfo}
        />
      )}
    </div>
  );
};
export default CategoryDetail;
