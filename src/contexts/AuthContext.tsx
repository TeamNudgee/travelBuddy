import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserQuery } from '@/query/UserQuery.ts';
import type { AppUser } from '@/model/AppUser.ts';
import { toast } from 'sonner';

const CustomAuthContext = createContext<{
  authUser: User | null;
  appUser: AppUser | null;
  // refreshAppUser: () => Promise<void>;
}>({
  authUser: null,
  appUser: null,
  // refreshAppUser: async () => {}, // 초기값
});

export const CustomAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(() => auth.currentUser);
  const [appUser, setAppUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[AuthProvider] Auth state changed:', user);
      setAuthUser(user);

      if (user) {
        const findUser = await UserQuery.findByFirebaseUid(user.uid);
        if (!findUser) {
          const appUser = await UserQuery.create({
            id: user.uid,
            name: user.displayName || 'Anonymous',
            email: user.email || '',
            avatar: user.photoURL || '',
          });

          setAppUser(appUser);

          toast.success(`🎉 Account created successfully. Welcome, ${appUser.data.name}!`);
        } else {
          setAppUser(findUser);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // const refreshAppUser = async () => {
  //   setAppUser(appUser ? await getMe() : null);
  // };

  return (
    <CustomAuthContext.Provider value={{ authUser, appUser }}>
      {children}
    </CustomAuthContext.Provider>
  );
};

export const useAuth = () => useContext(CustomAuthContext);
