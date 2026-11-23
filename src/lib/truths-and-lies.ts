import { shuffle } from "./bingo";

export const MIN_TRUTHS = 1;
export const MAX_TRUTHS = 5;
export const MIN_LIES = 1;
export const MAX_LIES = 3;
export const DEFAULT_TRUTHS = 2;
export const DEFAULT_LIES = 1;

export type Statement = { text: string; isLie: boolean };

export function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

/** "2 truths and 1 lie", "3 truths and 2 lies", and so on. */
export function roundName(truths: number, lies: number): string {
  return `${plural(truths, "truth", "truths")} and ${plural(lies, "lie", "lies")}`;
}

/** Grows or trims a list of answers to `length`, keeping what's already written. */
export function resize(answers: readonly string[], length: number): string[] {
  return Array.from({ length }, (_, i) => answers[i] ?? "");
}

export function allWritten(answers: readonly string[]): boolean {
  return answers.length > 0 && answers.every((answer) => answer.trim().length > 0);
}

/** Mixes truths and lies into one shuffled list to read out. */
export function buildRound(truths: readonly string[], lies: readonly string[]): Statement[] {
  return shuffle([
    ...truths.map((text) => ({ text: text.trim(), isLie: false })),
    ...lies.map((text) => ({ text: text.trim(), isLie: true })),
  ]);
}
