import { memo, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import { Select } from '../../../components';

const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
const weth_contract = process.env.REACT_APP_WETH_TOKEN_ADD?.toLowerCase();
const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
interface propTypes {
  openModel: boolean;
  onHide: () => void;
  network_id: string;
  checkMakeOfferApproval: (price: string, clearCurrentinputdata: (key: any) => void, selectedCurrency: string,) => void;
  hideCursor: boolean;
  loading: boolean;
  geterc20Bal: (val: string | undefined) => void;
  getagovBal: () => void;
  getAgovEthBal: () => void;
  getMpwrBal: () => void;
  getUsdtEthBal: () => void;
  getUsdtKlaytnBal: () => void;
}
const MakeofferModel = (props: propTypes) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('KLAY');
  const [networkId, setNetworkId]: any = useState<string>('');
  const [makeOfferPrice, SetMakeOfferPrice] = useState<string>('');
  const [currencybal, Setcurrencybal] = useState<number>(0);
  const [currencyOptions, setCurrencyOptions]: any = useState([
    { name: 'WETH', value: 'WETH' },
    { name: 'MPWR', value: 'MPWR' },
    { name: 'AGOV', value: 'AGOV' },
    { name: 'USDT', value: 'USDT' },
  ]);
  const [error, setError] = useState({
    price: '',
  });

  // ***** getCurrencyBalance function used for get agov and weth  balance
  const getCurrencyBalance = async () => {
    if (Number(props?.network_id) == 1) {
      if (selectedCurrency === 'WETH') {
        const bal = await props.geterc20Bal(weth_contract);
        Setcurrencybal(Number(bal));
        checkBalOnCurrencyChange(Number(bal));
      } else if (selectedCurrency === 'MPWR') {
        const bal = await props.geterc20Bal(mpwr_token_address);
        Setcurrencybal(Number(bal));
        checkBalOnCurrencyChange(Number(bal));
      } else if (selectedCurrency === 'AGOV') {
        const bal = await props.geterc20Bal(agov_eth_token_address);
        Setcurrencybal(Number(bal));
        checkBalOnCurrencyChange(Number(bal));
      } else if (selectedCurrency === 'USDT') {
        const bal = await props.getUsdtEthBal();
        Setcurrencybal(Number(bal));
        checkBalOnCurrencyChange(Number(bal));
      }
    } else {
      if (selectedCurrency === 'USDT') {
        const bal = await props.getUsdtKlaytnBal();
        Setcurrencybal(Number(bal));
      } else {
        const bal = await props.getagovBal();
        Setcurrencybal(Number(bal));
      }
    }
  };

  const checkBalOnCurrencyChange = (bal: number) => {
    if (Number(makeOfferPrice) > bal) {
      setError({
        ...error,
        price: `Your token balance is not enough to placed offer || Your current balance ${bal}`,
      });
    } else {
      setError({ ...error, price: '' });
    }
  };

  useEffect(() => {
    getCurrencyBalance();
  }, [selectedCurrency]);

  useEffect(() => {
    if (props?.network_id) {
      const network =
        Number(props?.network_id) == 1
          ? process.env.REACT_APP_NFT_NETWORK_ID
          : process.env.REACT_APP_KLATYN_NETWORK_ID;
      setNetworkId(network);
      if (network == klatynNetworkId) {
        setCurrencyOptions([{ name: 'AGOV', value: 'AGOV' }, { name: 'USDT', value: 'USDT' }]);
        setSelectedCurrency('KLAY');
      } else {
        setCurrencyOptions([
          { name: 'WETH', value: 'WETH' },
          { name: 'MPWR', value: 'MPWR' },
          { name: 'AGOV', value: 'AGOV' },
          { name: 'USDT', value: 'USDT' },
        ]);
        setSelectedCurrency('WETH');
      }
    }
  }, [props?.network_id]);

  const onCurrencyChange = (selected: any) => {
    setSelectedCurrency(selected?.value);
  };

  const inputClickHandler = (event: any) => {
    const { name, value } = event.target;
    switch (name) {
      case 'price':
        const regex1 = /^[0-9][.\d]{0,17}$/;
        if (value === '') {
          setError({ ...error, price: 'cannot be empty' });
        } else if (value <= 0) {
          setError({ ...error, price: 'Price must be greater than 0' });
        } else if (Number(value) > currencybal) {
          setError({
            ...error,
            price: `Your token balance is not enough to placed offer || Your current balance ${currencybal}`,
          });
        } else if (value.length >= 19) {
          setError({ ...error, price: 'Price should not more then 18 digit' });
        } else if (!regex1.test(value)) {
          setError({ ...error, price: 'Please enter correct value' });
        } else {
          setError({ ...error, price: '' });
        }
        SetMakeOfferPrice(value);
        break;

      default:
        break;
    }
  };

  const updateMakeOfferprice = () => {
    if (error.price) {
      return;
    }
    props.checkMakeOfferApproval(
      makeOfferPrice,
      clearCurrentinputdata,
      selectedCurrency,
    );
  };

  const clearCurrentinputdata = (key: any): void => {
    SetMakeOfferPrice(key);
  };

  return (
    <>
      <Modal
        {...props}
        show={props?.openModel}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="details_bidmodal details_palcebid_modal"
        backdrop="static"
      >
        <Modal.Header className="details_placebid_heading">
          <Modal.Title id="contained-modal-title-vcenter">
            Make a Offer
          </Modal.Title>
          <Button
            className="details_placebidmodal_closebtn"
            onClick={() => {
              props.onHide();
              setError({ ...error, price: '' });
              SetMakeOfferPrice('');
            }}
            style={{ pointerEvents: props.loading ? 'none' : 'auto' }}
          >
            <AiOutlineClose />
          </Button>
        </Modal.Header>
        <Modal.Body
          className="details_placebid_body "
          style={{ pointerEvents: props.loading ? 'none' : 'auto' }}
        >
          <div className="placebid_input_wrp">
            <div className="fixed_price_wrp form_input_wrp">
              <label className="text-18 text-blue font-semibold mb-2">
                Enter offer Amount
                <span className="req_field"> * </span>
              </label>
              <div className="flex items-center justify-between minimum_bid_wrp mt-2">
                <div className="w-full">
                  <input
                    type="number"
                    className="responsive-placeholder bg-transparent border-b-2 border-solid border-white w-full minimumbid"
                    placeholder={`0.00 ${selectedCurrency}`}
                    value={makeOfferPrice}
                    name="price"
                    onChange={inputClickHandler}
                  />
                </div>
                <div className="top-0 right-0 flex items-center space-x-2">
                  <Select
                    value={selectedCurrency}
                    selectValueChange={onCurrencyChange}
                    options={currencyOptions}
                    width="w-24"
                  />
                </div>
              </div>
              <p className="text-red justify-self-start mt-2 pl-2">
                {error.price}
              </p>
            </div>

            {/* <p className="placebid_input_feild_bottom">${props.price} USD</p> */}
          </div>
        </Modal.Body>
        <Modal.Footer className="placebid_btn_footer">
          <button
            style={
              props.loading ? { pointerEvents: 'none', opacity: '0.4' } : {}
            }
            className="placebid_cancel"
            onClick={() => {
              props.onHide();
              setError({ ...error, price: '' });
              SetMakeOfferPrice('');
            }}
          >
            Cancel
          </button>
          <button
            style={
              props.loading || makeOfferPrice === '' || error.price !== ''
                ? { pointerEvents: 'none', opacity: '0.4' }
                : {}
            }
            disabled={
              props.loading || makeOfferPrice === '' || error.price !== ''
            }
            onClick={() => updateMakeOfferprice()}
            className="placebid_btn"
          >
            {props?.loading ? 'Loading...' : 'Submit'}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(MakeofferModel);
