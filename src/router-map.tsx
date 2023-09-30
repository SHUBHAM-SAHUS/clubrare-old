export const routeMap = {
  home: '/home',
  home_new: '/home_new',
  liveAuctions: {
    index: '/live-auctions',
    view(collectible_id: any) {
      return `/item/${collectible_id}`;
    },
  },
  explore: '/explore',
  rewards: '/rewards',
  clubrareDrops: '/clubrare-drops',
  create: '/create',
  connectWallet: '/connect-wallet',
  claimingNFT: {
    index: '/claim',
    success: '/claim/success',
  },
  profile: {
    index: '',
    view(address: any) {
      return `/${address}`;
    },
    edit: '/profile/edit',
    upvote: '/profile/upvote',
    communityUpvote: '/profile/community-upvote',
    verifyProfile: {
      index: '/profile/verify',
      viaTwitter: '/profile/verify/twitter',
    },
  },
  userList: '/user-list',
  ViewSells: '/view-sells',
  productVerification: '/redeem-verification',
  redeemList: '/redeem-list',
  reportsList: '/reports-list',
  approveList: '/item-approval',
  dropNFT: '/clubrare-drop',
  connectionDetail: {
    index: '/collection-details',
    view(collectionAddress: any) {
      return `/collection-details/${collectionAddress}`;
    },
  },
  listNFT: '/list-nft',
  admin: '/admin',
  presale: '/presale-settings',
  ilo: '/ilo',
  stake: '/stake',
  careers: '/careers',
  about: '/about',
  topCollection: {
    index: '/top-collection',
    view(collection_address: any, network_id: any) {
      return `/collection/${collection_address}/${network_id}`;
    },
  },
  whitelistSeller: '/whitelist-seller',
  spaceLists:'/space-lists',
  support: '/support',
  category: '/category',
  adminWarehouse: '/warehouse',
  agovDaoLpStaking: '/agov-dao-lp-staking',
  adminSellReport: '/view-sells-report',
  mpwrDaoLpStaking: '/mpwr-dao-lp-staking',
  llcMigration: '/llc-migration',
  statsReports: '/stats-report',
  adminallItemReport: '/admin-all-item-report',
  escrowlistReport: '/escrow-list',
  vaultItemListReport:'/vault-item-list',
  pendingApproval: '/pending-approval',
  metaverseItems: '/metaverse-items',
  backgroundTemplate: '/background-template',
  color: '/color',
  notFoundPage: '/404',
  authenticationPurchase:"/authentication-lists"
};
