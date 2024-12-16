export interface User {
  userId:          string;
  username:        string;
  email:           string;
  password?:        string;
  profilePicture?: string | null;
  role:            string;
}

export interface githubData {
  githubId: string;
  githubToken: string;
}


