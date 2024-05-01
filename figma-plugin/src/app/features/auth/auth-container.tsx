import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { emit, on } from '../../../utils/events';
import {
  baseUrl,
  AppToPluginEvents,
  PluginToAppEvents,
} from '../../../utils/constants';

import type { AppState, PonyUser } from '../app-context/app-state.context';
import { AppStateContext } from '../app-context/app-state.context';

const AuthContainer = () => {
  const [figmaUser, setFigmaUser] = useState<User>(null);
  const [ponyUser, setPonyUser] = useState<PonyUser>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const relogin = useCallback(
    async (user?: User) => {
      // setLoading(false);
      // navigate('/private/nodes');
      const figmaId = user ? user.id : figmaUser.id;

      try {
        const { data } = await axios.post(`${baseUrl}/login`, {
          figmaId,
        });

        setPonyUser(data as PonyUser);

        navigate('/private/home');
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
    () => ({ figmaUser, ponyUser, relogin }),
    [figmaUser, ponyUser, relogin],
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
