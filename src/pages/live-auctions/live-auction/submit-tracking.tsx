import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import { Loading } from '../../../components';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './submit.scss';

const SubmitTracking = (props: any) => {
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
              Submit Tracking
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
            <div className="placebid_input_wrp comn_site_dropdown">
              <Dropdown onSelect={(e: any) => props.changecategory(e)}>
                <Dropdown.Toggle
                  variant="success"
                  // className={`cmntitsel ${
                  //   selectCategory !== "Select Category" ? "notplaceholder" : ""
                  // }`}
                  className="btn_dropdown"
                  id="dropdown-basic"
                >
                  {props.trackingdrop === null ? 'UPS' : props.trackingdrop}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item disabled={true} eventKey="">
                    Select Category
                  </Dropdown.Item>

                  <Dropdown.Item
                    // onClick={() => getCategory(val.name)}
                    eventKey="UPS"
                  >
                    UPS
                  </Dropdown.Item>

                  <Dropdown.Item
                    // onClick={() => getCategory(val.name)}
                    eventKey="USPS"
                  >
                    USPS
                  </Dropdown.Item>

                  <Dropdown.Item
                    // onClick={() => getCategory(val.name)}
                    eventKey="FEDEX"
                  >
                    FEDEX
                  </Dropdown.Item>

                  <Dropdown.Item
                    // onClick={() => getCategory(val.name)}
                    eventKey="DHL"
                  >
                    DHL
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div className="mt-3">
                <p className="placebid_input_left col-12">
                  {' '}
                  Enter your Tracking Number{' '}
                </p>
                {/* trackingid */}
                <input
                  type="text"
                  name="Bid"
                  value={props?.trackingValue}
                  className="placebid_input_feild"
                  placeholder="Please enter tracking number"
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                  maxLength={40}
                />
                <p style={{ color: 'red' }}>{props.trackingValErr}</p>
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
              {props.loading ? (
                <div className="d-flex justify-content-center">
                  {' '}
                  <Loading margin={'0'} size={'25px'} />
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default SubmitTracking;
