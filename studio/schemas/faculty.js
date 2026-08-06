export default {
  title: "Karok",
  name: "faculties",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
    },
    {
      title: "Szakok",
      name: "subjects",
      type: "array",
      of: [
        {
          title: "Szakok",
          type: "reference",
          to: [{ type: "subjects" }],
          options: {
            disableNew: true,
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
  ],
};
