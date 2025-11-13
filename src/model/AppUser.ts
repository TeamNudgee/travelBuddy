export interface GeoPoint {
  lat: number;
  lng: number;
  cityName?: string; // 도시 이름 (검색으로 설정한 경우)
}

export interface AppUser {
  id: string;
  data: {
    name: string;
    firebaseUid: string;
    email: string;
    avatar: string;
    hash: string;
    followers: number;
    followings: number;
    friends: string[]; // Array of user IDs (1촌 관계)
    geo?: GeoPoint; // 사용자 위치 (optional)
    trust_score: number; // 신뢰도 점수 (0~1)
    createdAt: Date;
    updatedAt: Date;
  };
}
