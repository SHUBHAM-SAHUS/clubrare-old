import { useState, memo, useEffect, ChangeEvent } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { postEDitItemReportListAction } from '../../redux/actions';
import { editItemAction } from '../../redux/actions/edit-item-action';
import './edit-item.scss';

const EditItemModal = (props: any) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [descriptionVal, setDescriptionVal] = useState<any>();
  const [title, setTitle] = useState<string>('');

  const EditItemHandler = async () => {
    if (title === '' || title === null || title === undefined) {
      addToast('Title can not be empty', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else {
      setLoading(true);
      try {
        const req = {
          _id: props?.id,
          title: title,
          description: descriptionVal,
        };
        const result: any = await dispatch(editItemAction(req));
        if (result) {
            props.onHide();
            setLoading(false);
            props.getItemDetails();
            addToast('Item updated successfully', {
              appearance: 'success',
              autoDismiss: true,
            });
             } else {
              props.onHide();
              setLoading(false);
              props.getItemDetails();
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
    setDescriptionVal(props?.description);
    setTitle(props?.title);
  }, [props?.description, props?.title]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ pointerEvents: loading ? 'none' : 'auto' }}
      className="editdetailitem_modal"
    >
      <Modal.Header
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">Edit Item</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <div className="fieldwrp ">
          <label>
            Title: <span className="req_field"> * </span>
          </label>
          <input
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            value={title}
          />
        </div>

        <div className="fieldwrp">
          <label>Description:</label>
          <textarea
            onChange={(e: any) => setDescriptionVal(e.target.value)}
            value={descriptionVal}
          />
        </div>
      </Modal.Body>
      <Modal.Footer style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <button
          type="button"
          className={`updatebtn ${loading ? 'disablebtn' : ''}`}
          disabled={loading}
          onClick={EditItemHandler}
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <button type="button" onClick={props.onHide} className="cancelbtn">
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(EditItemModal);
