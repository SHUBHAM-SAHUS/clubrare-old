import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { addTemplateAction } from '../../../redux/actions/background-action/template-action';
export const AddTemplateModal = (props: any) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [template, setTemplate] = useState<Array<string>>();
  const [templateType, setTemplateType] = useState<string>('template');

  const AddCategoryHandler = async () => {
    if (!template || !templateType) {
      addToast('template can not be empty', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else {
      setLoading(true);
      try {
        let data = new FormData();
        template?.map((_:any,i:number)=>{

          data.append("image",template && template[i])
        })
        data.append('type', templateType);
        const result: any = await dispatch(addTemplateAction(data));
        if (result.status) {
          props.onHide();
          setLoading(false);
          props.pageSet();
          props.getTemplateData(1);
          addToast('template added successfully', {
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

  const fileHandler = (e: any) => {
    setTemplate([...e.target.files]);
  };
  const deleteFileHandler =(i:number)=>{
    setTemplate(template?.filter((_:any,j:number)=>j!==i))
  }

  useEffect(() => {
    setTemplate([]);
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
          Add new template
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        {template && template?.length > 0 ? (
          <div className="fieldwrp image">
            {template &&
              template?.map((data: any, i: number) => (
                <div key ={i} className="background_wrap">
                  <label className="background_lable">
                    <button onClick={(e) => deleteFileHandler(i)}>X</button>
                  </label>
                  <img
                    key={i}
                    style={{ width: '100px' }}
                    src={URL.createObjectURL(data)}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div className="fieldwrp">
            <label>
              image: <span className="req_field"> * </span>
            </label>
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg, image/*"
              multiple={true}
              placeholder="Enter category name"
              onChange={fileHandler}
            />
          </div>
        )}

        <div className="fieldwrp">
          <label>
            type: <span className="req_field"> * </span>
          </label>
          <select
            onChange={(e) => setTemplateType(e.target.value)}
            value={templateType}
          >
            <option value="template">Template</option>
            <option value="border">Border</option>
            <option value="object">Object</option>
            <option value="lighting">Lighting</option>
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <button
          type="button"
          className={`sbmtbtn ${loading ? 'disablebtn' : ''}`}
          disabled={loading}
          onClick={AddCategoryHandler}
        >
          {loading ? 'Loading...' : 'Add Template'}
        </button>
        <button type="button" onClick={props.onHide} className="cancelbtn">
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};
