import { User } from "./user";
export interface Project {
  projectId:        string;
  title:            string;
  description:      string;
  imageVideoUrl:    string;
  repositoryLink:   string;
  tags:             string[];
  technologies:     string[];
  creatorId:        User['userId'];
  creationDate:     string;
  totalStars:       number;
  gitHubRepository: GitHubRepository;
}


export interface GitHubRepository {
  repoId:   string;
  repoName: string;
  repoUrl:  string;
}
