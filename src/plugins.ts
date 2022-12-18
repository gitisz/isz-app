import { PiralPlugin } from 'piral-core';
import { PiralThemeApi, PiralUserApi, Navigation as Navigation, PiraNavigationApi } from './types';
import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { getToken, getUserInfo, User } from './auth';


export function createThemeApi(): PiralPlugin<PiralThemeApi> {
  return (ctx) => ({
    getTheme() {
      let theme = ctx.readState((s) => s.theme);
      if (theme === undefined) {
        let lsState = localStorage.getItem("prefers-color");
        if (lsState == null) {
          theme = createTheme({
            palette: {
              mode: 'light',
            },
          });
        } else {
          theme = createTheme({
            palette: {
              mode: lsState as PaletteMode
            }
          });
        }
        localStorage.setItem("prefers-color", theme.palette.mode);
      }
      return ctx.readState((s) => theme);
    },
    setTheme(theme) {
      localStorage.setItem("prefers-color", theme.palette.mode);
      ctx.updateTheme(theme);
    },
  });
}

export function createNavigationApi(): PiralPlugin<PiraNavigationApi> {
  return (context) => ({
    getNavigation() {
      let navigation = context.readState((s) => s.navigation);
      // if(navigation === undefined) {
      //   navigation = {
      //     name: 'dashboard',
      //     navigation: '/',
      //     drawer: 'closed'
      //   }
      // }
      return navigation;
    },
    setNavigation(navigation: Navigation) {
      context.updateNavigation(navigation)
    }
  });
}

export function createUserApi(): PiralPlugin<PiralUserApi> {
  return (context) => {
    const setUser = (user: User) => {
      context.dispatch((state) => ({
        ...state,
        user: {
          id: user.sub,
          name: user.preferred_username,
          company: user.organization,
        },
      }));
    };

    setUser({
      DOB: "",
      organization: "",
      preferred_username: "...",
      sub: "",
    });

    getUserInfo().then((s) => {
      console.log(s);
      setUser(s);
    });

    return {
      getCurrentUser() {
        return context.readState((s) => s.user);
      },
      requestToken() {
        return getToken();
      },
    };
  };
}

