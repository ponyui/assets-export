import React, { useContext, useEffect, useState, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import * as mixpanel from 'mixpanel-figma';

import { emit, on } from '../../../../utils/events';
import {
  AppToPluginEvents,
  PluginToAppEvents,
} from '../../../../utils/constants';

import {
  AppState,
  AppStateContext,
  AssetNode,
} from '../../app-context/app-state.context';

import NodesComponent from './nodes.component';

type NodesPageProps = {};

const NodesPage: React.FC<NodesPageProps> = () => {
  const { bannerMessage, drafts, setDrafts } =
    useContext<AppState>(AppStateContext);

  // const [error, setError] = useState<string | null>(null);
  const [node, setNode] = useState<BaseNode>(null);
  const [draft, setDraft] = useState<AssetNode>(null);

  useEffect(() => {
    return on(
      PluginToAppEvents.SELECTION_CHANGED,
      async (selected: BaseNode) => {
        setNode(selected);

        if (selected) {
          setDraft(drafts.find(n => n.nodeId === selected.id));
        } else {
          setDraft(null);
        }
      },
    );
  }, [drafts]);

  useEffect(() => {
    emit(AppToPluginEvents.SUBSCRIBE_ON_SELECTION_CHANGE);

    return () => {
      emit(AppToPluginEvents.UNSUBSCRIBE_ON_SELECTION_CHANGE);
    };
  }, []);

  const onDelete = useCallback(() => {
    if (draft) {
      drafts.splice(
        drafts.findIndex(({ nodeId }) => nodeId === draft.nodeId),
        1,
      );
      setDrafts([...drafts]);
      setDraft(null);
    }
  }, [drafts, setDrafts, draft]);

  const onChange = useCallback(
    (v: Partial<AssetNode>) => {
      if (
        !isEqual(
          omit(v, ['updatedAt', 'publishedAt']),
          omit(draft, ['updatedAt', 'publishedAt']),
        )
      ) {
        const value = {
          ...draft,
          ...v,
          nodeId: node.id,
          updatedAt: new Date(),
        };

        setDrafts([
          value,
          ...drafts.filter(({ nodeId }) => nodeId !== value.nodeId),
        ]);
        setDraft(value);

        mixpanel.track('Config Node');
      }
    },
    [drafts, draft, node, setDrafts],
  );

  return (
    <NodesComponent
      banner={bannerMessage}
      error={null}
      node={node}
      draft={draft}
      onDelete={onDelete}
      onChange={onChange}
    />
  );
};

export default NodesPage;
