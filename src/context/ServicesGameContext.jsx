import { createContext, useCallback, useContext, useRef, useState } from "react";

// Shared "console" state for the Game Boy-themed Services section: the D-pad,
// A and B buttons (rendered in PokemonBackground) drive the booster box and the
// dealt cards (rendered in Works) through this context.
const ServicesGameContext = createContext(null);

export const useServicesGame = () => useContext(ServicesGameContext);

export function ServicesGameProvider({ children, total = 6 }) {
	const [opened, setOpened] = useState(false);
	const [selected, setSelected] = useState(0);
	const [flipped, setFlipped] = useState(false);
	// BoosterBox3D registers its click handler so the A button can trigger the
	// same open animation as clicking the pack directly.
	const boxTrigger = useRef(null);

	const registerBoxTrigger = useCallback((fn) => {
		boxTrigger.current = fn;
	}, []);

	const markOpened = useCallback(() => {
		setOpened(true);
		setSelected(0);
		setFlipped(false);
	}, []);

	// A button: open the pack while it's still closed.
	const pressA = useCallback(() => {
		if (opened) return;
		if (boxTrigger.current) boxTrigger.current();
	}, [opened]);

	// B button: flip the current card once the cards are out.
	const pressB = useCallback(() => {
		if (!opened) return;
		setFlipped((f) => !f);
	}, [opened]);

	// D-pad: move the selection between cards (flipping resets to the front).
	const move = useCallback(
		(dir) => {
			if (!opened) return;
			setSelected((i) => (i + dir + total) % total);
			setFlipped(false);
		},
		[opened, total]
	);

	return (
		<ServicesGameContext.Provider
			value={{ opened, selected, flipped, total, registerBoxTrigger, markOpened, pressA, pressB, move, setSelected }}
		>
			{children}
		</ServicesGameContext.Provider>
	);
}
