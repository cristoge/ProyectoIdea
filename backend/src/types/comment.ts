import { Timestamp } from "firebase/firestore";

export interface Comment {
  comment_ID: string;
  project_ID: string;
  userId: string;
  text: string;
  creationDate: Timestamp;
}
