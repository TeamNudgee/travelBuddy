import { useAuth } from '@/contexts/AuthContext.tsx';
import { Page, useNavigationStore } from '@/store/navigationStore.ts';

export const Authenticated = (props: { children: React.ReactNode }) => {
  const { authUser } = useAuth();
  const { navigateTo } = useNavigationStore((state) => state.actions);

  if (!authUser) {
    navigateTo(Page.SignUp);
    return;
  }

  return props.children;
};
