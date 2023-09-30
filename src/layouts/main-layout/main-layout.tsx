import React from 'react';
import Sidebar from './sidebar';
import { Spinner } from '../../components';
import { useHistory } from 'react-router-dom';
const Header = React.lazy(() => import('./header'));

function MainLayout({
  children,
  mainClassName,
  loading,
  hideCursor,
  displaySidebar = false,
  displayStickySidebar,
}: any) {
  const history = useHistory();
  return (
    <div className="">
      <Header hideCursor={hideCursor} />

      <div className="lg:flex">
        <div className={`lg:pt-40 ${displaySidebar ? 'lg:pl-16 lg:pr-8' : ''}`}>
          <Sidebar
            displaySidebar={displaySidebar}
            displayStickySidebar={displayStickySidebar}
            loading={loading}
          />
        </div>
        <main
          className={`main-container w-full pb-40 lg:pb-4 lg:pt-10 ${
            mainClassName || ''
          } ${
            displaySidebar
              ? 'lg:pr-8 xl:pr-11'
              : 'connact_wallet_wrp home_page_wrp'
          } ${history.location.pathname.includes('/profile') ? `pt-0` : ``}`}
        >
          {loading ? (
            <div className="mt-20">
              <Spinner />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
