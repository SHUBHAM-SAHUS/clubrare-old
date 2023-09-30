import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../../layouts/main-layout/main-layout';
import { useHistory } from 'react-router-dom';
import { Loading } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkCustomUrlActon,
  EditProfileAction,
} from '../../../redux/actions/edit-profile-action';
import { getEditProfileAction } from '../../../redux/actions/edit-profile-action';
import './edit-profile.css';
import Footer from '../../../components/footer/footer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ShowMoreText from 'react-show-more-text';
import { useToasts } from 'react-toast-notifications';
import { imgConstants } from '../../../assets/locales/constants';
const Modal = React.lazy(() => import('../../../components/modal'));
function EditProfile() {
  const { t } = useTranslation();
  const { addToast } = useToasts();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [profileImg, setProfileImage]: any = useState(null);
  const [uploadedImage, setUploadedImage]: any = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [fields, setFields] = useState({
    name: '',
    bio: '',
    twitterUsername: '',
    email: '',
    customUrl: '',
  });

  const dispatch = useDispatch();
  const profile_details = useSelector((state: any) => {
    return state.profileReducers.profile_details;
  });
  const history = useHistory();
  const inputReference = React.createRef();
  const [showCoverModal, setShowCoverModal] = useState<boolean>(false);
  const [saveButton, setSaveButton] = useState<boolean>(false);
  const [coverBackgroundPosition, setCoverBackgroundPosition] = useState<string>('');
  const [coverImage, setCoverImage]: any = useState();
  const [coverUpload, setCoverUpload]: any = useState(null);
  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const [msgIcon, setErrorMsgIcon] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [urlStatus, setUrlStatus] = useState<boolean>(false);
  const [urlMessage, setUrlMessage] = useState<string>('');
  const [customError, setCustomError] = useState<{customValidationMsg:string}>({ customValidationMsg: '' });
  const [btnState, setBtnState] = useState<boolean>(false);
  const [previousCustomUrl, setPreviousUrl] = useState<string>('');

  useEffect(() => {
    const container: any = document.querySelector('div#cover-image') || '';
    if (history.location.pathname === '/profile/edit') {
      if (container) {
        const containerSize = container.getBoundingClientRect();
        const imagePosition = { x: 50, y: 50 };
        let cursorPosBefore = { x: 0, y: 0 };
        let imagePosBefore: any = null;
        let imagePosAfter = imagePosition;
        const actualImage = new Image();
        if (actualImage) {
          actualImage.src = $('#cover-image')
            .css('background-image')
            .replace(/"/g, '')
            .replace(/url\(|\)$/gi, '');
          actualImage.onload = function () {
            const zoomX: any = actualImage.width / containerSize.width - 1;
            const zoomY: any = actualImage.height / containerSize.height - 1;

            container.addEventListener('mousedown', function (event: any) {
              cursorPosBefore = { x: event.clientX, y: event.clientY };
              imagePosBefore = imagePosAfter; // Get current image position
            });
            container.addEventListener('mousemove', function (event: any) {
              event.preventDefault();
              if (event.buttons === 0) return;
              let newXPos =
                imagePosBefore?.x +
                (((cursorPosBefore.x - event.clientX) / containerSize.width) *
                  100) /
                  zoomX;
              newXPos = newXPos < 0 ? 0 : newXPos > 100 ? 100 : newXPos;
              let newYPos =
                imagePosBefore?.y +
                (((cursorPosBefore.y - event.clientY) / containerSize.height) *
                  100) /
                  zoomY;
              newYPos = newYPos < 0 ? 0 : newYPos > 100 ? 100 : newYPos;

              imagePosAfter = { x: newXPos, y: newYPos };
              container.style.backgroundPosition = `${newXPos}% ${newYPos}%`;
            });
          };
        }
      }
    }
  }, [saveButton]);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getProfileDetails = async () => {
      const data = { user_address: localStorage.getItem('Wallet Address') };
      await dispatch(getEditProfileAction(data));
    };
    if (localStorage.getItem('Wallet Address')) {
      getProfileDetails();
    }
  }, []);

  useEffect(() => {
    if (profile_details) {
      setFields({
        ...fields,
        name: profile_details.name,
        bio: profile_details.bio,
        email: profile_details.email,
        customUrl: profile_details.custom_url,
      });
      setProfileImage(profile_details?.image);
      setCoverImage(profile_details?.cover_image);
      setCoverBackgroundPosition(profile_details?.coverBackgroundPosition);
      setSaveButton(true);
      setPreviousUrl(profile_details?.custom_url);
    }
  }, [profile_details]);

  useEffect(() => {
    const regex = RegExp(
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z][a-zA-Z])/,
    );
    if (fields.email) {
      if (!regex.test(fields.email)) {
        setErrorMsg(true);
        setIsDisable(true);
      } else {
        setIsDisable(!regex.test(fields.email));
        setErrorMsg(false);
      }
    }
  }, [fields.email]);

  const handleFileUpload = (e: any) => {
    const file = e?.target?.files;
    if (file[0]) {
      setUploadedImage(file[0]);
    }
  };

  const profiledeatils = useSelector(
    (state: any) => state.profileReducers.profile_details,
  );
  const onChangeVal = (e: any) => {
    const regex = RegExp(
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z][a-zA-Z])/,
    );
    if (e.target.name === 'email') {
      if (!regex.test(e.target.value)) {
        setErrorMsg(true);
        setIsDisable(true);
      } else {
        setIsDisable(!regex.test(e.target.value));
        setErrorMsg(false);
      }
    } else if (e.target.name === 'customUrl') {
      if (e.target.value.length > 0) {
        setErrorMsgIcon(true);
        if (e.target.value.length > 5) {
          checkCustomUrl(e.target.value);
        } else {
          setUrlStatus(false);

          let regex_exp = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g;
          if (!regex_exp?.test(e.target.value)) {
            setCustomError({
              ...customError,
              customValidationMsg:
                'Special characters not allowed in Custom URL',
            });
          } else if (e.target.value.length < 6) {
            setCustomError({
              ...customError,
              customValidationMsg:
                'Custom URL length must be at least 6 Characters Long',
            });
          } else {
            setCustomError({
              ...customError,
              customValidationMsg: '',
            });
          }
        }
      } else {
        setErrorMsgIcon(false);
        setCustomError({
          ...customError,
          customValidationMsg: '',
        });
      }
    }
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const checkCustomUrl = async (customUrl: string) => {
 
    let urlquery = {
      custom_url: customUrl,
    };

    if (customUrl?.length > 5) {
      try {
        let res: any = await dispatch(checkCustomUrlActon(urlquery));
        if (res?.status) {
          setUrlStatus(true);
          setUrlMessage(res?.message);
        } else {
          setUrlStatus(false);
          setUrlMessage(res?.message);
        }
      } catch (err) {
        setUrlStatus(false);
      }
    }
  };

  const closeAddCoverModal = () => {
    setShowCoverModal(false);
    setSaveButton(true);
  };

  const inputClickHandler = (event: any) => {
    const container: any = document.querySelector('div#cover-image') || '';
    const { name, value } = event.target;
    if (value === '' || value == null || !value) {
      setSaveButton(false);
      addToast('cannot be empty', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else if (
      event.target.files &&
      event.target.files[0] &&
      !event.target.files[0]?.type?.startsWith('image/')
    ) {
      setSaveButton(false);
      addToast('Please select file valid format(Image)', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    } else if (event.target.files[0].size / 1024 / 1024 > 20) {
      setSaveButton(false);
      addToast('Please select file size not more than 20 MB', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    } else if (event.target.files && event.target.files.length > 0) {
      const reader: any = new FileReader();
      const file = event.target.files[0];
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        if (width <= 1280 && height <= 280) {
          setSaveButton(false);
          container.style.pointerEvents = 'none';
          addToast('Please upload image of minimum resolution 1280 x 280 ', {
            appearance: 'error',
            autoDismiss: true,
          });
          return;
        } else {
          setCoverUpload(event.target.files[0]);
          closeAddCoverModal();
        }
      };
    } else {
      setCoverUpload(event.target.files[0]);
      closeAddCoverModal();
    }
    setShowCoverModal(false);
  };

  const updateProfile = async (e: any) => {
    e.preventDefault();
    const element: any = document.querySelector('#cover-image') || '';
    const backPos = element.style.backgroundPosition;
    if (isDisable) {
      addToast('Please enter valid email address', {
        appearance: 'error',
        autoDismiss: true,
      });
    } else {
      setSubmitLoading(true);

      let address: any = localStorage.getItem('Wallet Address');
      if (address) {
        let formData = new FormData();
        formData.append('_id', profile_details?._id);
        formData.append('wallet_address', address ? address : '');
        formData.append('custom_url', fields.customUrl ? fields.customUrl : '');
        formData.append('name', fields.name ? fields.name : '');
        formData.append('email', fields.email ? fields.email : '');
        formData.append('bio', fields.bio ? fields.bio : '');
        formData.append(
          'attachment',
          uploadedImage ? uploadedImage : profileImg,
        );
        formData.append(
          'cover_attachment',
          coverUpload ? coverUpload : coverImage,
        );
        formData.append('coverBackgroundPosition', backPos ? backPos : '');

        let response: any = await dispatch(EditProfileAction(formData));

        setSubmitLoading(false);
        if (response?.status === true) {
          const container: any =
            document.querySelector('div#cover-image') || '';
          container.style.pointerEvents = 'auto';
          if (fields.customUrl ) {
            localStorage.setItem("Custom Url",fields.customUrl);
          }else{
            localStorage.removeItem("Custom Url");
          }

          addToast('Profle successfully updated', {
            appearance: 'success',
            autoDismiss: true,
          });

          history.push(`/${address}`);
        }
      }
    }
  };

  const handleOpenModal = () => {
    setSaveButton(true);
    setShowCoverModal(true);
};

  const btnststate = () => {
    if (previousCustomUrl === fields?.customUrl) {
      setBtnState(true);
    } else {
      if (fields?.customUrl?.length > 0 && urlStatus) {
        setBtnState(true);
      } else if (fields?.customUrl === null || fields?.customUrl === '') {
        setBtnState(true);
      } else {
        setBtnState(false);
      }
    }
  };

  useEffect(() => {
    btnststate();
  }, [fields.customUrl, urlStatus]);

  return (
    <React.Fragment>
      <Layout mainClassName="editprofile_page_wrp" hideCursor={submitLoading}>
        <div
          className="club_viewprofile_inn_wrp"
          style={{ pointerEvents: submitLoading ? 'none' : 'auto' }}
        >
          {showCoverModal && (
            <AddCoverModal
              hide={closeAddCoverModal}
              inputReference={inputReference}
              coverUpload={coverUpload}
              inputClickHandler={inputClickHandler}
              open={showCoverModal}
              t={t}
            />
          )}

          <div
            className="relative rect-angle-profile"
            id="cover-image"
            style={{
              backgroundImage: `url(${
                coverUpload
                  ? URL.createObjectURL(coverUpload)
                  : coverImage
                  ? coverImage
                  : 'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/rectangle.svg'
              })`,
              backgroundPosition: `${
                coverBackgroundPosition ? coverBackgroundPosition : '50% 50%'
              }`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <button className="cover_text_style">Scroll to Reposition</button>
            <button onClick={handleOpenModal} className="cover_upload_btn">
              {coverImage
                ? t('profile.summary.updateCover')
                : t('profile.summary.addCover')}
            </button>
          </div>

          <input
            id="proflile-update"
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileUpload}
          />
          <div className="flex flex-col items-center top-position profile_page_wrp">
            <figure className="cmn_club_profile">
              {uploadedImage ? (
                <img
                  className="club_profile_img"
                  src={URL.createObjectURL(uploadedImage)}
                  alt="uploadedImage"
                />
              ) : (
                <img
                  className="club_profile_img"
                  src={profileImg || imgConstants.defaultProfileImg}
                  alt="defaultProfileImg"
                />
              )}
              <label htmlFor="proflile-update">
                <img
                  className="club_profile_img_hover"
                  src={imgConstants.hoverProfileImg}
                  alt="hoverProfileImg"
                />
              </label>
            </figure>
            <CopyToClipboard
              text={profiledeatils?.wallet_address?.toString()}
              onCopy={onCopyText}
            >
              <div className="user_addbtn flex">
                {profiledeatils?.network_id === '1' ? (
                  <img src={imgConstants.ethIcon} alt="currencyIcon" />
                ) : profiledeatils?.network_id === '2' ? (
                  <img src={imgConstants.klyicon} alt="currencyIcon" />
                ) : null}

                {isCopied ? (
                  'Copied...'
                ) : (
                  <div>
                    {profiledeatils?.wallet_address
                      ? profiledeatils?.wallet_address
                          .toString()
                          .substring(0, 5) +
                        '.....' +
                        profiledeatils?.wallet_address
                          .toString()
                          .substr(profiledeatils?.wallet_address.length - 4)
                      : ''}
                  </div>
                )}
              </div>
            </CopyToClipboard>
          </div>
          <div className="userbio">
            <p>
              <ShowMoreText
                lines={3}
                more="Show more"
                less="...Show less"
                anchorClass="showtxtbtn"
                onClick={ShowMoreText.executeOnClick}
                expanded={false}
                width={0}
              >
                {profiledeatils?.bio}
              </ShowMoreText>
            </p>
          </div>
          <div className="update_profile_tit_wrp row">
            <div className="col-8">
              <h3>Update your profile</h3>
            </div>
            <div className="col-4 update_profil_btn_wrp text-right">
              <button
                onClick={() =>
                  history.push(`/${profiledeatils?.wallet_address}`)
                }
                className="editcnl"
              >
                Cancel
              </button>
              <button
                className={btnState ? 'saveprofbtn' : 'saveprofbtn_dis'}
                type="button"
                disabled={!btnState}
                onClick={updateProfile}
              >
                {submitLoading ? (
                  <Loading margin={'0'} size={'16px'} />
                ) : (
                  t('editProfile.updateProfile')
                )}
              </button>
            </div>
          </div>
          <div className="relative profile_edit_frm">
            <div className="container">
              <form className="md:col-start-2">
                <div className="frminput">
                  <div className="frminputlabel">Display Name</div>
                  <input
                    className="responsive-placeholder bg-transparent text-input"
                    placeholder="Enter your display name"
                    name="name"
                    value={fields.name}
                    onChange={onChangeVal}
                    defaultValue={''}
                  />
                </div>
                <div className="frminput">
                  <div className="frminputlabel">
                    {t('editProfile.customURl')}
                  </div>
                  <div className="row text-input custom-url-wrp">
                    <div className="col-7 pl-0 custom-url-left">
                      <span>{process.env.REACT_APP_SITE_URL}/</span>
                    </div>
                    <div className="col-5 pl-0 custom-url-right">
                      <input
                        className="responsive-placeholder bg-transparen"
                        placeholder="custom-url"
                        defaultValue={''}
                        name="customUrl"
                        value={fields?.customUrl?.toLowerCase()}
                        onChange={onChangeVal}
                        maxLength={50}
                        spellCheck={false}
                      />
                    </div>
                  </div>
                  {msgIcon ? (
                    urlStatus ? (
                      <span className="custom_url correct_url">&#10003;</span>
                    ) : (
                      <span className="custom_url incorrect_url">&#x21;</span>
                    )
                  ) : (
                    ''
                  )}
                  {!urlStatus &&
                    (fields?.customUrl?.length < 6 ? (
                      <p style={{ color: 'red', fontSize: '16px' }}>
                        {customError?.customValidationMsg}
                      </p>
                    ) : (
                      <p style={{ color: 'red', fontSize: '16px' }}>
                        {urlMessage}
                      </p>
                    ))}
                </div>

                <div className="frminput">
                  <div className="frminputlabel">
                    {t('editProfile.email')}{' '}
                    <span className="text-danger"> * </span>
                  </div>
                  <input
                    className="responsive-placeholder bg-transparent text-input
                    ml-2 mr-2"
                    placeholder="Enter your email address"
                    defaultValue={''}
                    name="email"
                    value={fields.email}
                    onChange={onChangeVal}
                  />
                  {errorMsg && (
                    <p style={{ color: 'red' }}> Please Enter Valid Email</p>
                  )}
                </div>
                <div className="frminput">
                  <div className="text-blue w-full">
                    <div className="frminputlabel">{t('editProfile.bio')}</div>
                    <textarea
                      className="responsive-placeholder bg-transparent text-input resize-button-clear
                      "
                      placeholder="Write a brief description about yourself"
                      defaultValue={''}
                      name="bio"
                      value={fields.bio}
                      onChange={onChangeVal}
                    />
                  </div>
                </div>

                <div className="flex text-align justify-center update_profilebtn_wrp"></div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
      <Footer />
    </React.Fragment>
  );
}
const AddCoverModal = (props: any) => {
  const title = (
    <div className="modal_head_wrp row">
      <div className="col-9">
        <span>{props.t('profile.summary.updateCover')}</span>
      </div>
      <div className="modal-close col-3 text-right" onClick={props.hide}>
        <img src={imgConstants.closeIcon} alt="closeIcon" />
      </div>
    </div>
  );

  const content = (
    <div className="modal_content_wrp">
      <p>{props.t('profile.summary.coverText')}</p>
      <form className="">
        <div className="items-center text-align">
          {props.attachment && (
            <img
              className="preview-img"
              src={URL.createObjectURL(props.attachment)}
              alt="attatch-img"
              height="150"
              width="150px"
            />
          )}
        </div>

        <div className="modal_btn_wrp">
          <div className="text-right">
            <button className="modal_cmn_btn cancel_btn" onClick={props.hide}>
              Cancel
            </button>
            <input
              type="file"
              hidden
              ref={props.inputReference}
              name="attachment"
              accept="image/*"
              onChange={(event) => {
                props.inputClickHandler(event);
              }}
            />
            <button
              className="modal_cmn_btn choose_img_btn"
              type="button"
              onClick={() => props.inputReference.current.click()}
            >
              {props.t('profile.summary.chooseImage')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <Modal
      title={title}
      open={props.open}
      contentClass=""
      containerClass="rounded-32"
      content={content}
      onCloseModal={props.hide}
    />
  );
};
export default EditProfile;
