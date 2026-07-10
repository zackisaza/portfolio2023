import { describe, it, expect } from "vitest";
import { sliceHtmlByTextCount } from "./typewriter";

describe("sliceHtmlByTextCount", () => {
	it("slices plain text to the requested visible count", () => {
		const { html, visibleCount } = sliceHtmlByTextCount("hello", 3);
		expect(html).toBe("hel");
		expect(visibleCount).toBe(3);
	});

	it("returns the full string when the target exceeds its length", () => {
		const { html, visibleCount } = sliceHtmlByTextCount("hello", Infinity);
		expect(html).toBe("hello");
		expect(visibleCount).toBe(5);
	});

	it("treats tags as zero-width and closes any open tag", () => {
		// Only 1 visible char typed, but the <b> must be closed to stay valid HTML.
		const { html, visibleCount } = sliceHtmlByTextCount("<b>hi</b>", 1);
		expect(html).toBe("<b>h</b>");
		expect(visibleCount).toBe(1);
	});

	it("counts an HTML entity as a single visible character", () => {
		const { html, visibleCount } = sliceHtmlByTextCount("a&amp;b", 2);
		expect(html).toBe("a&amp;");
		expect(visibleCount).toBe(2);
	});

	it("closes nested tags in reverse order", () => {
		const { html } = sliceHtmlByTextCount("<b><i>x</i></b>", 1);
		expect(html).toBe("<b><i>x</i></b>");
	});

	it("handles a zero target without emitting visible characters", () => {
		const { html, visibleCount } = sliceHtmlByTextCount("hello", 0);
		expect(visibleCount).toBe(0);
		expect(html).toBe("");
	});
});
