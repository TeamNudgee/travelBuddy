import { Button } from '../../ui/button.tsx';
import { cn } from '@/lib/utils';
import { Page, useNavigationStore } from '@/store/navigationStore';
import { Home, Plus, Quote, Search, User, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

// 네비게이션 아이템 타입 정의
type NavItem = {
  id: Page;
  label: string;
  icon: React.ElementType;
};

// 네비게이션 아이템 데이터
const navItems: NavItem[] = [
  {
    id: Page.Home,
    label: 'Home',
    icon: Home,
  },
  {
    id: Page.Search,
    label: 'Search',
    icon: Search,
  },
  {
    id: Page.Map,
    label: 'Map',
    icon: MapPin,
  },
  {
    id: Page.Quotes,
    label: 'Quotes',
    icon: Quote,
  },
  {
    id: Page.Profile,
    label: 'Profile',
    icon: User,
  },
];

export const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState<NavItem['id']>(Page.Home);
  const currentPage = useNavigationStore((state) => state.currentPage);
  const { navigateTo } = useNavigationStore((state) => state.actions);

  useEffect(() => {
    setActiveTab(currentPage);
  }, [currentPage]);

  return (
    <nav className="fixed bottom-0 z-10 h-[66px] w-full border-t border-stone-100 bg-white sm:w-[384px] bg-white/95 px-2">
      <div className="flex h-full w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none p-0 text-stone-400 font-light',
                'transition-all duration-150',
                'active:scale-100 active:bg-gray-100 dark:active:bg-gray-800',
                isActive && 'text-stone-800 dark:text-primary'
              )}
              onClick={() => {
                setActiveTab(item.id);
                navigateTo(item.id);
              }}
            >
              <Icon className="h-6 w-6" fill={isActive ? 'oklch(26.8% 0.007 34.298)' : 'white'} />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
