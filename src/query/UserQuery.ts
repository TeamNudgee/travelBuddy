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

  /**
   * ID 배열로 여러 사용자 조회 (안전 처리)
   * @param ids 사용자 ID 배열
   * @returns 사용자 목록
   */
  static async findByIdIn(ids: string[]): Promise<AppUser[]> {
    // 빈 배열이면 빈 배열 반환
    if (!ids || ids.length === 0) {
      return [];
    }

    const result: AppUser[] = [];

    // Firestore 'in' 쿼리는 최대 10개까지만 가능
    const chunkSize = 10;
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);

      try {
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
      } catch (error) {
        console.error('Error fetching users chunk:', chunk, error);
        // 에러 발생 시 계속 진행
        continue;
      }
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
   * 사용자 위치 정보 업데이트 (완전 구현)
   * @param userId 사용자 문서 ID
   * @param geo 위도/경도/도시명 정보
   */
  static async updateLocation(userId: string, geo: GeoPoint): Promise<void> {
    if (!userId) {
      throw new Error('userId is required');
    }

    if (!geo || typeof geo.lat !== 'number' || typeof geo.lng !== 'number') {
      throw new Error('Valid geo coordinates are required');
    }

    try {
      const userDoc = doc(store, 'User', userId);

      await updateDoc(userDoc, {
        geo: {
          lat: geo.lat,
          lng: geo.lng,
          cityName: geo.cityName || null, // cityName이 없으면 null
        },
        updatedAt: new Date(),
      });

      console.log('Location updated successfully:', { userId, geo });
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }
}
