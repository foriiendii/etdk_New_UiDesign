export default {
  title: "Általános adatok",
  name: "general",
  type: "document",
  __experimental_actions: [/*'create',*/ "update", /*"delete",*/ "publish"],
  fields: [
    { title: "Aktuális év", name: "year", type: "string" },
    {
      title: "Kiadás",
      name: "edition",
      type: "string",
      description: "Irjatok ahogy angolul lenne, pld 26th",
    },
    { title: "Kiadás római számmal", name: "editionRoman", type: "string" },
    {
      title: "Dátum",
      name: "date",
      type: "string",
      description:
        "Amikor az ETDK meg lesz tartva (szöveg formátum) pld: 2022. május 23-26.",
    },
    { title: "Témavezetői igazolás pdf", name: "certificate", type: "file" },
    {
      title: "Általános részvételi feltételek",
      name: "generalApplicationRules",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Szabályzat",
      name: "rules",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Követelmények",
      name: "requirement",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Pontozási kritériumok",
      name: "scoringcriteria",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Határidők",
      name: "deadline",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Program",
      name: "schedule",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Program (napi bontásban)",
      name: "scheduleItems",
      type: "array",
      description:
        "Ha ez ki van töltve, a Program oldal ez alapján, napokra bontva (fülekkel) jeleníti meg az eseményeket, a fenti szöveges 'Program' mező helyett.",
      of: [
        {
          title: "Program elem",
          type: "object",
          fields: [
            {
              title: "Nap",
              name: "day",
              type: "string",
              options: {
                list: [
                  { title: "Csütörtök", value: "Csütörtök" },
                  { title: "Péntek", value: "Péntek" },
                  { title: "Szombat", value: "Szombat" },
                  { title: "Vasárnap", value: "Vasárnap" },
                ],
              },
            },
            {
              title: "Dátum",
              name: "date",
              type: "string",
              description: "pld: 2026. május 21.",
            },
            {
              title: "Időpont",
              name: "time",
              type: "string",
              description: "pld: 09:00",
            },
            {
              title: "Cím",
              name: "title",
              type: "string",
            },
            {
              title: "Helyszín",
              name: "location",
              type: "string",
            },
            {
              title: "Leírás",
              name: "description",
              type: "text",
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "day",
            },
          },
        },
      ],
    },
    {
      title: "GDPR",
      name: "gdpr",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      title: "Zsűrik fül megjelenítése",
      name: "showJury",
      type: "boolean",
      description:
        "Ha kikapcsolod, a főoldalon eltűnik a 'Zsűrik' gomb (pl. olyan évben, amikor nincs rá szükség).",
      initialValue: true,
    },
    {
      title: "Befizetés link",
      name: "paymentLink",
      type: "url",
      description: "A befizetés/fizetés oldal linkje (pld: https://in-time.hu/...)",
    },
    {
      title: "Elsődleges világos szín (Primary Light)",
      name: "primaryLight",
      type: "color",
      options: {
        disableAlpha: true,
      },
    },
    {
      title: "Elsődleges sötét szín (Primary Dark)",
      name: "primaryDark",
      type: "color",
      options: {
        disableAlpha: true,
      },
    },
    {
      title: "Másodlagos szín (Secondary)",
      name: "secondaryColor",
      type: "color",
      description:
        "Ez a szín jelenik meg a római számozáson (felső rész) és a 'reál és humántudományok' szövegen",
      options: {
        disableAlpha: true,
      },
    },
  ],
};
