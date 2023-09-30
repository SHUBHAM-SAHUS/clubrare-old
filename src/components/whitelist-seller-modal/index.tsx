import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import './whitelist-seller-modal.scss';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import $, { trim } from 'jquery';
import Web3 from 'web3';
import { useToasts } from 'react-toast-notifications';
import { useDispatch } from 'react-redux';
import { generateWhitelistSellerAction } from '../../redux/actions/whitelist-seller-action';

export const WhitelistSellerModal = (props: any) => {
  const [whitelistLoading, setWhitelistLoading] = useState<any>(false);
  const [errorMsg, setErrMsg] = useState<any>('');
  const [allData, setAllData] = useState<any>('');
  const { addToast } = useToasts();
  const dispatch = useDispatch();

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
        setWhitelistLoading(true);
        setErrMsg('');
        const req: any = {
          whiteListAddresses: corrStr,
        };
        try {
          const res: any = await dispatch(generateWhitelistSellerAction(req));
          if (res) {
            setAllData('');
            setWhitelistLoading(false);
            props.onHide();
            props.getWhiteListData();
            addToast('Whitelist seller added successfully', {
              appearance: 'success',
              autoDismiss: true,
            });
          } else {
            setWhitelistLoading(false);
            props.onHide();
            addToast('There is some issue, Please try again later', {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } catch (err: any) {
          setWhitelistLoading(false);
          props.onHide();
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!props.show) {
      setAllData('');
      setErrMsg('');
    }
  }, [props.show]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      className="whitelist-seller-modal-wrp"
      style={{ pointerEvents: whitelistLoading ? 'none' : 'auto' }}
      centered
    >
      <Modal.Header
        style={{ pointerEvents: whitelistLoading ? 'none' : 'auto' }}
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Whitelist Seller
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ pointerEvents: whitelistLoading ? 'none' : 'auto' }}>
        <div className="limit_token_wrp wallet_address_wrp">
          <form onSubmit={handleSubmit}>
            <div className="limit_token wallet_address_wrp">
              <div className="limit_token_left_wrp">
                <CodeMirror
                  value={allData}
                  height="300px"
                  extensions={[javascript({ jsx: true })]}
                  onChange={(value: any, viewUpdate: any) => setAllData(value)}
                />
              </div>
            </div>
            <div className="finalErrmsg">{errorMsg}</div>
            <div className="frmsubbtnwrp row text-center">
              <div className="col-6">
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
              </div>
              <div className="col-6">
                <div className="sendbtnwrp">
                  <button
                    type="submit"
                    className={whitelistLoading && 'disablebtn blkfull_btn'}
                    disabled={whitelistLoading}
                  >
                    {whitelistLoading ? 'Loading...' : 'Add Whitelist Seller'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
