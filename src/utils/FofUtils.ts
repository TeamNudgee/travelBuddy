import type { AppUser } from '@/model/AppUser.ts';
import type { TrustReaction } from '@/model/TrustReaction.ts';

export interface FOFUser {
  user: AppUser;
  mutualFriends: AppUser[];
  mutualFriendsCount: number;
  trustScore: number;
  trustLabel: string;
}

/**
 * Friends of Friends (FOF) 유틸리티
 * 2촌 관계 계산 및 신뢰도 평가
 */
export class FofUtils {
  /**
   * 특정 사용자의 2촌(FOF)를 계산
   * @param currentUser 현재 사용자
   * @param allUsers 모든 사용자 목록
   * @param reactions 모든 trust reactions
   * @returns 2촌 사용자 목록 (신뢰도 정보 포함)
   */
  static calculateFOF(
    currentUser: AppUser,
    allUsers: AppUser[],
    reactions: TrustReaction[]
  ): FOFUser[] {
    const myFriends = currentUser.data.friends || [];
    const fofMap = new Map<string, AppUser[]>(); // userId -> mutual friends

    // 내 친구들의 친구들을 순회
    myFriends.forEach((friendId) => {
      const friend = allUsers.find((u) => u.id === friendId);
      if (!friend) return;

      const friendsFriends = friend.data.friends || [];

      friendsFriends.forEach((fofId) => {
        // 1. 나 자신은 제외
        if (fofId === currentUser.id) return;
        // 2. 이미 내 친구인 사람은 제외 (1촌만 해당)
        if (myFriends.includes(fofId)) return;

        // 2촌 관계 추가
        if (!fofMap.has(fofId)) {
          fofMap.set(fofId, []);
        }
        fofMap.get(fofId)!.push(friend);
      });
    });

    // Map을 배열로 변환하고 신뢰도 계산
    const result: FOFUser[] = [];

    fofMap.forEach((mutualFriends, userId) => {
      const user = allUsers.find((u) => u.id === userId);
      if (!user) return;

      const mutualFriendsCount = mutualFriends.length;

      // 3촌 이상 제외 (공통 친구 없음)
      if (mutualFriendsCount === 0) return;

      const trustScore = this.calculateTrustScore(
        user.id,
        mutualFriends.map((f) => f.id),
        reactions,
        mutualFriendsCount
      );

      const trustLabel = this.getTrustLabel(trustScore, mutualFriendsCount);

      result.push({
        user,
        mutualFriends,
        mutualFriendsCount,
        trustScore,
        trustLabel,
      });
    });

    return result;
  }

  /**
   * 신뢰도 점수 계산
   * @param targetUserId 대상 사용자 ID
   * @param mutualFriendIds 공통 친구 ID 목록
   * @param reactions 모든 trust reactions
   * @param mutualFriendsCount 공통 친구 수
   * @returns 0~1 사이의 신뢰도 점수
   */
  static calculateTrustScore(
    targetUserId: string,
    mutualFriendIds: string[],
    reactions: TrustReaction[],
    mutualFriendsCount: number
  ): number {
    // 해당 사용자에 대한 평가 필터링
    const relevantReactions = reactions.filter(
      (r) => r.data.to === targetUserId && mutualFriendIds.includes(r.data.from)
    );

    if (relevantReactions.length === 0) {
      // 평가가 없으면 중립 점수
      return 0.5;
    }

    const upCount = relevantReactions.filter((r) => r.data.reaction === 'thumbs_up').length;
    const downCount = relevantReactions.filter((r) => r.data.reaction === 'thumbs_down').length;

    // 신뢰도 계산: thumbs_down에 1.2 가중치
    const rawScore = (upCount - 1.2 * downCount) / relevantReactions.length;

    // -1~+1 범위를 0~1로 normalize
    let trustScore = (rawScore + 1) / 2;

    // 공통 친구가 1명일 때는 불확실성 반영
    if (mutualFriendsCount <= 1) {
      trustScore *= 0.8;
    }

    // 0~1 범위로 clamp
    return Math.max(0, Math.min(1, trustScore));
  }

  /**
   * 신뢰도 라벨 반환
   * @param trustScore 0~1 신뢰도 점수
   * @param mutualFriendsCount 공통 친구 수
   * @returns 사용자에게 보여줄 문구
   */
  static getTrustLabel(trustScore: number, mutualFriendsCount: number): string {
    if (mutualFriendsCount === 0) {
      return '3촌 친구예요. 신뢰 정보가 없습니다.';
    }

    if (trustScore >= 0.8) {
      return '친구들이 신뢰하는 사람이에요 🌿';
    }

    if (trustScore >= 0.6) {
      return '대부분의 친구가 긍정적인 반응이에요 🙂';
    }

    if (trustScore >= 0.4) {
      return '아직 의견이 많지 않아요. 1촌 친구에게 직접 물어보는 건 어때요?';
    }

    return '친구들의 평가가 엇갈려요 ⚠️';
  }

  /**
   * 신뢰도에 따른 마커 색상 반환
   * @param trustScore 0~1 신뢰도 점수
   * @returns Leaflet circle 색상
   */
  static getMarkerColor(trustScore: number): string {
    if (trustScore >= 0.8) return '#22c55e'; // green
    if (trustScore >= 0.6) return '#86efac'; // lightgreen
    if (trustScore >= 0.4) return '#9ca3af'; // gray
    return '#ef4444'; // red
  }

  /**
   * 두 사용자 간의 mutual friends 계산
   * @param user1 사용자 1
   * @param user2 사용자 2
   * @param allUsers 모든 사용자 목록
   * @returns mutual friends 목록
   */
  static getMutualFriends(user1: AppUser, user2: AppUser, allUsers: AppUser[]): AppUser[] {
    const friends1 = user1.data.friends || [];
    const friends2 = user2.data.friends || [];

    const mutualFriendIds = friends1.filter((id) => friends2.includes(id));

    return allUsers.filter((u) => mutualFriendIds.includes(u.id));
  }

  /**
   * 1촌 + 2촌의 unique user ID 목록만 반환 (데이터 로딩용)
   * @param currentUser 현재 사용자
   * @returns unique user ID 배열
   */
  static getAllFriendsAndFOFIds(currentUser: AppUser): string[] {
    const myFriends = currentUser.data.friends || [];
    const allIds = new Set<string>(myFriends);

    // 여기서는 friends의 friends를 직접 조회할 수 없으므로
    // 일단 1촌만 반환하고, 실제 조회 후 calculateFOF에서 2촌 계산
    return Array.from(allIds);
  }
}
