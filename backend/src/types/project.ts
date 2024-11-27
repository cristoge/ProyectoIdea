import { User } from "./user";
export interface Project {
  projectId:        string;
  title:            string;
  description:      string;
  imageVideoUrl:    string;
  repositoryLink:   string;
  creatorId:        User['userId'];
  creationDate:     Date
  likeCounts:      number;
  likedBy:          User['userId'][];
  comments?:        Comment[];
  gitHubRepository?: GitHubRepository;
}

export interface GitHubRepository {
  repoId:   string;
  repoName: string;
  repoUrl:  string;
}


export interface Comment {
  commentId:    string;           
  userId:       User['userId'];   
  text:         string;           
  creationDate: Date;             
}