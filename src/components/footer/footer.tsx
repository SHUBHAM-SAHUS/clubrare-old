import React, { useEffect } from 'react';
import './footer.scss';
import { Link } from 'react-router-dom';
import logodark from '../../assets/images/CR_logo_footer.svg';
import { GET_SOCIAL_LINKS } from '../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { imgConstants } from '../../assets/locales/constants';
import { getSocialLinksAction } from '../../redux';

function Footer() {
  const dispatch = useDispatch();
  const getSocialLinks = useSelector(
    (state: any) => state.socialLinkReducer.data,
  );

  const callingApi = async () => {
    const result = await dispatch(getSocialLinksAction());
  };

  useEffect(() => {
    callingApi();
  }, []);

  return (
    <footer className="footer_wrp">
      <div className="container-fluid">
        <div className="footer_inn row">
          <div className="col-lg-6 col-md-6 col-sm-12 footer_left">
            <img src={logodark} alt="logodark" />
            <p>
              ClubRare - The premiere NFT marketplace for physical collectibles,
              connecting the metaverse to the real world.
            </p>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-12 text-end footer_right">
            <h6>Explore</h6>
            <ul>
              <li>
                <Link to="/live-auctions">Live Auctions</Link>
              </li>
              <li>
                <Link to="/clubrare-drops">Latest Drops</Link>
              </li>
              <li>
                <a
                  href="https://lazyleoclub.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Lazy Leo Club
                </a>
              </li>
              <li>
                <Link to="/explore">All NFTs</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-12 footer_right ">
            <h6>Resources</h6>
            <ul>
              <li>
                <Link to="/about"> About ClubRare</Link>
              </li>
              <li>
                <a
                  href="https://docs.clubrare.xyz/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Docs & Guides
                </a>
              </li>
              <li>
                <a
                  href="https://docs.clubrare.xyz/marketplace-user-guide/physical-authentication"
                  target="_blank"
                  rel="noreferrer"
                >
                  Authentication
                </a>
              </li>
              <li>
                <a
                  href="https://docs.clubrare.xyz/roadmap"
                  target="_blank"
                  rel="noreferrer"
                >
                  Roadmap
                </a>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/support">Support</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-3 col-sm-12 footer_col">
            <h6>Community</h6>
            <ul>
              {/* <li>
                <a href="https://t.me/ANSWER_GOVERNANCE" target="_blank">
                  <img src={footerteligram} alt="footerteligram" /> Telegram
                </a>
              </li> */}
              <li>
                <a
                  href={getSocialLinks ? getSocialLinks.twitter : ''}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={imgConstants.footertwitter} alt="footertwitter" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href={getSocialLinks ? getSocialLinks.discord : ''}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={imgConstants.footerddescord} alt="footerddescord" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href={getSocialLinks ? getSocialLinks.medium : ''}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={imgConstants.footermedium} alt="footermedium" />
                  Medium
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row copyright_wrp mt-5">
          <div className="col-5" style={{ paddingLeft: '35px' }}>
            <p>Copyright © {new Date().getFullYear()} ClubRare</p>
          </div>
          <div className="col-4" style={{ paddingLeft: '75px' }}>
            <p>
              <a
                href="https://docs.clubrare.xyz/terms-and-conditions"
                target="_blank"
                rel="noreferrer"
              >
                Terms of use
              </a>
            </p>
          </div>
          <div className="col-3" style={{ paddingLeft: '70px' }}>
            <p>
              <a href="mailto:support@clubrare.xyz">support@clubrare.xyz</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
