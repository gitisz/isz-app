import { Theme } from '@mui/material';
import { GlobalStateContext } from 'piral-core';
import { User } from '../auth';
import { Navigation, CurrentUser } from '../types';

export function updateTheme(ctx: GlobalStateContext, theme: Theme) {
  ctx.dispatch(state => ({
    ...state,
    theme,
  }));
}

export function updateNavigation(ctx: GlobalStateContext, navigation: Navigation) {
  ctx.dispatch(state => ({
    ...state,
    navigation,
  }));
}

export function updateUser(ctx: GlobalStateContext, user: any) {
  ctx.dispatch(state => ({
    ...state,
    user,
  }));
}