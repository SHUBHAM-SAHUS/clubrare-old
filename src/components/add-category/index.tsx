import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { addCategoryAction } from '../../redux/actions/category-detail-action';
import './add-category.scss';

export const AddCategoryModal = (props: any) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [catName, setCatName] = useState<any>('');

  const AddCategoryHandler = async () => {
    if (catName === '' || catName === null || catName === undefined) {
      addToast('Category can not be empty', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else {
      setLoading(true);
      try {
        const req = {
          name: catName,
        };
        const result: any = await dispatch(addCategoryAction(req));
        if (result.status) {
          props.onHide();
          setLoading(false);
          props.pageSet();
          props.getCategoryData(1);
          addToast('Category added successfully', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          props.onHide();
          setLoading(false);
          addToast(result.message, {
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
    setCatName('');
  }, [props.show]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ pointerEvents: loading ? 'none' : 'auto' }}
      className="addcategory_modal cmn_all_cat_modal"
    >
      <Modal.Header
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Add new category
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <div className="fieldwrp">
          <label>
            Name: <span className="req_field"> * </span>
          </label>
          <input
            placeholder="Enter category name"
            onChange={(e) => setCatName(e.target.value)}
            value={catName}
          />
        </div>
      </Modal.Body>
      <Modal.Footer style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <button
          type="button"
          className={`sbmtbtn ${loading ? 'disablebtn' : ''}`}
          disabled={loading}
          onClick={AddCategoryHandler}
        >
          {loading ? 'Loading...' : 'Add Category'}
        </button>
        <button type="button" onClick={props.onHide} className="cancelbtn">
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};
