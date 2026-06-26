import React, { type ReactNode, useCallback, useState } from 'react';
import clsx from 'clsx';
import { prefersReducedMotion, ThemeClassNames } from '@docusaurus/theme-common';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';
import ExpandButton from '@theme/DocRoot/Layout/Sidebar/ExpandButton';
import type { Props } from '@theme/DocRoot/Layout/Sidebar';

import SidebarResizer from './SidebarResizer';
import styles from './styles.module.css';

function ResetOnSidebarChange({ children }: { children: ReactNode }) {
    const sidebar = useDocsSidebar();

    return <React.Fragment key={sidebar?.name ?? 'noSidebar'}>{children}</React.Fragment>;
}

export default function DocRootLayoutSidebar({
    sidebar,
    hiddenSidebarContainer,
    setHiddenSidebarContainer
}: Props): ReactNode {
    const { pathname } = useLocation();
    const [hiddenSidebar, setHiddenSidebar] = useState(false);

    const toggleSidebar = useCallback(() => {
        if (hiddenSidebar) {
            setHiddenSidebar(false);
        }

        // onTransitionEnd won't fire when sidebar animation is disabled
        // fixes https://github.com/facebook/docusaurus/issues/8918
        if (!hiddenSidebar && prefersReducedMotion()) {
            setHiddenSidebar(true);
        }

        setHiddenSidebarContainer((value) => !value);
    }, [setHiddenSidebarContainer, hiddenSidebar]);

    return (
        <aside
            className={clsx(
                ThemeClassNames.docs.docSidebarContainer,
                styles.docSidebarContainer,
                hiddenSidebarContainer && styles.docSidebarContainerHidden
            )}
            onTransitionEnd={(event) => {
                if (
                    !event.currentTarget.classList.contains(
                        styles.docSidebarContainer!
                    )
                ) {
                    return;
                }

                if (hiddenSidebarContainer) {
                    setHiddenSidebar(true);
                }
            }}
        >
            <ResetOnSidebarChange>
                <div
                    className={clsx(
                        styles.sidebarViewport,
                        hiddenSidebar && styles.sidebarViewportHidden
                    )}
                >
                    <DocSidebar
                        sidebar={sidebar}
                        path={pathname}
                        onCollapse={toggleSidebar}
                        isHidden={hiddenSidebar}
                    />
                    <SidebarResizer hidden={hiddenSidebarContainer || hiddenSidebar} />
                    {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
                </div>
            </ResetOnSidebarChange>
        </aside>
    );
}
