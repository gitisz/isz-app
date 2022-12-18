import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, Piral, createStandardApi, createNotificationsApi, Dashboard, createModalsApi } from 'piral';
import { Layout, Errors } from './Layout';
import { createNavigationApi, createThemeApi, createUserApi } from './plugins';
import * as actions from './actions/actions';
import { isLoggedIn, login } from './auth';
import { Redirect } from 'react-router';
import { createTheme, PaletteMode } from '@mui/material';
import { Navigation } from './types';

isLoggedIn().then((loggedIn) => {
  if (loggedIn) {

    const feedUrl = 'http://localhost:9000/api/v1/pilet';

    const instance = createInstance({
      actions,
      state: {
        components: Layout,
        errorComponents: Errors,
        theme: undefined,
        routes: {
          "/": Dashboard,
          "/auth": () => <Redirect from="/auth" to="/" />,
        },
      },
      plugins: [
        createUserApi(),
        createNotificationsApi(),
        createThemeApi(),
        createNavigationApi(),
        createModalsApi(),
        ...createStandardApi(),
      ],
      requestPilets() {
        return fetch(feedUrl)
          .then((res) => res.json())
          .then((res) => res.items);
      },
    });

    instance.context.updateNavigation(getNavigation());
    instance.context.updateTheme(getTheme());

    const root = createRoot(document.querySelector('#app'));

    root.render(<Piral instance={instance}></Piral>);
  } else {
    // error case; not logged in
    login();
  }

  function getNavigation() : Navigation {
    return {
      name: 'dashboard',
      navigation: '/',
      drawer: 'closed'
    };
  }

  function getTheme() {
    let theme = createTheme({
      palette: {
        mode: 'light'
      },
    });
    const lsState = localStorage.getItem("prefers-color");
    if (lsState != null) {
      theme = createTheme({
        palette: {
          mode: lsState as PaletteMode,
        }
      });
    }
    return theme;
  }
});