import { memo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';

const PlaceBid = (props: any) => {
  return (
    <div>
      <Modal
        {...props}
        show={props?.show}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="details_bidmodal details_palcebid_modal"
        backdrop="static"
      >
        <Modal.Header className="details_placebid_heading">
          <Modal.Title id="contained-modal-title-vcenter">
            Place a Bid
          </Modal.Title>
          <Button
            className="details_placebidmodal_closebtn"
            onClick={props.onHide}
            style={{ pointerEvents: props.placeABidLoading ? 'none' : 'auto' }}
          >
            <AiOutlineClose />
          </Button>
        </Modal.Header>
        <Modal.Body
          className="details_placebid_body "
          style={{ pointerEvents: props.placeABidLoading ? 'none' : 'auto' }}
        >
          You are placing a bid for{' '}
          <p className="placebid_heading_msg text_break_item">
            <span>{props.itemName}</span>
          </p>
          <div className="placebid_input_wrp">
            <div className=" row placebid_input_top">
              <p className="placebid_input_left col-6">Your Bid</p>
              <p className="placebid_input_right col-6 text-right">
                Bid at least{' '}
                <span>
                  {Number(props.displayValues.value)
                    ? props.displayValues.value
                    : 0}
                </span>
              </p>
            </div>

            <div className="placebid_input_feild_wrp">
              <input
                maxLength={18}
                type="number"
                name="Bid"
                value={props.bidValue}
                className="placebid_input_feild"
                placeholder="0.00"
                onChange={(e) => props.handleBidValue(e)}
              />
              <span className="placebid_input_feild_eth">
                {' '}
                {props.currencyname}
              </span>
            </div>
            {props.placeForBidCheck && (
              <p
                className="input_bottom_error text-center"
                style={{ color: 'red' }}
              >
                {props.bidValueError}
              </p>
            )}

            {props.mustLoginToBid && (
              <div className="must_login">
                <p
                  className="input_bottom_error"
                  onClick={props.goToWalletConnect}
                >
                  You must login to place a bid
                </p>
              </div>
            )}
            {props.mustLoginToBuy && (
              <div className="must_login">
                <p
                  className="input_bottom_error"
                  onClick={props.goToWalletConnect}
                >
                  You must login to place buy this item
                </p>
              </div>
            )}

            <p className="placebid_input_feild_bottom">${props.price} USD</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="placebid_btn_footer">
          <button
            style={
              props.placeABidLoading
                ? { pointerEvents: 'none', opacity: '0.4' }
                : {}
            }
            className="placebid_cancel"
            onClick={props.onHide}
          >
            Cancel
          </button>
          <button
            style={
              props.placeABidLoading
                ? { pointerEvents: 'none', opacity: '0.4' }
                : {}
            }
            // disabled={props.placeABidLoading || props.bidValue == ""}
            onClick={props.onPlaceBid}
            className="placebid_btn"
          >
            {props.placeABidLoading ? 'Loading...' : 'Place Bid'}
          </button>
          {props?.redeemable && (
            <h6 className="policy_notes text-center mt-3">
              Note: Kindly note all physical items have a no return/cancellation
              policy.
            </h6>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default memo(PlaceBid);
