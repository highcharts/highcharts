import React, { isValidElement } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import type { ReactElement, ReactNode } from 'react';

type CodeSwitchableProps = {
    children: ReactNode;
};

const LANGUAGE_LABELS: Record<string, string> = {
    js: 'JavaScript',
    jsx: 'React',
    ts: 'TypeScript',
    tsx: 'React TS',
    php: 'PHP',
};

const GROUP_ID = 'code-language';

function extractLanguage(node: ReactNode): string | null {
    if (!isValidElement(node)) {
        return null;
    }

    const className = node.props?.className;

    if (typeof className === 'string') {
        const match = className.match(/language-([\w-]+)/);
        if (match) {
            return match[1];
        }
    }

    if (node.props?.children) {
        const nested = React.Children.toArray(node.props.children);
        for (const child of nested) {
            const language = extractLanguage(child);
            if (language) {
                return language;
            }
        }
    }

    return null;
}

function getLabel(lang: string): string {
    return LANGUAGE_LABELS[lang] ?? lang;
}

export default function CodeSwitchable(props: CodeSwitchableProps): React.ReactElement {
    const childArray = React.Children.toArray(props.children).filter(isValidElement) as ReactElement[];

    if (childArray.length === 0) {
        return <>{props.children}</>;
    }

    const tabItems: Array<{ lang: string; element: ReactElement }> = [];

    for (const child of childArray) {
        const lang = extractLanguage(child);

        if (!lang) {
            continue;
        }

        if (tabItems.some((item) => item.lang === lang)) {
            continue;
        }

        tabItems.push({ lang, element: child });
    }

    if (tabItems.length <= 1) {
        return <>{props.children}</>;
    }

    const defaultValue = tabItems[0]?.lang;

    return (
        <>
            Switch code
            <Tabs
                className="code-switchable"
                groupId={GROUP_ID}
                defaultValue={defaultValue}
            >
                {tabItems.map(({ lang, element }) => (
                    <TabItem key={lang} value={lang} label={getLabel(lang)}>
                        {element}
                    </TabItem>
                ))}
            </Tabs>

        </>
    );
}
