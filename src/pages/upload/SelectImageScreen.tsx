import { useRef } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { ImageUtils } from '@/utils/ImageUtils.ts';

export const SelectImageScreen = ({
  onSelectImage,
}: {
  onSelectImage: (image: HTMLImageElement) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const image = await ImageUtils.fileToImageElement(file);
      onSelectImage(image);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center px-6 text-center">
      <div className=" rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
        <Button
          className={'w-64 h-64'}
          onClick={() => fileInputRef.current?.click()}
          variant={'ghost'}
        >
          Select Images...
        </Button>
      </div>
      <div className="text-sm text-stone-400 mb-2">
        Upload photo or <br /> take a photo.
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={'hidden'}
      />
    </div>
  );
};
