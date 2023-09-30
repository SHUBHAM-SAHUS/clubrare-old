import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import './submit.scss';

import { CopyToClipboard } from 'react-copy-to-clipboard';
const copyIcon = 'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/Copy.svg';

const ViewTracking = (props: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
              View Tracking Number
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
            <div className="transfer_modal_style_inner">
              <h3 className="tracking_number "> {props?.trackingid} </h3>
              <CopyToClipboard
                text={props?.trackingid?.toString()}
                onCopy={onCopyText}
              >
                <div className="hasidwrp ">
                  {isCopied ? (
                    <span>Copied</span>
                  ) : (
                    <span>
                      <img src={copyIcon} alt="CopyIcon" />
                    </span>
                  )}
                </div>
              </CopyToClipboard>
            </div>

            <h5 className="typetext mt-2">{props.viewtype} </h5>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default ViewTracking;
