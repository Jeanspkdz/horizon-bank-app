export function cleanTransactionName(description: string) {
  return description
    .replace(/[^\w\s\d]/g, '')  // Remove any character that's not a word character (\w), whitespace (\s), or digit (\d)
    .replace(/\s+/g, ' ')      
    .trim();                   
};