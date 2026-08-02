import { useEffect, useState } from "react";
import { Button, Heading, Text } from "@noahwright/design";
import { BUZZWORDS } from "../../../data/buzzwords";
import { CARD_SIZE, FREE_SPACE, FREE_SPACE_INDEX, checkBingo, generateCard } from "../../../lib/bingo";
import "../../../styles/buzzword-bingo.css";

const CARD_KEY = "wfh-bingo-player-card";
const MARKS_KEY = "wfh-bingo-player-marks";

function loadCard(): string[] {
  try {
    const stored = localStorage.getItem(CARD_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore malformed/unavailable storage
  }
  return generateCard(BUZZWORDS);
}

function loadMarks(cellCount: number): boolean[] {
  try {
    const stored = localStorage.getItem(MARKS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore malformed/unavailable storage
  }
  return Array.from({ length: cellCount }, (_, i) => i === FREE_SPACE_INDEX);
}

export default function PlayerCard() {
  const cellCount = CARD_SIZE * CARD_SIZE;
  const [card, setCard] = useState<string[]>(() => Array(cellCount).fill(FREE_SPACE));
  const [marks, setMarks] = useState<boolean[]>(() => Array(cellCount).fill(false));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCard(loadCard());
    setMarks(loadMarks(cellCount));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CARD_KEY, JSON.stringify(card));
  }, [card, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(MARKS_KEY, JSON.stringify(marks));
  }, [marks, ready]);

  const bingo = ready && checkBingo(marks);

  function toggleCell(index: number) {
    if (index === FREE_SPACE_INDEX) return;
    setMarks((prev) => prev.map((marked, i) => (i === index ? !marked : marked)));
  }

  function newCard() {
    setCard(generateCard(BUZZWORDS));
    setMarks(Array.from({ length: cellCount }, (_, i) => i === FREE_SPACE_INDEX));
  }

  if (!ready) {
    return <Text align="center">Loading your card…</Text>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {bingo && (
        <div className="bingo-banner" role="status">
          <Heading level={2}>🎉 BINGO! 🎉</Heading>
        </div>
      )}

      <Text align="center" tone="muted">
        Tap a square as you hear the host call it out. Get five in a row —
        across, down, or diagonal — to win.
      </Text>

      <div className="bingo-card">
        {card.map((word, i) => (
          <button
            key={i}
            type="button"
            className={[
              "bingo-cell",
              marks[i] && "bingo-cell--marked",
              i === FREE_SPACE_INDEX && "bingo-cell--free",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={marks[i]}
            disabled={i === FREE_SPACE_INDEX}
            onClick={() => toggleCell(i)}
          >
            {word}
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <Button variant="outline" onClick={newCard}>
          New Card
        </Button>
      </div>
    </div>
  );
}
