export interface Quote {
  id: string;
  data: {
    text: string;
    bgColor: string;
    user: {
      id: string;
      avatar: string;
      name: string;
      hash: string;
    };
    likes: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
