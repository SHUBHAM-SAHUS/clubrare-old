import Footer from '../../components/footer/footer';
import MainLayout from '../../layouts/main-layout/main-layout';
import './reward-admin.scss';
import { WhiteListModal } from './white-list-modal';
import { useState, useEffect } from 'react';
import { useCustomStableCoin } from '../../hooks';
import {
  PreSaleActive,
  PreSaleLive,
  SetMerkleRoot,
  GetPresalePrice,
  SetPresalePrice,
} from '../../service/rewards-admin';
import { useToasts } from 'react-toast-notifications';
import Switch from 'react-switch';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import $, { trim } from 'jquery';
import Web3 from 'web3';
import { useDispatch, useSelector } from 'react-redux';
import {
  generateMerkleRootHashAction,
  getWhitelistDataAction,
} from '../../redux/actions/reward-admin-action';
import { getWeb3 } from '../../service/web3-service';
import { ParticipantInformation } from '../../components/participant-information';
import { getEditProfileAction } from '../../redux';
import { useHistory } from 'react-router-dom';

export const RewardAdmin = () => {
  const { customToWei, customFromWei } = useCustomStableCoin();
  const [show, setShow] = useState<boolean>(false);
  const [cursor, setCursor] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [whitelistLoading, setWhitelistLoading] = useState<any>(false);
  const [state, setState] = useState<any>();
  const [activeSale, setActiveSale] = useState<any>(false);
  const [allData, setAllData] = useState<any>('');
  const [csv, setCsv] = useState<any>();
  const [errorMsg, setErrMsg] = useState<any>('');
  const [presalePriceVal, SetPresalePriceVal] = useState<any>();
  const [profileDetails, setProfileDetails]: any = useState('');
  const [priceErr, setPriceError]: any = useState('');

  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const whiteListData = useSelector((state: any) => {
    return state.getWhitelistDataReducer.data;
  });
  const getProfileDetails = async (add: any) => {
    if (add) {
      const data = { user_address: add };
      let res: any = await dispatch(getEditProfileAction(data));
      if (res) {
        await setProfileDetails(res?.data);
        if (res) {
          if (!res?.data?.isPresaleAdmin) {
            history.push('/home');
          }
        }
      } else {
        history.push('/home');
      }
    } else {
      history.push('/home');
    }
  };
  useEffect(() => {
    const walletAdd = localStorage.getItem('Wallet Address');
    getProfileDetails(walletAdd);
  }, []);

  useEffect(() => {
    dispatch(getWhitelistDataAction());
  }, [dispatch]);

  const PrivateLive = async () => {
    try {
      setCursor(true);
      const data: any = await PreSaleLive();
      const privateSaleActive: any = await PreSaleActive();
      if (data) {
        setState(data);
        if (privateSaleActive) {
          setCursor(false);
          addToast('Presale is live', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          addToast('Presale is not live', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } else {
        setCursor(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (error: any) {
      setCursor(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const csvArr: any = [];
  let duplicateTxt: any = false;
  const csvLoopFunct = (csvData: any) => {
    for (let i: any = 0; i < csvData.length; i++) {
      csvArr.push(csvData[i]);
    }
  };

  const exists = (value: any, array: any) => {
    return array.some((e: any) => e === value);
  };

  const duplicateDataCheck = () => {
    const cmline: any = window.document.getElementsByClassName('cm-line');
    let checkExists: any;
    const listArr: any = [];
    for (let i: any = 0; i < cmline.length; i++) {
      const cmlinetxt: any = cmline[i].textContent;
      if (cmlinetxt !== null || cmlinetxt === ' ') {
        listArr.push(cmlinetxt);
      }
    }
    for (let i = 0; i < csvArr.length; i++) {
      const cmlinetxt: any = csvArr[i];
      if (cmlinetxt !== '') {
        checkExists = exists(cmlinetxt, listArr);
        if (checkExists) {
          duplicateTxt = true;
        } else {
          duplicateTxt = false;
        }
      }
    }
  };

  const fileChangeHandler = (e: any) => {
    const fileUpload: any = window.document.getElementById('uploadcsv');
    if (fileUpload !== null) {
      const regex = new RegExp('(.*?).(csv)$');
      if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof FileReader != 'undefined') {
          const reader: any = new FileReader();
          const currTxt: any = $('.cm-line').text();
          if (currTxt === 'AGOV Token') {
            $('.cm-line').text('');
          }
          reader.onload = function (e: any) {
            const text: any = e.target.result;
            const lines: any = text.split('\n');
            csvLoopFunct(lines);
            duplicateDataCheck();
            if (!duplicateTxt) {
              const newTxt: any = document.createTextNode(text);
              const currElem: any = document.querySelector(
                '.cm-line:last-child',
              );
              const checkEmpty: any = currElem.childNodes.length;
              if (checkEmpty) {
                currElem.appendChild(newTxt);
              } else {
                const div: any = document.createElement('div');
                div.classList.add('cm-line');
                currElem.after(div);
                div.appendChild(newTxt);
              }
            }
          };
          reader.readAsText(e.target.files[0]);
        } else {
          addToast('This browser does not support HTML5.', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } else {
        addToast('Please upload a valid CSV file.', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const isValidAddress = (adr: any) => {
    try {
      const web3 = new Web3();
      web3.utils.toChecksumAddress(adr);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isEmpty = (el: any) => {
    return !$.trim(el.html());
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const cmline: any = window.document.getElementsByClassName('cm-line');
    const corrStr: any = [];
    const invalidStr: any = [];
    const listArr: any = [];

    if (cmline.length === 0) {
      addToast('Please enter list of address.', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else {
      $('.cm-line')
        .filter(function () {
          return $(this).text().trim().length === 0;
        })
        .remove();

      const elmntCount: any = allData.split('\n');

      for (var i: any = 0; i < elmntCount.length; i++) {
        const cmlinetxt: any = elmntCount[i];
        if (cmlinetxt) {
          listArr.push(cmlinetxt);
        }
      }
      for (let j: any = 0; j < listArr?.length; j++) {
        const add: any = trim(listArr[j]);
        if (isValidAddress(add)) {
          corrStr.push(add);
        } else {
          invalidStr.push(listArr[j]);
        }
      }

      for (var i: any = 0; i < cmline.length; i++) {
        for (let j: any = 0; j < invalidStr.length; j++) {
          const searchText: any = invalidStr[j];
          if (cmline[i].textContent == searchText) {
            const foundErrElem: any = cmline[i];
            setTimeout(() => {
              foundErrElem.classList.add('rederr');
            }, 100);
          }
        }
      }

      if (invalidStr.length > 0 || isEmpty($('.cm-line'))) {
        setErrMsg('Please enter correct list of address');
      } else {
        setCursor(true);
        setWhitelistLoading(true);
        setErrMsg('');
        setCsv(corrStr);
        const req: any = {
          whiteListAddresses: corrStr,
        };
        try {
          const res: any = await dispatch(generateMerkleRootHashAction(req));
          if (res) {
            try {
              const rootHash: any = res.data.merkle_root;
              if (rootHash) {
                try {
                  const merkleroot = await SetMerkleRoot(rootHash);
                  if (merkleroot) {
                    setAllData('');
                    dispatch(getWhitelistDataAction());
                    setCursor(false);
                    setWhitelistLoading(false);
                    addToast('User whitelisted successfully.', {
                      appearance: 'success',
                      autoDismiss: true,
                    });
                  } else {
                    setCursor(false);
                    setWhitelistLoading(false);
                    addToast('There is some issue, Please try again later', {
                      appearance: 'error',
                      autoDismiss: true,
                    });
                  }
                } catch (err: any) {
                  setCursor(false);
                  setWhitelistLoading(false);
                  addToast(err.message, {
                    appearance: 'error',
                    autoDismiss: true,
                  });
                }
              } else {
                setCursor(false);
                setWhitelistLoading(false);
                addToast('There is some issue, Please try again later', {
                  appearance: 'error',
                  autoDismiss: true,
                });
              }
            } catch (err: any) {
              setCursor(false);
              setWhitelistLoading(false);
              addToast(err.message, {
                appearance: 'error',
                autoDismiss: true,
              });
            }
          } else {
            setCursor(false);
            setWhitelistLoading(false);
            addToast('There is some issue, Please try again later', {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } catch (err: any) {
          setCursor(false);
          setWhitelistLoading(false);
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
    }
  };

  const priceInputHandle = (e: any) => {
    SetPresalePriceVal(e.target.value);
  };

  const presalePriceHandler = async (e: any) => {
    e.preventDefault();
    if (
      presalePriceVal == undefined ||
      presalePriceVal == '' ||
      presalePriceVal == null
    ) {
      addToast('Please enter value for presale price.', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else {
      try {
        setCursor(true);
        setLoading(true);
        const { web3 }: any = await getWeb3();
        const preSaleVal: any = await customToWei(presalePriceVal, web3, '');
        const res: any = await SetPresalePrice(preSaleVal);
        if (res) {
          setCursor(false);
          setLoading(false);
          getPresalePriceData();
          addToast('Presale price set successfully.', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          setLoading(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (error: any) {
        setCursor(false);
        setLoading(false);
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  useEffect(() => {
    const Data = async () => {
      const privateSaleActive: any = await PreSaleActive();
      setActiveSale(privateSaleActive);
    };
    Data();
  }, [state]);

  const getPresalePriceData = async () => {
    try {
      const { web3 }: any = await getWeb3();
      const presalePrice: any = await GetPresalePrice();
      if (presalePrice) {
        const presalePriceConvt = await customFromWei(presalePrice, web3, '');
        SetPresalePriceVal(presalePriceConvt);
      } else {
        SetPresalePriceVal('');
      }
    } catch (error: any) {
      SetPresalePriceVal('');
    }
  };

  useEffect(() => {
    getPresalePriceData();
  }, []);

  return (
    <div style={{ pointerEvents: cursor ? 'none' : 'auto' }}>
      <MainLayout mainClassName="reward_admin_page_wrp" hideCursor={cursor}>
        <div className="container-fluid">
          <div className="reward_admin_wrp">
            <h1>Presale Settings</h1>
            <div className="reward_admin">
              <div className="reward_admin_sale">
                <div className="row start_sale_wrp">
                  <div className="col-7 start_sale_left_wrp">
                    <p>Start Presale</p>
                  </div>
                  <div className="col-5 start_sale_right_wrp">
                    <label className="switchlabel roundswitchlabel">
                      <Switch
                        checked={activeSale}
                        onChange={PrivateLive}
                        onColor="#202020"
                        onHandleColor="#ECF962"
                        handleDiameter={22}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="unset"
                        activeBoxShadow="unset"
                        offColor="#EFF0ED"
                        height={24}
                        width={44}
                        className={`react-switch ${
                          activeSale ? 'activetoggle' : ''
                        }`}
                        id="material-switch"
                      />
                    </label>
                    <span className="radio_btn_status">
                      {activeSale ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>
                <div className="limit_token_wrp limit_to_purchase_wrp">
                  <h4>Presale Price</h4>
                  <form onSubmit={presalePriceHandler}>
                    <div className="row limit_token limit_to_purchase ">
                      <div className="col-lg-7 col-md-7 limit_token_left_wrp">
                        <input
                          type="text"
                          placeholder="0"
                          value={presalePriceVal}
                          name="presaleprice"
                          onChange={priceInputHandle}
                        />
                        <span className="priceerr">{priceErr}</span>
                      </div>
                      <div className="col-lg-5 col-md-5 limit_token_right_wrp pl-0">
                        <button
                          type="submit"
                          className={
                            loading || priceErr ? 'disablebtn blkfull_btn' : ''
                          }
                          disabled={loading || priceErr}
                        >
                          {loading ? 'Loading...' : 'Set Price'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="reward_admin_sale reward_admin_wallet_address">
                <div className="limit_token_wrp wallet_address_wrp">
                  <h4>
                    Wallet Address <span className="req_field"> * </span>
                  </h4>
                  <form onSubmit={handleSubmit}>
                    <div className="limit_token wallet_address_wrp">
                      <div className="limit_token_left_wrp">
                        <CodeMirror
                          value={allData}
                          height="300px"
                          extensions={[javascript({ jsx: true })]}
                          onChange={(value: any, viewUpdate: any) =>
                            setAllData(value)
                          }
                        />
                      </div>
                    </div>
                    <div className="finalErrmsg">{errorMsg}</div>
                    <div className="frmsubbtnwrp text-center">
                      <label htmlFor="uploadcsv" className="uploadcsvfilewrp">
                        <input
                          type="file"
                          id="uploadcsv"
                          accept=".csv"
                          name="uploadcsv"
                          onChange={fileChangeHandler}
                          onClick={(event: any) => {
                            event.target.value = null;
                          }}
                        />
                        Upload CSV File
                      </label>
                      <div className="sendbtnwrp">
                        <button
                          type="submit"
                          className={
                            whitelistLoading && 'disablebtn blkfull_btn'
                          }
                          disabled={whitelistLoading}
                        >
                          {whitelistLoading ? 'Loading...' : 'Add to Whitelist'}
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="view_witelist_wrp text-right">
                    <span
                      className="view_witelist text-right"
                      onClick={handleShow}
                    >
                      View Whitelist
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="participant_table_wrp">
            <ParticipantInformation />
          </div>
        </div>
        <WhiteListModal
          show={show}
          onHide={handleClose}
          whiteListData={whiteListData}
        />
      </MainLayout>
      <Footer />
    </div>
  );
};
