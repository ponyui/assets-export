import React from 'react';
import Alert from 'react-bootstrap/Alert';
import * as Icon from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './publish.module.scss';

export type PublishProps = {
  className?: string;
};

const Publish: React.FC<PublishProps> = ({ className }) => {
  return (
    <div className={`${styles.frame1} ${className}`}>
      <div className={styles.alertsContainer}>
        <Alert variant="danger" dismissible className={styles.errorAlert}>
          Sorry, something went wrong. Try it later.
        </Alert>
        <Alert variant="success" dismissible className={styles.infoAlert}>
          Hi there, if you want to know more about PonyUI, just check out our
          landing page!
        </Alert>
      </div>
      <div className={styles.sheetsBlock}>
        <div className={styles.sheetsHeader}>
          <div className={styles.googeSheets}>GOOGE SHEETS</div>
          <Icon.QuestionCircle />
        </div>
        <div className={styles.urlGroup}>
          <div className={styles.link}>Link</div>
          <Form.Control placeholder="link" className={styles.input} />
        </div>
      </div>
      <div className={styles.nodesBlock}>
        <div className={styles.stats}>STATS</div>
        <div className={styles.nodesContent}>
          <div className={styles.lastPublish}>
            <div className={styles.lastPublication}>Last publication</div>
            <Form.Control
              placeholder="29.11.2023"
              className={styles.input22019867}
            />
          </div>
        </div>
        <Button variant="dark" className={styles.publishButton}>
          Publish
        </Button>
      </div>
    </div>
  );
};

export default Publish;
