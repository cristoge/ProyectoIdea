import { Project } from './project';
export interface Favorites {
  favoriteId:   string;
  userId:       string;
  projects:     Project['projectId'];
  favoriteDate: Date;
}
