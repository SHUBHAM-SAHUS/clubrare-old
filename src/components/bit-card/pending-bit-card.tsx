import React, { useEffect, useState } from 'react';
import './pending-bit-card.scss';
import LazyLoad from 'react-lazyload';
import { imgConstants } from '../../assets/locales/constants';
import VideoThumbnail from 'react-video-thumbnail';
import { VideoPLayIcon } from '../icons/play-icon';
import { VideoStopIcon } from '../icons/stop-video-icon';

function PendingBidCard({
  name,
  collectibleType,
  closingTime,
  startingTime,
  list,
  itemDetails,
  deletecollection,
  editcollection,
}: any) {
  const menuRef: any = React.useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [daysLeft1, setDaysLeft1] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [hoursLeft1, setHoursLeft1] = useState(0);
  const [minutesLeft1, setMinutesLeft1] = useState(0);
  const [secondsLeft1, setSecondsLeft1] = useState(0);
  const [playPause, setPlayPause] = useState<boolean>(true);

  useEffect(() => {
    let interval: any = null;
    interval = setInterval(() => {
      if (collectibleType == '2' && closingTime) {
        const closingdate1 = new Date(closingTime);
        const closingdate2 = new Date(startingTime);
        const currentDate = new Date();
        timeDiffCalc(closingdate1, currentDate);
        timeDiffCalc1(closingdate2, currentDate);
      }
    }, 1000);
    document.addEventListener('mousedown', handleOutSideClick);
    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  const timeDiffCalc = (dateFuture: any, dateNow: any) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    // calculate hours
    let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    // calculate minutes
    const seconds = Math.floor(diffInMilliSeconds);
    if (days) {
      hours = hours;
    }
    setDaysLeft(days);
    setHoursLeft(hours);
    setMinutesLeft(minutes);
    setSecondsLeft(seconds);

    let difference = '';
    if (days > 0) {
      difference += days === 1 ? `${days} day, ` : `${days} days, `;
    }

    difference +=
      hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

    difference +=
      minutes === 0 || hours === 1
        ? `${minutes} minutes`
        : `${minutes} minutes`;

    return difference;
  };

  const timeDiffCalc1 = (dateFuture: any, dateNow: any) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    // calculate hours
    let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    // calculate minutes
    const seconds = Math.floor(diffInMilliSeconds);
    if (days) {
      hours = hours;
    }
    setDaysLeft1(days);
    setHoursLeft1(hours);
    setMinutesLeft1(minutes);
    setSecondsLeft1(seconds);

    let difference = '';
    if (days > 0) {
      difference += days === 1 ? `${days} day, ` : `${days} days, `;
    }

    difference +=
      hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

    difference +=
      minutes === 0 || hours === 1
        ? `${minutes} minutes`
        : `${minutes} minutes`;

    return difference;
  };

  const handleOutSideClick = (event: any) => {
    if (menuRef && menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenu(false);
    }
  };
  const changePlayPauseImg = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setPlayPause(!playPause);
  };

  return (
    <>
      <div className="new_pending_card_wrp text-left  px-3 py-2">
        {list?.file_content_type?.includes('image') ||
          list?.file_content_type?.includes('audio') ? (
          <>
            {itemDetails?.preview_url ? (
              <div className="preview_img_wrp">
                <img
                  src={itemDetails?.preview_url}
                  alt=""
                  className="preview_img"
                />
              </div>
            ) : (
              <div
                className={`new_club_card_imgwrp ${list?.file_content_type == 'audio'
                    ? 'audio_club_card_wrp'
                    : list?.file_content_type == 'image'
                      ? ''
                      : 'video_club_card_wrp'
                  }`}
              >
                {list?.file_content_type?.includes('image') ? (
                  <LazyLoad>
                    <img src={list?.s3_url} alt="file" className="img_rdsius" />
                  </LazyLoad>
                ) : list?.file_content_type?.includes('audio') ? (
                  <div className="auio_img_wrp">
                    <div className="inn_audio_box">
                      <figure>
                        <img src={imgConstants.musicIcon} alt="musicIcon" />
                      </figure>
                      <audio controls>
                        <source src={list?.s3_url}></source>
                      </audio>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            )}
          </>
        ) : null}
        {list?.file_content_type?.includes('video') && (
          <div
            className={`new_club_card_imgwrp ${list?.file_content_type == 'audio'
                ? 'audio_club_card_wrp'
                : list?.file_content_type == 'image'
                  ? ''
                  : 'video_club_card_wrp'
              }`}
          >
            <div className="thumbnail_wrp">
              {/* <button onClick={changePlayPauseImg}>
                {playPause ? (
                  <VideoPLayIcon className="playimg" />
                ) : (
                  <VideoStopIcon className="playimg" />
                )}
              </button>
              {playPause ? (
                <VideoThumbnail videoUrl={list.s3_url} />
              ) : (
                <video loop autoPlay>
                  <source src={list.s3_url} type="video/mp4"></source>
                </video>
              )} */}
               <video loop autoPlay muted>
                <source src={list?.preview_url} type="video/mp4"></source>
                </video>
            </div>
            <div className="liveauctimg_top row"></div>
          </div>
        )}
        <div className="liveauctimg_top row">
          <div className="category_heading">
            <span>{list?.nft_type}</span>
          </div>
        </div>
        <div className="liveauctimg_bottom">
          {collectibleType !== 2 &&
            new Date(startingTime).getTime() > new Date().getTime() ? (
            <span className="text-gray">
              Sale starts in :{+daysLeft1 < 10 ? '0' + daysLeft1 : daysLeft1}:
              {+hoursLeft1 < 10 ? '0' + hoursLeft1 : hoursLeft1}:
              {+minutesLeft1 < 10 ? '0' + minutesLeft1 : minutesLeft1}:
              {+secondsLeft1 < 10 ? '0' + secondsLeft1 : secondsLeft1}
            </span>
          ) : collectibleType == 2 &&
            new Date(closingTime).getTime() > new Date().getTime() ? (
            <span className="text-gray">
              Sale ends in :{+daysLeft < 10 ? '0' + daysLeft : daysLeft}:
              {+hoursLeft < 10 ? '0' + hoursLeft : hoursLeft}:
              {+minutesLeft < 10 ? '0' + minutesLeft : minutesLeft}:
              {+secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}
            </span>
          ) : collectibleType == 2 ? (
            <span>Auction Ended</span>
          ) : null}
        </div>

        <div className="live_auct_cont">
          <div
            className="row live_a  {/* {showDeleteModal && (
                <DeleteModal  hide={closeDeleteModal} 
                openDeleteModal={openDeleteModal} 
                />
            )} */}uct_tit"
          >
            <div className="live_auct_scroll col-10">
              <h3>{name}</h3>
            </div>
          </div>
          <div className="row live_auct_prof">
            <div
              className="col-7"
              style={{ marginTop: 'auto', marginBottom: 'auto' }}
            >
              <div className="row">
                <div
                  className="col-3 pr-0 pendcardimg"
                  style={{ marginTop: 'auto', marginBottom: 'auto' }}
                >
                  <figure>
                    <img
                      src={list?.userObj?.image || imgConstants.avatar}
                      alt="avatar"
                    />
                  </figure>
                </div>
                <div className="col-9">
                  <span className="card_creator_heading">Creator</span>
                  <span className="font-bold">
                    {list?.userObj?.name || list?.userObj?.wallet_address}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-5">
              <span className="approvalStatus">
                {list?.admin_approve_status}
              </span>
            </div>
          </div>

          <div className="card_place_bid_btns">
            <button className="card_place_bid_btn" onClick={editcollection}>
              Edit
            </button>
            <button className="card_place_bid_btn" onClick={deletecollection}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingBidCard;
