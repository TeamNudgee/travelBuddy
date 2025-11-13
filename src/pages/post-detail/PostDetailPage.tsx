import { Avatar, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Download, Heart, Share } from 'lucide-react';
import { Tag } from '@/pages/post-detail/tag.tsx';
import type { Post } from '@/model/Post.ts';

export const PostDetailPage = (props: { post: Post }) => {
  const { post } = props;

  return (
    <div className="relative">
      <div className="fixed top-0 w-[384px] bg-gray-white">
        <img src={post.image} alt={post.phrase} className="w-full h-[400px] object-cover" />
        <div className="absolute top-0 h-[56px] w-full bg-gradient-to-b from-black/70 to-transparent"></div>
      </div>
      <div className="relative top-[-20px] mt-[380px] z-20 bg-background rounded-t-xl w-full">
        <div className="sticky p-6 overflow-y-scroll hide-scrollbar max-h-[700px] flex flex-col gap-6">
          <div className={'flex gap-3 items-center'}>
            <Avatar className={'w-10 h-10'}>
              <AvatarImage src={post.user.avatar}></AvatarImage>
            </Avatar>
            <div className={'flex flex-col'}>
              <div className={'font-bold'}>{post.user.name}</div>
              <div className={'text-sm text-stone-600 font-light'}>2h ago</div>
            </div>
          </div>
          <div className={'flex justify-between'}>
            <Button variant={'secondary'} className={'rounded-full'}>
              <Heart />
              <span>{post.likes}</span>
            </Button>
            <div className={'flex gap-1 text-stone-700'}>
              <Button variant={'ghost'} className={'hover: cursor-pointer'}>
                <Download />
              </Button>
              <Button variant={'ghost'} className={'hover: cursor-pointer'}>
                <Share />
              </Button>
            </div>
          </div>
          <div className={'flex flex-col bg-stone-50 rounded-xl px-6 py-5 gap-4'}>
            <div className={'text-stone-600 text-sm/6.5'}>{post.phrase}</div>
            <div className={'flex gap-2 flex-wrap'}>
              <Tag title={'ocean'} />
              <Tag title={'sunset'} />
              <Tag title={'waves'} />
              <Tag title={'photography'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
