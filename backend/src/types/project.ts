import { User } from "./user";
export interface Project {
  projectId:        string;
  title:            string;
  description:      string;
  imageVideoUrl:    string;
  repositoryLink:   string;
  creatorId:        User['userId'];
  creationDate:     string;
  likeCounts:      number;
  likedBy:          User['userId'][];
  gitHubRepository: GitHubRepository;
}


export interface GitHubRepository {
  repoId:   string;
  repoName: string;
  repoUrl:  string;
}
