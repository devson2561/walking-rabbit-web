export function groupBy<T, K extends keyof any>(
  collection: T[],
  iteratee: ((item: T) => K) | K
): Record<K, T[]> {
  const iterateeFunc =
    typeof iteratee === "function" ? iteratee : (item: any) => item[iteratee];

  return collection.reduce((acc: Record<K, T[]>, item: T) => {
    const key: K = iterateeFunc(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
