export default {
  name: "admins",
  title: "Adminok",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
    },
    {
      title: "Email",
      name: "email",
      type: "string",
    },
    {
      title: "Jelszó",
      name: "password",
      type: "string",
    },
    {
      title: "Szerep",
      name: "role",
      type: "string",
      options: {
        list: [
          { title: "Pontozó", value: "scorer" },
          { title: "Szuperadmin", value: "superadmin" },
          { title: "Szekció záró", value: "section_closer" },
          { title: "Adat ellenőrző", value: "data_checker" },
        ],
      },
    },
    {
      title: "Felelős szekciók",
      name: "sections",
      type: "array",
      of: [
        {
          title: "Felelős szekciók",
          type: "reference",
          to: [{ type: "sections" }],
          options: {
            disableNew: true,
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
  ],
};
