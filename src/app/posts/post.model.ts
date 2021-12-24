export interface Post {
  id?: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}

export interface BackendPost {
  _id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}
