import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as mixpanel from 'mixpanel-figma';
import * as Sentry from '@sentry/react';

import { emit, on } from '../../../utils/events';
import {
  baseUrl,
  AppToPluginEvents,
  PluginToAppEvents,
} from '../../../utils/constants';

import type {
  AppState,
  PonyUser,
  AssetNode,
} from '../app-context/app-state.context';
import { AppStateContext } from '../app-context/app-state.context';

const AuthContainer = () => {
  const [loading, setLoading] = useState(true);

  const [figmaUser, setFigmaUser] = useState<User>(null);
  const [ponyUser, setPonyUser] = useState<PonyUser>(null);

  const [bannerMessage, setBannerMessage] = useState<string>(null);
  const [successPushMessage, setSuccessPushMessage] = useState(null);

  const [publishedNodes, setPublishedNodes] = useState<AssetNode[]>([]);
  const [drafts, setDrafts] = useState<AssetNode[]>([]);

  const navigate = useNavigate();

  const relogin = useCallback(
    async (user?: User) => {
      // setLoading(false);
      // navigate('/private/nodes');
      const figmaId = user ? user.id : figmaUser.id;

      try {
        const {
          data: { user, bannerMessage, successPushMessage },
        } = await axios.post(`${baseUrl}/login`, {
          figmaId,
        });

        setPonyUser(user as PonyUser);
        setBannerMessage(bannerMessage);
        setSuccessPushMessage(successPushMessage);

        navigate('/private/nodes');
      } catch (error) {
        const {
          response: { status },
        } = error;

        if (status === 401) {
          navigate('/signup');
        } else if (status === 403) {
          navigate('/confirm');
        }

        throw error;
      }
    },
    [figmaUser, navigate],
  );

  useEffect(() => {
    on(PluginToAppEvents.FIGMA_USER, async figmaUser => {
      // mixpanel: initialize and identify user
      mixpanel.init(process.env.MIXPANEL_KEY, {
        disable_cookie: true,
        disable_persistence: true,
      });
      mixpanel.identify(figmaUser.id);
      mixpanel.people.set({
        $name: figmaUser.name,
      });
      // sentry: initialization
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
        ],
        // Performance Monitoring
        // tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        // tracePropagationTargets: [
        //   'localhost',
        //   /^https:\/\/yourserver\.io\/api/,
        // ],
        // Session Replay
        // replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        // replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      });
      //
      setFigmaUser(figmaUser);
      try {
        setLoading(true);

        await relogin(figmaUser);
      } catch (error) {
        console.log('initial.login.error: ', error);
      }

      setLoading(false);
    });
    //
    emit(AppToPluginEvents.GET_FIGMA_USER);
  }, []);

  const appState = useMemo<AppState>(
    () => ({
      figmaUser,
      ponyUser,
      relogin,
      bannerMessage,
      successPushMessage,
      publishedNodes,
      setPublishedNodes,
      drafts,
      setDrafts,
    }),
    [
      figmaUser,
      ponyUser,
      relogin,
      bannerMessage,
      successPushMessage,
      publishedNodes,
      setPublishedNodes,
      drafts,
      setDrafts,
    ],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AppStateContext.Provider value={appState}>
      <Outlet />
    </AppStateContext.Provider>
  );
};

export default AuthContainer;
