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
      title: "GDPR",
      name: "gdpr",
      type: "array",
      of: [{ type: "block" }],
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
