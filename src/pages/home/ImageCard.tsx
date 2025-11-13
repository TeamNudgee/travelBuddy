import { Avatar, AvatarImage } from '@/components/ui/avatar.tsx';
import { ArrowLeft, Heart, Share } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { InnerSheet, InnerSheetContent, InnerSheetTrigger } from '@/components/ui/inner-sheet.tsx';
import { PostDetailPage } from '@/pages/post-detail/PostDetailPage.tsx';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import type { Post } from '@/model/Post.ts';

export const ImageCard = (props: { post: Post }) => {
  const { post } = props;

  return (
    <InnerSheet>
      <InnerSheetTrigger asChild>
        <div className={'flex flex-col w-full mb-6 last:mb-0'}>
          <div className={'flex items-center gap-4 px-4 pb-3 '}>
            <Avatar className={'w-[48px] h-[48px]'}>
              <AvatarImage
                src={post.user.avatar}
                style={{
                  objectFit: 'cover',
                }}
              />
            </Avatar>
            <div className={'flex flex-col justify-center h-[44px]'}>
              <div className={'text-medium text-stone-800 font-[600]'}>{post.user.name}</div>
              <div className={'text-sm text-stone-500'}>@pete-10910</div>
            </div>
          </div>
          <div className={'relative'}>
            <img src={post.image} alt={`${name}'s image`} />
            <div
              className={cn(
                'absolute bg-gray-300/20 aspect-square w-[40px]  rounded-full bottom-4 right-17 flex justify-center items-center',
                'hover:cursor-pointer hover:bg-gray-300/30 transition-colors duration-200'
              )}
            >
              <Heart stroke={'white'} size={18} />
            </div>
            <div
              className={cn(
                'absolute bg-gray-300/20 aspect-square w-[40px] p-2 rounded-full bottom-4 right-4 flex justify-center items-center',
                'hover:cursor-pointer hover:bg-gray-300/30 transition-colors duration-200'
              )}
            >
              <Share stroke={'white'} size={18} />
            </div>
          </div>
          <div className={'flex text-stone-500 items-center p-3 text-sm gap-[14px] font-light'}>
            <div className={'flex items-center gap-1'}>
              <Heart size={15} /> <span>{post.likes}</span>
            </div>
            <div className={'text-stone-400'}>•</div>
            <div>2h ago</div>
          </div>
        </div>
      </InnerSheetTrigger>
      <InnerSheetContent
        className={'w-full'}
        closeButton={
          <SheetPrimitive.Close className="fixed top-4 ml-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
            <ArrowLeft className="h-5 w-5" color={'white'} strokeWidth={3} />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        }
      >
        <PostDetailPage post={post} />
      </InnerSheetContent>
    </InnerSheet>
  );
};
