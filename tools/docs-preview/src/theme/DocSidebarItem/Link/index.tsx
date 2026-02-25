import React from 'react';
import type { Props } from '@theme/DocSidebarItem/Link';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import styles from '@docusaurus/theme-classic/src/theme/DocSidebarItem/Link/styles.module.css';
import GridProBadge from '../../../components/GridProBadge';

const GRID_PRO_TOKEN = '__grid_pro__';

function LinkLabel({
    label,
    isGridPro,
}: {
    label: string;
    isGridPro: boolean;
}): JSX.Element {
    return (
        <>
            <span
                title={label}
                className={styles.linkLabel}
            >
                {label}
            </span>
            {isGridPro && <GridProBadge />}
        </>
    );
}

export default function DocSidebarItemLink(
    props: Props
): JSX.Element {
    const { item, onItemClick, activePath, level, index, ...linkProps } = props;
    const { href, label, className, autoAddBaseUrl } = item;

    if (typeof label !== 'string') {
        return (
            <li
                className={clsx(
                    ThemeClassNames.docs.docSidebarItemLink,
                    ThemeClassNames.docs.docSidebarItemLinkLevel(props.level),
                    'menu__list-item',
                    className
                )}
                key={String(label)}
            >
                <Link
                    className="menu__link"
                    autoAddBaseUrl={autoAddBaseUrl}
                    to={href}
                >
                    {label}
                </Link>
            </li>
        );
    }

    const hasGridProCustomProp = Boolean(item.customProps?.gridPro);

    const isGridPro =
        hasGridProCustomProp ||
        label.includes(GRID_PRO_TOKEN);
    const displayLabel = isGridPro ? label.replace(GRID_PRO_TOKEN, '').trim() : label;

    const isActive = isActiveSidebarItem(item, activePath);
    const isInternalLink = isInternalUrl(href);

    return (
        <li
            className={clsx(
                ThemeClassNames.docs.docSidebarItemLink,
                ThemeClassNames.docs.docSidebarItemLinkLevel(level),
                'menu__list-item',
                className
            )}
            key={label}
        >
            <Link
                className={clsx(
                    'menu__link',
                    !isInternalLink && styles.menuExternalLink,
                    {
                        'menu__link--active': isActive,
                    }
                )}
                autoAddBaseUrl={autoAddBaseUrl}
                aria-current={isActive ? 'page' : undefined}
                to={href}
                {...(isInternalLink && {
                    onClick: onItemClick ? () => onItemClick(item) : undefined,
                })}
                {...linkProps}
            >
                <LinkLabel
                    label={displayLabel}
                    isGridPro={isGridPro}
                />
                {!isInternalLink && <IconExternalLink />}
            </Link>
        </li>
    );
}
