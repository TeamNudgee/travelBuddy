export const pickRandom = <T>(items: T[]) => {
  const length = items.length;
  const randomIndex = Math.floor(Math.random() * length);
  return items[randomIndex];
};
