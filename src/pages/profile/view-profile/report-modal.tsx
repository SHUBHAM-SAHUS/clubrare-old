import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { submitReportAPiAction } from '../../../redux';
import { useToasts } from 'react-toast-notifications';
import { imgConstants } from '../../../assets/locales/constants';
const Modal = React.lazy(() => import('../../../components/modal'));

function ReportModal({
  open,
  onCloseModal,
  report_to_add,

  collectible_id,
  network_id,
}: any) {
  const { t } = useTranslation();
  const [fields, setFields] = useState({ email_address: '', description: '' });
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  useEffect(() => {
    if (open) {
      setFields({ email_address: '', description: '' });
    }
  }, [open]);

  const onsubmit = async (e: any) => {
    e.preventDefault();
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (
      fields.email_address.match(pattern) &&
      fields.description &&
      report_to_add &&
      localStorage.getItem('Wallet Address')
    ) {
      const data = {
        reason: fields.description,
        email: fields.email_address,
        report_to: report_to_add,
        report_by: localStorage.getItem('Wallet Address'),
        collectible_id: collectible_id,
        network_id: network_id,
      };
      const res: any = await dispatch(submitReportAPiAction(data));

      if (res?.status === true) {
        addToast(res.message, { appearance: 'success', autoDismiss: true });
      } else {
        addToast('there is some issue, please try again', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      onCloseModal();
    } else {
      if (!fields.email_address.match(pattern)) {
        addToast('Please enter valid email', {
          appearance: 'error',
          autoDismiss: true,
        });
      } else {
        addToast('Please enter description', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const onchangeVal = (e: any) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const title = (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between text-26 font-bold px-4 sm:px-11 submitreportheadwrp">
      <div className="margin-auto text-align  text-22 sm:text-26 font-bold submitreporthead">
        {t('profile.summary.report.submitAReport')}
      </div>
      <div
        className="position-close self-end sm:self-center cursor-pointer"
        onClick={onCloseModal}
      >
        <img src={imgConstants.closeSvg} alt="closeSvg" />
      </div>
    </div>
  );

  const content = (
    <div className="text-align pb-6.5 sm:mt-0 submitreporthea_wrp">
      <p className="shorttxt">{t('profile.summary.report.text')}</p>
      <form className="mt-6 text-left">
        <div className="user-details text-18 sm:text-18 font-bold">
          {t('profile.summary.report.email.title')}
          <span className="req_field"> * </span>
        </div>
        {/* register your input into the hook by invoking the "register" function */}
        <input
          // type='email'
          onChange={onchangeVal}
          name="email_address"
          value={fields.email_address}
          className="responsive-placeholder fadeBgWhite border-b border-solid border-fadeBlue
                   pr-6 py-2 mt-1 sm:mt-4 w-full"
          placeholder={t('profile.summary.report.email.placeholder')}
        />
        {/* <p className="text-red">{errors.email?.message}</p> */}

        <div className="user-details text-18 sm:text-18 font-bold mt-3">
          {t('profile.summary.report.description.title')}
          <span className="req_field"> * </span>
        </div>
        {/* include validation with required or other standard HTML validation rules */}
        <input
          onChange={onchangeVal}
          name="description"
          value={fields.description}
          className="fadeBgWhite border-b border-solid border-fadeBlue pr-6 py-2 w-full mt-1 sm:mt-4"
          placeholder={t('profile.summary.report.description.placeholder')}
        />
        {/* errors will return when field validation fails  */}
        {/* <p className="text-red">{errors.description?.message}</p> */}

        <div className="text-center mt-5 mb-3 subrepbtn">
          <button
            id="report-modal-btn-id"
            className="button-share-black"
            type="submit"
            onClick={(e) => onsubmit(e)}
          >
            {t('profile.summary.report.submit')}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <Modal
      title={title}
      open={open}
      contentClass="subrepdetailwrp"
      containerClass="rounded-32 report-modal"
      content={content}
      onCloseModal={onCloseModal}
    />
  );
}

export default ReportModal;
