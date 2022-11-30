import { Theme } from "@mui/material/styles";

declare module 'piral-core/lib/types/custom' {
    interface PiletCustomApi extends PiralThemeApi { }

    interface PiralCustomActions {
        updateTheme(theme: Theme): void;
    }

    interface PiralCustomState {
        theme: Theme;
    }
}

export interface PiralThemeApi {
    getTheme(): Theme;
    setTheme(theme: Theme): void;
}

