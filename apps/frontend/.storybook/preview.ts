import { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as docJson from 'apps/frontend/docs/documentation.json';

setCompodocJson(docJson);

const preview: Preview = {
  tags: ['autodocs'],
};

export default preview;
