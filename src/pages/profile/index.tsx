import { Avatar, AvatarImage } from '@/components/ui/avatar.tsx';
import { Header } from '@/components/layout/Header';
import { Image, Megaphone, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils.ts';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { Authenticated } from '@/components/layout/Authenticated.tsx';
import {
  InnerSheet,
  InnerSheetClose,
  InnerSheetContent,
  InnerSheetTrigger,
} from '@/components/ui/inner-sheet.tsx';
import { SettingPage } from '@/pages/setting';
import { PostQuery } from '@/query/PostQuery.ts';
import type { Post } from '@/model/Post.ts';

export const Profile = () => {
  const { appUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<'posts' | 'echoes'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!appUser) {
      return;
    }

    if (currentTab === 'posts') {
      PostQuery.find({
        userId: appUser.id,
      }).then(setPosts);
    } else {
      PostQuery.find({
        userId: appUser.id,
      });
    }
  }, [currentTab, appUser]);

  if (!appUser) {
    return <div></div>;
  }

  return (
    <Authenticated>
      <Header>
        <div className={'flex relative h-[64px] items-center justify-between border-b'}>
          <div className={'w-full text-center font-bold text-xl absolute font-playfair'}>
            Profile
          </div>
          <div></div>
          <InnerSheet>
            <InnerSheetTrigger asChild>
              <Button
                variant={'ghost'}
                className={'w-4 h-4 mr-4 text-stone-400 hover:cursor-pointer z-20'}
                size={'icon'}
              >
                <Settings />
              </Button>
            </InnerSheetTrigger>
            <InnerSheetContent className={'w-full'}>
              <InnerSheetClose>
                <div className={'flex justify-end p-2'}>
                  <Button variant={'ghost'}>
                    <X />
                  </Button>
                </div>
              </InnerSheetClose>
              <SettingPage />
            </InnerSheetContent>
          </InnerSheet>
        </div>
      </Header>
      {appUser && (
        <div className={'flex flex-col px-4 mt-8'}>
          <div className={'flex gap-4 px-2'}>
            <Avatar className={'w-20 h-20'}>
              <AvatarImage src={appUser?.data.avatar} />
            </Avatar>
            <div className={'flex flex-col gap-2'}>
              <div className={'text-xl font-bold'}>{appUser?.data.name}</div>
              <div className={'text-pink-400'}>@{appUser?.data.name}</div>
              <div className={'text-stone-500 text-sm/6'}>
                Finding beauty in everyday moments. <br />
                📸✨ Spreading positivity through art & words.
              </div>
            </div>
          </div>
          <div className={'flex flex-row gap-8 p-6 justify-center mt-2'}>
            <div className={'flex flex-col items-center'}>
              <div className={'text-xl font-bold'}>{appUser?.data.followers}</div>
              <div className={'text-sm text-stone-500'}>followers</div>
            </div>
            <div className={'border-l border-1 my-3'}></div>
            <div className={'flex flex-col items-center'}>
              <div className={'text-xl font-bold'}>{appUser?.data.followings}</div>
              <div className={'text-sm text-stone-500'}>following</div>
            </div>
            <div className={'border-l border-1 my-3'}></div>
            {/*<Separator orientation={'vertical'} className={'border-gray-600'} />*/}
            <div className={'flex flex-col items-center'}>
              <div className={'text-xl font-bold'}>6</div>
              <div className={'text-sm text-stone-500'}>sparks</div>
            </div>
          </div>
          <div>
            <div className={'flex items-center px-2 text-stone-500'}>
              <Button
                variant={'ghost'}
                className={cn(
                  'grow border-b-2 m-0 rounded-none h-[48px]',
                  currentTab === 'posts' && 'border-black'
                )}
                onClick={() => {
                  setCurrentTab('posts');
                }}
              >
                <Image />
                My Posts
              </Button>
              <Button
                variant={'ghost'}
                className={cn(
                  'grow border-b-2 m-0 rounded-none h-[48px]',
                  currentTab === 'echoes' && 'border-black'
                )}
                onClick={() => {
                  setCurrentTab('echoes');
                }}
              >
                <Megaphone />
                Echoes
              </Button>
            </div>
            <div className={'grid grid-cols-2'}>
              {posts.map((post) => (
                <div key={post.id}>
                  <img src={post.image} alt={post.phrase} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Authenticated>
  );
};
