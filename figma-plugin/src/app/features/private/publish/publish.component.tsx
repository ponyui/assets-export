import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import NodeStatus, {
  NodeStatusState,
} from '../../../components/node-status/node-status.component';

import { AssetNode } from '../../app-context/app-state.context';

import styles from './publish.module.scss';

export interface DraftWithState {
  state: NodeStatusState;
  node: AssetNode;
}

export type PublishProps = {
  className?: string;
  error?: string;
  banner?: string;
  //
  unsaved: number;
  draftsWithState: DraftWithState[];
  //
  onSelect: (draft: AssetNode) => () => void;
  onPublish: () => void;
};

const Publish: React.FC<PublishProps> = ({
  className,
  error,
  banner,
  //
  unsaved,
  draftsWithState,
  //
  onSelect,
  onPublish,
}) => {
  return (
    <div className={`${styles.frame1} ${className}`}>
      <div className={styles.alertsContainer}>
        {!!error && (
          <Alert variant="danger" dismissible className={styles.errorAlert}>
            {error}
          </Alert>
        )}
        {!!banner && (
          <Alert variant="success" dismissible className={styles.infoAlert}>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: banner }} />
          </Alert>
        )}
      </div>
      <div className={styles.saveBlock}>
        <div className={styles.saveBlockHeader}>
          {unsaved} UNSAVED FROM {draftsWithState.length} MARKED NODES
        </div>
        <Button
          variant="dark"
          className={styles.publishButton}
          onClick={onPublish}>
          Save for Export
        </Button>
      </div>
      <div className={styles.nodesBlock}>
        <div className={styles.nodesBlockHeader}>LIST OF MARKED NODES</div>
        <div className={styles.nodesBlockList}>
          {!!draftsWithState &&
            draftsWithState.map(({ state, node }) => {
              return (
                <div key={node.nodeId} className={styles.frame10}>
                  <NodeStatus className={styles.nodeStatus} state={state} />
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a href="#" onClick={onSelect(node)}>
                    {`${node.path || ''}${node.path ? '/' : ''}${node.name}`}
                  </a>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Publish;
