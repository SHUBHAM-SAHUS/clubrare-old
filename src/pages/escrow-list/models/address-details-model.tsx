
import { memo } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import './editmodel.scss';

const AddressDetailsModel = (props: any) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="editdetailitem_modal"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="title_heading"
        >
          Address Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* full_name, email, address, city, state, zip_code, country, phone_number */}

        <div className=" mt-3">
          <div>
            {' '}
            <span className="keyheading"> Name </span> :{' '}
            <span> {props?.details?.full_name}</span>
          </div>
          <div>
            <span className="keyheading"> Email </span> :{' '}
            <span> {props?.details?.email}</span>
          </div>

          <div>
            <span className="keyheading"> Phone Number </span> :{' '}
            <span> {props?.details?.phone_number}</span>
          </div>
          <div>
            <span className="keyheading"> City </span> :{' '}
            <span> {props?.details?.city}</span>
          </div>
          <div>
            <span className="keyheading"> State </span> :{' '}
            <span> {props?.details?.state}</span>
          </div>
          <div>
            <span className="keyheading"> Zip Code </span> :{' '}
            <span> {props?.details?.zip_code}</span>
          </div>

          <div>
            <span className="keyheading"> Country </span> :{' '}
            <span> {props?.details?.country}</span>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default memo(AddressDetailsModel);
