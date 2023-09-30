import React, { useState, useEffect, Suspense } from 'react';
import Layout from '../../layouts/main-layout/main-layout';
import { useSelector } from 'react-redux';
import { ClubCategory } from './club-category';
import './style.css';
const Banner = React.lazy(() => import('./banner'));
const TopMembers = React.lazy(() => import('./top-members'));
const Footer = React.lazy(() => import('../../components/footer/footer'));
const TopCollection = React.lazy(() => import('./top-collection'));
const LiveAuctions = React.lazy(
  () => import('../../components/live-auctions/index'),
);
const RecentAuctions = React.lazy(
  () => import('../../components/live-auctions/recent'),
);
const MostViews = React.lazy(
  () => import('../../components/live-auctions/most-view'),
);
const HotBids = React.lazy(
  () => import('../../components/live-auctions/hot-bids'),
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const auctionItems = useSelector(
    (state: any) => state.exploreReducer.RecentAuctionItems,
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <div className="homenew">
        <Layout mainClassName="newhome_page_wrp" loading={loading}>
          <div className="">
            <div className="row">
              <div className="col-md-12">
                <Suspense fallback={<></>}>
                  <Banner />
                </Suspense>

                <Suspense fallback={<></>}>
                  <LiveAuctions wrapperClass="" />
                </Suspense>

                <Suspense fallback={<></>}>
                  {auctionItems?.length > 0 && <TopCollection />}
                </Suspense>

                <Suspense fallback={<></>}>
                  <MostViews wrapperClass=" mt-10" />
                </Suspense>

                <Suspense fallback={<></>}>
                  <RecentAuctions wrapperClass=" mt-14" />
                </Suspense>

                <Suspense fallback={<></>}>
                  {auctionItems?.length > 0 && <TopMembers />}
                </Suspense>

                <Suspense fallback={<></>}>
                  <ClubCategory />
                </Suspense>

                <Suspense fallback={<></>}>
                  <HotBids wrapperClass=" mt-14" />
                </Suspense>
              </div>
            </div>
          </div>
        </Layout>
      </div>
      <Footer />
    </React.Fragment>
  );
};
export default Home;
