import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { storage } from '@/lib/firebase.ts';
import { v4 as uuid } from 'uuid';

export class StorageUtils {
  static options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
  };

  static uploadImageByFile = async (
    file: File
  ): Promise<{
    success: boolean;
    file?: {
      url: string;
    };
  }> => {
    try {
      const compressedFile = await imageCompression(file, StorageUtils.options);

      const storageRef = ref(storage, `images/${uuid()}.webp`);
      await uploadBytes(storageRef, compressedFile);

      const downloadURL = await getDownloadURL(storageRef);

      return {
        success: true,
        file: { url: downloadURL },
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
      };
    }
  };
}
