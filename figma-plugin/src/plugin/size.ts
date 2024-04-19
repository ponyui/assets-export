import { on } from '../utils/events';

figma.clientStorage
  .getAsync('size')
  .then(size => {
    if (size) figma.ui.resize(size.w, size.h);
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.log('err: ', err);
  });

on('resize', (size: { w: number; h: number }) => {
  figma.ui.resize(size.w, size.h);
  figma.clientStorage.setAsync('size', size).catch(err => {
    // eslint-disable-next-line no-console
    console.log('err: ', err);
  }); // save size
});
