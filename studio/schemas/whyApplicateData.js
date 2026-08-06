export default {
  title: "Miért jelentkezz?",
  name: "applicate",
  type: "document",
  __experimental_actions: ["create", "update", /*"delete",*/ "publish"],
  fields: [
    { title: "Cím", name: "title", type: "string" },
    {
      title: "Leírás",
      name: "description",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Kicsi előnyők",
      name: "small_benefit",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      title: "Nagy előnyők",
      name: "big_benefit",
      type: "array",
      of: [
        {
          title: "Nagy előnyők",
          type: "object",
          fields: [
            {
              title: "Cím",
              name: "title",
              type: "string",
            },
            {
              title: "Leirás",
              name: "description",
              type: "string",
            },
            {
              title: "Icon",
              name: "icon",
              type: "image",
            },
          ],
        },
      ],
    },
  ],
};
