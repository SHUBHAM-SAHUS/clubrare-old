export interface ItemDetails {
  auctionDetails: {
    id?:string;
    image?:any;
    auctionType: string;
    collectible_data: string;
    bid_time: string;
    buyPrice: string;
    buyer: string;
    closingTime: string;
    collectible_id: string;
    collection_address: string;
    contract_address: string;
    currentBid: string;
    erc20Token: string;
    highestBidder: string;
    initialClosingTime: string;
    isTokenGated: boolean;
    is_active: boolean;
    lastOwner: string;
    nonce: string;
    signature: string;
    startingPrice: string;
    startingTime: string;
    tokenGateAddress: string;
    token_id: null | string;
    collectible_owner: string;
    contract_type: string;
    created_by: string;
    created_on: string;
    customFields: any[];
    description: string;
    file: string;
    history: any;
    is_approve: boolean;
    is_hide: boolean;
    is_like: boolean;
    network_id: string;
    nft_type: string;
    on_sale: boolean;
    preview_url: string;
    redeem_type: number;
    redeem_verified: boolean;
    redeemable: boolean;
    royalties: number;
    title: string;
    total_like: number;
    transaction_hash: string;
    usd_amount: number;
    view_count: number;
    _id: string;
    userObj: {
      image: null | string;
      name: null | string;
      wallet_address: string;
    };
  };
  id?:string;
  collectible_data:string | null;
  name?:string | null
  eth_price?:string;
  collection:string;
  timer:string;
  collectible_owner: string;
  collection_address: string;
  contract_type: string;
  created_by: string;
  created_on: string;
  customFields: any[];
  creator_image?:string;
  owner_image:string
  description: string;
  file: string;
  history: any;
  is_active: boolean;
  is_approve: boolean;
  is_hide: boolean;
  is_like: boolean;
  network_id: string;
  nft_type: string;
  on_sale: boolean;
  preview_url: string;
  redeem_type: number;
  redeem_verified: boolean;
  redeemable: false;
  royalties: number;
  title: string;
  total_like: number;
  usd_amount: number;
  userObj: {
    image: string;

    name: string;
    wallet_address: string;
  };
  view_count: number;
  _id:string;
  image?:any
}

export interface createdItemsTypes {
  myItemsReducer: {
    createdItems: ItemDetails[];
  };
}

export interface createdItemIsNullTypes {
  myItemsReducer: {
    createdItemIsNull: boolean;
  };
}

export interface createdItemPageTypes {
  myItemsReducer: {
    createdItemPage: number;
  };
}

export interface hiddenItemsTypes {
  myItemsReducer: {
    hiddenItems: ItemDetails[];
  };
}

export interface hiddenItemIsNullTypes {
  myItemsReducer: {
    hiddenItemIsNull: boolean;
  };
}

export interface hiddenItemPageType {
  myItemsReducer: {
    hiddenItemPage: number;
  };
}

export interface collectibleItemsTypes {
  myItemsReducer: {
    collectibleItems: ItemDetails[];
  };
}

export interface pendingCollectibleItemsTypes {
  myItemsReducer: {
    pendingCollectibleItems: ItemDetails[];
  };
}

export interface collectedItemIsNullTypes {
  myItemsReducer: {
    collectedItemIsNull: boolean;
  };
}

export interface pendingCollectedItemIsNullType {
  myItemsReducer: { pendingCollectedItemIsNull: boolean };
}

export interface collectedItemPageType {
  myItemsReducer: { collectedItemPage: number };
}

export interface pendingCollectedItemPageType {
  myItemsReducer: { pendingCollectedItemPage: number };
}

export interface onSaleItemsTypes {
  myItemsReducer: { onSaleItems: ItemDetails[] };
}

export interface onSaleItemIsNullType {
  myItemsReducer: { onSaleItemIsNull: boolean };
}

export interface onSaleItemPageType {
  myItemsReducer: { onSaleItemPage: number };
}

export interface favourateItemTypes {
  myItemsReducer: { favourateItem: ItemDetails[] };
}

export interface onFaviourateItemIsNullTypes {
  myItemsReducer: { onFaviourateItemIsNull: boolean };
}

export interface onFaviourateItemPage {
  myItemsReducer: { onFaviourateItemPage: number };
}

export interface collectionDetailsType {
  banner_image: string;
  collectible_type: string;
  collection_abi_path: string;
  collection_address: string;
  collection_status: string;
  created_on: string;
  description: string;
  displayName: string;
  factory_address: string;
  image_id: string;
  is_active: boolean;
  network_id: string;
  order: string;
  symbol: string;
  symbol_hash: string;
  transaction_hash: string;
  wallet_address: string;
  __v: number;
  _id: string;
  message: string;
  status: boolean;
}

export interface collectibleListTypes {
  myItemsReducer: { collectionItem: ItemDetails[] };
}

export interface collectibleItemPageTypes {
  myItemsReducer: { collectibleItemPage: number };
}

export interface isCollectionTypes {
  myItemsReducer: {
    collectionItemIsNull: boolean;
  };
}

