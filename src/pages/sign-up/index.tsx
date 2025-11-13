import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigationStore } from '@/store/navigationStore';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { Page } from '@/store/navigationStore.ts';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export const SignUpPage = () => {
  const { authUser } = useAuth();
  const { navigateTo } = useNavigationStore((state) => state.actions);

  if (authUser) {
    console.log('signupPage.user', authUser);
    navigateTo(Page.Home);
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // await signInToServer();
      navigateTo(Page.Home);

      console.log('Google Login Success', user.displayName, user.email);
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-8 text-center">
        <h1 className="text-4xl font-bold font-logo">Nudgee</h1>
        <p className="text-muted-foreground font-playfair">Discover the inspiration.</p>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full hover:cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>
        </div>
      </div>
    </div>
  );
};
