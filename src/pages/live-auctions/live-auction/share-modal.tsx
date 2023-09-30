import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import { imgConstants } from '../../../assets/locales/constants';

const ShareModal = (props: any) => {
  const [shareNFT, setShareNFT] = useState('');

  useEffect(() => {
    const getURL = window.location.href;
    setShareNFT(getURL);
  }, []);

  return (
    <div>
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="details_share_modal mt-5"
      >
        <Modal.Header className="details_share_heading">
          <Modal.Title id="contained-modal-title-vcenter">
            Share NFT
          </Modal.Title>
          <Button
            className="details_sharemodal_closebtn"
            onClick={props.onHide}
          >
            <AiOutlineClose />
          </Button>
        </Modal.Header>
        <Modal.Body className="details_share_body d-flex justify-content-between">
          <a
            href={`https://www.facebook.com/sharer.php?u=${shareNFT}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={imgConstants.facebook2}
              alt="facebookicon"
              onClick={props.onHide}
            />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareNFT}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={imgConstants.twitter2}
              onClick={props.onHide}
              alt="onHide"
            />
          </a>
          <a
            href={`https://t.me/share/url?url=${shareNFT}`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={imgConstants.telegram2}
              onClick={props.onHide}
              alt="onHide"
            />
          </a>
          <Link to="#" onClick={() => navigator.clipboard.writeText(shareNFT)}>
            <img
              src={imgConstants.link2}
              alt="linkicon"
              onClick={props.onHide}
            />
          </Link>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ShareModal;
