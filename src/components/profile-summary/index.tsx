import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import {
  EditProfileAction,
  getEditProfileAction,
} from '../../redux/actions/edit-profile-action';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ShowMoreText from 'react-show-more-text';
import { useSelector, useDispatch } from 'react-redux';
import '../../pages/profile/view-profile/view-profile.css';
import { imgConstants } from '../../assets/locales/constants';
import { Loading } from '../loading';

const Modal = React.lazy(() => import('../modal'));
const ReportModal = React.lazy(
  () => import('../../pages/profile/view-profile/report-modal'),
);

function ProfileSummary({
  wrapperClassName,
  profile,
  userAdd,
  otherUserProfile,
}: any) {
  const { t } = useTranslation();
  const [reportOpen, setReportOpen] = useState(false);
  const [attachment, setAttachment] = useState<any>();
  const inputReference = React.createRef();
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [saveButton, setSaveButton] = useState<boolean>(false);
  const [coverBackgroundPosition, setCoverBackgroundPosition] = useState('');
  const [uploadedImage, setUploadedImage]: any = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const { addToast } = useToasts();
  const [profileImg, setProfileImage]: any = useState(imgConstants.rectangle);
  const [coverImage, setCoverImage]: any = useState(imgConstants.tickBox);
  const dispatch = useDispatch();
  const [fields, setFields] = useState({
    name: '',
    bio: '',
    twitterUsername: '',
    email: '',
    customUri: '',
  });
  const profile_details = useSelector((state: any) => {
    return state.profileReducers.profile_details;
  });


  const [submitLoading, setSubmitLoading] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);

  useEffect(() => {
    const container: any = document.querySelector('div#cover-image') || '';
    if (saveButton) {
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
              imagePosBefore = imagePosAfter;
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

  useEffect(() => {
    if (uploadedImage) {
      setIconLoading(true);
      const element: any = document.querySelector('#cover-image') || '';
      const backPos = element.style.backgroundPosition;
      uploadCoverImage(backPos);
    }
  }, [uploadedImage]);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const closeAddCoverModal = () => {
    setShowCoverModal(false);
    setSaveButton(false);
    setSubmitLoading(false);
    const container: any = document.querySelector('div#cover-image') || '';
    container.style.pointerEvents = 'none';
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
          setAttachment(event.target.files[0]);
        }
      };
    } else {
      setAttachment(event.target.files[0]);
    }
    setShowCoverModal(false);
  };

  useEffect(() => {
    if (profile_details) {
      setFields({
        ...fields,
        name: profile_details.name,
        bio: profile_details.bio,
        email: profile_details.email,
        customUri: profile_details.custom_url,
      });
      setProfileImage(profile_details?.image);
      setCoverImage(profile_details?.cover_image);
      setCoverBackgroundPosition(profile_details?.coverBackgroundPosition);
    }
  }, [profile_details]);

  const handleChangeBannerImage = (e: any) => {
    const file = e?.target?.files;
    setUploadedImage(file[0]);
  };

  const uploadCoverImage = async (backPos: any) => {
    setSubmitLoading(true);
    const formData = new FormData();
    const address: any = localStorage.getItem('Wallet Address');
    formData.append('_id', profile_details?._id);
    formData.append('wallet_address', address ? address : '');
    formData.append('custom_url', fields.customUri ? fields.customUri : '');
    formData.append('name', fields.name ? fields.name : '');
    formData.append('email', fields.email ? fields.email : '');
    formData.append('bio', fields.bio ? fields.bio : '');
    formData.append(
      'attachment',
      uploadedImage ? uploadedImage : imgConstants.defaultProfileImg,
    );
    formData.append('cover_attachment', attachment ? attachment : coverImage);
    formData.append('coverBackgroundPosition', backPos ? backPos : '');
    const response: any = await dispatch(EditProfileAction(formData));
    setSaveButton(false);
    const container: any = document.querySelector('div#cover-image') || '';
    container.style.pointerEvents = 'none';
    if (response?.status === true) {
      addToast('Profile updated successfully', {
        appearance: 'success',
        autoDismiss: true,
      });
      dispatch(getEditProfileAction({ user_address: address }));
    }
    setSubmitLoading(false);
    setIconLoading(false);
  };

  const handleSaveImage = () => {
    const element: any = document.querySelector('#cover-image') || '';
    const backPos = element.style.backgroundPosition;
    uploadCoverImage(backPos);
  };

  const handleOpenModal = () => {
    setSaveButton(true);
    setShowCoverModal(true);
    const container: any = document.querySelector('div#cover-image') || '';
    container.style.pointerEvents = 'auto';
  };

  return (
    <div className={wrapperClassName}>
      {showCoverModal && (
        <AddCoverModal
          hide={closeAddCoverModal}
          inputReference={inputReference}
          attachment={attachment}
          inputClickHandler={inputClickHandler}
          open={showCoverModal}
          t={t}
        />
      )}
      <ReportModal
        report_to_add={userAdd}
        open={reportOpen}
        onCloseModal={() => setReportOpen(false)}
      />
      <div
        className="relative rect-angle-profile"
        id="cover-image"
        style={{
          backgroundImage: `url(${
            attachment
              ? URL.createObjectURL(attachment)
              : profile?.cover_image
              ? profile?.cover_image
              : imgConstants.rectangle
          })`,
          backgroundPosition: `${
            coverBackgroundPosition ? coverBackgroundPosition : '50% 50%'
          }`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {saveButton ? (
          <button className="cover_text_style">Scroll to Reposition</button>
        ) : null}

        {!otherUserProfile ? (
          !saveButton ? (
            <button onClick={handleOpenModal} className="cover_upload_btn">
              {coverImage
                ? t('profile.summary.updateCover')
                : t('profile.summary.addCover')}
            </button>
          ) : (
            <button
              className="cover_upload_btn"
              disabled={submitLoading}
              onClick={handleSaveImage}
            >
              {submitLoading ? 'loading..' : 'Save cover'}
            </button>
          )
        ) : null}
      </div>

      <div className="flex flex-col items-center top-position profile_page_wrp">
        <div className="profile_img_wrp">
          <figure
            className={`cmn_club_profile ${
              otherUserProfile ? 'nohoverimg' : ''
            } `}
          >
            {uploadedImage ? (
              <img
                className="club_profile_img"
                src={URL.createObjectURL(uploadedImage)}
                alt="avatar"
              />
            ) : (
              <img
                className="club_profile_img"
                src={profile?.image || imgConstants.defaultProfileImg}
                alt="avatar"
              />
            )}
            {!otherUserProfile ? (
              <label htmlFor="proflile-image">
                <img
                  className="club_profile_img_hover"
                  src={imgConstants.hoverProfileImg}
                  alt="avatar"
                />
              </label>
            ) : (
              ''
            )}
            {iconLoading && (
              <div className="d-flex justify-content-center">
                <Loading
                  className="icon-loading-style"
                  margin={'0'}
                  size={'50px'}
                />
              </div>
            )}
          </figure>
          {/* <img className="varified_user_img" src={varified_seller} alt="varified-Seller" /> */}
        </div>
        {!otherUserProfile ? (
          <input
            id="proflile-image"
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleChangeBannerImage}
          />
        ) : (
          ''
        )}

        {profile?.isVerified && (
          <img
            className="absolute bottom-0 right-0"
            src={imgConstants.tickBox}
            alt="tick box"
          />
        )}
        <div className="text-center">
          <div className="user_add_wrp">
            <CopyToClipboard
              text={profile?.wallet_address?.toString()}
              onCopy={onCopyText}
            >
              <div className="user_addbtn flex">
                {profile?.network_id === '1' ? (
                  <img src={imgConstants.ethIcon} alt="currencyIcon" />
                ) : profile?.network_id === '2' ? (
                  <img src={imgConstants.klyicon} alt="currencyIcon" />
                ) : null}

                {isCopied ? (
                  'Copied...'
                ) : (
                  <div>
                    {profile?.wallet_address
                      ? profile?.wallet_address.toString().substring(0, 5) +
                        '.....' +
                        profile?.wallet_address
                          .toString()
                          .substr(profile?.wallet_address.length - 4)
                      : ''}
                  </div>
                )}
              </div>
            </CopyToClipboard>
          </div>
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
              {profile?.bio}
            </ShowMoreText>
          </p>
        </div>

        <div className="text-18 font-semibold text-center mt-2">
          {profile?.name}
        </div>
        <div className="text-14 font-semibold text-center mt-2 text-gray"></div>
      </div>
    </div>
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
    <React.Suspense fallback={'Loading'}>
      <Modal
        title={title}
        open={props.open}
        contentClass="content_main_wrp"
        containerClass="updatecover_popupinn"
        content={content}
        onCloseModal={props.hide}
      />
    </React.Suspense>
  );
};
export default ProfileSummary;
