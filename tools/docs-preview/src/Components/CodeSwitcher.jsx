import { CodeLangContext } from './CodeLangContext';
import React, { useContext, useEffect, useState } from 'react';

import clsx from 'clsx';

const names = {
	js: 'JavaScript',
	jsx: 'React',
	ts: 'TypeScript',
	tsx: 'React TS',
	php: 'PHP',
};

export function CodeSwitcher({ langs, controls }) {
	const { codeLang, setCodeLang } = useContext(CodeLangContext);
	const [activeLang, setActiveLang] = useState(langs[0]);

	useEffect(() => {
		if (langs.includes(codeLang) && codeLang !== activeLang) {
			setActiveLang(codeLang);
		}
	}, [codeLang, langs, activeLang]);

	return (
		<div className="code-switcher">
			<div
				className="btn-group btn-group-sm"
				role="group"
				aria-label="Select programming language"
				aria-controls={controls}
			>
				{langs.map((lang) => (
					<button
						className={clsx(
							'btn',
							'btn-primary',
							activeLang === lang && 'active',
						)}
						key={lang}
						value={lang}
						type="button"
						onClick={(e) => setCodeLang(e.target.value)}
					>
						{names[lang] ?? lang}
					</button>
				))}
			</div>
		</div>
	);
}
