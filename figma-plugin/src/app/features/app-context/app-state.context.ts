import { createContext } from 'react';

export interface PonyUser {
  id: string;
  extId: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface AppState {
  figmaUser: User | null;
  ponyUser: PonyUser | null;
  relogin: () => void | null;
}

export const initialAppState: AppState = {
  figmaUser: null,
  ponyUser: null,
  relogin: null,
};

export const AppStateContext = createContext<AppState>(initialAppState);
