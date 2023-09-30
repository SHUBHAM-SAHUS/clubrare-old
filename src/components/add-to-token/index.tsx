import "../add-to-token/add-to-token.scss";
import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getWeb3 } from "../../service/web3-service";
import { imgConstants } from "../../assets/locales/constants";
import { useCustomStableCoin } from '../../hooks';

const AddToToken = (props: any) => {
    const { customFromWei } = useCustomStableCoin();
  var wallet_address: any = localStorage
    .getItem("Wallet Address")
    ?.toLowerCase();

  var shareProfile = `${window.location.origin}/profile/${wallet_address}`;

  const [mpwrClaimVal, setMpwrClaimVal] = useState<any>();

  useEffect(() => {
    if (!props.addTokenLoading) {
      props.setShowMethod(false);
    }
  }, [props,props.addTokenLoading]);

  useEffect(() => {
    async function fetchData() {
      const { web3 }: any = await getWeb3();
      let pr = await customFromWei(
        props.airdropStashData.mpwr_to_claim,
        web3,''
      );
      setMpwrClaimVal(Number(pr).toFixed(6));
    }
    if (props.airdropStashData.mpwr_to_claim) {
      fetchData();
    }
  }, [props.airdropStashData]);

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="readytoearn_modal ready_Congratulations_modal"
        backdrop="static"
        style={{ pointerEvents: props.hideCursor ? "none" : "auto" }}
      >
        <Modal.Header>
          <Modal.Title>Congratulations</Modal.Title>
          <Button
            onClick={props.onHide}
            style={{ pointerEvents: props.hideCursor ? "none" : "auto" }}
          >
            <img src={imgConstants.close} alt="close" />
          </Button>
        </Modal.Header>

        <Modal.Body>
          <div className="Congratulations_wrp">
            <img src={imgConstants.mpwr_icon} alt="mpwr_icon" />
            <div className="Congratulations">
              <h4>You’ve earned {mpwrClaimVal} MPWR Token</h4>
            </div>
          </div>
          <div className="Additional_info_wrp">
            <div className="rewards_wrp headstart_wrp">
              <div className="rewards_heading headstart_heading">
                <img src={imgConstants.PersonSimpleRun} alt="person" />
                <h4>Get a Headstart</h4>
              </div>
              <div className="rewards_details_wrp headstart_details_wrp">
                <p>
                  We want you to get ahead and succeed. Gain more visibility by
                  sharing your listing on social media. Don’t forget to use{" "}
                  <span>#clubrare</span>
                </p>
                <div className="serch_sect_wrp">
                  <input
                    type="text"
                    className="backgroup-trans"
                    placeholder="Search Collections"
                    value={shareProfile}
                    onClick={() => navigator.clipboard.writeText(shareProfile)}
                  />
                </div>
                <div className="social_icons_wrp">
                  <a
                    href={`https://www.facebook.com/sharer.php?u=${shareProfile}`}
                    target="_blank"
                    className="facebook_icon"
                    rel="noreferrer"
                  >
                    <img src={imgConstants.facebook} alt="facebook" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareProfile}`}
                    target="_blank"
                    className="twitter_icon"
                    rel="noreferrer"
                  >
                    <img src={imgConstants.twitter} alt="img" />
                  </a>
                  <a
                    href={`https://reddit.com/submit?url=${shareProfile}&title=https://clubrare.xyz`}
                    target="_blank"
                    className="reddit_icon"
                    rel="noreferrer"
                  >
                    <img src={imgConstants.Reddit} alt="reddit" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="ready_btn tokentometamask_btn"
            onClick={props.addToken}
            disabled={props.addTokenLoading}
          >
            Add Token to Metamask
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { AddToToken };