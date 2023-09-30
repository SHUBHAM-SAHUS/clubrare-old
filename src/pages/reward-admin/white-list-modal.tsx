import { Modal, Button } from 'react-bootstrap';
import { imgConstants } from '../../assets/locales/constants';
import './reward-admin';

export const WhiteListModal = (props: any) => {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        className="whitelist_modal"
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Whitelist</Modal.Title>
          <Button onClick={props.onHide}>
            <img src={imgConstants.close} alt="closeIcon" />
          </Button>
        </Modal.Header>

        <Modal.Body>
          <div className="whitelist_add_wrp">
            <ul>
              {props.whiteListData &&
                props.whiteListData.map((elm: any, key: number) => {
                  return <li key={key}>{elm.wallet_address}</li>;
                })}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
