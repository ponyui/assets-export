import React from 'react';
import styles from './assets-app-name.module.scss';

export type AssetsAppNameProps = {
  className?: string;
};

const AssetsAppName: React.FC<AssetsAppNameProps> = ({ className }) => {
  return (
    <div className={`${styles.assetsAppName} ${className}`}>
      <div className={styles.ponyUi}>PonyUI</div>
      <div className={styles.assets}>assets export</div>
    </div>
  );
};

export default AssetsAppName;
