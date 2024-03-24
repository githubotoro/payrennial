export function sanitizeText(text) {
  if (text === null || text === undefined) {
    return null;
  }

  return text.replace(/'/g, "''");
}

export function sanitizeAmount(input) {
  const parsedAmount = parseFloat(input);

  if (!isNaN(parsedAmount)) {
    return parsedAmount;
  } else {
    return 0;
  }
}
