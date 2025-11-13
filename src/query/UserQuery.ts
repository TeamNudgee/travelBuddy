import type { AppUser, GeoPoint } from '@/model/AppUser.ts';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { store } from '@/lib/firebase.ts';

export class UserQuery {
  static async findById(id: string): Promise<AppUser | null> {
    const snapshot = await getDoc(doc(store, 'User', id));

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      data: snapshot.data(),
    } as AppUser;
  }

  static async findByFirebaseUid(firebaseUid: string): Promise<AppUser | null> {
    const q = query(collection(store, 'User'), where('firebaseUid', '==', firebaseUid), limit(1));
    const snapshot = await getDocs(q);
    console.log('snapshot', snapshot);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      data: doc.data(),
    } as AppUser;
  }

  static async findByIdIn(ids: string[]): Promise<AppUser[]> {
    const result: AppUser[] = [];

    const chunkSize = 10;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);

      const q = query(
        collection(store, 'User'),
        where('__name__', 'in', chunk) // '__name__' = document ID
      );

      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          data: doc.data(),
        } as AppUser);
      });
    }

    return result;
  }

  static async create(properties: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }): Promise<AppUser> {
    const { id, name, email, avatar } = properties;

    const data: AppUser['data'] = {
      firebaseUid: id,
      name,
      email,
      avatar,
      hash: `@${name}`,
      followers: 0,
      followings: 0,
      friends: [], // 초기에는 빈 배열
      trust_score: 0.5, // 초기 신뢰도 0.5 (중립)
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(store, 'User'), {
      ...data,
    });

    return {
      id: docRef.id,
      data,
    } as AppUser;
  }

  /**
   * 사용자 위치 정보 업데이트
   * @param userId 사용자 문서 ID
   * @param geo 위도/경도 정보
   */
  static async updateLocation(userId: string, geo: GeoPoint): Promise<void> {
    const userDoc = doc(store, 'User', userId);
    await updateDoc(userDoc, {
      geo,
      updatedAt: new Date(),
    });
  }
}
