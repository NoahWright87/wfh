export const CARD_SIZE = 5;
export const FREE_SPACE_INDEX = Math.floor((CARD_SIZE * CARD_SIZE) / 2);
export const FREE_SPACE = "FREE";

export function shuffle<T>(items: readonly T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Builds a size*size card from the word bank with a FREE center space.
// Throws if the bank doesn't have enough unique words to fill the card.
export function generateCard(wordBank: readonly string[], size = CARD_SIZE): string[] {
  const cellCount = size * size;
  const freeIndex = Math.floor(cellCount / 2);
  const needed = cellCount - 1;

  if (wordBank.length < needed) {
    throw new Error(`Word bank needs at least ${needed} words, got ${wordBank.length}`);
  }

  const words = shuffle(wordBank).slice(0, needed);
  const card = [...words.slice(0, freeIndex), FREE_SPACE, ...words.slice(freeIndex)];
  return card;
}

// Returns true if any row, column, or diagonal is fully marked.
export function checkBingo(marks: readonly boolean[], size = CARD_SIZE): boolean {
  for (let row = 0; row < size; row++) {
    if (marks.slice(row * size, row * size + size).every(Boolean)) return true;
  }

  for (let col = 0; col < size; col++) {
    let full = true;
    for (let row = 0; row < size; row++) {
      if (!marks[row * size + col]) {
        full = false;
        break;
      }
    }
    if (full) return true;
  }

  let diag1 = true;
  let diag2 = true;
  for (let i = 0; i < size; i++) {
    if (!marks[i * size + i]) diag1 = false;
    if (!marks[i * size + (size - 1 - i)]) diag2 = false;
  }

  return diag1 || diag2;
}
