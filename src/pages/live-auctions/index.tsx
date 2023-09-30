import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../layouts/main-layout/main-layout';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { fetchAuctionCollectiblesAction, updateAuctionPage } from '../../redux';
import { Spinner } from '../../components';
import CardSkeleton from '../../components/skeleton/card-skeleton';
const BidCard = React.lazy(() => import('../../components/bit-card/index'));

function LiveAuctionsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const auctionItems = useSelector(
    (state: any) => state.exploreReducer.auctionItems,
  );
  const auctionPageNo = useSelector((state: any) => {
    return state.exploreReducer.auctionPageNo;
  });
  const auctionIsNull = useSelector((state: any) => {
    return state.exploreReducer.auctionIsNull;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchAuctionCollectiblesAction(1));
        await dispatch(updateAuctionPage());
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        return false;
      }
    };
    getData();
  }, []);

  const fetchMoreAuctionData = async () => {
    try {
      if (!auctionIsNull && !loading) {
        setLoading(true);
        await dispatch(fetchAuctionCollectiblesAction(auctionPageNo));
        await dispatch(updateAuctionPage());
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      return false;
    }
  };

  return (
    <Layout mainClassName="mt-1" displayStickySidebar>
      <div className="container-fluid liveauctionpage_wrp">
        <div className="text-24 text-blue font-semibold">
          {t('header.liveAuctions')}
        </div>
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchMoreAuctionData}
          hasMore={!auctionIsNull}
        >
          <div className="grid grid-cols-4 gap-y-8 gap-x-8 md:gap-x-8 mt-16 md:mt-8 liveauctipagerow">
            {auctionItems.map((ele: any, i: number) => (
              <div key={i} className="cmn_club_card_wrp">
                <BidCard
                  collectible={ele?.collectible_data}
                  collectibleType={ele?.auctionDetails?.auctionType || null}
                  closingTime={ele?.auctionDetails?.closingTime || null}
                  startingTime={ele?.auctionDetails?.startingTime || null}
                  name={ele?.title}
                  price={ele?.eth_price}
                  contentClass="lightShadow p-6"
                  timer={ele.timer}
                  isExplore={true}
                  list={ele}
                  onSale={ele.onSale}
                  auction_detail={ele?.auctionDetails}
                  itemDetails={ele}
                  likeCount={ele?.total_like}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
        {loading && (
          // <Spinner />
          <div className="row cardskeleton_wrp">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((loading) => (
              <div className=" cardskeleton_inner" key={loading}>
                <CardSkeleton />
              </div>
            ))}
          </div>
        )}
        {(!auctionItems || auctionItems?.length === 0) && !loading && (
          <div className="w-full py-6 flex items-center justify-center flex-row md:flex-col">
            <div className="flex items-start flex-col justify-center md:items-center">
              <span className="text-24 text-blue font-bold mb-1">
                No Items Available
              </span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default LiveAuctionsPage;
