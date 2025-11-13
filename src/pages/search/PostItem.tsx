import type { TrendingPost } from '@/dummy/dummy.ts';
import { Avatar, AvatarImage } from '@/components/ui/avatar.tsx';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

export const PostItem = (props: { post: TrendingPost }) => {
  const { post } = props;

  const formatLikes = (likes: number) => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}k`;
    }
    return likes.toString();
  };

  return (
    <div key={post.id} className="relative group">
      <img src={post.image} alt={post.phrase} className="rounded-sm w-full object-cover" />

      <div
        className={cn(
          'absolute bottom-0 w-full p-3 flex flex-col gap-1 text-white',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300',
          'bg-gradient-to-t from-black/40 via-black/40 to-transparent'
        )}
      >
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={post.user.avatar} />
          </Avatar>
          <div className="text-xs">{post.user.username}</div>
        </div>
        <div className="text-sm">{post.phrase}</div>
        <div className="flex items-center gap-1">
          <Heart size="12px" />
          <span className="text-white text-xs">{formatLikes(post.likes)}</span>
        </div>
      </div>
    </div>
  );
};
