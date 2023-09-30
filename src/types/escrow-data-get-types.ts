export interface EscrowgetdataTypes {
  created_on: string;
  _id: number;
  seller_wallet_address?: string;
  buyer_wallet_address?: string;
  sale_type?: string;
  order_status?: string;
  escrow_status?: string;
  currency?: string;
  transaction_hash?: string;
  delivery_type?: string;
  full_name?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone_number?: string;
  escrow_id?: number;
  userObj: any;
  collectible_id: {
    wallet_addres: string;
  };
  dbCollectible: {
    item_current_location: string
  };
}
