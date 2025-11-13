/**
 * Trust Reaction 모델
 * 1촌이 2촌에게 주는 신뢰도 평가
 */
export interface TrustReaction {
  id: string; // 문서 ID: `${from}_${to}` 형식
  data: {
    from: string; // 평가자 uid (1촌)
    to: string; // 대상 uid (2촌)
    reaction: 'thumbs_up' | 'thumbs_down';
    updatedAt: Date;
  };
}
