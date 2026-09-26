export type Category = 'sách' | 'điện tử' | 'đồ gia dụng' | 'quần áo' | 'khác';
export type TransactionType = 'cho tặng' | 'cho mượn' | 'trao đổi';
export type ItemStatus = 'available' | 'requested' | 'completed';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Item {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  image_url: string;
  category: Category;
  transaction_type: TransactionType;
  status: ItemStatus;
  latitude: number;
  longitude: number;
  location_label: string;
  created_at: string;
}

export interface Request {
  id: string;
  item_id: string;
  requester_id: string;
  status: RequestStatus;
  created_at: string;
}
