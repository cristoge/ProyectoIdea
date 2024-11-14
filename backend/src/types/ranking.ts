export interface Ranking {
  rankingId: string;
  period:    string;
  projects:  Project[];
}

export interface Project {
  projectId:  string;
  totalStars: number;
}
