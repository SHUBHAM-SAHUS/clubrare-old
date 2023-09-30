import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { deleteColorAction } from '../../../../../redux/actions/background-action/color-action';

export const DeleteColorModal = (props: any) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const DeleteColorHandler = async () => {
    setLoading(true);
    try {
      const req = {
        id: props?.currCatInfo[1],
      };
      const result: any = await dispatch(deleteColorAction(req));
      if (result.status) {
        props.onHide();
        setLoading(false);
        props.getColorData();
        addToast('Color deleted successfully', {
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
      className="deletecategory_modal cmn_all_cat_modal"
    >
      <Modal.Header
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Are you sure you want to delete this color ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <button
          type="button"
          className={`sbmtbtn ${loading ? 'disablebtn' : ''}`}
          disabled={loading}
          onClick={DeleteColorHandler}
        >
          {loading ? 'Loading...' : 'Yes'}
        </button>
        <button type="button" onClick={props.onHide} className="cancelbtn">
          No
        </button>
      </Modal.Footer>
    </Modal>
  );
};
