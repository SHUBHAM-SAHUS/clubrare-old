import { useState, memo, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { postEDitItemReportListAction } from '../../../redux/actions';
import './editmodel.scss';
import Switch from 'react-switch';

const EditDetailModel = (props: any) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [descriptionVal, setDescriptionVal] = useState<string>('');
  const [title, Settitle] = useState<string>('');
  const [isHide, setHide] = useState<boolean>(false);

  interface querydataType {
    _id: number;
    title: string;
    description: string;
    is_hide: boolean;
  }

  const EditItemHandler = async () => {
    if (
      descriptionVal === '' ||
      descriptionVal === null ||
      descriptionVal === undefined
    ) {
      addToast('Description can not be empty', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else if (title === '' || title === null || title === undefined) {
      addToast('Title can not be empty', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else {
      setLoading(true);
      try {
        const req: querydataType = {
          _id: props?.querydata?._id,
          title: title,
          description: descriptionVal,
          is_hide: isHide,
        };
        const result: any = await dispatch(postEDitItemReportListAction(req));
        if (result) {
          props?.getFilterData();
          props.onHide();
          setLoading(false);

          addToast(`${result?.message}`, {
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
    setDescriptionVal(props.querydata?.description);
    Settitle(props.querydata?.title);
    setHide(props.querydata?.is_hide);
  }, [
    props?.querydata?.description,
    props.querydata?.title,
    props?.onHide,
    props.querydata?.is_hide,
  ]);

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
        <div>
          <label className="d-flex justify-content-between">
            <span>Item Hidden </span>
            <Switch
              onChange={(checked: boolean) => setHide(checked)}
              checked={isHide}
            />
          </label>
        </div>

        <div className="fieldwrp">
          <label>
            Title: <span className="req_field"> * </span>
          </label>
          <input
            type="text"
            onChange={(e: any) => Settitle(e.target.value)}
            value={title}
          />
        </div>
        <div className="fieldwrp mt-3">
          <label>
            Description: <span className="req_field"> * </span>
          </label>
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

export default memo(EditDetailModel);
