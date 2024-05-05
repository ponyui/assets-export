import React, { useContext, useCallback, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import { emit } from '../../../../utils/events';
import { AppToPluginEvents } from '../../../../utils/constants';

import {
  AppState,
  AppStateContext,
  AssetNode,
} from '../../app-context/app-state.context';

import PublishComponent, { DraftWithState } from './publish.component';

type ConfirmPageProps = {};

const PublishPage: React.FC<ConfirmPageProps> = () => {
  const { bannerMessage, successPushMessage, drafts, publishedNodes } =
    useContext<AppState>(AppStateContext);

  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = useCallback(() => setModalVisible(false), []);
  const showModal = useCallback(() => setModalVisible(true), []);
  const openLink = useCallback(
    (url: string) => () => window.open(url, '_blank'),
    [],
  );

  const onSelect = useCallback(
    ({ nodeId }) =>
      () => {
        emit(AppToPluginEvents.SELECT_NODE, nodeId);
      },
    [],
  );
  const onPublish = useCallback(() => {
    const values = drafts.map((draft: AssetNode) => ({
      ...draft,
      updatedAt: draft.updatedAt.toISOString(),
      publishedAt: draft.publishedAt?.toISOString(),
    }));

    emit(AppToPluginEvents.PUBLISH, values);

    showModal();
  }, [drafts, showModal]);

  const draftsWithState: DraftWithState[] = useMemo(
    () => [
      ...publishedNodes
        .filter(({ nodeId }) => !drafts.some(n => n.nodeId === nodeId))
        .map(node => ({ state: 'deleted', node }) as DraftWithState),
      ...drafts.map(node => {
        const published = publishedNodes.find(
          ({ nodeId }) => nodeId === node.nodeId,
        );

        if (!published) {
          return { state: 'new', node } as DraftWithState;
        }

        const om = ['updatedAt', 'publishedAt', 'nodeId'];

        if (isEqual(omit(node, om), omit(published, om))) {
          return { state: 'saved', node } as DraftWithState;
        }

        return { state: 'changed', node } as DraftWithState;
      }),
    ],
    [drafts, publishedNodes],
  );

  const unsaved = useMemo(
    () => draftsWithState.filter(({ state }) => state !== 'saved').length,
    [draftsWithState],
  );

  return (
    <>
      <PublishComponent
        banner={bannerMessage}
        error={null}
        unsaved={unsaved}
        draftsWithState={draftsWithState}
        onSelect={onSelect}
        onPublish={onPublish}
      />
      <Modal
        backdrop="static"
        show={isModalVisible}
        onHide={closeModal}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <center>Now it&apos;s time import your assets using our CLI.</center>
        </Modal.Body>
        {successPushMessage && successPushMessage.text && (
          <Modal.Footer>
            <center
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: successPushMessage.text }}
            />
          </Modal.Footer>
        )}
        <Modal.Footer>
          {(!successPushMessage ||
            (!successPushMessage.close && !successPushMessage.cta)) && (
            <Button variant="outline-dark" onClick={closeModal}>
              Close
            </Button>
          )}
          {successPushMessage && !!successPushMessage.close && (
            <Button variant="outline-dark" onClick={closeModal}>
              {successPushMessage.close || 'Close'}
            </Button>
          )}
          {successPushMessage && !!successPushMessage.cta && (
            <Button
              variant="dark"
              onClick={openLink(successPushMessage.cta.link)}>
              {successPushMessage.cta.text}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PublishPage;
