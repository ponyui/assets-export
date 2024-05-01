import React, { useContext } from 'react';

import { AppState, AppStateContext } from '../../app-context/app-state.context';

import NodesComponent from './nodes.component';

type ConfirmPageProps = {};

const NodesPage: React.FC<ConfirmPageProps> = () => {
  const { bannerMessage } = useContext<AppState>(AppStateContext);
  // const [error, setError] = useState<string | null>(null);

  return <NodesComponent banner={bannerMessage} error={null} />;
};

export default NodesPage;
