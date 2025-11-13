import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';

export const WritingPostScreen = (props: {
  imageUrl: string;
  text: string;
  setText: (text: string) => void;
  createPost: () => void;
}) => {
  const { imageUrl, text, setText, createPost } = props;

  return (
    <div className={'flex flex-col gap-4 h-[calc(100%-65px)] pb-3 bg-stone-100'}>
      <img src={imageUrl} alt="" className={'object-contain bg-stone-300 grow'} />
      <div className={'flex flex-col gap-3 px-4'}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={'resize-none bg-background'}
          placeholder={'Write a caption...'}
        />
        <Button variant={'outline'} onClick={createPost}>
          Create
        </Button>
      </div>
    </div>
  );
};
