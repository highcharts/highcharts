import React, { useContext, useEffect, useRef, useMemo } from 'react';

import { CodeSwitcher } from './CodeSwitcher';
import { CodeLangContext } from './CodeLangContext';

export function CodeSwitchable(props) {
    if (!Array.isArray(props.children)) {
        return props.children;
    }

    const { codeLang } = useContext(CodeLangContext);

    const languages = new Set();

    for (const child of props.children) {
        if (child.props.children && !Array.isArray(child.props.children)) {
            const lang = child.props.children.props.className.split('-')[1];
            if (lang) {
                languages.add(lang);
            }
        }
    }

    const rootRef = useRef();
    const prevCodeLang = useRef(false);

    useEffect(() => {
        const el = rootRef.current;
        const prismContainers = el.querySelectorAll('.prism-code');

        if (prismContainers.length > 1) {
            if (prevCodeLang.current !== codeLang) {
                let activeEl = el.querySelector(`.language-${codeLang}`)?.parentElement
                    ?.parentElement;

                if (!activeEl) {
                    activeEl = el.querySelector(`.language-${Array.from(languages)[0]}`)
                        ?.parentElement?.parentElement;
                }

                if (activeEl) {
                    console.log(activeEl);
                    const oldActive = el.querySelector('pre.active');
                    if (oldActive) {
                        oldActive.classList.remove('active');
                    }
                    activeEl.classList.add('active');
                    prevCodeLang.current = codeLang;
                }
            }

            rootRef.current.dataset.init = true;
        }
    }, [codeLang, languages]);

    const id = useMemo(
        () => `code-switchable-${Math.random().toString(36).substring(2, 9)}`,
        [],
    );

    return (
        <div
            role="region"
            id={id}
            ref={rootRef}
            className="code-switchable"
            data-init="false"
        >
            <CodeSwitcher langs={Array.from(languages)} controls={id} />
            {props.children}
        </div>
    );
}
