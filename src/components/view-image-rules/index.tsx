import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getImageRulesAction } from '../../redux/actions/category-detail-action';
import { Spinner } from '../../components/spinner';
import './view-image-rules.scss';
import { AddImageRulesModal } from '../add-image-rules';
import { DeleteImageRuleModal } from '../delete-image-rule';

export const ViewImageRulesModal = (props: any) => {
  const dispatch = useDispatch();
  const [imageRulesData, setImageRulesData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currImgRuleId, setCurrImgRuleId] = useState<any>();
  const [showAddImageRulesModal, setShowAddImageRulesModal] =
    useState<boolean>(false);
  const [showDeleteImageRulesModal, setShowDeleteImageRulesModal] =
    useState<boolean>(false);

  const getViewImagesRulesList = async () => {
    setLoading(true);
    try {
      const req = {
        _id: props?.currCatInfo[1],
      };
      const data: any = await dispatch(getImageRulesAction(req));
      if (data?.imageRules && data?.imageRules.length > 0) {
        setImageRulesData([...data?.imageRules]);
        setLoading(false);
      } else {
        setLoading(false);
        setImageRulesData([]);
      }
    } catch (err: any) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getViewImagesRulesList();
  }, []);

  const addImageRulesHandler = () => {
    setShowAddImageRulesModal(true);
  };

  const deleteImageRuleModalHandler = (imageRuleId: any) => {
    setShowDeleteImageRulesModal(true);
    setCurrImgRuleId(imageRuleId);
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="viewimgrules_modal cmn_all_cat_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Image Rules
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button
            type="button"
            className="addcatbtn"
            onClick={addImageRulesHandler}
          >
            Add new image rules
          </button>
          {loading ? (
            <Spinner />
          ) : imageRulesData && imageRulesData.length > 0 ? (
            <div className="table_wrp">
              <table>
                <thead>
                  <tr>
                    <th className="firstclmn">Name</th>
                    <th className="secndclmln">Description</th>
                    <th className="thirdclmn">isRequired</th>
                    <th className="fourthclmn">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {imageRulesData?.map((elm: any, key: number) => (
                    <tr key={key}>
                      <td className="firstclmn">{elm.name}</td>
                      <td className="secndclmln">{elm.description}</td>
                      <td className="thirdclmn">
                        {elm.isRequired ? 'Yes' : 'No'}
                      </td>
                      <td className="fourthclmn">
                        <button
                          type="button"
                          onClick={() => deleteImageRuleModalHandler(elm._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h2> No items </h2>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <AddImageRulesModal
        show={showAddImageRulesModal}
        onHide={() => setShowAddImageRulesModal(false)}
        getViewImagesRulesList={getViewImagesRulesList}
        catId={props?.currCatInfo[1]}
      />
      <DeleteImageRuleModal
        show={showDeleteImageRulesModal}
        onHide={() => setShowDeleteImageRulesModal(false)}
        getViewImagesRulesList={getViewImagesRulesList}
        catId={props?.currCatInfo[1]}
        ImgRuleId={currImgRuleId}
      />
    </>
  );
};
