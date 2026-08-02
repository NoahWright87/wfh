import { useEffect, useState } from "react";
import { Button, Heading, Pill, Text } from "@noahwright/design";
import { BUZZWORDS } from "../../../data/buzzwords";
import { shuffle } from "../../../lib/bingo";
import "../../../styles/buzzword-bingo.css";

const CALLED_KEY = "wfh-bingo-host-called";

function loadCalled(): string[] {
  try {
    const stored = localStorage.getItem(CALLED_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore malformed/unavailable storage
  }
  return [];
}

export default function HostBoard() {
  const [called, setCalled] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCalled(loadCalled());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CALLED_KEY, JSON.stringify(called));
  }, [called, ready]);

  const remaining = BUZZWORDS.filter((word) => !called.includes(word));
  const currentWord = called[called.length - 1];

  function callWord(word: string) {
    setCalled((prev) => (prev.includes(word) ? prev : [...prev, word]));
  }

  function callRandom() {
    if (remaining.length === 0) return;
    const [next] = shuffle(remaining);
    callWord(next);
  }

  function resetGame() {
    setCalled([]);
  }

  if (!ready) {
    return <Text align="center">Loading…</Text>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div className="called-word-display">
        <Heading level={1}>{currentWord ?? "Ready when you are"}</Heading>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Button onClick={callRandom} disabled={remaining.length === 0}>
          {remaining.length === 0 ? "All words called" : "Call Random Word"}
        </Button>
        <Button variant="outline" color="danger" onClick={resetGame}>
          Reset Game
        </Button>
      </div>

      <div>
        <Heading level={4} align="center">
          Called ({called.length}/{BUZZWORDS.length})
        </Heading>
        <div className="called-history">
          {called.length === 0 && <Text tone="muted">Nothing called yet.</Text>}
          {called.map((word) => (
            <Pill key={word} variant="secondary">
              {word}
            </Pill>
          ))}
        </div>
      </div>

      <div>
        <Heading level={4} align="center">
          Word Bank
        </Heading>
        <div className="word-bank">
          {BUZZWORDS.map((word) => {
            const isCalled = called.includes(word);
            return (
              <Button
                key={word}
                variant={isCalled ? "solid" : "outline"}
                color={isCalled ? "secondary" : "primary"}
                size="small"
                onClick={() => callWord(word)}
                disabled={isCalled}
              >
                {word}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
