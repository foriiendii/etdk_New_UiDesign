const hungarianNameCollator = new Intl.Collator("hu", {
  sensitivity: "base",
});

type NamedItem = {
  name?: string | null;
};

export const sortByHungarianName = <T extends NamedItem>(items: T[]) => {
  return [...items].sort((a, b) =>
    hungarianNameCollator.compare(a.name || "", b.name || "")
  );
};
