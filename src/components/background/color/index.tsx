import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { addColorAction, updateColorAction } from '../../../redux/actions/background-action/color-action';

export const ColorModal = (props: any) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [colorCode, setcolorCode] = useState<any>('');
  const colorHandler = async () => {
    if (colorCode === '' || colorCode === null || colorCode === undefined) {
      addToast('color can not be empty', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else {
      setLoading(true);
      try {
        let req = {};
        let result :any
        if (props?.currCatInfo?.[0]) {
          req = {
            color: colorCode,
            id: props?.currCatInfo[1],
          };
          result = await dispatch(updateColorAction(req));
        } else {
          req = {
            colors: [colorCode],
          };
          result = await dispatch(addColorAction(req));
        }
        if (result.status) {
          props.onHide();
          setLoading(false);
          props.getColorData?.();
          addToast('Color added successfully', {
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
    setcolorCode(props?.currCatInfo?.[0]);
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
          Add new color
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <div className="fieldwrp">
          <label>
            color: <span className="req_field"> * </span>
          </label>
          <input
            type="color"
            onChange={(e) => setcolorCode(e.target.value)}
            value={colorCode}
          />
        </div>
      </Modal.Body>
      <Modal.Footer style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <button
          type="button"
          className={`sbmtbtn ${loading ? 'disablebtn' : ''}`}
          disabled={loading}
          onClick={colorHandler}
        >
          {loading ? 'Loading...' : props?.title}
        </button>
        <button type="button" onClick={props.onHide} className="cancelbtn">
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};
