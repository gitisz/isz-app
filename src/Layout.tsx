import * as React from 'react';
import { Link } from 'react-router-dom';
import { ComponentsState, ErrorComponentsState, Modals, SwitchErrorInfo } from 'piral';
import { Notifications } from 'piral-notifications';
import { Main } from './components/Main';
import { getTileClass } from './utils';
import { AlertTitle, Icon, Snackbar, Typography } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Error, Lightbulb, Warning, Done } from '@mui/icons-material';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ minWidth: '50%', maxWidth: '50%' }} />;
});


export const Layout: Partial<ComponentsState> = {
  Layout: ({ children }) => {
    return (
      <>
        <Main currentLayout={'desktop'} children={children} />
        <Notifications />
        <Modals />
      </>
    )
  },
  ErrorInfo: (props) => (
    <div>
      <h1>Error</h1>
      <SwitchErrorInfo {...props} />
    </div>
  ),
  LoadingIndicator: () => (
    <>
    </>
  ),
  DashboardContainer: ({ children }) => {
    return (
      <div className="pi-content">
        <div className="pi-dashboard">{children}</div>
      </div>
    );
  },

  ModalsHost: ({ children }) => <div className="pi-modal">{children}</div>,
  DashboardTile: ({ children, rows, columns }) => <div className={getTileClass(columns, rows)}>{children}</div>,
  MenuItem: ({ children }) => <div className="pi-item">{children}</div>,
  MenuContainer: ({ children }) => <div className="pi-menu">{children}</div>,
  NotificationsHost: ({ children }) => <div className="notifications">{children}</div>,
  NotificationsToast: ({ options, onClose, children }) => {

    let iconName = (<Error fontSize="inherit" />);
    if(options.type == 'info') {
      iconName = (<Lightbulb fontSize="inherit" />)
    } else if (options.type == 'success') {
      iconName = (<Done fontSize="inherit" />)
    } else if (options.type == 'warning') {
      iconName = (<Warning fontSize="inherit" />)
    }

    return (
      <Snackbar open={true} onClose={onClose} sx={{ width: '100%' }}>
        <Alert onClose={onClose} severity={options.type} icon={iconName}>
          <AlertTitle>
            {options.title}
          </AlertTitle>
          {children}
        </Alert>
      </Snackbar>
    )
  },
};

export const Errors: Partial<ErrorComponentsState> = {
  not_found: () => (
    <div>
      <p className="error">Could not find the requested page. Are you sure it exists?</p>
      <p>
        Go back <Link to="/">to the dashboard</Link>.
      </p>
    </div>
  ),
};

