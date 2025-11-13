import type { Quote } from '@/model/Quote.ts';
import { pickRandom } from '@/utils/pick.ts';
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
} from 'firebase/firestore';
import { store } from '@/lib/firebase.ts';

export class QuoteQuery {
  static async find(condition: { lastId?: string; pageSize?: number }): Promise<Quote[]> {
    const { lastId, pageSize = 10 } = condition;

    let q = query(collection(store, 'Quote'), orderBy('createdAt', 'desc'), limit(pageSize));

    if (lastId) {
      const snapshot = await getDoc(doc(store, 'Post', lastId));
      q = query(q, startAfter(snapshot));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      return {
        data: doc.data(),
        id: doc.id,
      } as Quote;
    });
  }

  static async create(properties: {
    text: string;
    user: {
      id: string;
      avatar: string;
      name: string;
      hash: string;
    };
  }): Promise<Quote> {
    const bgColors = ['yellow', 'purple', 'blue', 'violet', 'red', 'green'];
    const quoteData: Quote['data'] = {
      text: properties.text,
      user: properties.user,
      bgColor: pickRandom(bgColors),
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(store, 'Quote'), quoteData);

    return {
      id: docRef.id,
      data: quoteData,
    };
  }
}
