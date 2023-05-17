export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors are not the same dimensions.");
  }

  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += Math.pow(a[i], 2);
    normB += Math.pow(b[i], 2);
  }

  if (normA === 0 || normB === 0) {
    throw new Error("Zero vector encountered.");
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
