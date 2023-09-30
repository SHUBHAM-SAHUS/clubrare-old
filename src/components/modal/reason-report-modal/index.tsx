import React, { memo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { imgConstants } from '../../../assets/locales/constants';
import { Loading } from '../../loading';
import '../../../pages/reports-list/reports-list.css'
import './reason-report-modal.css'
const UserReportModal = (props: any) => {
  return (
    <>
      <Modal
        {...props}
        open={props?.show}
        className="transfer_modal reports-modal-style"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
      >
        <Modal.Header className="details_placebid_heading">
          <Modal.Title id="contained-modal-title-vcenter">
          Reason of Reporting
          </Modal.Title>
          <Button
            className="details_placebidmodal_closebtn"
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
            onClick={props.closeModal}
          >
            <img src={imgConstants.close} alt="img" />
          </Button>
        </Modal.Header>
        <Modal.Body className="transfer_modal_style">
          <div className="modal-content text-center  border-none">
            {props.reason}         
          </div>
        </Modal.Body>
        <Modal.Footer
          className=""
          style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
        >
          <Button
            className="button-black"
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
            onClick={props.closeModal}
          >
            Block
          </Button>

          <Button
            className="button-white"
            onClick={props.closeModal}
          >
            {props.poolstakeloading ? (
              <div className="d-flex justify-content-center">
                <Loading margin={'0'} size={'25px'} />
              </div>
            ) : (
              'Warning'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(UserReportModal);
