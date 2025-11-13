// src/components/ui/inner-sheet.tsx
import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppLayoutContext } from '@/contexts/AppLayoutContext';
import { useEffect, useState } from 'react'; // 1. Context import

const InnerSheet = ({
  open,
  onOpenChange,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>) => {
  return (
    <SheetPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </SheetPrimitive.Root>
  );
};
const InnerSheetTrigger = SheetPrimitive.Trigger;
const InnerSheetClose = SheetPrimitive.Close;

// 2. Overlay의 position을 'absolute'로 변경
const InnerSheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      'absolute inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
InnerSheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const InnerSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
    closeButton?: React.ReactNode;
  }
>(({ side = 'right', closeButton = true, className, children, ...props }, ref) => {
  // 3. Context에서 mainFrameRef를 가져옴
  const { mainFrameRef } = React.useContext(AppLayoutContext);

  // 1. 마운트 상태를 추적하기 위한 state 추가
  const [isMounted, setIsMounted] = useState(false);

  // 2. 컴포넌트가 마운트된 후에 isMounted를 true로 설정
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. 마운트되기 전에는 아무것도 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  return (
    // 4. Portal을 사용하고, container를 mainFrameRef.current로 지정
    <SheetPrimitive.Portal container={mainFrameRef?.current}>
      <InnerSheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          // 5. Content의 position도 'absolute'로 변경
          'absolute z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 h-screen overflow-y-scroll hide-scrollbar',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-3/4  data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
          side === 'left' &&
            'inset-y-0 left-0 h-full w-3/4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
          side === 'top' &&
            'inset-x-0 top-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
          side === 'bottom' &&
            'inset-x-0 bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          className
        )}
        onEscapeKeyDown={(e) => {
          e.preventDefault(); // Esc 키 기본 동작 차단
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault(); // 바깥 클릭으로 닫히는 것 방지
        }}
        {...props}
      >
        {children}
        {closeButton ? (
          closeButton
        ) : (
          <SheetPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
});
InnerSheetContent.displayName = SheetPrimitive.Content.displayName;

// --- 나머지 컴포넌트(Header, Footer, Title, Description)는 그대로 ---

const InnerSheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
InnerSheetHeader.displayName = 'InnerSheetHeader';

const InnerSheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
InnerSheetFooter.displayName = 'InnerSheetFooter';

const InnerSheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
InnerSheetTitle.displayName = SheetPrimitive.Title.displayName;

const InnerSheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
InnerSheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  InnerSheet,
  InnerSheetTrigger,
  InnerSheetClose,
  InnerSheetContent,
  InnerSheetHeader,
  InnerSheetFooter,
  InnerSheetTitle,
  InnerSheetDescription,
};
