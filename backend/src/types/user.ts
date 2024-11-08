export interface User {
  userId:          string;
  username:        string;
  email:           string;
  password?:        string;
  profilePicture?: string;
  githubId?:       string;
  githubToken?:    string;
  role:            string;
}

