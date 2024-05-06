import React, { useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import * as mixpanel from 'mixpanel-figma';
import * as Sentry from '@sentry/react';

import { baseUrl } from '../../../utils/constants';
import { AppState, AppStateContext } from '../app-context/app-state.context';

import SignUp from './sign-up.component';

type SignupPageProps = {};

const SignupPage: React.FC<SignupPageProps> = () => {
  const { figmaUser, relogin } = useContext<AppState>(AppStateContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mixpanel.track('Open Plugin');
  }, []);

  const onSignUp = useCallback(
    async (email: string) => {
      try {
        setError(null);
        setLoading(true);
        await axios.put(`${baseUrl}/signup`, {
          app: 'assets',
          id: figmaUser.id,
          name: figmaUser.name,
          email,
        });

        await relogin();

        mixpanel.track('Sign Up');
      } catch (error) {
        if (error.code === 'ERR_NETWORK') {
          Sentry.captureException(error);
          setError(error.message);
        } else {
          setError(error.response?.data?.message);
        }
      }
      setLoading(false);
    },
    [figmaUser, relogin],
  );

  return <SignUp error={error} onSignUp={onSignUp} loading={loading} />;
};

export default SignupPage;
