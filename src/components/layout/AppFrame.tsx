import { AppLayoutContext } from '@/contexts/AppLayoutContext';
import React, { useRef } from 'react';

interface AppFrameProps {
  children: React.ReactNode;
}

export const AppFrame = ({ children }: AppFrameProps) => {
  const mainFrameRef = useRef<HTMLDivElement>(null);

  return (
    <AppLayoutContext.Provider value={{ mainFrameRef }}>
      <div className="flex w-screen justify-center bg-gray-100 mx-auto my-0">
        <div className="flex w-4xl justify-center">
          {/* 1. 왼쪽 로고 및 설명 영역 (lg 사이즈 이상에서만 보임) */}
          <aside className="hidden md:flex w-sm items-center justify-center shrink-0 flex-col">
            <div
              className={
                'flex flex-col bg-white items-center w-3xs border shadow-xl rounded-lg p-10 gap-8 font-logo'
              }
            >
              <h1 className={'relative text-4xl font-bold gap-3 text-stone-800'}>Nudgee</h1>
              <div className={'font-serif font-light text-stone-600'}>Discover the inspiration</div>
              {/*<img src={reactSvg} alt="Logo" className={'aspect-square w-40'} />*/}
            </div>
          </aside>

          {/* 2. 오른쪽 콘텐츠 영역 */}
          <div
            ref={mainFrameRef}
            className="w-screen sm:w-[384px] shrink-0 relative overflow-hidden h-screen bg-background "
          >
            <div
              className="w-screen sm:w-[384px] shrink-0 h-screen overflow-y-scroll hide-scrollbar  relative"
              id={'main-frame'}
            >
              {/* h-screen과 overflow-y-auto를 통해 꽉 찬 스크롤 영역 생성 */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </AppLayoutContext.Provider>
  );
};
