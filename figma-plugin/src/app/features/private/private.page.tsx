import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import NodesPage from './nodes/nodes.page';
import PublishPage from './publish/publish.page';

type PrivateAreaPageProps = {};

const PrivateAreaPage: React.FC<PrivateAreaPageProps> = () => {
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
