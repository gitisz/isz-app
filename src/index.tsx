import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, Piral, createStandardApi, SetComponent } from 'piral';
import { Layout, Errors } from './Layout';

// change to your feed URL here (either using feed.piral.cloud or your own service)
const feedUrl = 'http://localhost:9000/api/v1/pilet';

const instance = createInstance({
  state: {
    components: Layout,
    errorComponents: Errors,
  },
  plugins: [
    ...createStandardApi()],
  requestPilets() {
    return fetch(feedUrl)
      .then((res) => res.json())
      .then((res) => res.items);
  },
});

const root = createRoot(document.querySelector('#app'));

let theme = localStorage.getItem("prefers-color");

if (theme === undefined) {
  theme = "light";
}

instance.root.setData('theme', theme);

root.render(<Piral instance={instance}></Piral>);
