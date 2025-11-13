import type { TrustReaction } from '@/model/TrustReaction.ts';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { store } from '@/lib/firebase.ts';

/**
 * Trust Reaction 쿼리
 * thumbs_up/down 평가 CRUD
 */
export class TrustQuery {
  /**
   * 모든 trust reactions 가져오기
   */
  static async findAll(): Promise<TrustReaction[]> {
    const snapshot = await getDocs(collection(store, 'trust_reactions'));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      data: {
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      },
    })) as TrustReaction[];
  }

  /**
   * 특정 사용자(to)에 대한 reactions 가져오기
   * @param toUserId 대상 사용자 ID
   */
  static async findByToUser(toUserId: string): Promise<TrustReaction[]> {
    const q = query(collection(store, 'trust_reactions'), where('to', '==', toUserId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      data: {
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      },
    })) as TrustReaction[];
  }

  /**
   * 특정 평가자(from)의 reactions 가져오기
   * @param fromUserId 평가자 사용자 ID
   */
  static async findByFromUser(fromUserId: string): Promise<TrustReaction[]> {
    const q = query(collection(store, 'trust_reactions'), where('from', '==', fromUserId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      data: {
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      },
    })) as TrustReaction[];
  }

  /**
   * Trust reaction 생성 또는 업데이트
   * 문서 ID는 `${from}_${to}` 형식으로 고정
   * @param from 평가자 uid
   * @param to 대상 uid
   * @param reaction thumbs_up 또는 thumbs_down
   */
  static async upsert(
    from: string,
    to: string,
    reaction: 'thumbs_up' | 'thumbs_down'
  ): Promise<TrustReaction> {
    const docId = `${from}_${to}`;

    const data = {
      from,
      to,
      reaction,
      updatedAt: new Date(),
    };

    // setDoc with merge: true로 upsert
    await setDoc(doc(store, 'trust_reactions', docId), data, { merge: true });

    return {
      id: docId,
      data,
    };
  }
}
