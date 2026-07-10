import { describe, it, expect } from "vitest";
import { fadeIn, textVariant, zoomIn, slideIn, staggerContainer } from "./motion";

describe("motion variants", () => {
	it("textVariant forwards the delay into the show transition", () => {
		const v = textVariant(0.3);
		expect(v.hidden).toMatchObject({ y: -50, opacity: 0 });
		expect(v.show.opacity).toBe(1);
		expect(v.show.transition.delay).toBe(0.3);
	});

	it("fadeIn maps direction to the correct hidden offset axis", () => {
		expect(fadeIn("left").hidden.x).toBe(100);
		expect(fadeIn("right").hidden.x).toBe(-100);
		expect(fadeIn("up").hidden.y).toBe(100);
		expect(fadeIn("down").hidden.y).toBe(-100);
		expect(fadeIn("").hidden).toMatchObject({ x: 0, y: 0 });
	});

	it("fadeIn passes type/delay/duration through to the transition", () => {
		const t = fadeIn("up", "spring", 0.2, 1).show.transition;
		expect(t).toMatchObject({ type: "spring", delay: 0.2, duration: 1, ease: "easeOut" });
	});

	it("zoomIn animates scale from 0 to 1", () => {
		const v = zoomIn(0, 0.5);
		expect(v.hidden.scale).toBe(0);
		expect(v.show.scale).toBe(1);
	});

	it("slideIn uses percentage offsets per direction", () => {
		expect(slideIn("left").hidden.x).toBe("-100%");
		expect(slideIn("right").hidden.x).toBe("100%");
	});

	it("staggerContainer wires stagger + delay children", () => {
		const t = staggerContainer(0.1, 0.2).show.transition;
		expect(t).toMatchObject({ staggerChildren: 0.1, delayChildren: 0.2 });
		// delayChildren defaults to 0 when omitted
		expect(staggerContainer(0.1).show.transition.delayChildren).toBe(0);
	});
});
