import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { uiCopy } from "../translations";

// Minimal consumer that surfaces the i18n API to the DOM for assertions.
const Consumer = () => {
	const { t, language, setLanguage } = useLanguage();
	return (
		<div>
			<span data-testid="lang">{language}</span>
			<span data-testid="copy">{t("hero.subheading")}</span>
			<span data-testid="fallback">{t("does.not.exist")}</span>
			<button onClick={() => setLanguage("es")}>ES</button>
		</div>
	);
};

describe("LanguageContext", () => {
	beforeEach(() => window.localStorage.clear());

	it("defaults to English and resolves a real translation key", () => {
		render(
			<LanguageProvider>
				<Consumer />
			</LanguageProvider>
		);
		expect(screen.getByTestId("lang")).toHaveTextContent("en");
		expect(screen.getByTestId("copy")).toHaveTextContent(uiCopy.en.hero.subheading);
	});

	it("switches locale when setLanguage is called", () => {
		render(
			<LanguageProvider>
				<Consumer />
			</LanguageProvider>
		);
		fireEvent.click(screen.getByText("ES"));
		expect(screen.getByTestId("lang")).toHaveTextContent("es");
		expect(screen.getByTestId("copy")).toHaveTextContent(uiCopy.es.hero.subheading);
	});

	it("falls back to the key itself for unknown paths", () => {
		render(
			<LanguageProvider>
				<Consumer />
			</LanguageProvider>
		);
		expect(screen.getByTestId("fallback")).toHaveTextContent("does.not.exist");
	});
});
