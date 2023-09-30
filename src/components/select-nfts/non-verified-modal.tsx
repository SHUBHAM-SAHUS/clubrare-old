import { Modal } from 'react-bootstrap';
import { imgConstants } from '../../assets/locales/constants';

export const NonVerifiedModal = (props: any) => {
  const confirmModal = () => {
    props.puonsaleModal();
    props.onHide();
  };

  return (
    <>
      <Modal
        show={props?.show}
        onHide={props.onHide}
        centered
        className="nonverifiedmoda_wrp"
      >
        <Modal.Header className="text-right">
          <button className="put_sale_close_wrp" onClick={props.onHide}>
            <img src={imgConstants.close} alt="img" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="nonverified_inn">
            <p>
              You’re trying to list unverified collections, so this collection
              won’t be count as a listed for MPWR airdrop, Are you sure want to
              continue ?
            </p>
            <div className="text-right allbtnwrp">
              <button
                type="button"
                className="confirmbtn cmmnbtn"
                onClick={confirmModal}
              >
                Yes
              </button>
              <button
                type="button"
                className="cmmnbtn cancel_button"
                onClick={props.onHide}
              >
                No
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
