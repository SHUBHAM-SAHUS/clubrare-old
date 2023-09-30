import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch } from 'react-redux';
import { getLlcNftDataAction } from '../../redux/actions/eth-llc-nft-lp-staking-action';
import CardSkeleton from '../skeleton/card-skeleton';
import './eth-llc-nft-lp-staking-modal.scss';
import dummyImg from '../../assets/images/dummy_image.svg'

const viewGuide = process.env.REACT_APP_ETH_VIEW_GUIDE;

type LlcNftArr = {
  token_id: string;
  token_uri: string;
};

// propTypes is  props data type model
interface propTypes {
  ChekUserStep: (value:number)=>void;
  handleExistingNft: (value:string)=>void;
  currExistingNftId: string;
}

export const SelectLlcNft = ({ ChekUserStep, handleExistingNft, currExistingNftId }: propTypes) => {
    const dispatch = useDispatch();

    const [llcNftData, setLlcNftData] = useState<Array<LlcNftArr>>([]);
    const [llcLoading, setLlcLoading] = useState<boolean>(false);
    const [selectLlcNft, setSelectLlcNft] = useState<string>(currExistingNftId);
    const [cursorStr, setCursorStr] = useState<string>('');
    const [isNull, setIsNull] = useState<boolean>(true);
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    // set Llc Nft selcted by user handler
    const selectLlcNftHandler = (e: any) => {
      setSelectLlcNft(e.target.value);
    };

    const nextButtonHandler = () => {
      ChekUserStep(3);
      handleExistingNft(selectLlcNft);
    };

    // LLC Nft data function to get all the LLC NFT
    const llcNftDataHandler = async () => {
      const req = {
        cursor: cursorStr ? cursorStr : '',
      };
      setLlcLoading(true);
      try {
        let showItems:Array<LlcNftArr> = [];
        const llcRes: any = await dispatch(getLlcNftDataAction(req));
        if (llcRes?.data?.result && llcRes?.data?.result.length > 0) {
          setInitialLoad(false);
          for (let index = 0; index < llcRes?.data?.result.length; index++) {
            const item = llcRes?.data?.result[index];
            if (item) {
              const nftImg = JSON.parse(llcRes.data.result[index].metadata).image;
              if(nftImg) {
                const updNftImg = nftImg.replace('ipfs://', 'https://ipfs.io/ipfs/');
                item['nftImage'] = updNftImg;
              } else {
                item['nftImage'] = dummyImg;
              }
              showItems.push(item);
            }
          }
          if(llcRes?.data?.page === 1) {
            setLlcNftData(showItems);
          } else {
            setLlcNftData([...showItems]);
            setCursorStr(llcRes?.data?.cursor);
          }
          setLlcLoading(false);
          setIsNull(false);
        } else {
          setLlcLoading(false);
          setIsNull(true);
        }
      } catch (err: any) {
        setLlcLoading(false);
      }
    };

    useEffect(() => {
      llcNftDataHandler();
    }, []);

    const fetchMoreExploreData = async (llcNftnull: boolean) => {
      if (!llcLoading && !llcNftnull && llcNftData.length % 20 === 0) {
        llcNftDataHandler();
      }
    };

    return (
      <div className='select_llc_nft_wrp lockup_period_wrp agovconnect_wallet_wrp agov_dao_lpStaking_modal'>
        <div className='containe-fluid agovconnect_wallet_content lockup_period_inn agov_dao'>
          <div className='agovconnect_wallet_header'>
            <div className='agov_modal_inn'>
              <h1>SELECT LLC NFT</h1>
              <p>Select your LLC to stake for 180 days</p>
              <p className='red-note-txt'>Note: Please add flashbots <a href='https://docs.clubrare.xyz/international/korean/agov-and-dao/agov-migration-guide' rel='noreferrer' target='_blank'>RPC URL</a> in your metamask to deposit over ethereum network</p>
              <div className='view_guidebtn_wrp'>
                <a
                  href={viewGuide}
                  target='_blank'
                  rel='noreferrer'
                  className='view_guid_btn'
                >
                  VIEW GUIDE
                </a>
              </div>
            </div>
          </div>
          <div className='lockup_period_inn_content'>
            <div className='reward_comm_box row'>
                <div className='select_llc_nft_list_wrp'>
                  {llcNftData && llcNftData.length > 0 && (
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={() => fetchMoreExploreData(isNull)}
                      hasMore={!isNull}
                      useWindow={false}
                      initialLoad={initialLoad}
                    >
                      <div className='select_llc_nft_list_inn'>
                        {llcNftData.map((elm: any, i: number) => (
                          <label htmlFor={`nftId-${i}`} key={i}>
                            <div className='reward_comm_left col'>
                              <div className='row'>
                                <div className='col-9 pr-0 text-left llc_tokrn_head'>
                                  <span>LLC TOKEN ID</span>
                                  <h4>{elm?.token_id}</h4>
                                </div>
                                <div className='col-3 text-right checkbox_wrp'>
                                  <div className='checkbox'>
                                    <input
                                      type='radio'
                                      id={`nftId-${i}`}
                                      name='radiobtn'
                                      value={elm?.token_id}
                                      checked={selectLlcNft === elm?.token_id}
                                      onChange={selectLlcNftHandler}
                                    />
                                    <span></span>
                                    <br />
                                  </div>
                                </div>
                              </div>
                              <figure>
                                <img src={elm?.nftImage} alt='lazyleo' />
                              </figure>
                            </div>
                          </label>
                        ))}
                      </div>
                    </InfiniteScroll>
                  )}
                </div>
                <div className='select_llc_nft_list_load_wrp'>
                  {llcLoading && (
                    <div className='row cardskeleton_wrp'>
                      {[1, 2, 3, 4].map((load) => {
                        return (
                          <div className=' cardskeleton_inner' key={load}>
                            <CardSkeleton />
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {(!llcNftData || llcNftData?.length === 0) && !llcLoading && (
                    <div className='no-item-msg'>
                      <span>No Items Available</span>
                    </div>
                  )}
                </div>
            </div>
            <div className='club_createitem'>
              <button
                type='button'
                className={selectLlcNft !== '' ? 'mintbtn' : 'mintbtn disabled'}
                disabled={selectLlcNft === ''}
                onClick={nextButtonHandler}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}