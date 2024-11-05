export interface Project {
  projectId:        string;
  title:            string;
  description:      string;
  imageVideoUrl:    string;
  repositoryLink:   string;
  tags:             string[];
  technologies:     string[];
  creator:          Creator;
  creationDate:     string;
  totalStars:       number;
  gitHubRepository: GitHubRepository;
}

export interface Creator {
  userId: string;
}

export interface GitHubRepository {
  repoId:   string;
  repoName: string;
  repoUrl:  string;
}
