import React, { type ReactElement } from 'react';
import NavbarLayout from '@theme/Navbar/Layout';
import MobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import { useLocation } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import { Header } from 'highsoft-ui';

const THEME_ATTRIBUTE = 'data-theme';

function getThemeFromDocument(): 'light' | 'dark' | null {
    const theme = document.documentElement.getAttribute(THEME_ATTRIBUTE);

    if (theme === 'light' || theme === 'dark') {
        return theme;
    }

    return null;
}

export default function Navbar(): ReactElement {
    const { pathname } = useLocation();
    const { colorMode, setColorMode } = useColorMode();
    const colorModeRef = React.useRef(colorMode);

    React.useEffect(() => {
        colorModeRef.current = colorMode;
    }, [colorMode]);

    React.useEffect(() => {
        const syncColorMode = () => {
            const nextTheme = getThemeFromDocument();

            if (nextTheme && nextTheme !== colorModeRef.current) {
                colorModeRef.current = nextTheme;
                setColorMode(nextTheme);
            }
        };

        syncColorMode();

        const observer = new MutationObserver(syncColorMode);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [THEME_ATTRIBUTE]
        });

        return () => {
            observer.disconnect();
        };
    }, [setColorMode]);

    return (
        <Header
            host=""
            pathname={pathname}
            cssVariable={true}
        >
            <NavbarLayout>
                <MobileSidebarToggle />
            </NavbarLayout>
        </Header>
    );
}
