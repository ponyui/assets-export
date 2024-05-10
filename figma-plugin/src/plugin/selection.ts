import { on, emit } from '../utils/events';
import { AppToPluginEvents, PluginToAppEvents } from '../utils/constants';

const FIGMA_SELECTION_CHANGE = 'selectionchange';

function selectionChanged() {
  if (figma.currentPage.selection && figma.currentPage.selection.length > 0) {
    const node = figma.currentPage.selection[0];

    emit(PluginToAppEvents.SELECTION_CHANGED, {
      id: node.id,
      name: node.name,
      type: node.type,
    });
  } else {
    emit(PluginToAppEvents.SELECTION_CHANGED, null);
  }
}

on(AppToPluginEvents.SUBSCRIBE_ON_SELECTION_CHANGE, () => {
  figma.on(FIGMA_SELECTION_CHANGE, selectionChanged);
  selectionChanged();
});

on(AppToPluginEvents.UNSUBSCRIBE_ON_SELECTION_CHANGE, () => {
  figma.off(FIGMA_SELECTION_CHANGE, selectionChanged);
});

function getPageNode(node: BaseNode): PageNode {
  if (node.type === 'PAGE') {
    return node;
  }

  return getPageNode(node.parent);
}

on(AppToPluginEvents.SELECT_NODE, (nodeId: string) => {
  const node = figma.getNodeById(nodeId);
  const pageNode = getPageNode(node);

  if (pageNode !== figma.currentPage) {
    figma.currentPage = pageNode;
  }

  if (node && node.type !== 'DOCUMENT' && node.type !== 'PAGE') {
    figma.currentPage.selection = [node];
    figma.viewport.scrollAndZoomIntoView([node]);
  }
});
