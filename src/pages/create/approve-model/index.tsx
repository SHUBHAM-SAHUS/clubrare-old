import { Button, Modal } from 'react-bootstrap';
import { useState, memo } from 'react';
import { Loading } from '../../../components/loading';
import { useHistory } from 'react-router-dom';

import { imgConstants } from '../../../assets/locales/constants';

const ApproveModel = (props: any) => {
  const history = useHistory();

  return (
    <>
      <Modal
        {...props}
        open={props?.show}
        className="transfer_modal TokenWithdrawmodel followstepmodaluser"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
      >
        <Modal.Header className="details_placebid_heading followstepheadwrp">
          <Modal.Title id="contained-modal-title-vcenter">
            Follow Step
          </Modal.Title>

          <Button
            className="details_placebidmodal_closebtn"
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
            onClick={() => history.push(`/item/${props.itemid}`)}
          >
            <img src={imgConstants.close} alt="close" />
          </Button>
        </Modal.Header>

        <Modal.Body className="transfer_modal_style">
          <div className="follow_inside">
            <div className="create_collection_btn_wrp follow_btn_wrp text-center">
              <button
                onClick={() => {
                  props.putOnSale();
                }}
                className="nrml_btn createcmnbtn"
              >
                {props.onsaleloading ? (
                  <div className="d-flex justify-content-center">
                    {' '}
                    <Loading margin={'0'} size={'25px'} />
                  </div>
                ) : (
                  'SIGN SALE ORDER'
                )}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default memo(ApproveModel);
