import { createContext, type RefObject } from 'react';

// 컨텍스트에 담을 데이터 타입 정의
interface AppLayoutContextType {
  mainFrameRef: RefObject<HTMLDivElement | null> | null;
}

// 컨텍스트 생성
export const AppLayoutContext = createContext<AppLayoutContextType>({
  mainFrameRef: null,
});
