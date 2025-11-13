import './App.css';
import './extend.css';

import { AppFrame } from '@/components/layout/AppFrame.tsx';
import { useNavigationStore } from '@/store/navigationStore.ts';
import { CustomAuthProvider } from '@/contexts/AuthContext.tsx';
import { NavigationBar } from '@/components/layout/NavigationBar';
import { Toaster } from '@/components/ui/sonner.tsx';
import { HomePage } from '@/pages/home';
import { SearchPage } from '@/pages/search';
import { UploadPage } from '@/pages/upload';
import { QuotesPage } from '@/pages/quotes';
import { Profile } from '@/pages/profile';
import { MapPage } from '@/pages/map';

//font
import '@fontsource/pacifico/index.css';
import '@fontsource-variable/playfair-display/index.css';
import { SignUpPage } from '@/pages/sign-up';

const PAGES = {
  Home: <HomePage />,
  Search: <SearchPage />,
  Upload: <UploadPage />,
  Quotes: <QuotesPage />,
  Profile: <Profile />,
  Map: <MapPage />,
  SignUp: <SignUpPage />,
} as const;

function App() {
  const currentPage = useNavigationStore((state) => state.currentPage);

  return (
    <AppFrame>
      <CustomAuthProvider>
        {/*<Header/>*/}
        <main className={'h-[calc(100%-65px)]'}>{PAGES[currentPage]}</main>
        <div className="h-[56px]"></div>
        <NavigationBar />
        <Toaster />
      </CustomAuthProvider>
    </AppFrame>
  );
}

export default App;
