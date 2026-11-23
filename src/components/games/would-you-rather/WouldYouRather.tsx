import { useEffect, useState } from "react";
import { Button, Heading, Text } from "@noahwright/design";
import { WOULD_YOU_RATHER } from "../../../data/would-you-rather";
import { shuffle } from "../../../lib/bingo";
import "../../../styles/would-you-rather.css";

const STATE_KEY = "wfh-would-you-rather";

type SavedState = { order: number[]; position: number };

function freshDeck(): SavedState {
  return { order: shuffle(WOULD_YOU_RATHER.map((_, i) => i)), position: 0 };
}

function loadState(): SavedState {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) {
      const saved = JSON.parse(stored) as SavedState;
      // Start a new deck if the question list changed since this was saved.
      if (saved.order.length === WOULD_YOU_RATHER.length) return saved;
    }
  } catch {
    // ignore malformed/unavailable storage
  }
  return freshDeck();
}

export default function WouldYouRather() {
  const [state, setState] = useState<SavedState>({ order: [], position: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable: the deck still works, it just won't survive a reload
    }
  }, [state, ready]);

  if (!ready) {
    return <Text align="center">Loading…</Text>;
  }

  const { order, position } = state;
  const question = WOULD_YOU_RATHER[order[position]];
  const isLast = position === order.length - 1;

  function move(step: number) {
    setState((prev) => ({ ...prev, position: prev.position + step }));
  }

  return (
    <div className="wyr">
      <Heading level={2} align="center">
        Would you rather…
      </Heading>

      <div className="wyr-options" aria-live="polite">
        <div className="wyr-option">
          <span className="wyr-option__letter">A</span>
          <span>{question.a}</span>
        </div>
        <span className="wyr-or">or</span>
        <div className="wyr-option wyr-option--b">
          <span className="wyr-option__letter">B</span>
          <span>{question.b}</span>
        </div>
      </div>

      <Text align="center" tone="muted">
        Question {position + 1} of {order.length}
      </Text>

      <div className="wyr-actions">
        <Button variant="outline" onClick={() => move(-1)} disabled={position === 0}>
          Back
        </Button>
        {isLast ? (
          <Button onClick={() => setState(freshDeck())}>Shuffle a new deck</Button>
        ) : (
          <Button onClick={() => move(1)}>Next question</Button>
        )}
      </div>
    </div>
  );
}
