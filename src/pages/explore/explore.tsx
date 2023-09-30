import React, { useEffect, useState,Suspense } from 'react';
import Layout from '../../layouts/main-layout/main-layout';
const ExploreContainer = React.lazy(() => import('../../components/explore'));

function Explore() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <div className="">
        <Layout
          mainClassName="mt-1 club_expl_page_wrp"
          displayStickySidebar
          loading={loading}
          >
           <Suspense fallback={<></>}>
           <ExploreContainer />
          </Suspense>         
        </Layout>
      </div>
    </>
  );
}

export default Explore;
