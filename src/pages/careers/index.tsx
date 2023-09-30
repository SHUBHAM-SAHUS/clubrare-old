import React, { useEffect } from 'react';
import './careers.scss';
import MainLayout from '../../layouts/main-layout/main-layout';

import { imgConstants } from '../../assets/locales/constants';
import { Card } from 'react-bootstrap';
import Slider from 'react-slick';
import CardSkeleton from '../../components/skeleton/card-skeleton';
import TwoCoins from '../../assets/images/TwoCoins.svg';
import { useState } from 'react';

const Footer = React.lazy(() => import('../../components/footer/footer'));

const Careers = () => {
  const [showskeleton, setShowSkelton] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSkelton(false);
    }, 3000);
    window.scrollTo(0, 0);
  }, []);

  const RemoteTeam = [
    {
      name: 'PAUL CHUNG',
      designation: 'CEO',
      emploeeImg: imgConstants.paulChungImg,
      linkedinImg: imgConstants.LinkedinLogo,
      linkedinUrl: 'https://www.linkedin.com/in/jiwoong/',
    },
    {
      name: 'ELLY KANG',
      designation: 'CSO',
      emploeeImg: imgConstants.ellyKangImg,
      linkedinImg: imgConstants.LinkedinLogo,
      linkedinUrl: 'https://www.linkedin.com/in/elly-kang-777679166/',
    },
    {
      name: 'matias richards',
      designation: 'Talent Acquisition Manager',
      emploeeImg: imgConstants.matiasRichardsImg,
      linkedinImg: imgConstants.LinkedinLogo,
      linkedinUrl: 'https://www.linkedin.com/in/matiasrichards/',
    },
    {
      name: 'GLENN',
      designation: 'Token Project Manager',
      emploeeImg: imgConstants.glennImg,
    },
    {
      name: 'Claire Kang',
      designation: 'Token Project Manager',
      emploeeImg: imgConstants.claireKangImg,
    },
    {
      name: 'Florian Munoz',
      designation: 'Metaverse Product Manager',
      emploeeImg: imgConstants.florianMunozImg,
      linkedinImg: imgConstants.LinkedinLogo,
      linkedinUrl: 'https://www.linkedin.com/in/florianmunoz/',
    },
    {
      name: 'ANDY BELL',
      designation: 'Engineer',
      emploeeImg: imgConstants.andyBellImg,
    },
    {
      name: 'Satoru Kato',
      designation: 'Engineer',
      emploeeImg: imgConstants.satoruKatoImg,
    },
    {
      name: 'CASEY EVERTS',
      designation: 'Node Product Manager',
      emploeeImg: imgConstants.caseyEvertsImg,
      linkedinImg: imgConstants.LinkedinLogo,
      linkedinUrl: 'https://www.linkedin.com/in/caseyeverts/',
    },
    {
      name: 'EMMA KIM',
      designation: 'Interpreter & Translator',
      emploeeImg: imgConstants.emmaKimImg,
    },
    {
      name: 'roy chung',
      designation: 'Engineer',
      emploeeImg: imgConstants.royChungImg,
    },
    {
      name: 'CHRIS ASTLES',
      designation: 'Design Manager',
      linkedinImg: imgConstants.LinkedinLogo,
      emploeeImg: imgConstants.chrisAstlesImg,
      linkedinUrl: 'https://www.linkedin.com/in/chris-astles-09379952/',
    },
  ];
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 649,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          initialSlide: 2.5,
        },
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          initialSlide: 1.5,
        },
      },
    ],
  };

  return (
    <div className="careers_main_wrp">
      <MainLayout mainClassName="careers_page_wrp">
        {showskeleton ? (
          // <Spinner />
          <div className="row cardskeleton_wrp">
            {[1].map((loading) => (
              <div className=" cardskeleton_inner" key={loading}>
                <CardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="banner_sect">
              <div className="container-fluid">
                <div className="banner_contant_wrp">
                  <h1>
                    Building a collector-centered <br />
                    METAVERSE
                  </h1>
                  <p>Join us as we innovate commerce and community in web3</p>
                </div>
                <div>
                  <a
                    href="https://apply.workable.com/clubrare/"
                    className="careers_comm_btn"
                    rel="noreferrer"
                    target="_blank"
                  >
                    APPLY NOW
                  </a>
                </div>
              </div>
            </div>
            <div className="careers_brand_sect">
              <div className="brand_img_wrp d-flex">
                <img src={imgConstants.budweiserimg} alt="" />
                <img src={imgConstants.thesendboximg} alt="" />
                <img src={imgConstants.naeemkhanimg} alt="" />
                <img src={imgConstants.relevantcustomimg} alt="" />
              </div>
            </div>
            <div className="mission_sect">
              <div className="container-fluid">
                <div className="mission_inner_wrp">
                  <img src={imgConstants.union} alt="" />
                  <h1>mission</h1>
                  <p>
                    The ClubRare mission is to build a collector-centered
                    ecosystem <br />
                    for physical goods on web3, become the bridge from the{' '}
                    <br />
                    metaverse to the real world, and empower individuals to
                    shape <br />
                    their destinies both on and offline.
                  </p>
                </div>
              </div>
            </div>
            <div className="web_sect">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 from_web_left"></div>
                <div className="col-lg-6 col-md-6 col-sm-12 pt-sm-5 pb-sm-5  from_web_right">
                  <div className="container">
                    <img src={imgConstants.webstar} alt="" />
                    <h1>FROM WEB3 TO WEB-ME</h1>
                    <p>
                      At ClubRare, we are building platforms that empower <br />
                      individuals to express themselves.We’re bridging the real{' '}
                      <br />
                      world to the digital with a revolutionary logistics system
                      for <br />
                      NFT-backed physical goods.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="club_values_sect">
              <div className="container-fluid">
                <div className="club_values_wrp">
                  <img
                    className="valuestar_img"
                    src={imgConstants.valuestar}
                    alt=""
                  />
                  <h2 className="text-center">CLUBRARE VALUES</h2>
                  <div className="club_values_inner">
                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <img
                          src={imgConstants.integrityimg}
                          alt="handshake-img"
                        />
                        <h5>integrity</h5>
                        <p>
                          The ability to adhere to the standards, values and
                          rules of conduct associated with one’s position and
                          the culture in which one operates.
                        </p>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <img
                          src={imgConstants.Intentionalityimg}
                          alt="handshake-img"
                        />
                        <h5>Intentionality</h5>
                        <p>
                          The ability to be aware of, control, and express one's
                          emotions, ask clarifying questions, make people feel
                          heard and respected, and to handle interpersonal
                          relationships judiciously.
                        </p>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <img
                          src={imgConstants.empathyimg}
                          alt="handshake-img"
                        />
                        <h5>empathy</h5>
                        <p>
                          The ability to understand verbal and nonverbal
                          information, consider situations from all frames of
                          reference, and recognize the importance of the
                          perspectives and context of others.
                        </p>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <img
                          src={imgConstants.flexibilityimg}
                          alt="handshake-img"
                        />
                        <h5>flexibility</h5>
                        <p>
                          The ability to change one’s behavioral style and/or
                          views in order to attain a set goal, and adapt to
                          changing circumstances.
                        </p>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <img
                          src={imgConstants.resilienceimg}
                          alt="handshake-img"
                        />
                        <h5>resilience</h5>
                        <p>
                          The ability to rebound from challenge and adversity as
                          a more resourceful contributor.
                        </p>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <img
                          src={imgConstants.insightimg}
                          alt="handshake-img"
                        />
                        <h5>insight</h5>
                        <p>
                          The ability to deconstruct problems and systematically
                          investigate the various components, in order to build
                          a complete picture of the whole problem.
                        </p>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <img
                          src={imgConstants.analysisimg}
                          alt="handshake-img"
                        />
                        <h5>analysis</h5>
                        <p>
                          The ability to detect problems, recognize important
                          information, and link various data in order to trace
                          causes and discover solutions.
                        </p>
                      </div>
                    </div>
                    <div className="joinus_btn_wrp">
                      <h3>JOIN US</h3>
                      <a
                        href="https://apply.workable.com/clubrare/"
                        className="careers_comm_btn"
                        rel="noreferrer"
                        target="_blank"
                      >
                        VIEW OPEN ROLES
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="remote_sec text-center">
              <div className="container-fluid">
                <img
                  src={imgConstants.globe}
                  alt="globeimg"
                  className="mx-auto"
                />
                <h2>100% REMOTE TEAM</h2>
                <p>
                  All roles with ClubRare are globally remotely based. We
                  encourage you to apply regardless of your location.
                </p>
              </div>
              <div className="remote_card_wrp ">
                <div className="container-fluid">
                  <div className="remote_card_inn desktop_remote_card_wrp ">
                    {RemoteTeam.map((val) => {
                      return (
                        <Card className="comm_card" key={val.name}>
                          <figure>
                            <Card.Img
                              className="employee_wrp"
                              variant="top"
                              src={val.emploeeImg}
                            />
                          </figure>
                          <Card.Body>
                            <h5>{val.name}</h5>
                            <h3>{val.designation}</h3>
                            {val.linkedinImg ? (
                              <a
                                className="d-inline-block"
                                href={val.linkedinUrl}
                                rel="noreferrer"
                                target="_blank"
                              >
                                <figure>
                                  <img src={val.linkedinImg} alt="" />
                                </figure>
                              </a>
                            ) : (
                              ''
                            )}
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                <div className="remote_card_inn mobile_remote_card_wrp ">
                  <Slider {...settings}>
                    {RemoteTeam.map((val) => {
                      return (
                        <Card className="comm_card" key={val.name}>
                          <figure>
                            <Card.Img
                              className="employee_wrp"
                              variant="top"
                              src={val.emploeeImg}
                            />
                          </figure>
                          <Card.Body>
                            <h5>{val.name}</h5>
                            <h3>{val.designation}</h3>
                            {val.linkedinImg ? (
                              <a
                                className="d-inline-block"
                                href={val.linkedinUrl}
                                rel="noreferrer"
                                target="_blank"
                              >
                                <figure>
                                  <img src={val.linkedinImg} alt="" />
                                </figure>
                              </a>
                            ) : (
                              ''
                            )}
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </Slider>
                </div>
              </div>
            </div>
            <div className="transforming_sec ">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 transforming_sec_left trans_cont">
                  <div className="container">
                    <img src={imgConstants.transformingImg} alt="" />
                    <h1>TRANSFORMING E-COMMERCE WITH WEB3</h1>
                    <p>
                      Paul Chung, CEO of ClubRare, shared his insights from the
                      e-commerce industry, and laid out his vision for
                      innovating the new collector economy.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 transforming_sec_right">
                  <div className="club_life_vedio_wrp">
                    <iframe
                      className="club_life_vedio"
                      width="570"
                      height="400"
                      src={imgConstants.clubLife}
                      title="Phygital NFT: Transforming E-Comerce with Web3 | NFT.NYC 2022"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            <div className="community_sec transforming_sec">
              <div className="row">
                <div className="transforming_sec_left">
                  <div className="container-fluid">
                    <img
                      className="star_img"
                      src={imgConstants.transformingImg}
                      alt=""
                    />
                    <h1>CLUBRARE community</h1>
                    <p>
                      The future of the distribution economy is empowering,
                      rewarding, and community-
                      <br />
                      owned. Become a member of the ClubRare community and earn
                      exclusive perks
                    </p>
                    <a
                      href="https://discord.com/invite/clubrare"
                      className="careers_comm_btn "
                      rel="noreferrer"
                      target="_blank"
                    >
                      JOIN DISCORD
                    </a>
                  </div>
                </div>
              </div>
              <div className="container-fluid">
                <div className="row community_sec_right">
                  <div className="col-lg-4 col-md-4 col-sm-12 comm_commiunity_sec">
                    <img
                      className="comm_logo_img"
                      src={imgConstants.resilienceimg}
                      alt=""
                    />
                    <h2>EMPOWERING</h2>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 comm_commiunity_sec">
                    <img className="comm_logo_img" src={TwoCoins} alt="" />
                    <h2>REWARDING</h2>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 comm_commiunity_sec">
                    <img
                      className="comm_logo_img"
                      src={imgConstants.empathyimg}
                      alt=""
                    />
                    <h2>COMMUNITY-OWNED</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="carreers_btn_wrp">
              <div className="container-fluid">
                <div className="row text-center">
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <div className="join_team">
                      <h2>join the team</h2>
                      <a
                        href="https://apply.workable.com/clubrare/"
                        className="careers_comm_btn"
                        rel="noreferrer"
                        target="_blank"
                      >
                        APPLY NOW
                      </a>
                    </div>
                    
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12 ">
                      <div className="become_partner">
                        <h2>BECOME A PARTNER</h2>
                        <a href="mailto:partners@clubrare.xyz" className="careers_comm_btn" rel="noreferrer">GET IN TOUCH</a>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </>
        )}
      </MainLayout>
      <Footer />
    </div>
  );
};
export default Careers;
