import FilerobotImageEditor, {
  type getCurrentImgDataFunction,
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';
import './ImageEditor.css';
import { ImageUtils } from '@/utils/ImageUtils.ts';
import { StorageUtils } from '@/utils/StorageUtils.ts';
import { Button } from '@/components/ui/button.tsx';
import { useRef } from 'react';

export const ImageEditor = (props: {
  image: HTMLImageElement;
  onSuccess: (imageUrl: string) => void;
  onFail: () => void;
}) => {
  const { image, onSuccess, onFail } = props;
  const getImgDataRef = useRef<{ current?: getCurrentImgDataFunction }>({});

  const handleSave = async () => {
    if (!getImgDataRef.current) return;

    // @ts-ignore
    const { imageData } = getImgDataRef.current({
      name: 'custom-save',
      extension: 'png',
      quality: 0.9,
    });

    const blob = await new Promise<Blob>((resolve) =>
      // @ts-ignore
      imageData.imageCanvas.toBlob((blob) => resolve(blob!), 'image/png')
    );

    const file = new File([blob], 'edited-image.png', { type: 'image/png' });

    // 원하는 방식으로 업로드
    const result = await StorageUtils.uploadImageByFile(file);

    if (result.success && result.file) {
      onSuccess(result.file.url);
    } else {
      onFail();
    }
    console.log(result);
  };

  return (
    <div className={'h-full relative'}>
      <Button
        variant="secondary"
        className={'absolute top-3 left-2 z-10 bg-stone-300'}
        onClick={handleSave}
      >
        Save
      </Button>
      <FilerobotImageEditor
        savingPixelRatio={1}
        previewPixelRatio={1}
        source={image}
        getCurrentImgDataFnRef={getImgDataRef}
        removeSaveButton={true}
        onSave={async (editedImageObject) => {
          const imageCanvas = editedImageObject.imageCanvas;

          if (!imageCanvas) {
            throw new Error('Image cannot be empty');
          }

          const blob = await ImageUtils.canvasToBlobPng(imageCanvas);

          const file = new File([blob], 'edited-image.png', { type: 'image/png' });

          const { success, file: savedFile } = await StorageUtils.uploadImageByFile(file);

          if (success && savedFile) {
            onSuccess(savedFile.url);
          } else {
            onFail();
          }
        }}
        annotationsCommon={{
          fill: '#ff0000',
        }}
        Text={{ text: 'Add Quotes...' }}
        // removeSaveButton={true}
        // Crop={{
        //   presetsItems: [
        //     {
        //       titleKey: 'classicTv',
        //       descriptionKey: '4:3',
        //       ratio: 4 / 3,
        //       // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
        //     },
        //     {
        //       titleKey: 'cinemascope',
        //       descriptionKey: '21:9',
        //       ratio: 21 / 9,
        //       // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
        //     },
        //   ],
        //   presetsFolders: [
        //     {
        //       titleKey: 'socialMedia', // will be translated into Social Media as backend contains this translation key
        //       // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
        //       groups: [
        //         {
        //           titleKey: 'facebook',
        //           items: [
        //             {
        //               titleKey: 'profile',
        //               width: 180,
        //               height: 180,
        //               descriptionKey: 'fbProfileSize',
        //             },
        //             {
        //               titleKey: 'coverPhoto',
        //               width: 820,
        //               height: 312,
        //               descriptionKey: 'fbCoverPhotoSize',
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // }}
        tabsIds={[TABS.ANNOTATE]} // or {['Adjust', 'Annotate', 'Watermark']}
        defaultTabId={TABS.ANNOTATE} // or 'Annotate'
        defaultToolId={TOOLS.TEXT} // or 'Text'
        // showCanvasOnly={true}
      />
    </div>
  );
};
