import React, { useContext, useState, useCallback } from 'react';

import { AppState, AppStateContext } from '../app-context/app-state.context';

import Confirm from './confirm.component';

type ConfirmPageProps = {};

const ConfirmPage: React.FC<ConfirmPageProps> = () => {
  const { relogin } = useContext<AppState>(AppStateContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onConfirm = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await relogin();
    } catch (error) {
      setError(error.response.data.message);
    }
    setLoading(false);
  }, [relogin]);

  return <Confirm onConfirm={onConfirm} error={error} loading={loading} />;
};

export default ConfirmPage;
