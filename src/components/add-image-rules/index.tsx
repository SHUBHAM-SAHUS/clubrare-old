import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { addImageRuleAction } from '../../redux/actions/category-detail-action';
import './add-image-rules.scss';

export const AddImageRulesModal = (props: any) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageRuleNameVal, setImageRuleNameVal] = useState<any>();
  const [imageRuleDescVal, setImageRuleDescVal] = useState<any>();
  const [isRequiredVal, setIsRequiredVal] = useState<boolean>(false);

  const AddImageRuleHandler = async () => {
    if (
      imageRuleNameVal === '' ||
      imageRuleNameVal === null ||
      imageRuleNameVal === undefined
    ) {
      addToast('Name is required', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else if (
      imageRuleDescVal === '' ||
      imageRuleDescVal === null ||
      imageRuleDescVal === undefined
    ) {
      addToast('Description is required', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else {
      setLoading(true);
      try {
        const req = {
          _id: props?.catId,
          name: imageRuleNameVal,
          description: imageRuleDescVal,
          isRequired: isRequiredVal,
        };
        const result: any = await dispatch(addImageRuleAction(req));
        if (result) {
          props.onHide();
          setLoading(false);
          props.getViewImagesRulesList();
          addToast('Image rule added successfully', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          props.onHide();
          setLoading(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (err: any) {
        props.onHide();
        setLoading(false);
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  useEffect(() => {
    setImageRuleNameVal('');
    setImageRuleDescVal('');
    setIsRequiredVal(false);
  }, [props.show]);

  const onChangeValue = (event: any) => {
    if (event.target.value === 'yes') {
      setIsRequiredVal(true);
    } else {
      setIsRequiredVal(false);
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
      style={{ pointerEvents: loading ? 'none' : 'auto' }}
      className="addimgrules_modal cmn_all_cat_modal"
    >
      <Modal.Header
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Add Image Rule
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <div className="fieldwrp">
          <label>
            Name: <span className="req_field"> * </span>
          </label>
          <input
            placeholder="Enter name"
            onChange={(e) => setImageRuleNameVal(e.target.value)}
            value={imageRuleNameVal}
          />
        </div>
        <div className="fieldwrp">
          <label>
            Description: <span className="req_field"> * </span>
          </label>
          <input
            placeholder="Enter description"
            onChange={(e) => setImageRuleDescVal(e.target.value)}
            value={imageRuleDescVal}
          />
        </div>
        <div className="fieldwrp">
          <label>isRequired:</label>
          <input
            type="radio"
            value="yes"
            name="is_required"
            onChange={onChangeValue}
          />{' '}
          Yes
          <input
            type="radio"
            value="no"
            name="is_required"
            checked={!isRequiredVal}
            onChange={onChangeValue}
          />{' '}
          No
        </div>
      </Modal.Body>
      <Modal.Footer style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <button
          type="button"
          className={`sbmtbtn ${loading ? 'disablebtn' : ''}`}
          disabled={loading}
          onClick={AddImageRuleHandler}
        >
          {loading ? 'Loading...' : 'Add Image Rule'}
        </button>
        <button type="button" onClick={props.onHide} className="cancelbtn">
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};
