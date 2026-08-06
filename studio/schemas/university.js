export default {
  title: "Egyetemek",
  name: "universities",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
    },
    {
      title: "Karok",
      name: "faculties",
      type: "array",
      of: [
        {
          title: "Karok",
          type: "reference",
          to: [{ type: "faculties" }],
          options: {
            disableNew: true,
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
  ],
};
