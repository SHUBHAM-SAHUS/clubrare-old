export interface AuthenticationListsObject {
    _id:string;
    totalItem: number;
    total_purchased: number;      
}
export interface AuthenticationListsRequest {
  page_number:number;
  page_size: number;
  search: string;      
}