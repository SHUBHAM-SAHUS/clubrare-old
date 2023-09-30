import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { deleteWhitelistSellerAction } from '../../redux/actions/whitelist-seller-action';
import './delete-whitelist-seller.scss';

export const DeleteWhitelistSeller = (props: any) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState<boolean>(false);

  const deleteWhitelistSellerHandler = async () => {
    setLoading(true);
    try {
      const req = {
        _id: props.sellerId,
      };
      const res: any = await dispatch(deleteWhitelistSellerAction(req));
      if (res) {
        props.onHide();
        setLoading(false);
        props.getWhiteListData();
        addToast('Whitelist seller deleted successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        props.onHide();
        setLoading(false);
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
      aria-labelledby="contained-modal-title-vcenter"
      className="whitelist-seller-modal-wrp delete-seller-modal"
      style={{ pointerEvents: loading ? 'none' : 'auto' }}
      centered
    >
      <Modal.Header
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Are you sure want to delete?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <div className="row">
          <div className="col-6">
            <button
              type="button"
              className={`${loading ? 'disablebtn' : ''}`}
              disabled={loading}
              onClick={deleteWhitelistSellerHandler}
            >
              {loading ? 'Loading...' : 'Yes'}
            </button>
          </div>
          <div className="col-6">
            <button type="button" onClick={props.onHide}>
              No
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
