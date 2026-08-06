export default {
  title: "Díjazottak",
  name: "winners",
  type: "document",
  fields: [
    {
      title: "Szekció",
      name: "section",
      type: "reference",
      to: [{ type: "sections" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Díjazottak",
      name: "winnerPersons",
      type: "array",
      of: [
        {
          title: "Díjazott",
          type: "object",
          fields: [
            {
              title: "Név",
              name: "name",
              type: "string",
            },
            {
              title: "Elért eredmény",
              name: "result",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "section.name",
    },
  },
};
