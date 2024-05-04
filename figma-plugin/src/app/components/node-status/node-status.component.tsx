import React from 'react';
import * as Icon from 'react-bootstrap-icons';

import styles from './node-status.module.scss';

export type NodeStatusState = 'saved' | 'new' | 'deleted' | 'changed';

export type NodeStatusProps = {
  className?: string;
  state?: NodeStatusState;
};

const NodeStatus: React.FC<NodeStatusProps> = ({
  className,
  state = 'saved',
}) => {
  return (
    <div className={`${styles.nodeStatus} ${className}`}>
      {state === 'saved' && <Icon.FileCheck />}
      {state === 'new' && <Icon.FilePlus />}
      {state === 'deleted' && <Icon.FileMinus />}
      {state === 'changed' && <Icon.FileImage />}
    </div>
  );
};

export default NodeStatus;
