import { createContext, useContext, useMemo, useRef, useState } from "react";

const BallSlotsContext = createContext({
  maxSlots: 6,
  requestSlot: () => false,
  releaseSlot: () => {},
  hasSlot: () => false,
});

export const BallSlotsProvider = ({ maxSlots = 6, children }) => {
  const slotsRef = useRef(new Set());
  const [, force] = useState(0);

  const requestSlot = (id) => {
    const slots = slotsRef.current;
    if (slots.has(id)) return true;
    if (slots.size < maxSlots) {
      slots.add(id);
      force((c) => c + 1);
      return true;
    }
    return false;
  };

  const releaseSlot = (id) => {
    const slots = slotsRef.current;
    if (slots.delete(id)) {
      force((c) => c + 1);
    }
  };

  const hasSlot = (id) => slotsRef.current.has(id);

  const value = useMemo(
    () => ({ maxSlots, requestSlot, releaseSlot, hasSlot }),
    // The slot callbacks are stable for the provider's life; memoize on maxSlots.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxSlots]
  );

  return (
    <BallSlotsContext.Provider value={value}>
      {children}
    </BallSlotsContext.Provider>
  );
};

export const useBallSlots = () => useContext(BallSlotsContext);
