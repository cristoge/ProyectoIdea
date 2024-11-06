export interface User {
  userId?:         string;
  username:       string;
  email:          string;
  password:       string;
  profilePicture?: string;
  githubId?:       string;
  githubToken?:    string;
  repositories?:   Repository[];
  role:           string;
}

export interface Repository {
  repoId:      string;
  repoName:    string;
  repoUrl:     string;
  description: string;
}
