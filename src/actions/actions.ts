import { Theme } from '@mui/material';
import { GlobalStateContext } from 'piral-core';

export function updateTheme(ctx: GlobalStateContext, theme: Theme) {
  ctx.dispatch(state => ({
    ...state,
    theme,
  }));
}