import React from 'react';
import { Modal } from 'react-bootstrap';

const TransitionHashModel = (props: any) => {
  return (
    <>
      <div>
        <Modal
          {...props}
          open={props?.show}
          className="hashkey"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="details_placebid_heading">
            <Modal.Title id="contained-modal-title-vcenter">
              Please secure the transaction hash
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="details_placebid_body ">
            <h6>{props?.hashkey}</h6>
          </Modal.Body>

          <Modal.Footer className="placebid_btn_footer">
            <button className="placebid_cancel" onClick={props.onCloseModal}>
              Okay
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default TransitionHashModel;
