import React, { createContext, useState, useEffect, useRef } from 'react';

export const CodeLangContext = createContext({
	codeLang: 'js',
	setCodeLang: () => {},
});

function getCodelangFromLocalStorage() {
	try {
		if (typeof window === 'undefined') {
			return false;
		}

		return localStorage.getItem('codelang');
	} catch {
		return false;
	}
}

export function CodeLangContextProvider(props) {
	const [codeLang, setCodeLang] = useState(null);
	const prevCodeLang = useRef(false);

	function setLocalStorageWithConsent(key, value) {
		try {
			if (typeof window === 'undefined') {
				return false;
			}
			const consented =
				'Cookiebot' in window ? window.Cookiebot.consent.preferences : true;

			if (consented) localStorage.setItem(key, value);
		} catch {
			return false;
		}
	}

	useEffect(() => {
		if (!codeLang) {
			const lang = getCodelangFromLocalStorage();
			setCodeLang(lang ?? 'js');
		}

		if (codeLang && codeLang !== prevCodeLang.current) {
			setLocalStorageWithConsent('codelang', codeLang);
		}
	}, [codeLang]);

	return (
		<CodeLangContext.Provider value={{ codeLang, setCodeLang }}>
			{props.children}
		</CodeLangContext.Provider>
	);
}
