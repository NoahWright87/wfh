import { useEffect, useState } from "react";
import { Button, Heading, Input, Pill, Select, Text } from "@noahwright/design";
import {
  DEFAULT_LIES,
  DEFAULT_TRUTHS,
  MAX_LIES,
  MAX_TRUTHS,
  MIN_LIES,
  MIN_TRUTHS,
  allWritten,
  buildRound,
  plural,
  resize,
  roundName,
  type Statement,
} from "../../../lib/truths-and-lies";
import "../../../styles/truths-and-lies.css";

const STATE_KEY = "wfh-truths-and-lies";

type Step = "setup" | "truths" | "lies" | "share";

type SavedState = {
  step: Step;
  truths: string[];
  lies: string[];
  round: Statement[];
};

const FRESH: SavedState = {
  step: "setup",
  truths: resize([], DEFAULT_TRUTHS),
  lies: resize([], DEFAULT_LIES),
  round: [],
};

const TRUTH_IDEAS = [
  "a job you had before this one",
  "a place you've lived",
  "a weird skill or talent",
  "someone famous you've met",
  "a food you refuse to eat",
  "something you did as a kid that you'd never do now",
];

function loadState(): SavedState {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) return { ...FRESH, ...JSON.parse(stored) };
  } catch {
    // ignore malformed/unavailable storage
  }
  return FRESH;
}

function range(min: number, max: number): number[] {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

function AnswerFields({
  kind,
  answers,
  onChange,
}: {
  kind: "Truth" | "Lie";
  answers: string[];
  onChange: (answers: string[]) => void;
}) {
  return (
    <>
      {answers.map((answer, i) => (
        <Input
          key={i}
          label={answers.length === 1 ? kind : `${kind} ${i + 1}`}
          multiline
          rows={2}
          value={answer}
          onChange={(e) => onChange(answers.map((a, j) => (j === i ? e.target.value : a)))}
        />
      ))}
    </>
  );
}

export default function TruthsAndLies() {
  const [state, setState] = useState<SavedState>(FRESH);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable: the round still works, it just won't survive a reload
    }
  }, [state, ready]);

  const { step, truths, lies, round } = state;
  const lieWord = lies.length === 1 ? "lie" : "lies";

  function update(patch: Partial<SavedState>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function shuffleRound() {
    setRevealed(false);
    update({ step: "share", round: buildRound(truths, lies) });
  }

  function startOver() {
    setRevealed(false);
    setState(FRESH);
  }

  if (!ready) {
    return <Text align="center">Loading…</Text>;
  }

  if (step === "setup") {
    return (
      <div className="tl-flow">
        <Text align="center">
          The point isn't to fool anyone. It's to learn something about each other you'd never
          hear in a standup.
        </Text>
        <div className="tl-counts">
          <Select
            label="Truths"
            value={String(truths.length)}
            onChange={(e) => update({ truths: resize(truths, Number(e.target.value)) })}
          >
            {range(MIN_TRUTHS, MAX_TRUTHS).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
          <Select
            label="Lies"
            value={String(lies.length)}
            onChange={(e) => update({ lies: resize(lies, Number(e.target.value)) })}
          >
            {range(MIN_LIES, MAX_LIES).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </div>
        <Text align="center" tone="muted">
          Agree on the numbers as a group, so everyone writes {roundName(truths.length, lies.length)}.
        </Text>
        <div className="tl-actions">
          <Button onClick={() => update({ step: "truths" })}>Start writing</Button>
        </div>
      </div>
    );
  }

  if (step === "truths") {
    return (
      <div className="tl-flow">
        <Heading level={2} align="center">
          Write {plural(truths.length, "truth", "truths")}
        </Heading>
        <Text>
          Pick things your teammates wouldn't guess. The more surprising, the better the
          conversation afterward.
        </Text>
        <Text tone="muted">Stuck? Try {TRUTH_IDEAS.join(", ")}.</Text>
        <AnswerFields kind="Truth" answers={truths} onChange={(next) => update({ truths: next })} />
        <div className="tl-actions">
          <Button variant="outline" onClick={() => update({ step: "setup" })}>
            Back
          </Button>
          <Button onClick={() => update({ step: "lies" })} disabled={!allWritten(truths)}>
            Next: your {lieWord}
          </Button>
        </div>
      </div>
    );
  }

  if (step === "lies") {
    return (
      <div className="tl-flow">
        <Heading level={2} align="center">
          Write {plural(lies.length, "lie", "lies")}
        </Heading>
        <Text>A good lie sounds just like your truths. Some ways to get there:</Text>
        <ul className="tl-tips">
          <li>Exaggerate a true story. Add a zero, upgrade the place, make it weirder.</li>
          <li>Borrow something that happened to a friend or family member.</li>
          <li>Take a real memory and change one key detail.</li>
          <li>Just make it up, with as much detail as your truths have.</li>
        </ul>
        <AnswerFields kind="Lie" answers={lies} onChange={(next) => update({ lies: next })} />
        <div className="tl-actions">
          <Button variant="outline" onClick={() => update({ step: "truths" })}>
            Back
          </Button>
          <Button onClick={shuffleRound} disabled={!allWritten(lies)}>
            Mix them up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="tl-flow">
      <Heading level={2} align="center">
        Your turn
      </Heading>
      <Text align="center">
        Read these out in this order and keep a straight face. Everyone else guesses the {lieWord}.
      </Text>
      <ol className="tl-statements">
        {round.map((statement, i) => (
          <li
            key={i}
            className={[
              "tl-statement",
              revealed && (statement.isLie ? "tl-statement--lie" : "tl-statement--truth"),
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="tl-statement__text">{statement.text}</span>
            {revealed && (
              <Pill size="small" variant={statement.isLie ? "danger" : "confirm"}>
                {statement.isLie ? "Lie" : "Truth"}
              </Pill>
            )}
          </li>
        ))}
      </ol>
      {revealed ? (
        <Text align="center">Now tell the story behind one of your truths. That's the good part.</Text>
      ) : (
        <div className="tl-actions">
          <Button onClick={() => setRevealed(true)}>Reveal the {lieWord}</Button>
        </div>
      )}
      <div className="tl-actions">
        <Button variant="outline" onClick={() => update({ step: "truths" })}>
          Edit my answers
        </Button>
        <Button variant="outline" onClick={shuffleRound}>
          Reshuffle
        </Button>
        <Button variant="outline" color="danger" onClick={startOver}>
          Start over
        </Button>
      </div>
    </div>
  );
}
