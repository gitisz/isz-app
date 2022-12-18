import * as React from 'react';
import { LayoutProps, useGlobalState } from 'piral';
import { styled, Theme, CSSObject, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ListItem from '@mui/material/ListItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, createTheme, PaletteMode, Tooltip } from '@mui/material';

export const SingleColumn: React.FC<LayoutProps> = ({ children }) => {

  let navigation = useGlobalState((s) => s.navigation);
  let prefers = useGlobalState((s) => s.theme);
  let user = useGlobalState((s) => s.user);
  let menuItems = useGlobalState((s) => s.registry.menuItems);

  const drawerWidth = 240;

  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

  let [drawerOpen, setDrawerState] = React.useState(navigation.drawer);

  React.useEffect(() => {
    setDrawerState(navigation.drawer);
  }, [navigation.drawer]);

  const handleDrawerOpen = () => {
    navigation.drawer = 'open'
    setDrawerState(navigation.drawer);
  };

  const handleDrawerClose = () => {
    navigation.drawer = 'closed'
    setDrawerState(navigation.drawer);
  };

  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const m_open = Boolean(anchor);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => { setAnchor(event.currentTarget); };
  const handleClose = () => { setAnchor(null); };

  return (
    <ThemeProvider theme={prefers}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerOpen}
              sx={{
                marginRight: 5,
                ...((drawerOpen === 'open') && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerClose}
              sx={{
                marginRight: 5,
                ...(!(drawerOpen === 'open') && { display: 'none' }),
              }}>
              <MenuOpenIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              THE-REALM
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>
            <Box sx={{ flexGrow: 0, marginLeft: 'auto' }}>
              {Object.keys(menuItems).filter(name => menuItems[name].settings.type === 'header').length > 0 ?
                <>
                  <Tooltip title="Settings">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={m_open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={m_open ? 'true' : undefined}
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchor}
                    id="settings-menu"
                    open={m_open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {Object.keys(menuItems).map((name) => {
                      const item = menuItems[name];
                      if (item.settings.type === 'header') {
                        const Component = item.component;
                        return (
                          <List key={name}>
                            {
                              [menuItems].map((text, index) => (
                                <Component key={name} />
                              ))
                            }
                          </List>
                        );
                      }
                      return undefined;
                    })}
                  </Menu>
                </>
                : null}
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={(drawerOpen === 'open')}>
          <DrawerHeader />
          {Object.keys(menuItems).map((name) => {
            const item = menuItems[name];
            if (item.settings.type === 'general') {
              const Component = item.component;
              return (
                <List key={name}>
                  {
                    [menuItems].map((text, index) => (
                      <ListItem key={name} disablePadding sx={{ display: 'block' }}>
                        <Component />
                        <Divider />
                      </ListItem>
                    ))
                  }
                </List>
              );
            }
            return undefined;
          })}
        </Drawer>
        <div className="app-container">
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <div className="app-content">
              {children}
            </div>
          </Box>
        </div>
      </Box>
    </ThemeProvider>
  )
};