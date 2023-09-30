import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home-club.scss';
import tradeimg from '../../assets/images/tradeimg.svg';
import { useTranslation } from 'react-i18next';
import { imgConstants } from '../../assets/locales/constants';

const Homeclub = (props: any) => {
  const { t } = useTranslation();
  const [checkUserLogin, setCheckUserLogin] = useState<boolean>(false);
  const [checknetwork, Setchecknetwork] = useState<any>();
  const [hideContant, SetHideContant] = useState<boolean>(false);

  const getuserconnect = () => {
    const userconnection: any = localStorage.getItem('isConnected');
    const networkIdcheck: any = localStorage.getItem('networkId');
    setCheckUserLogin(userconnection);
    Setchecknetwork(networkIdcheck);
  };

  useEffect(() => {
    getuserconnect();
  }, []);

  return (
    <>
      <div className="club_landingpage_wrp">
        <div className="club_landingpage_inn">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6 club_landingpage_left landing_pg_mobile d-flex align-item-center">
                <div className="landingpg_col_inn">
                  <h1>
                    {t('homeClub.heading.heading1')}
                    <br /> {t('homeClub.heading.heading2')}
                    <br />
                    {t('homeClub.heading.heading3')}
                  </h1>
                  <p>
                    {t('homeClub.text.text1')}
                    <br />
                    {t('homeClub.text.text2')}
                    <del>{t('homeClub.text.text3')}</del>
                    <span>{t('homeClub.text.text4')}</span>
                    <br /> {t('homeClub.text.text5')}
                  </p>
                  <div className="clubbtn_wrp">
                    {props.profileDetails?.role === 'user' &&
                      props.profileDetails?.isWhiteListedSeller ? (
                      ''
                    ) : (
                      <button
                        type="button"
                        className="club_crtbtn culbbtn"
                        onClick={props.onCLickCreate}
                      >
                        Start Your Collection
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 club_landingpage_right">
                <img className="w-100 h-100 " src={tradeimg} alt="tradeimg" />
                <div className="club_landingpage_left club_landingpage_left_responsive">
                  <div className="clubbtn_wrp clubbtn_wrp_responsive">
                    <button
                      type="button"
                      onClick={props.onCLickCreate}
                      className="club_crtbtn culbbtn"
                    >
                      Start Your Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {!hideContant && (
        <div className="eth_provider_wrp">
          <div className="eth_provider_img_wrp">
            <img src={imgConstants.ethProviderImg} />
          </div>
          <div className="eth_provider_inner">

            <div className="container-fluid">
              <div className=" row eth_provider">
                <div className="col-lg-6 col-md-12 eth_provider_lft_wrp ">
                  <h1>
                    Clubare Ethereum <br />
                    Providers Contest
                  </h1>
                </div>
                <div className="col-lg-6 col-md-12 eth_provider_right_wrp">
                  <h1>$100k on the tables</h1>
                  <a href="https://lpcontest.clubrare.xyz/?utm_source=mainwebsite" rel="noreferrer" target="_blank">join now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};
export default Homeclub;
