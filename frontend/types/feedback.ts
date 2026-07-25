export interface Feedback {
  id: number;
  user_id: number;
  rating: number;
  message: string;
  status: string;
  admin_note: string | null;
  created_at: string;
}