import * as React from 'react';
import { Link } from 'react-router-dom';
import { ComponentsState, ErrorComponentsState, Notifications, SwitchErrorInfo, Menu, MenuItemProps } from 'piral';
import { Main } from './components/Main';
import { getTileClass } from './utils';

export const Layout: Partial<ComponentsState> = {
  Layout: ({ children }) => {
    return ( <Main currentLayout={'desktop'} children={children} /> )
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
  DashboardTile: ({ children, rows, columns }) => <div className={getTileClass(columns, rows)}>{children}</div>,
  MenuItem: ({ children }) => <div className="pi-item">{children}</div>,
  MenuContainer: ({ children }) => <div className="pi-menu">{children}</div>,
  NotificationsHost: ({ children }) => <div className="notifications">{children}</div>,
  NotificationsToast: ({ options, onClose, children }) => (
    <div className={`notification-toast ${options.type}`}>
      <div className="notification-toast-details">
        {options.title && <div className="notification-toast-title">{options.title}</div>}
        <div className="notification-toast-description">{children}</div>
      </div>
      <div className="notification-toast-close" onClick={onClose} />
    </div>
  ),
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

