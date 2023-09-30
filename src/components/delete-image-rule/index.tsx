import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { deleteImageRuleAction } from '../../redux/actions/category-detail-action';
import './delete-image-rule.scss';

export const DeleteImageRuleModal = (props: any) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [deleteImageRulesloading, setDeleteImageRulesLoading] =
    useState<any>(false);

  const DeleteImageRuleHandler = async () => {
    setDeleteImageRulesLoading(true);
    try {
      const req = {
        _id: props?.catId,
        imageRuleId_id: props?.ImgRuleId,
      };
      const result: any = await dispatch(deleteImageRuleAction(req));
      if (result) {
        setDeleteImageRulesLoading(false);
        props.getViewImagesRulesList();
        props.onHide();
        addToast('Image rule deleted successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        setDeleteImageRulesLoading(false);
        props.onHide();
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (err: any) {
      setDeleteImageRulesLoading(false);
      props.onHide();
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ pointerEvents: deleteImageRulesloading ? 'none' : 'auto' }}
      className="deleteimgrules_modal cmn_all_cat_modal"
    >
      <Modal.Header
        style={{ pointerEvents: deleteImageRulesloading ? 'none' : 'auto' }}
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Are you sure you want to delete this image rule ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer
        style={{ pointerEvents: deleteImageRulesloading ? 'none' : 'auto' }}
      >
        <button
          type="button"
          className={`sbmtbtn ${deleteImageRulesloading ? 'disablebtn' : ''}`}
          disabled={deleteImageRulesloading}
          onClick={DeleteImageRuleHandler}
        >
          {deleteImageRulesloading ? 'Loading...' : 'Yes'}
        </button>
        <button type="button" onClick={props.onHide} className="cancelbtn">
          No
        </button>
      </Modal.Footer>
    </Modal>
  );
};
