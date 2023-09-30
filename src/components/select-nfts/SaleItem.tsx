import React, { useState, useEffect } from 'react';

export const SaleItem = (props: any) => {
  const auctionTypeValSecond = '2';

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(props?.collectible?.delist_loading);
  }, [props?.delistLoading]);

  return (
    <React.Fragment>
      {props.collectible.isApproved ? (
        !props.collectible?.on_sale ||
        (props.collectible?.on_sale &&
          props.collectible?.auctionDetails?.auctionType ===
            auctionTypeValSecond &&
          props.collectible?.history?.bid?.length === 0 &&
          new Date() >=
            new Date(props.collectible?.auctionDetails?.closingTime)) ? (
          <div className="listed_list listed_list_floor_wrp">
            <button onClick={() => props.handlePutOnSale(props.collectible)}>
              List Item
            </button>
          </div>
        ) : (
          <div className="listed_list listed_list_floor_wrp">
            <button
              disabled={
                props?.collectible?.history?.bid?.length > 0 || loading
                  ? true
                  : false
              }
              className={`${loading ? 'disablebtn' : ''}`}
              onClick={() => props.handlePutOffSale(props.collectible)}
            >
              {loading ? 'Loading...' : 'Delist Item'}
            </button>
          </div>
        )
      ) : (
        <div className="listed_list listed_list_floor_wrp">
          <button>Not Approved</button>
        </div>
      )}
    </React.Fragment>
  );
};
