import { on, emit } from '../utils/events';
import { AppToPluginEvents, PluginToAppEvents } from '../utils/constants';

on(AppToPluginEvents.LOAD_PUBLISHED_NODES, () => {
  const toJson = figma.currentPage.parent.getSharedPluginData(
    'ponyui.assets',
    'nodes',
  );

  const values = toJson ? JSON.parse(toJson) : [];
  const nodes = values.map(({ updatedAt, publishedAt, ...rest }) => ({
    ...rest,
    updatedAt: new Date(updatedAt),
    publishedAt: new Date(publishedAt),
  }));

  emit(PluginToAppEvents.PUBLISHED_NODES, nodes);
});

on(AppToPluginEvents.PUBLISH, nodes => {
  figma.currentPage.parent.setSharedPluginData(
    'ponyui.assets',
    'nodes',
    JSON.stringify(nodes),
  );

  emit(PluginToAppEvents.PUBLISHED_NODES, nodes);
});
