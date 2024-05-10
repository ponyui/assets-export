import React, { useContext, useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import { emit, on } from '../../../utils/events';
import { AppToPluginEvents, PluginToAppEvents } from '../../../utils/constants';

import type { AppState, AssetNode } from '../app-context/app-state.context';

import { AppStateContext } from '../app-context/app-state.context';

import NodesPage from './nodes/nodes.page';
import PublishPage from './publish/publish.page';

type PrivateAreaPageProps = {};

const PrivateAreaPage: React.FC<PrivateAreaPageProps> = () => {
  const { setPublishedNodes, setDrafts } =
    useContext<AppState>(AppStateContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    on(PluginToAppEvents.PUBLISHED_NODES, (nodes0: AssetNode[]) => {
      setLoading(false);

      const nodes = nodes0.map(({ updatedAt, publishedAt, ...rest }) => ({
        ...rest,
        updatedAt: new Date(updatedAt),
        publishedAt: publishedAt && new Date(publishedAt),
      }));

      setPublishedNodes(nodes ? [...nodes] : []);
      setDrafts(nodes ? [...nodes] : []);
    });

    emit(AppToPluginEvents.LOAD_PUBLISHED_NODES);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Tab.Container defaultActiveKey="nodes">
      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link eventKey="nodes">Nodes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="publish">Publish</Nav.Link>
        </Nav.Item>
      </Nav>
      <Tab.Content className="private-content">
        <Tab.Pane eventKey="nodes">
          <NodesPage />
        </Tab.Pane>
        <Tab.Pane eventKey="publish">
          <PublishPage />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

export default PrivateAreaPage;
