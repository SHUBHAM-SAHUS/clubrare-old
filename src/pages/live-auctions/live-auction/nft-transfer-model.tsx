import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';

const NftTransferModel = (props: any) => {
  const nftRef: any = React.useRef(null);

  const handleNftSideClick = (event: any) => {
    if (nftRef && nftRef.current && !nftRef.current.contains(event.target)) {
      props.onCloseModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleNftSideClick);
  }, []);

  const handleChange = (e: any) => {
    props.removeError();
    props.setValue(e.target.value);
  };

  return (
    <>
      <div>
        <Modal
          {...props}
          open={props?.show}
          className="transfer_modal"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="details_placebid_heading">
            <Modal.Title id="contained-modal-title-vcenter">
              Transfer Nft
            </Modal.Title>
            <Button
              className="details_placebidmodal_closebtn"
              style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
              onClick={props.onCloseModal}
            >
              <AiOutlineClose />
            </Button>
          </Modal.Header>

          <Modal.Body
            className="transfer_modal_style"
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
          >
            <div className="placebid_input_wrp">
              <div className="">
                <p className="placebid_input_left col-12 mb-2">
                  {' '}
                  Enter your wallet address{' '}
                  <span className="req_field"> * </span>
                </p>

                <input
                  type="text"
                  name="Bid"
                  value={props.transferValue}
                  className="placebid_input_feild"
                  placeholder="Please enter wallet address"
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
                <p style={{ color: 'red' }}>{props.transferValErr}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer
            className="placebid_btn_footer"
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
          >
            <button className="placebid_cancel" onClick={props.onCloseModal}>
              cancel
            </button>
            <button onClick={props.handleSaveData} className="placebid_btn">
              {props.loading ? 'Loading...' : 'Transfer'}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default NftTransferModel;
