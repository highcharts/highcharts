import React from 'react';
import type { Props } from '@theme/Navbar';
import NavbarLayout from '@theme/Navbar/Layout';
import MobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import { useLocation } from '@docusaurus/router';
import { Header } from 'highsoft-ui';

export default function Navbar(_props: Props): JSX.Element {
    const { pathname } = useLocation();

    return (
        <NavbarLayout>
            <Header
                host=""
                pathname={pathname}
            />
            <div id="mobile-sidebar-toggle-wrapper">
                <MobileSidebarToggle />
            </div>
        </NavbarLayout>
    );
}
