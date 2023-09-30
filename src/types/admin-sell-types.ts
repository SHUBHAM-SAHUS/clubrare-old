export interface AdminSaleItem{
    _id:string;
    seller: string;
      buyer: string;
      title: string;
      collectible_id: string;
      royalties: number;
      transaction_hash: string;
      redeemable: boolean;
      amount: string;
      network_id: string;
      erc20_address: string;
      type: string;
      created_by:string;
      time: string;
      created_on:string;
      userObj: {
          name: string;
          image: string;
          wallet_address: string;
      }
  }

export type AdminSellQueryParams={
    page_number: number;
    page_size:number;
    fromDate : string;
    toDate : string;
    item_type : string;
    export : boolean
  }