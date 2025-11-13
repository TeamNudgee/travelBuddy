import { Input } from '@/components/ui/input.tsx';
import { cn } from '@/lib/utils.ts';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { PostItem } from '@/pages/search/PostItem.tsx';
import { trendingPosts } from '@/dummy/dummy.ts';

export const SearchPage = () => {
  const [focused, setFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className={'flex flex-col pb-[70px]'}>
      <div className={'p-4 relative'}>
        <Search size={'20px'} className={'absolute top-[30px] left-8 text-stone-400'} />
        {focused && <X size={'20px'} className={'absolute top-[30px] right-8 text-stone-400'} />}
        <Input
          className={cn(
            'w-full pl-10 pr-10 py-3 bg-stone-100 rounded-full text-sm transition-all h-[48px] border-none  ',
            'focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white ',
            'placeholder:font-light placeholder:text-stone-400'
          )}
          placeholder={'Search for users...'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className={'grid grid-cols-2 gap-2 px-3 py-2'}>
        {trendingPosts.map((post) => (
          <PostItem post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};
