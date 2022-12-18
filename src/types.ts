import { Theme } from "@mui/material/styles";

declare module 'piral-core/lib/types/custom' {
    interface PiletCustomApi extends PiralThemeApi, PiralUserApi, PiraNavigationApi { }

    interface PiralCustomActions {
        updateNavigation(navigation: Navigation): void;
        updateTheme(theme: Theme): void;
        updateUser(user: CurrentUser): void;
    }

    interface PiralCustomState {
        theme: Theme;
        user: CurrentUser;
        navigation: Navigation;
    }
}

export interface PiralThemeApi {
    setTheme(theme: Theme): void;
    getTheme(): Theme;
}

export interface PiralUserApi {
    getCurrentUser(): CurrentUser;
    requestToken(): Promise<string>;
}

export interface PiraNavigationApi {
    setNavigation(navigation: Navigation): void;
    getNavigation(): Navigation;
}

export interface CurrentUser {
    id: string;
    name: string;
    company: string;
}

export interface Navigation {
    name: string;
    navigation: string;
    drawer: DrawerMode;
}

export type DrawerMode = 'open' | 'closed';


