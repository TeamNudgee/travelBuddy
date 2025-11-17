import type { TrustReaction } from '@/model/TrustReaction.ts';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { store } from '@/lib/firebase.ts';

/**
 * Trust Reaction 쿼리
 * thumbs_up/down 평가 CRUD (타입 안전성 보완)
 */
export class TrustQuery {
  /**
   * 모든 trust reactions 가져오기
   */
  static async findAll(): Promise<TrustReaction[]> {
    try {
      const snapshot = await getDocs(collection(store, 'trust_reactions'));

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          data: {
            from: data.from || '',
            to: data.to || '',
            reaction: (data.reaction as 'thumbs_up' | 'thumbs_down') || 'thumbs_up',
            updatedAt: data.updatedAt?.toDate() || new Date(),
          },
        };
      }) as TrustReaction[];
    } catch (error) {
      console.error('Error fetching trust reactions:', error);
      return [];
    }
  }

  /**
   * 특정 사용자(to)에 대한 reactions 가져오기
   * @param toUserId 대상 사용자 ID
   */
  static async findByToUser(toUserId: string): Promise<TrustReaction[]> {
    try {
      const q = query(collection(store, 'trust_reactions'), where('to', '==', toUserId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          data: {
            from: data.from || '',
            to: data.to || '',
            reaction: (data.reaction as 'thumbs_up' | 'thumbs_down') || 'thumbs_up',
            updatedAt: data.updatedAt?.toDate() || new Date(),
          },
        };
      }) as TrustReaction[];
    } catch (error) {
      console.error('Error fetching reactions by toUser:', error);
      return [];
    }
  }

  /**
   * 특정 평가자(from)의 reactions 가져오기
   * @param fromUserId 평가자 사용자 ID
   */
  static async findByFromUser(fromUserId: string): Promise<TrustReaction[]> {
    try {
      const q = query(collection(store, 'trust_reactions'), where('from', '==', fromUserId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          data: {
            from: data.from || '',
            to: data.to || '',
            reaction: (data.reaction as 'thumbs_up' | 'thumbs_down') || 'thumbs_up',
            updatedAt: data.updatedAt?.toDate() || new Date(),
          },
        };
      }) as TrustReaction[];
    } catch (error) {
      console.error('Error fetching reactions by fromUser:', error);
      return [];
    }
  }

  /**
   * Trust reaction 생성 또는 업데이트 (중복 방지)
   * 문서 ID는 `${from}_${to}` 형식으로 고정 (한 명이 한 명에게 한 번만 평가)
   * @param from 평가자 uid
   * @param to 대상 uid
   * @param reaction thumbs_up 또는 thumbs_down
   */
  static async upsert(
    from: string,
    to: string,
    reaction: 'thumbs_up' | 'thumbs_down'
  ): Promise<TrustReaction> {
    if (!from || !to) {
      throw new Error('from and to are required');
    }

    if (from === to) {
      throw new Error('Cannot react to yourself');
    }

    const docId = `${from}_${to}`;

    const data = {
      from,
      to,
      reaction,
      updatedAt: new Date(),
    };

    try {
      // setDoc with merge: true로 upsert (중복 방지)
      await setDoc(doc(store, 'trust_reactions', docId), data, { merge: true });

      console.log('Trust reaction saved:', { from, to, reaction });

      return {
        id: docId,
        data,
      };
    } catch (error) {
      console.error('Error saving trust reaction:', error);
      throw error;
    }
  }
}
