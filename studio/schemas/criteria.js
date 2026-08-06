export default {
  title: "Kritériumok",
  name: "criteria",
  type: "document",
  fields: [
    { title: "Név", name: "name", type: "string" },
    { title: "Elérhető max pontszám", name: "maxScore", type: "number" },
    { title: "Irásbeli", name: "written", type: "boolean" },
  ],
  initialValue: {
    written: false,
  },
};
