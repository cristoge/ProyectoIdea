import { Timestamp } from 'firebase/firestore';
export interface Favorites {
  favoriteId:   string;
  userId:       string;
  projectId:    string;
  favoriteDate: Timestamp;
}
