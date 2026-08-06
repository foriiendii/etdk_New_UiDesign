export default {
  title: "Elért pontszám",
  type: "object",
  fields: [
    {
      title: "Kritérium",
      name: "criteria",
      type: "reference",
      to: [{ type: "criteria" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Pontszám",
      name: "score",
      type: "number",
    },
  ],
  preview: {
    select: {
      title: "criteria.name",
      score: "score",
    },
    prepare(selection) {
      const { title, score } = selection;
      return {
        title: `${title} ${score}`,
      };
    },
  },
};
