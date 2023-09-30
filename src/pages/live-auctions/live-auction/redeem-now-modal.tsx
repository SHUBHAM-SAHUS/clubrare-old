import React, { useState } from 'react';
import './live-auction.css';
import { useDispatch } from 'react-redux';
import { postRedeemItemCreateAction } from '../../../redux';
import { ToastProvider } from 'react-toast-notifications';
import { useToasts } from 'react-toast-notifications';

function RedeemNowModal(props: any) {
  const { addToast } = useToasts();
  // const [loading,Setloading]= useState<boolean>(false)

  const [fields, setFields] = useState({
    full_name: '',
    address: '',
    phone_number: '',
    city: '',
    country: '',
    state: '',
    zip: '',
  });
  const [errors, setErrors] = useState({
    full_name: '',
    address: '',
    phone_number: '',
    city: '',
    country: '',
    state: '',
    zip: '',
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const error = checkValidation();

    if (error === false) {
      setLoading(true);
      const body = {
        name: fields.full_name,
        address: fields.address,
        phone: fields.phone_number,
        city: fields.city,
        zip: fields.zip,
        state: fields.state,
        country: fields.country,
        item_owner:
          props?.itemDetails?.history?.onSale &&
          props?.itemDetails?.history?.onSale.length > 0
            ? props?.itemDetails?.history?.onSale[
                props?.itemDetails?.history?.onSale.length - 1
              ].seller
            : '',
        burn: props?.itemDetails?.redeem_type == '1' ? false : true,
        collectible_id: props?.itemDetails?._id,
      };
      const res: any = await dispatch(postRedeemItemCreateAction(body));
      if (res.status === true) {
        setLoading(false);
        props.openRedeemRequestModal();
        addToast('Redeem successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
        setLoading(false);
      } else {
        setLoading(false);
        addToast('Something was wrong', {
          appearance: 'error',
          autoDismiss: true,
        });
        setLoading(false);
      }
    }
  };

  const checkValidation = () => {
    let error = false;
    const obj = {
      full_name: '',
      address: '',
      phone_number: '',
      city: '',
      country: '',
      state: '',
      zip: '',
    };
    if (fields.full_name === '') {
      obj.full_name = 'Please enter fullname';
      error = true;
    }
    if (fields.address === '') {
      obj.address = 'Please enter address';
      error = true;
    }
    if (fields.phone_number === '') {
      obj.phone_number = 'Please enter phone number';
      error = true;
    }
    if (fields.city === '') {
      obj.city = 'Please enter city';
      error = true;
    }
    if (fields.country === '') {
      obj.country = 'Please enter country';
      error = true;
    }
    if (fields.state === '') {
      obj.state = 'Please enter state';
      error = true;
    }
    if (fields.zip === '') {
      obj.zip = 'Please enter zip';
      error = true;
    }
    setErrors(obj);
    return error;
  };

  const onChangeValue = (e: any) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="redeem-now-modal redeem_auction_modal"
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b0',
        position: 'fixed',
        zIndex: 99999,
      }}
    >
      <div
        className="redeem-modal-inner"
        style={{
          width: '35%',
          backgroundColor: 'white',
          minWidth: '300px',
          position: 'relative',
        }}
      >
        <ToastProvider>
          <div className="text-center">
            <div onClick={props.closeModal} className="close_btn_X">
              X
            </div>
            <div className="header">
              <h2 className="text-center">Redeem</h2>
            </div>
            <div className="modal-content text-center">
              <form>
                <div className="form-group">
                  <label>
                    Full Name <span className="req_field"> * </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    name="full_name"
                    value={fields.full_name}
                    onChange={onChangeValue}
                  />
                  <p className="text-red justify-self-start mt-2 pl-2">
                    {errors.full_name}
                  </p>
                </div>

                <div className="form-group">
                  <label>
                    Address <span className="req_field"> * </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your address"
                    name="address"
                    value={fields.address}
                    onChange={onChangeValue}
                  />
                  <p className="text-red justify-self-start mt-2 pl-2">
                    {errors.address}
                  </p>
                </div>
                <div className="form-group">
                  <label>
                    Phone Number <span className="req_field"> * </span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your Phone Number"
                    name="phone_number"
                    value={fields.phone_number}
                    onChange={onChangeValue}
                  />
                  <p className="text-red justify-self-start mt-2 pl-2">
                    {errors.phone_number}
                  </p>
                </div>
                <div className="form-group-wrapper">
                  <div className="form-group">
                    <label>
                      City <span className="req_field"> * </span>
                    </label>
                    <input
                      type="text"
                      placeholder="City"
                      name="city"
                      value={fields.city}
                      onChange={onChangeValue}
                    />
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {errors.city}
                    </p>
                  </div>
                  <div className="form-group">
                    <label>
                      Zip/Postal <span className="req_field"> * </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Zip/Postal"
                      name="zip"
                      value={fields.zip}
                      onChange={onChangeValue}
                    />
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {errors.zip}
                    </p>
                  </div>
                </div>
                <div className="form-group-wrapper">
                  <div className="form-group">
                    <label>
                      State <span className="req_field"> * </span>
                    </label>
                    <input
                      type="text"
                      placeholder="State"
                      name="state"
                      value={fields.state}
                      onChange={onChangeValue}
                    />
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {errors.state}
                    </p>
                  </div>
                  <div className="form-group">
                    <label>
                      Country <span className="req_field"> * </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Country"
                      name="country"
                      value={fields.country}
                      onChange={onChangeValue}
                    />
                    <p className="text-red justify-self-start mt-2 pl-2">
                      {errors.country}
                    </p>
                  </div>
                </div>
              </form>
            </div>
            <button
              disabled={loading}
              className="comm_follow_btn"
              onClick={onSubmit}
            >
              {loading ? 'Loading..' : 'Redeem Now'}
            </button>
          </div>
        </ToastProvider>
      </div>
    </div>
  );
}

export default RedeemNowModal;
