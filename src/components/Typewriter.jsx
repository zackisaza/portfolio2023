import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sliceHtmlByTextCount } from '../utils/typewriter';

/**
 * Typewriter component
 * - Animates text on change (by language or content)
 * - Supports plain text and simple HTML (b, i, strong, br, span, etc.)
 */
const Typewriter = ({
  content,
  rich = false,
  speed = 28, // ms per character
  startDelay = 120, // initial delay before typing starts
  cursor = true,
  className = '',
  ariaLabel,
  onDone,
}) => {
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const timerRef = useRef(null);

  const key = useMemo(() => (content ?? ''), [content]);

  useEffect(() => {
    // Reset on content change
    if (!key) {
      setCount(0);
      setTyping(false);
      return;
    }
    setCount(0);
    setTyping(true);

    const totalVisible = rich ? sliceHtmlByTextCount(key, Infinity).visibleCount : (key?.length ?? 0);

    const startT = setTimeout(() => {
      timerRef.current = setInterval(() => {
        setCount((c) => {
          if (c + 1 >= totalVisible) {
            clearInterval(timerRef.current);
            setTyping(false);
            onDone?.();
            return totalVisible;
          }
          return c + 1;
        });
      }, speed);
    }, Math.max(0, startDelay));

    return () => {
      clearTimeout(startT);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rich, speed, startDelay]);

  const rendered = useMemo(() => {
    if (!key) return '';
    if (rich) {
      const { html } = sliceHtmlByTextCount(key, count);
      return html;
    }
    return key.slice(0, count);
  }, [key, count, rich]);

  // Stack a hidden "ghost" of the FULL text under the animated text so the
  // container is sized to its final dimensions from the first frame. This stops
  // the layout shift (reflow) that happens when the typed text grows char by char.
  const cursorHtml = cursor && typing ? '<span class="tw-cursor">|</span>' : '';
  return rich ? (
    <span className={className} aria-label={ariaLabel} style={{ display: 'grid' }}>
      <span
        aria-hidden='true'
        style={{ gridArea: '1 / 1', visibility: 'hidden' }}
        dangerouslySetInnerHTML={{ __html: key }}
      />
      <span
        style={{ gridArea: '1 / 1' }}
        dangerouslySetInnerHTML={{ __html: rendered + cursorHtml }}
      />
    </span>
  ) : (
    <span className={className} aria-label={ariaLabel} style={{ display: 'grid' }}>
      <span aria-hidden='true' style={{ gridArea: '1 / 1', visibility: 'hidden' }}>
        {key}
      </span>
      <span style={{ gridArea: '1 / 1' }}>
        {rendered}
        {cursor && typing && <span className='tw-cursor'>|</span>}
      </span>
    </span>
  );
};

export default Typewriter;
