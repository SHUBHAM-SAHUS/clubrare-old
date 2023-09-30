import React, { Suspense } from 'react';
import './app.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { routeMap } from './router-map';
import {
  NotFound,
  ViaTwitter,
  TransfferAssets,
  BackgroundTemplate,
  BackgroundColor,
} from './pages';
import { ToastProvider } from 'react-toast-notifications';
import { RewardAdmin } from './pages/reward-admin/reward-admin';
import Careers from './pages/careers';
import About from './pages/about';
import CollectionDetail from './pages/collection-detail';
import WhitelistSeller from './pages/whitelist-seller';
import CategoryDetail from './pages/category-detail';
import AdminWarehouse from './pages/admin-ware-house';
import { AgovDaoLpStaking } from './pages/agov-dao-lp-staking';
import { MpwrDaoLpStaking } from './pages/mpwr-dao-lp-staking';
import { EthLlcNftLpStaking } from './pages/eth-llc-nft-lp-staking';
import PendingApproval from './pages/pending-approval';
import MetaverseItems from './pages/metaverse-items';
import AuthenticationLists from './pages/authentication-lists';
import SpaceLists from './pages/space-lists';

const Ilo = React.lazy(() => import('./pages/Ilo'));
const Stack = React.lazy(() => import('./pages/stake'));
const Home = React.lazy(() => import('./pages/home'));
const Explore = React.lazy(() => import('./pages/explore/explore'));
const Support = React.lazy(() => import('./pages/support'));
const TransactionHashModal = React.lazy(
  () => import('./components/notification-modal'),
);
const ProductVerification = React.lazy(
  () => import('./pages/product-verfication'),
);
const ViewSells = React.lazy(() => import('./pages/profile/view-sells'));
const RedeemList = React.lazy(() => import('./pages/redeem-list'));
const ReportsList = React.lazy(() => import('./pages/reports-list'));
const ApprovalList = React.lazy(() => import('./pages/Item-approval'));
const DropsList = React.lazy(() => import('./components/clubrare-drops-list'));
const ClaimingNFT = React.lazy(() => import('./pages/claiming-nft'));
const ClaimingNFTSuccess = React.lazy(
  () => import('./pages/claiming-nft/success'),
);
const CommunityUpvote = React.lazy(
  () => import('./pages/profile/community-upvote'),
);
const ConnectWallet = React.lazy(() => import('./pages/connect-wallet'));
const Create = React.lazy(() => import('./pages/create'));
const EditProfile = React.lazy(() => import('./pages/profile/edit-profile'));
const LiveAuction = React.lazy(
  () => import('./pages/live-auctions/live-auction'),
);
const LiveAuctionsPage = React.lazy(() => import('./pages/live-auctions'));
const profile = React.lazy(() => import('./pages/profile/view-profile'));
const Upvote = React.lazy(() => import('./pages/profile/upvote'));
const UserList = React.lazy(() => import('./pages/user-list/index'));
const VerifyProfile = React.lazy(
  () => import('./pages/profile/verify-profile'),
);
const StakeAdmin = React.lazy(() => import('./pages/stake-admin/index'));
const AdminSellReport = React.lazy(
  () => import('./pages/admin-sells-report/index'),
);
const AdminSalesStatsReport = React.lazy(
  () => import('./pages/admin-sell-stats-report/index'),
);
const AdminAllItemReport = React.lazy(
  () => import('./pages/admin-all-item-report/index'),
);
const EscrowlistReport = React.lazy(() => import('./pages/escrow-list/index'));

