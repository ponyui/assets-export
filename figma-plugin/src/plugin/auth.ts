import { on, emit } from '../utils/events';
import { AppToPluginEvents, PluginToAppEvents } from '../utils/constants';

on(AppToPluginEvents.GET_FIGMA_USER, () => {
  emit(PluginToAppEvents.FIGMA_USER, figma.currentUser);
});
