import { ImageCard } from '@/pages/home/ImageCard.tsx';
import { Header } from '@/components/layout/Header';
import { useEffect, useState } from 'react';
import { PostQuery } from '@/query/PostQuery.ts';
import type { Post } from '@/model/Post.ts';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    PostQuery.find({ pageSize: 10 }).then(setPosts);
  }, []);
  return (
    <div className={'pb-[70px]'}>
      <Header>
        <div className="max-w-sm mx-auto px-4 py-4 flex items-center justify-center ">
          <div className="text-2xl font-bold text-stone-800 font-logo">Nudgee</div>
        </div>
      </Header>
      <div className={'flex flex-col  bg-white'}>
        {posts.map((post) => (
          <ImageCard post={post} />
        ))}
      </div>
    </div>
  );
};
