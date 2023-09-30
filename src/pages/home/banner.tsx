import { useEffect, useState } from 'react';
import './banner.css';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRecentAuctionCollectiblesAction,
  fetchLiveAuctionCollectiblesAction,
  fetchMostViewedAuctionCollectiblesAction,
  fetchHotBidsAuctionCollectiblesAction,
  MostLikedAction,
} from '../../redux';
import { Spinner } from '../../components';

function Banner({ wrapperClass }: any) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const selectedNet = useSelector(
    (state: any) => state.headerReducer.selectedNet,
  );

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [selectedNet]);

  const getData = async () => {
    setIsLoading(true);
    await Promise.all([
      dispatch(fetchRecentAuctionCollectiblesAction(1)),
      dispatch(fetchLiveAuctionCollectiblesAction(1)),
      dispatch(fetchMostViewedAuctionCollectiblesAction(1)),
      dispatch(fetchHotBidsAuctionCollectiblesAction(1)),
      dispatch(MostLikedAction()),
    ]);
    setIsLoading(false);
  };

  return <div className={wrapperClass}>{isLoading ? <Spinner /> : null}</div>;
}

export default Banner;
