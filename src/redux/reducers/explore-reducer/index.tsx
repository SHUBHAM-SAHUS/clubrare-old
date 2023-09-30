import {
  SET_AUCTION,
  SET_RECENT_AUCTION,
  SET_LIVE_AUCTION,
  SET_MOST_VIEWED_AUCTION,
  SET_HOT_BIDS_AUCTION,
  AUCTION_LOADING,
  SET_AUCTION_IS_NULL,
  SET_EXPLORE_IS_NULL,
  SET_EXPLORE_ITEMS,
  UPDATE_AUCTION_ITEMS,
  UPDATE_LAZY_LEO_PAGE,
  SET_LAZY_LEO_IS_NULL,
  UPDATE_EXPLORE_ITEMS,
  UPDATE_EXPLORE_PAGE,
  UPDATE_ACTION_PAGE,
  SET_CLUBRARE_DROP_ITEMS,
  UPDATE_CLUBRARE_DROP_ITEMS,
  UPDATE_CLUBRARE_DROP_PAGE,
  MOST_LIKED_ITEMS,
  SEARCH_KEYWORD,
  EXPLORE_LIST_LOADING,
  SET_COLLECTION_ITEMS,
  SET_CLUBRARE_RECENT_DROP_ITEMS,
  UPDATE_CLUBRARE_RECENT__DROP_ITEMS,
  UPDATE_CLUBRARE_RECENT__DROP_PAGE,
  SET_CLUBRARE_RECENT__DROP_IS_NULL,
  SET_CLUBRARE_RECENT__LIST_LOADING,
} from '../../types';

const initialState = {
  exploreItems: [],
  auctionItems: [],
  RecentAuctionItems: [],
  liveAuctionItems: [],
  mostViewedItems: [],
  hotBidsItems: [],
  explorePageNo: 1,
  auctionPageNo: 1,
  exploreIsNull: true,
  auctionIsNull: false,
  clubrareDropsItems: [],
  clubrareDropsRecentItems: [],
  clubrareDropsPageNo: 1,
  clubrareDropsRecentPageNo: 1,
  clubrareDropsIsNull: false,
  clubrareDropsRecentIsNull: false,
  mostLikedNft: [],
  auction_loading: true,
  search_keyword: '',
  explore_loading: false,
  recent_drop_loading: false,
  search_start: false,
  lazyLeoPageNo: 1,
  lazyLeoIsNull: true,
  allCollection: [],
};

const exploreReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_EXPLORE_ITEMS:
      return { ...state, exploreItems: action.payload };
    case SET_AUCTION:
      return { ...state, auctionItems: action.payload };
    case SET_RECENT_AUCTION:
      return { ...state, RecentAuctionItems: action.payload };
    case SET_LIVE_AUCTION:
      return { ...state, liveAuctionItems: action.payload };
    case SET_MOST_VIEWED_AUCTION:
      return { ...state, mostViewedItems: action.payload };
    case SET_HOT_BIDS_AUCTION:
      return { ...state, hotBidsItems: action.payload };
    case SET_AUCTION_IS_NULL:
      return { ...state, auctionIsNull: true };
    case UPDATE_AUCTION_ITEMS:
      return {
        ...state,
        auctionItems: [...state.auctionItems, ...action.payload],
      };
    case UPDATE_EXPLORE_ITEMS:
      return {
        ...state,
        exploreItems: [...state.exploreItems, ...action.payload],
      };
    case SET_EXPLORE_IS_NULL:
      return { ...state, exploreIsNull: action.payload };
    case UPDATE_EXPLORE_PAGE:
      return { ...state, explorePageNo: action.payload };

    case UPDATE_ACTION_PAGE:
      return { ...state, auctionPageNo: state.auctionPageNo + 1 };

    case SET_CLUBRARE_DROP_ITEMS:
      return { ...state, clubrareDropsItems: action.payload };

    case SET_CLUBRARE_RECENT_DROP_ITEMS:
      return { ...state, clubrareDropsRecentItems: action.payload };

    case UPDATE_CLUBRARE_DROP_ITEMS:
      return {
        ...state,
        clubrareDropsItems: [...state.clubrareDropsItems, ...action.payload],
      };
    case UPDATE_CLUBRARE_RECENT__DROP_ITEMS:
      return {
        ...state,
        clubrareDropsRecentItems: [
          ...state.clubrareDropsRecentItems,
          ...action.payload,
        ],
      };
    case SET_CLUBRARE_RECENT__DROP_IS_NULL:
      return { ...state, clubrareDropsRecentIsNull: action.payload };
    case UPDATE_CLUBRARE_DROP_PAGE:
      return { ...state, clubrareDropsPageNo: action.payload };
    case UPDATE_CLUBRARE_RECENT__DROP_PAGE:
      return { ...state, clubrareDropsRecentPageNo: action.payload };
    case MOST_LIKED_ITEMS:
      return { ...state, mostLikedNft: action.payload };
    case SEARCH_KEYWORD:
      return { ...state, search_keyword: action.payload };
    case AUCTION_LOADING:
      return { ...state, auction_loading: action.payload };
    case EXPLORE_LIST_LOADING:
      return { ...state, explore_loading: action.payload };
    case SET_CLUBRARE_RECENT__LIST_LOADING:
      return { ...state, recent_drop_loading: action.payload };
    case UPDATE_LAZY_LEO_PAGE:
      return { ...state, lazyLeoPageNo: action.payload };
    case SET_LAZY_LEO_IS_NULL:
      return { ...state, lazyLeoIsNull: action.payload };
    case SET_COLLECTION_ITEMS:
      return { ...state, allCollection: action.payload };
    default:
      return state;
  }
};

export { exploreReducer };
