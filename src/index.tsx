import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, Piral, createStandardApi, createNotificationsApi } from 'piral';
import { Layout, Errors } from './Layout';
import { createThemeApi } from './plugins';
import * as actions from './actions/actions';

// change to your feed URL here (either using feed.piral.cloud or your own service)
const feedUrl = 'http://localhost:9000/api/v1/pilet';

const instance = createInstance({
  actions,
  state: {
    components: Layout,
    errorComponents: Errors,
    theme: undefined,
  },
  plugins: [
    createNotificationsApi(),
    createThemeApi(),
    ...createStandardApi()],
  requestPilets() {
    return fetch(feedUrl)
      .then((res) => res.json())
      .then((res) => res.items);
  },
});

const root = createRoot(document.querySelector('#app'));

root.render(<Piral instance={instance}></Piral>);
