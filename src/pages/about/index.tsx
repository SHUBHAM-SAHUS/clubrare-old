import Footer from '../../components/footer/footer';
import MainLayout from '../../layouts/main-layout/main-layout';
import './about.scss';
import collectImg from '../../assets/images/collectImg.svg';
import rescollectimg from '../../assets/images/rescollectimg.svg';
import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="club_about_main_page">
      <MainLayout>
        <div className="club_about_wrp">
          <div className="phygital_world_wrp">
            <div className="container">
              <div className="phygital_world_inn">
                <h1>BUILDING A PHYGITAL WORLD</h1>
                <p>
                  The ClubRare mission is to build a collector-centered
                  marketplace for physical <br /> goods on web3, become the
                  bridge from the metaverse to the real world, and <br />{' '}
                  empower individuals to shape their destinies both on and
                  offline.
                </p>
              </div>
            </div>
            <img
              className="w-100 h-100 collect_desk"
              src={collectImg}
              alt="collectImg"
            />
            <img
              className="w-100 h-100 collectimg_res"
              src={rescollectimg}
              alt="rescollectimg"
            />
          </div>
          <div className="re_centeringsec_wrp">
            <div className="container">
              <div className="re_centeringsec_inn">
                <h1>Re-centering the shopping experience</h1>

                <p>
                  ClubRare is developing the future of commerce and physical
                  distribution, centered on the collectors. Native to web3,
                  ClubRare is empowering the individual by connecting them
                  directly to creators, connecting creators directly to the
                  metaverse, and connecting the metaverse to the physical world.
                </p>

                <p>
                  At ClubRare, collectors can communicate directly with each
                  other and the creators they support. With innovative
                  governance protocols, community members shape the evolution of
                  the ecosystem, earn unique physical and digital rewards, and
                  build their presence in the metaverse.
                </p>
              </div>
            </div>
          </div>
          <div className="phygital_marketplace_wrp">
            <div className="container">
              <div className="phygital_marketplace_inn">
                <h1>
                  More than physical. More than digital. ClubRare is the
                  <br /> premiere <span>phygital</span> marketplace.
                </h1>
              </div>
              <div className="row phygital_blocks">
                <div className="col-lg-4 col-md-4 col-sm-12 comm_col">
                  <h3>Fair Start, Fair Development</h3>
                  <p>
                    ClubRare will never have private token sales. The
                    development team and community all receive a transparent and
                    fair distribution of tokens according to their contributions
                    and support. The long-term goal is full decentralization.
                  </p>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 comm_col">
                  <h3>Shared Profit and Governance</h3>
                  <p>
                    ClubRare is committed to sharing both profit and governance
                    with the community. The community determines ClubRare’s
                    operating policies, steers the development of ClubRare
                    products, and gets rewarded for their participation.
                  </p>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 comm_col">
                  <h3>Sustainable Economy</h3>
                  <p>
                    ClubRare is committed to never using unsustainable rewards
                    or gimmicks to capture market share. Contrary to other
                    projects that offer huge promises but fail to deliver over
                    time, ClubRare is building long-term economies within the
                    ecosystem.
                  </p>
                </div>
              </div>
            </div>
            <div className="phygital_marketplace_base">
              <h1>
                The future of the distribution economy is EMPOWERING,
                <br /> REWARDING, and community-owned
              </h1>
            </div>
          </div>
        </div>
      </MainLayout>
      <Footer />
    </div>
  );
};
export default About;