const VaultItemListReport = React.lazy(
  () => import('./pages/vault-item-list/index'),
);
function App() {
  return (
    <>
      <Suspense fallback={<div> </div>}>
        <ToastProvider>
          <TransactionHashModal />
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Redirect to={routeMap.home} />}
              />
              <Route exact path={routeMap.home} component={Home} />
              <Route
                exact
                path={routeMap.liveAuctions.view(':collectible_id')}
                component={LiveAuction}
              />
              <Route
                exact
                path={routeMap.liveAuctions.index}
                component={LiveAuctionsPage}
              />
              <Route exact path={routeMap.explore} component={Explore} />
              <Route exact path={routeMap.create} component={Create} />
              <Route
                exact
                path={routeMap.connectWallet}
                component={ConnectWallet}
              />
              <Route
                exact
                path={routeMap.claimingNFT.success}
                component={ClaimingNFTSuccess}
              />
              <Route
                exact
                path={routeMap.claimingNFT.index}
                component={ClaimingNFT}
              />
              <Route
                exact
                path={routeMap.profile.verifyProfile.viaTwitter}
                component={ViaTwitter}
              />
              <Route
                exact
                path={routeMap.profile.verifyProfile.index}
                component={VerifyProfile}
              />
              <Route exact path={routeMap.profile.upvote} component={Upvote} />
              <Route
                exact
                path={routeMap.profile.communityUpvote}
                component={CommunityUpvote}
              />
              <Route
                exact
                path={routeMap.profile.edit}
                component={EditProfile}
              />
              <Route exact path={routeMap.userList} component={UserList} />
              <Route
                exact
                path={routeMap.productVerification}
                component={ProductVerification}
              />
              <Route exact path={routeMap.redeemList} component={RedeemList} />
              <Route exact path={routeMap.ViewSells} component={ViewSells} />
              <Route
                exact
                path={routeMap.reportsList}
                component={ReportsList}
              />
              <Route
                exact
                path={routeMap.approveList}
                component={ApprovalList}
              />
              <Route
                exact
                path={routeMap.adminSellReport}
                component={AdminSellReport}
              />
              <Route
                exact
                path={routeMap.listNFT}
                component={TransfferAssets}
              />
              <Route exact path={routeMap.rewards} component={Stack} />
              <Route exact path={routeMap.ilo} component={Ilo} />
              <Route exact path={routeMap.presale} component={RewardAdmin} />
              <Route exact path={routeMap.stake} component={StakeAdmin} />
              <Route exact path={routeMap.careers} component={Careers} />
              <Route exact path={routeMap.about} component={About} />
              <Route
                exact
                path={routeMap.whitelistSeller}
                component={WhitelistSeller}
              />
              <Route
                exact
                path={routeMap.spaceLists}
                component={SpaceLists}
              />

              <Route
                exact
                path={routeMap.category}
                component={CategoryDetail}
              />
              <Route
                exact
                path={routeMap.backgroundTemplate}
                component={BackgroundTemplate}
              />
              <Route exact path={routeMap.color} component={BackgroundColor} />
              <Route
                exact
                path={routeMap.adminWarehouse}
                component={AdminWarehouse}
              />
              <Route
                exact
                path={routeMap.topCollection.view(
                  ':collection_address',
                  ':network_id',
                )}
                component={CollectionDetail}
              />
              <Route exact path={routeMap.support} component={Support} />
              <Route
                exact
                path={routeMap.clubrareDrops}
                component={DropsList}
              />
              <Route exact path={routeMap.rewards} component={Stack} />
              <Route
                exact
                path={routeMap.agovDaoLpStaking}
                component={AgovDaoLpStaking}
              />
              <Route
                exact
                path={routeMap.mpwrDaoLpStaking}
                component={MpwrDaoLpStaking}
              />
              <Route
                exact
                path={routeMap.llcMigration}
                component={EthLlcNftLpStaking}
              />
              <Route
                exact
                path={routeMap.statsReports}
                component={AdminSalesStatsReport}
              />
              <Route
                exact
                path={routeMap.adminallItemReport}
                component={AdminAllItemReport}
              />
              <Route
                exact
                path={routeMap.escrowlistReport}
                component={EscrowlistReport}
              />
              <Route
                exact
                path={routeMap.vaultItemListReport}
                component={VaultItemListReport}
              />
              <Route
                exact
                path={routeMap.pendingApproval}
                component={PendingApproval}
              />
              <Route
                exact
                path={routeMap.metaverseItems}
                component={MetaverseItems}
              />
              <Route
                exact
                path={routeMap.authenticationPurchase}
                component={AuthenticationLists}
              />
              <Route
                exact
                path={routeMap.profile.view(':address')}
                component={profile}
              />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </ToastProvider>
      </Suspense>
    </>
  );
}

export default App;
