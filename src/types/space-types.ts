export interface spaceListsRequest {
  page_number?:number;
  page_size?: number;
  search?: string;      
  exports?: boolean;
  is_on_home_page?: string
}

export interface spaceListsObject {
  _id:string;
  wallet_address: string;
  space_url: string;      
  space_image: string;      
  is_on_home_page?: boolean;      
}

export interface spaceHomePageRequest {
_id: string;
}