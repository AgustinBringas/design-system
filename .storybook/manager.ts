import { addons } from '@storybook/manager-api';
import storybookTheme from './theme';

/*
 * Applies the custom branding to the Storybook manager chrome (sidebar,
 * toolbar, panel). This file is loaded in the manager frame, not the preview
 * frame, so it runs independently of the component stories.
 */
addons.setConfig({
  theme: storybookTheme,
  // Keep the sidebar panel open by default (useful during development).
  showPanel: true,
  panelPosition: 'bottom',
});
