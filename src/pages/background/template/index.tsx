import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Footer from '../../../components/footer/footer';
import MainLayout from '../../../layouts/main-layout/main-layout';
import { getTemplateAction } from '../../../redux/actions/background-action/template-action';
import { Spinner } from '../../../components/spinner';
import caretLeft from '../../../assets/images/CaretLeft.svg';
import caretRight from '../../../assets/images/CaretRight.svg';
import './background-template.scss';
import { AddTemplateModal } from '../../../components/background/template';
import { DeleteTemplateModal } from '../../../components/background/template/model/index';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import { getEditProfileAction } from '../../../redux';
export const BackgroundTemplate = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const [templateData, setTemplateData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [perPageCount, setPerPageCount] = useState<any>(10);
  const [pageRow, setPageRow] = useState(false);
  const [totalNumberOfPages, setTotalNumberofPages] = useState(0);
  const [currCatInfo, setCurrCatInfo] = useState<any>([]);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
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

  const getTemplateData = async (page: any) => {
    const object = {
      page_number: page,
      page_size: perPageCount,
    };
    setLoading(true);
    try {
      const data: any = await dispatch(getTemplateAction(object));
      if (!data || data?.length === 0) {
        setTemplateData([]);
      }
      if (data && data.length > 0) {
        setLoading(false);
        setPageRow(false);
        setTemplateData([...data]);
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
    getTemplateData(pageNumber);
  }, [perPageCount, pageRow]);

  useEffect(() => {
    if (pageRow) {
      getTemplateData(pageNumber);
    }
  }, [pageRow]);

  const onClickBack = () => {
    if (pageNumber > 1) {
      pageNumber -= 1;
      setPageNumber(pageNumber);
      getTemplateData(pageNumber);
    }
  };

  const onClickNext = () => {
    pageNumber += 1;
    setPageNumber(pageNumber);
    getTemplateData(pageNumber);
  };

  const handleSelect = async (e: any) => {
    setPageRow(true);
    setPerPageCount(Number(e.target.value));
    setPageNumber(1);
  };

  const addTemplateModalHandler = () => {
    setShowCategoryModal(true);
  };

  const deleteTemplateModalHandler = (data: any) => {
    if(currCatInfo?.length>0){
      setShowDeleteColorModal(true);
    }else{
      addToast("Please select at least one", {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };
  const checkboxHandler = (id: string) => {
    const index = currCatInfo.findIndex((item: string) => item === id);
    if (index !== -1) {
      setCurrCatInfo((prevData: any) => [...prevData.slice(index + 1)]);
    } else {
      setCurrCatInfo((prevData: any) => [...prevData, id]);
    }
  };
  return (
    <div className="category_detail_page_wrp">
      <MainLayout>
        <div className="container">
          <div className="category_detail_inn">
            <h1>Background Template</h1>
            <div className="text-right">
              <button
                type="button"
                className="addcatbtn"
                onClick={addTemplateModalHandler}
              >
                Add new background Template
              </button>
              <button
                type="button"
                className="addcatbtn z-10 w-115 fixed right-5 bottom-5"
                onClick={() => deleteTemplateModalHandler('multi')}
              >
                Delete 
              </button>
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <div className="category_table">
                {templateData && templateData.length > 0 ? (
                  <>
                    <div className="category_table_inner">
                      <table>
                        <thead>
                          <tr>
                            <th className="w-1/5	">Checkbox</th>
                            <th className="w-2/5	">thumbnail image</th>
                            <th className="w-1/5	">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {templateData?.map((elm: any, key: number) => (
                            <tr key={key}>
                              <td className="w-1/5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5 cursor-pointer"
                                  onChange={(e) => checkboxHandler(elm?._id)}
                                />
                              </td>

                              <td className="w-2/5">
                                <img src={elm?.thumbnail_image} />
                              </td>
                              <td className="w-1/5">{elm.type}</td>
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
      <AddTemplateModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        getTemplateData={getTemplateData}
        pageSet={() => setPageNumber(1)}
      />
      <DeleteTemplateModal
        show={showDeleteColorModal}
        onHide={() => setShowDeleteColorModal(false)}
        getTemplateData={() => getTemplateData(pageNumber)}
        currCatInfo={currCatInfo}
      />

    </div>
  );
};

