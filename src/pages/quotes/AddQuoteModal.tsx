import {
  InnerDialog,
  InnerDialogClose,
  InnerDialogContent,
  InnerDialogDescription,
  InnerDialogHeader,
  InnerDialogTitle,
  InnerDialogTrigger,
} from '@/components/ui/inner-dialog.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import { QuoteQuery } from '@/query/QuoteQuery.ts';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { FramePortal } from '@/components/layout/FramePortal.tsx';
import { Plus } from 'lucide-react';

export const AddQuoteModal = (props: { refresh: () => void }) => {
  const { refresh } = props;
  const { appUser } = useAuth();
  const [text, setText] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleAddQuote = async () => {
    if (!appUser) {
      return;
    }

    await QuoteQuery.create({
      text,
      user: {
        id: appUser.id,
        avatar: appUser.data.avatar,
        name: appUser.data.name,
        hash: appUser.data.hash,
      },
    });

    refresh();
    setOpen(false);
  };

  return (
    <InnerDialog open={open}>
      <FramePortal>
        <InnerDialogTrigger asChild>
          <Button
            className={cn(
              'absolute bottom-20 right-5 z-50 bg-gray-800/70 rounded-full shadow-lg w-12 h-12',
              'hover:cursor-pointer '
            )}
            onClick={() => setOpen(true)}
          >
            <Plus size={30} />
          </Button>
        </InnerDialogTrigger>
      </FramePortal>
      <InnerDialogContent className={'w-[354px]'} showCloseButton={false}>
        <InnerDialogHeader>
          <InnerDialogTitle>
            <div className={'font-playfair'}>Add New Quote</div>
          </InnerDialogTitle>
          <InnerDialogDescription>
            <div className={'flex flex-col mt-5 gap-6'}>
              <Textarea
                placeholder="Write something inspiring..."
                className={cn(
                  'bg-stone-50 placeholder:text-stone-400 text-stone-600 resize-none font-playfair',
                  'focus:outline-none focus-visible:ring-0 '
                )}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className={'flex justify-between gap-3'}>
                <InnerDialogClose asChild>
                  <Button variant={'secondary'} className={'grow'} onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </InnerDialogClose>
                <Button disabled={!text} className={'grow bg-stone-700'} onClick={handleAddQuote}>
                  Add Quote
                </Button>
              </div>
            </div>
          </InnerDialogDescription>
        </InnerDialogHeader>
      </InnerDialogContent>
    </InnerDialog>
  );
};
