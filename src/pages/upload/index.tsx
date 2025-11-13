import { ImageEditor } from '@/pages/upload/ImageEditor.tsx';
import { useState } from 'react';
import { SelectImageScreen } from '@/pages/upload/SelectImageScreen.tsx';
import { WritingPostScreen } from '@/pages/upload/WritingPostScreen.tsx';
import { PostQuery } from '@/query/PostQuery.ts';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { Authenticated } from '@/components/layout/Authenticated.tsx';
import { Page, useNavigationStore } from '@/store/navigationStore.ts';

// @ts-ignore
enum UploadState {
  SELECT_IMAGE,
  EDIT_IMAGE,
  WRITE_POST,
  DONE,
  ERROR,
}

export const UploadPage = () => {
  const { appUser } = useAuth();
  const { navigateTo } = useNavigationStore((state) => state.actions);

  const [state, setState] = useState(UploadState.SELECT_IMAGE);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState('');

  if (!appUser) {
    return <div>waiting</div>;
  }

  const saveEditedImageSuccessHandler = (imageUrl: string) => {
    setState(UploadState.WRITE_POST);
    setImageUrl(imageUrl);
  };

  const saveEditedImageFailHandler = () => {
    setState(UploadState.ERROR);
  };

  const createPost = async () => {
    if (!imageUrl) {
      throw new Error();
    }

    if (!text) {
      throw new Error();
    }

    await PostQuery.create({
      quoteId: null,
      phrase: text,
      image: imageUrl,
      user: {
        id: appUser.id,
        avatar: appUser.data.avatar,
        name: appUser.data.name,
        hash: appUser.data.hash,
      },
    });

    navigateTo(Page.Home);
  };

  return (
    <Authenticated>
      <div className={'h-full flex flex-col'}>
        {state === UploadState.SELECT_IMAGE && (
          <SelectImageScreen
            onSelectImage={(file: HTMLImageElement) => {
              setImage(file);
              setState(UploadState.EDIT_IMAGE);
            }}
          />
        )}
        {state === UploadState.EDIT_IMAGE && image != null && (
          <ImageEditor
            image={image}
            onSuccess={saveEditedImageSuccessHandler}
            onFail={saveEditedImageFailHandler}
          />
        )}
        {state === UploadState.WRITE_POST && imageUrl != null && (
          <WritingPostScreen
            imageUrl={imageUrl}
            text={text}
            setText={setText}
            createPost={createPost}
          />
        )}
      </div>
    </Authenticated>
  );
};
