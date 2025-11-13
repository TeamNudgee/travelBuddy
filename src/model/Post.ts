export interface Post {
  id: string;
  quoteId: string | null;
  user: {
    id: string;
    name: string;
    avatar: string;
    hash: string;
  };
  image: string;
  phrase: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}
