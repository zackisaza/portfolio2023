import { describe, it, expect } from "vitest";
import { uiCopy } from "./index";

// Recursively collect the dotted key paths of every leaf in a nested object,
// so we can assert the EN and ES dictionaries stay perfectly in sync.
const keyPaths = (obj, prefix = "") => {
	const paths = [];
	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key;
		if (value && typeof value === "object" && !Array.isArray(value)) {
			paths.push(...keyPaths(value, path));
		} else {
			paths.push(path);
		}
	}
	return paths.sort();
};

describe("i18n dictionary (uiCopy)", () => {
	it("exposes both en and es locales", () => {
		expect(uiCopy).toHaveProperty("en");
		expect(uiCopy).toHaveProperty("es");
	});

	it("has identical key structure across en and es (no missing translations)", () => {
		const en = keyPaths(uiCopy.en);
		const es = keyPaths(uiCopy.es);
		const onlyInEn = en.filter((k) => !es.includes(k));
		const onlyInEs = es.filter((k) => !en.includes(k));
		expect(onlyInEn, `keys missing from ES: ${onlyInEn.join(", ")}`).toEqual([]);
		expect(onlyInEs, `keys missing from EN: ${onlyInEs.join(", ")}`).toEqual([]);
	});

	it("has no empty string values in either locale", () => {
		const empties = [];
		const walk = (obj, locale, prefix = "") => {
			for (const [key, value] of Object.entries(obj)) {
				const path = prefix ? `${prefix}.${key}` : key;
				if (value && typeof value === "object") walk(value, locale, path);
				else if (typeof value === "string" && value.trim() === "") empties.push(`${locale}.${path}`);
			}
		};
		walk(uiCopy.en, "en");
		walk(uiCopy.es, "es");
		expect(empties, `empty copy at: ${empties.join(", ")}`).toEqual([]);
	});
});
