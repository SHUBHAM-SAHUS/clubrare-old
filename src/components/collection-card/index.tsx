import { useState } from "react";
import LazyLoad from "react-lazyload";
import { imgConstants } from "../../assets/locales/constants";
import "../bit-card/bit-card.scss";
import VideoThumbnail from "react-video-thumbnail";

function CollectionCard({
  collection,
  index,
  setActiveCollectionId,
  getCollectibleByCollection,
}: any) {
  const [contentType, setContentType] = useState("image");
  const [playPause, setPlayPause] = useState<boolean>(true)

  const getImgContentTyp = (img: any) => {
    return fetch(img, { method: 'HEAD' }).then((response) =>
      response.headers.get('Content-type'),
    );
  };
  
  if (collection && collection?.image_id) {
    getImgContentTyp(collection?.image_id)
      .then((type) => {
        if (type?.split('/')[0]) {
          const content = type?.split('/')[0];
          setContentType(content);
        }
      })
      .catch(() => {
        return false;
      });
  }
  const changePlayPauseImg = (event:React.MouseEvent<HTMLElement>):void => {
    event.preventDefault()
    event.stopPropagation()
    setPlayPause(!playPause);
  }
  return (
    <>
      <div
        className="live_auction_slider new_club_card_wrp text-left shadow px-2"
        onClick={() => {
          setActiveCollectionId(index);
          getCollectibleByCollection(collection, index);
        }}
      >
        <div
          className={`new_club_card_imgwrp ${
            contentType == 'audio'
              ? 'audio_club_card_wrp'
              : contentType == 'image'
              ? ''
              : 'video_club_card_wrp'
          }`}
        >
          {contentType == 'image' ? (
            <LazyLoad>
              <img src={collection?.image_id} alt="image_id" className="" />
            </LazyLoad>
          ) : contentType == 'audio' ? (
            <div className="auio_img_wrp">
              <div className="inn_audio_box">
                <figure>
                  <img src={imgConstants.musicIcon} alt="musicIcon" />
                </figure>
                <audio controls>
                  <source src={collection?.image_id}></source>
                </audio>
              </div>
            </div>
          ) : (
            <div className="thumbnail_wrp">
            <button onClick={changePlayPauseImg}>
              {playPause ?<svg className="playimg" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_10_5)">
              <circle cx="24" cy="24" r="24" fill="white"/>
              <path d="M18 14V34L33 24L18 14Z" fill="#303030"/>
              </g>
              <defs>
              <clipPath id="clip0_10_5">
              <rect width="48" height="48" fill="white"/>
              </clipPath>
              </defs>
              </svg>:
              <svg className="playimg" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_10_10)">
              <circle cx="24" cy="24" r="24" fill="white"/>
              <path d="M15 34H21V14H15V34ZM27 14V34H33V14H27Z" fill="#303030"/>
              </g>
              <defs>
              <clipPath id="clip0_10_10">
              <rect width="48" height="48" fill="white"/>
              </clipPath>
              </defs>
              </svg>}
            </button>
            {playPause ?
              <VideoThumbnail 
              videoUrl={collection?.image_id}
            />:
              <video loop autoPlay> 
              <source src={collection?.image_id} type="video/mp4"></source>
            </video>}
          </div>
            
          )}
        </div>
        <div className="live_auct_cont">
          <div className="row live_auct_tit">
            <div className="col-10">
              <h3
                className="ml-2"
                style={{
                  width: '80%',
                  fontSize: '15px',
                  wordWrap: 'break-word',
                }}
              >
                {collection.displayName}
              </h3>
            </div>
          </div>
          <div className="row live_auct_bottom">
            <div className="col-6"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export { CollectionCard };
