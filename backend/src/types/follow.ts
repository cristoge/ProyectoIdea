import { Timestamp } from 'firebase/firestore';
export interface Follow {
  followId:   string;
  followerId: string;
  followedId: string;
  startDate:  Timestamp;
}
