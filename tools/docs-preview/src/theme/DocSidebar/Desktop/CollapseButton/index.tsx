import React, { type ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import { Button, Icon } from 'highsoft-ui';
import type { Props } from '@theme/DocSidebar/Desktop/CollapseButton';

import styles from './styles.module.css';

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function CollapseButton({ onClick }: Props): ReactNode {
    return (
        <div className={styles.collapseSidebarButtonWrap}>
            <Button
                as="button"
                type="button"
                variant="plain"
                size={100}
                iconLeft={(
                    <Icon
                        name={ChevronLeftIcon}
                        size={12}
                        strokeWidth={1.5}
                        className={styles.collapseIcon}
                        aria-hidden="true"
                    />
                )}
                title={translate({
                    id: 'theme.docs.sidebar.collapseButtonTitle',
                    message: 'Collapse sidebar',
                    description: 'The title attribute for collapse button of doc sidebar'
                })}
                aria-label={translate({
                    id: 'theme.docs.sidebar.collapseButtonAriaLabel',
                    message: 'Collapse sidebar',
                    description: 'The title attribute for collapse button of doc sidebar'
                })}
                className={styles.collapseSidebarButton}
                onClick={onClick}
            >
                Collapse
            </Button>
        </div>
    );
}
