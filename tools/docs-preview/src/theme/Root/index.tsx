import React from 'react';
import type { Props } from '@theme/Root';
import Root from '@theme-original/Root';
import { ThemeProvider } from 'highsoft-ui';
import 'highsoft-ui/css';

const sidebarWidthScript = `
(() => {
  const key = 'docs-preview.sidebarWidth';
  const cssVar = '--doc-sidebar-width';
  const min = 240;
  const max = 480;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? Number(raw) : NaN;
    if (!Number.isFinite(parsed)) {
      return;
    }
    const width = Math.min(Math.max(Math.round(parsed), min), max);
    document.documentElement.style.setProperty(cssVar, width + 'px');
  } catch {
    // Ignore storage or DOM access failures.
  }
})();
`;

export default function RootWrapper(props: Props): JSX.Element {
    return (
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="light"
            storageKey="hs-ui-theme"
            enableSystem
        >
            <script dangerouslySetInnerHTML={{ __html: sidebarWidthScript }} />
            <Root {...props} />
        </ThemeProvider>
    );
}
