export default {
  title: "Szekciók",
  name: "sections",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
    },
    {
      title: "Slug",
      name: "slug",
      type: "string",
      description:
        "Ez fog megjelenni az urlbe pld: https://etdk.kmdsz.ro/allam-es-jogtudomany, lehetoleg ekezet nelkul",
    },
    {
      title: "Aktuális",
      name: "active",
      type: "boolean",
    },
    {
      title: "Zárva",
      name: "closed",
      type: "boolean",
    },
    {
      title: "Kép",
      name: "image",
      type: "image",
    },
    {
      title: "Követelmények",
      name: "requirement",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Hozzájárulási nyilatkozat szükséges",
      name: "contributionNeeded",
      type: "boolean",
    },
    {
      title: "Pontozási kritériumok",
      name: "criteria",
      type: "array",
      of: [
        {
          title: "Pontozási kritériumok",
          type: "reference",
          to: [{ type: "criteria" }],
          options: {
            disableNew: true,
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: "Zsűrik",
      name: "scorers",
      type: "array",
      of: [
        {
          title: "Zsűrik",
          type: "reference",
          to: [{ type: "admins" }],
          options: {
            disableNew: true,
          },
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
  ],
};
