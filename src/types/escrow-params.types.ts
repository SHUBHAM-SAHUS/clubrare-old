export interface EscrowQueryType {
  page_number?: number;
  page_size?: number;
  order_status?: string;
  escrow_status?: string;
  delivery_type?: string;
  search?: string;
  network_id?: string | null;
  exports?: boolean;
}

export interface EscrowStatusPayload {
  id: string;
  order_status: string;
}
