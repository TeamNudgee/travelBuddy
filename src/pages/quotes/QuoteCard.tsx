import { Avatar, AvatarImage } from '@/components/ui/avatar.tsx';
import type { Quote } from '@/model/Quote.ts';

export const QuoteCard = ({ quote }: { quote: Quote }) => {
  return (
    <div
      className={`flex flex-col rounded-lg pt-8 p-4 bg-${quote.data.bgColor}-100 mb-3 gap-4 relative`}
    >
      {/*<div className={'absolute top-1 right-1'}>*/}
      {/*  <Button*/}
      {/*    variant={'ghost'}*/}
      {/*    className={cn(*/}
      {/*      'text-stone-400 ',*/}
      {/*      'hover:bg-transparent hover:text-red-300 hover:cursor-pointer'*/}
      {/*    )}*/}
      {/*    size={'sm'}*/}
      {/*  >*/}
      {/*    <Heart />*/}
      {/*  </Button>*/}
      {/*</div>*/}
      <div className={`font-playfair text-stone-600 text-sm/6`}>"{quote.data.text}"</div>
      <div className={'flex items-center gap-2'}>
        <Avatar className={'w-6 h-6'}>
          <AvatarImage src={quote.data.user.avatar} />
        </Avatar>
        <div className={'text-xs text-stone-500'}>@{quote.data.user.name}</div>
      </div>
    </div>
  );
};
