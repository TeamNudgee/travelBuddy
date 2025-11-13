import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase.ts';
import { Button } from '@/components/ui/button.tsx';
import { Page, useNavigationStore } from '@/store/navigationStore.ts';

export const LogoutButton = () => {
  const { navigateTo } = useNavigationStore((state) => state.actions);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      console.log('로그아웃 성공');
      navigateTo(Page.Home);
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      className="h-[36px] flex items-center gap-3 justify-start px-2 text-black rounded-none hover:bg-gray-100 hover:cursor-pointer"
      onClick={handleLogOut}
    >
      <span>Logout</span>
    </Button>
  );
};
