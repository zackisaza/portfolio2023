import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { uiCopy } from "../translations";

const LanguageContext = createContext(null);

const DEFAULT_LANGUAGE = "en";

const resolvePath = (object, path) => {
	if (!object) return undefined;
	return path.split(".").reduce((acc, key) => {
		if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
			return acc[key];
		}
		return undefined;
	}, object);
};

const getInitialState = () => {
	if (typeof window === "undefined") {
		return { language: DEFAULT_LANGUAGE, hasPreference: false };
	}
	const stored = window.localStorage.getItem("preferredLanguage");
	// Debug: show what's in localStorage when running in development
	// Determine dev mode safely (works in browser and Vite)
	const __isDev__ = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV === true;
	if (__isDev__) {
		console.debug("[LanguageContext] localStorage.preferredLanguage =", stored);
	}
	if (stored && uiCopy[stored]) {
		return { language: stored, hasPreference: true };
	}
	return { language: DEFAULT_LANGUAGE, hasPreference: false };
};

export const LanguageProvider = ({ children }) => {
	const [state, setState] = useState(getInitialState);
	const { language, hasPreference } = state;

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (hasPreference) {
				window.localStorage.setItem("preferredLanguage", language);
			} else {
				window.localStorage.removeItem("preferredLanguage");
			}
		}
	}, [language, hasPreference]);

	const changeLanguage = useCallback((code) => {
		setState(() => {
			const nextLanguage = uiCopy[code] ? code : DEFAULT_LANGUAGE;
			return { language: nextLanguage, hasPreference: true };
		});
	}, []);

	const value = useMemo(() => {
		const t = (path) => {
			const result = resolvePath(uiCopy[language], path);
			return result ?? resolvePath(uiCopy[DEFAULT_LANGUAGE], path) ?? path;
		};

		return {
			language,
			setLanguage: changeLanguage,
			t,
			hasPreference,
		};
	}, [changeLanguage, hasPreference, language]);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};
