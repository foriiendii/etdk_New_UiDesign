import scoredPoints from "./scoredPoints";

export default {
  name: "participants",
  title: "Résztvevők",
  type: "document",
  fields: [
    {
      title: "Név",
      name: "name",
      type: "string",
    },
    {
      title: "Ellenőrző száma",
      name: "idNumber",
      type: "string",
    },
    {
      title: "Egyetem",
      name: "university",
      type: "reference",
      to: [{ type: "universities" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Egyéb egyetem",
      name: "universityOther",
      type: "string",
    },
    {
      title: "Kar",
      name: "faculty",
      type: "reference",
      to: [{ type: "faculties" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Egyéb Kar",
      name: "facultyOther",
      type: "string",
    },
    {
      title: "Szak",
      name: "subject",
      type: "reference",
      to: [{ type: "subjects" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Egyéb Szak",
      name: "subjectOther",
      type: "string",
    },
    {
      title: "Képzési szint",
      name: "degree",
      type: "string",
    },
    {
      title: "Évfolyam",
      name: "class",
      type: "string",
    },
    {
      title: "Elvégzett félévek száma",
      name: "finishedSemester",
      type: "string",
    },
    {
      title: "Email",
      name: "email",
      type: "string",
    },
    {
      title: "Telefonszám",
      name: "mobileNumber",
      type: "string",
    },
    {
      title: "Ellenőrző kép",
      name: "idPhoto",
      type: "file",
    },
    {
      title: "Kifizetési bizonylat",
      name: "voucher",
      type: "file",
    },

    {
      title: "Társszerzők",
      name: "companions",
      type: "array",
      of: [
        {
          title: "Társszerző",
          type: "object",
          fields: [
            {
              title: "Név",
              name: "name",
              type: "string",
            },
            {
              title: "Ellenőrző száma",
              name: "idNumber",
              type: "string",
            },
            {
              title: "Egyetem",
              name: "university",
              type: "reference",
              to: [{ type: "universities" }],
              options: {
                disableNew: true,
              },
            },
            {
              title: "Egyéb egyetem",
              name: "universityOther",
              type: "string",
            },
            {
              title: "Kar",
              name: "faculty",
              type: "reference",
              to: [{ type: "faculties" }],
              options: {
                disableNew: true,
              },
            },
            {
              title: "Egyéb Kar",
              name: "facultyOther",
              type: "string",
            },
            {
              title: "Szak",
              name: "subject",
              type: "reference",
              to: [{ type: "subjects" }],
              options: {
                disableNew: true,
              },
            },
            {
              title: "Egyéb Szak",
              name: "subjectOther",
              type: "string",
            },
            {
              title: "Képzési szint",
              name: "degree",
              type: "string",
            },
            {
              title: "Évfolyam",
              name: "class",
              type: "string",
            },
            {
              title: "Elvégzett félévek száma",
              name: "finishedSemester",
              type: "string",
            },
            {
              title: "Email",
              name: "email",
              type: "string",
            },
            {
              title: "Telefonszám",
              name: "mobileNumber",
              type: "string",
            },
            {
              title: "Ellenőrző kép",
              name: "idPhoto",
              type: "file",
            },
            {
              title: "Kifizetési bizonylat",
              name: "voucher",
              type: "file",
            },
          ],
          preview: {
            select: {
              title: "name",
            },
          },
        },
      ],
    },
    {
      title: "Témavezetők",
      name: "advisors",
      type: "array",
      of: [
        {
          title: "Témavezető",
          type: "object",
          fields: [
            {
              title: "Név",
              name: "name",
              type: "string",
            },
            {
              title: "Egyetem",
              name: "university",
              type: "reference",
              to: [{ type: "universities" }],
              options: {
                disableNew: true,
              },
            },
            {
              title: "Egyéb egyetem",
              name: "universityOther",
              type: "string",
            },
            {
              title: "Titulus",
              name: "title",
              type: "string",
            },
            {
              title: "Egyéb titulus",
              name: "titleOther",
              type: "string",
            },
            {
              title: "Email",
              name: "email",
              type: "string",
            },
            {
              title: "Igazolás",
              name: "certificate",
              type: "file",
            },
          ],
          preview: {
            select: {
              title: "name",
            },
          },
        },
      ],
    },

    {
      title: "Dolgozat cím",
      name: "title",
      type: "string",
    },
    {
      title: "Dolgozat kivonat",
      name: "extract",
      type: "file",
    },
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
      title: "Összevont szekció",
      name: "merged_section",
      type: "reference",
      to: [{ type: "sections" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Dolgozat",
      name: "essay",
      type: "file",
    },
    {
      title: "Melléklet",
      name: "annex",
      type: "file",
    },
    {
      title: "Hozzájárulási nyilatkozat",
      name: "contribution",
      type: "file",
    },

    {
      title: "Elért pontszámok",
      name: "score",
      type: "array",
      of: [
        {
          title: "Tanár pontozások",
          type: "object",
          fields: [
            {
              title: "Tanár",
              name: "scorer",
              type: "reference",
              to: [{ type: "admins" }],
              options: {
                disableNew: true,
              },
            },
            {
              title: "Pontok",
              name: "score",
              type: "array",
              of: [scoredPoints],
            },
            {
              title: "Jelölve OTDKra",
              name: "otdk_nominated",
              type: "boolean",
            },
            {
              title: "Jelölve publikálásra",
              name: "publish_nominated",
              type: "boolean",
            },
          ],
          preview: {
            select: {
              title: "scorer.name",
            },
          },
          initialValue: {
            otdk_nominated: false,
            publish_nominated: false,
          },
        },
      ],
    },

    {
      title: "Elfogadva",
      name: "accepted",
      type: "boolean",
    },
    {
      title: "GDPR",
      name: "gdpr",
      type: "boolean",
    },
    {
      title: "Jelszó",
      name: "password",
      type: "string",
    },
  ],
  preview: {
    select: {
      title: "name",
      section: "section.name",
    },
    prepare(selection) {
      const { title, section } = selection;
      return {
        title: `${title} ${section}`,
      };
    },
  },
};
