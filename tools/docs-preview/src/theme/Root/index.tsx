import React from 'react';
import type { Props } from '@theme/Root';
import Root from '@theme-original/Root';
import { ThemeProvider } from 'highsoft-ui';
import 'highsoft-ui/css';

export default function RootWrapper(props: Props): JSX.Element {
    return (
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="light"
            storageKey="hs-ui-theme"
            enableSystem
        >
            <Root {...props} />
        </ThemeProvider>
    );
}
