export default {
  title: "Archívum",
  name: "archiv",
  type: "document",
  fields: [
    { title: "Év", name: "year", type: "string" },
    {
      title: "Kivonatos füzet link",
      name: "book",
      type: "string",
    },
    {
      title: "Kivonatos füzet boritókép",
      name: "book_image",
      type: "image",
    },
    {
      title: "Díjazottak",
      name: "winners",
      type: "array",
      of: [
        {
          title: "Szekció díjazottak",
          type: "object",
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
        },
      ],
    },
  ],
};
