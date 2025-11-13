import React, { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AppLayoutContext } from '@/contexts/AppLayoutContext';

export const FramePortal = ({ children }: { children?: React.ReactNode }) => {
  const { mainFrameRef } = useContext(AppLayoutContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !mainFrameRef?.current) {
    return null;
  }

  return createPortal(children, mainFrameRef.current);
};
