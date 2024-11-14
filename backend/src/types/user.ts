export interface User {
  userId:          string;
  username:        string;
  email:           string;
  password?:        string;
  profilePicture?: string | null;
  githubId?:       string | null;
  githubToken?:    string | null;
  role:            string;
}

