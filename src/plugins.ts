import { PiralPlugin } from 'piral-core';
import { PiralThemeApi } from './types';
import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';


export function createThemeApi(): PiralPlugin<PiralThemeApi> {
    return (ctx) => ({
      getTheme() {
        let theme = ctx.readState((s) => s.theme);
        console.log("FOO")
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