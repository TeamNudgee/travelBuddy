import type { Post } from '@/model/Post.ts';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { store } from '@/lib/firebase.ts';

export class PostQuery {
  static async find(condition: {
    lastId?: string;
    pageSize?: number;
    userId?: string;
  }): Promise<Post[]> {
    const { lastId, pageSize = 10, userId } = condition;

    let q = query(collection(store, 'Post'), orderBy('createdAt', 'desc'), limit(pageSize));

    if (lastId) {
      const snapshot = await getDoc(doc(store, 'Post', lastId));
      q = query(q, startAfter(snapshot));
    }

    if (userId) {
      q = query(q, where('user.id', '==', userId));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as Post;
    });
  }

  static async create(properties: {
    quoteId: string | null;
    phrase: string;
    image: string;
    user: {
      id: string;
      name: string;
      avatar: string;
      hash: string;
    };
  }): Promise<Post> {
    const newPost: Partial<Post> = {
      quoteId: properties.quoteId || null,
      user: properties.user,
      image: properties.image,
      phrase: properties.phrase,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(store, 'Post'), {
      ...newPost,
    });

    return {
      ...newPost,
      id: docRef.id,
    } as Post;
  }
}
