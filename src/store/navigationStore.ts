import { create } from 'zustand';

// @ts-ignore
export enum Page {
  Home = 'Home',
  Search = 'Search',
  Upload = 'Upload',
  Quotes = 'Quotes',
  Profile = 'Profile',
  Map = 'Map',
  SignUp = 'SignUp',
}

interface NavigationState {
  currentPage: Page;
  actions: {
    navigateTo: (page: Page) => void;
  };
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: Page.Quotes,
  actions: {
    navigateTo: (page) => set({ currentPage: page }),
  },
}));
