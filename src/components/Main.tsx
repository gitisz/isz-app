import * as React from 'react';
import { LayoutProps, Menu, Notifications, Modals, SetComponent } from 'piral';
import { StyledEngineProvider } from '@mui/material/styles';
import { SingleColumn } from './SingleColumn';

export const Main: React.FC<LayoutProps> = ({ children }) => (
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <SingleColumn currentLayout={'desktop'} children={children}></SingleColumn>
    </StyledEngineProvider>
  </React.StrictMode>
);