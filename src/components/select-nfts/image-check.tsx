import { useState, useEffect } from "react";
import LazyLoad from "react-lazyload";
import { imgConstants } from "../../assets/locales/constants";
import VideoThumbnail from "react-video-thumbnail";

const ImageCheck = (props: any) => {
    
    const [contentType, setContentType] = useState("image");
    const [videoThumbnail, setVideoThumbnail] = useState<boolean>(false);
    const [audioPlayPause, setAudioPlayPause] = useState<boolean>(false);

    const getImgContentTyp = (img: any) => {
        return fetch(img)
          .then((response) => response.headers.get("Content-type"))
          .catch((err) => {
            return err;
        });
    };

    useEffect(() => {
    if (String(props?.collectible_file)) {
        getImgContentTyp(props.collectible_file)
          .then((type) => {
            if (type?.split("/")[0]) {
              const content = type?.split("/")[0];
              setContentType(content);
            }
          })
          .catch((err) => {
            return false;
          });
      }
    }, [props.collectible_file])

    return (
          <div
            className={`new_trass_card_imgwrp ${contentType == "audio"
              ? "audio_trass_card_wrp"
              : contentType == "image"
                ? ""
                : "video_trass_card_wrp"
              }`}
          >
            {!props.collectible_file || !props?.collectible?.s3_url ? 
                <img className="card_img" src={imgConstants.avatar} alt="avatar" />
            :
            contentType == "image" ? (
              <LazyLoad>
                <img src={props.collectible_file || props?.collectible?.s3_url} alt="" className="" />
              </LazyLoad>
            ) : contentType == "audio" ? (
              <div className="auio_img_wrp trass_audio_wrp">
                <div className="inn_audio_box text-right">
                  <figure>
                    <img
                      src={
                        "https://d1gqvtt7oelrdv.cloudfront.net/assets/images/musicIcon.png"
                      }
                      alt=""
                    />
                  </figure>
                  {audioPlayPause && 
                    <audio autoPlay>
                      <source src={props.collectible_file || props?.collectible?.s3_url}  ></source>
                    </audio>
                  }
                  <button type="button" className="trass_audio_btn" 
                  onClick={() => setAudioPlayPause(!audioPlayPause)}  >{audioPlayPause ? <>	&#9208;</> : <>&#9205;</>  }	</button>
                </div>
              </div>
            ) : (
                <div className="trass_vedio_wrp">
                  {videoThumbnail ? 
                    <video autoPlay loop >
                      <source src={props.collectible_file || props?.collectible?.s3_url} type="video/mp4"></source>
                    </video> :
                    <VideoThumbnail videoUrl={props.collectible_file || props?.collectible?.s3_url}/>
                  }
                  <button type="button" className="trass_vedio_btn" onClick={() => setVideoThumbnail(!videoThumbnail)} >{videoThumbnail ? <>	&#9208;</> : <>&#9205;</>  }	</button>
                </div>
              )
            }
          </div>
    )
}

export { ImageCheck }
