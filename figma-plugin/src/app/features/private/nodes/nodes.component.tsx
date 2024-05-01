import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import styles from './nodes.module.scss';

export type NodesProps = {
  className?: string;
};

const Nodes: React.FC<NodesProps> = ({ className }) => {
  return (
    <div className={`${styles.content} ${className}`}>
      <div className={styles.alertsContainer}>
        <Alert variant="danger" dismissible className={styles.errorAlert}>
          Sorry, something went wrong. Try it later.
        </Alert>
        <Alert variant="success" dismissible className={styles.infoAlert}>
          Hi there, if you want to know more about PonyUI, just check out our
          landing page!
        </Alert>
      </div>
      <div className={styles.statsBlock}>
        <div className={styles.statsHeader}>ICON/PIC/COMPONENT</div>
        <div className={styles.statsContainer}>
          <div className={styles.lastChanged}>
            <div className={styles.lastChanges}>Last changes</div>
            <div className={styles.frame3}>
              <Form.Control
                placeholder="29.12.2023 15:44"
                className={styles.input}
              />
              <Button variant="dark" className={styles.button}>
                undefined
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.exportSettingsBlock}>
        <div className={styles.exportSettingsHeader}>EXPORT SETTINGS</div>
        <div className={styles.exportSettingsContent}>
          <div className={styles.exportAsGroup}>
            <div className={styles.exportAs}>Export as</div>
            <Form.Select className={styles.select}>
              <option id="">Select asset type</option>
            </Form.Select>
          </div>
          <div className={styles.nameGroup}>
            <div className={styles.name}>Name</div>
            <Form.Control className={styles.nameInput} />
          </div>
          <div className={styles.pathGroup}>
            <div className={styles.customPath}>Custom path</div>
            <Form.Control className={styles.pathInput} />
          </div>
          <div className={styles.ratioGroup}>
            <div className={styles.scaleRatio}>Scale ratio</div>
            <Form.Control
              placeholder="integer >= 1"
              className={styles.ratioInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nodes;