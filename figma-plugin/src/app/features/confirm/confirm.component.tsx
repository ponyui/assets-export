import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import styles from './confirm.module.scss';

import AssetsAppName from '../../components/assets-app-name/assets-app-name.component';
import AssetsCover from '../../assets/images/ponyui-cover.jpg';

export type ConfirmProps = {
  className?: string;
  error?: string;
  loading: boolean;
  onConfirm: () => void;
};

const Confirm: React.FC<ConfirmProps> = ({
  className,
  error,
  loading,
  onConfirm,
}) => {
  return (
    <div className={`${styles.confirm} ${className}`}>
      <div className={styles.content}>
        <AssetsAppName className={styles.assetsAppName} />
        <img
          src={AssetsCover}
          alt="assets-cover"
          className={styles.assetsCover}
        />
        <div className={styles.form}>
          <div className={styles.description}>
            We’ve sent you an email, please check and confirm to start using the
            plugin
          </div>
          <Button variant="dark" className={styles.button} onClick={onConfirm}>
            <span>Check it now</span>
            {loading && (
              <span>
                {' '}
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </span>
            )}
          </Button>
          <div className={styles.learnMoreBlock}>
            <div className={styles.learnMoreAbout}>Learn more about</div>
            <a
              className={styles.ponyUiLink}
              href="https://ponyui.com"
              target="blank">
              PonyUI
            </a>
          </div>
        </div>
      </div>
      {!!error && (
        <Alert variant="danger" dismissible className={styles.alert}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default Confirm;
