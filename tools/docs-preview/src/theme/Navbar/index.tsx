import React from 'react';
import type { Props } from '@theme/Navbar';
import { useLocation } from '@docusaurus/router';
import { Header } from 'highsoft-ui';

export default function Navbar(_props: Props): JSX.Element {
    const { pathname } = useLocation();

    return (
        <nav
            className="navbar navbar--fixed-top"
            aria-label="Main"
        >
            <Header
                host=""
                pathname={pathname}
            />
        </nav>
    );
}
