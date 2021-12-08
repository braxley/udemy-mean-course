export interface Post {
  id: string | null;
  title: string;
  content: string;
}

export interface BackendPost {
  _id: string;
  title: string;
  content: string;
}
