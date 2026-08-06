export default {
  title: "Letölthető dokumentumok",
  name: "files",
  type: "document",
  __experimental_actions: ["create", "update", /*"delete",*/ "publish"],
  fields: [
    {
      title: "Letölthető dokumentumok",
      name: "files",
      type: "array",
      of: [
        {
          title: "Dokumentum",
          type: "object",
          fields: [
            {
              title: "Név",
              name: "name",
              type: "string",
            },
            {
              title: "Dokumentum",
              name: "file",
              type: "file",
            },
          ],
        },
      ],
    },
  ],
};
