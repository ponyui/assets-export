import React, { useCallback, useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as Icon from 'react-bootstrap-icons';
import pascalCase from 'just-pascal-case';
import kebabCase from 'just-kebab-case';

import { AssetNode } from '../../app-context/app-state.context';

import styles from './nodes.module.scss';

export type NodesProps = {
  className?: string;
  error?: string;
  banner?: string;
  //
  node: BaseNode;
  draft: Partial<AssetNode>;
  //
  onChange: (draft: Partial<AssetNode>) => void;
  onDelete: () => void;
};

const Nodes: React.FC<NodesProps> = ({
  className,
  error,
  banner,
  //
  node,
  draft,
  //
  onChange,
  onDelete,
}) => {
  const [local, setLocal] = useState<Partial<AssetNode>>(null);
  const [isScaleValid, setIsScaleValid] = useState<boolean>(true);

  useEffect(() => {
    setLocal(draft);
  }, [draft]);

  const onChangeField = useCallback(
    (field: string) => (e: any) => {
      const {
        target: { value },
      } = e;

      const newLocal = {
        ...local,
        [field]: value,
        ...(field === 'exportAs'
          ? {
              name:
                value === 'react-icon-component'
                  ? pascalCase(node.name)
                  : `${kebabCase(node.name)}.${value}`,
            }
          : {}),
        ...(field === 'exportAs' && ['jpg', 'png'].indexOf(value) >= 0
          ? { scale: 2 }
          : {}),
      };
      setLocal(newLocal);

      if (newLocal.scale) {
        setIsScaleValid(
          Number(newLocal.scale) >= 0.01 && Number(newLocal.scale) <= 4,
        );
      }
    },
    [local, node],
  );

  const onBlur = useCallback(() => onChange(local), [onChange, local]);

  return (
    <div className={`${styles.content} ${className}`}>
      <div className={styles.alertsContainer}>
        {!!error && (
          <Alert variant="danger" dismissible className={styles.errorAlert}>
            {error}
          </Alert>
        )}
        {!!banner && (
          <Alert variant="success" dismissible className={styles.infoAlert}>
            {banner}
          </Alert>
        )}
      </div>
      {!node && (
        <div>
          <center>
            To start work
            <div>please select a node</div>
          </center>
        </div>
      )}
      {!!node && (
        <>
          <div className={styles.statsBlock}>
            <div className={styles.statsHeader}>ICON/PIC/COMPONENT</div>
            <div className={styles.statsContainer}>
              <div className={styles.lastChanged}>
                <div className={styles.lastChangesLight}>ID: {node.id}</div>
                <div className={styles.lastChangesLight}>Name: {node.name}</div>
              </div>
              {!!local?.updatedAt && (
                <div className={styles.lastChanged}>
                  <div className={styles.lastChanges}>Last changes</div>
                  <div className={styles.frame3}>
                    <Form.Control
                      className={styles.input}
                      disabled
                      value={local?.updatedAt?.toLocaleString() || ''}
                    />
                    <Button
                      variant="dark"
                      className={styles.button}
                      onClick={onDelete}>
                      <Icon.Trash3 />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.exportSettingsBlock}>
            <div className={styles.exportSettingsHeader}>EXPORT SETTINGS</div>
            <div className={styles.exportSettingsContent}>
              <div className={styles.exportAsGroup}>
                <div className={styles.exportAs}>Export as</div>
                <Form.Select
                  className={styles.select}
                  value={local?.exportAs || ''}
                  onChange={onChangeField('exportAs')}
                  onBlur={onBlur}>
                  <option id="">Select asset type</option>
                  <option value="jpg">jpg</option>
                  <option value="png">png</option>
                  <option value="svg">svg</option>
                  <option value="react-icon-component">
                    react-icon-component
                  </option>
                </Form.Select>
              </div>
              {!!local?.exportAs && (
                <>
                  <div className={styles.nameGroup}>
                    <div className={styles.name}>
                      {local.exportAs === 'react-icon-component'
                        ? 'Class '
                        : 'File '}
                      Name
                    </div>
                    <Form.Control
                      className={styles.nameInput}
                      value={local.name || ''}
                      onChange={onChangeField('name')}
                      onBlur={onBlur}
                    />
                  </div>
                  <div className={styles.pathGroup}>
                    <div className={styles.customPath}>Custom Path</div>
                    <Form.Control
                      className={styles.pathInput}
                      value={local.path || ''}
                      onChange={onChangeField('path')}
                      onBlur={onBlur}
                    />
                  </div>
                  {['jpg', 'png'].indexOf(local.exportAs) >= 0 && (
                    <div className={styles.ratioGroup}>
                      <div className={styles.scaleRatio}>
                        Scale (a number between 0.01 and 4)
                      </div>
                      <Form.Control
                        className={styles.ratioInput}
                        value={local.scale || ''}
                        onChange={onChangeField('scale')}
                        onBlur={onBlur}
                        isValid={isScaleValid}
                        isInvalid={!isScaleValid}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Nodes;
