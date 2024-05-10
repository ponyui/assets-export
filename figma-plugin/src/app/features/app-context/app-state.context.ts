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

export interface AssetNode {
  nodeId: string;
  exportAs: string;
  name: string;
  path?: string;
  scale?: number;

  updatedAt: Date;
  publishedAt?: Date;
}

export interface AppState {
  figmaUser: User | null;
  ponyUser: PonyUser | null;
  bannerMessage: string | null;
  successPushMessage: any | null;
  relogin: (() => Promise<void>) | null;
  //
  publishedNodes: AssetNode[] | null;
  setPublishedNodes: ((nodes: AssetNode[]) => void) | null;
  drafts: AssetNode[] | null;
  setDrafts: ((nodes: AssetNode[]) => void) | null;
}

export const initialAppState: AppState = {
  figmaUser: null,
  ponyUser: null,
  bannerMessage: null,
  successPushMessage: null,
  relogin: null,
  //
  publishedNodes: null,
  setPublishedNodes: null,
  drafts: null,
  setDrafts: null,
};

export const AppStateContext = createContext<AppState>(initialAppState);
