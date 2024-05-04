import React, { useContext, useCallback, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import { emit, on } from '../../../../utils/events';
import {
  AppToPluginEvents,
  PluginToAppEvents,
} from '../../../../utils/constants';

import { AppState, AppStateContext } from '../../app-context/app-state.context';

import PublishComponent, { DraftWithState } from './publish.component';

type ConfirmPageProps = {};

const PublishPage: React.FC<ConfirmPageProps> = () => {
  const { bannerMessage, drafts, publishedNodes } =
    useContext<AppState>(AppStateContext);

  const onSelect = useCallback(
    ({ nodeId }) =>
      () => {
        emit(AppToPluginEvents.SELECT_NODE, nodeId);
      },
    [],
  );
  const onPublish = useCallback(() => {
    emit(AppToPluginEvents.PUBLISH, drafts);
  }, [drafts]);

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
    <PublishComponent
      banner={bannerMessage}
      error={null}
      unsaved={unsaved}
      draftsWithState={draftsWithState}
      onSelect={onSelect}
      onPublish={onPublish}
    />
  );
};

export default PublishPage;
